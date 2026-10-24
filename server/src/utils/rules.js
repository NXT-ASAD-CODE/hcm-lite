/**
 * HCM Lite — pure business-rule functions (no database, no framework).
 * Copy to backend/src/utils/rules.js and call from your services.
 *
 * Conventions:
 *  - Dates are "YYYY-MM-DD" strings.
 *  - Times are "HH:MM" strings (office local time) or JS Date objects where noted.
 *  - Weekend is an array of weekday numbers (Sun=0 ... Sat=6). Default Sat+Sun = [0, 6].
 */

const DAY_MS = 86400000;

const DEFAULT_SETTINGS = {
  officeStart: '09:00',
  graceMinutes: 15,
  halfDayHours: 5,
  weekend: [0, 6],
};

const LEAVE_QUOTAS = { annual: 14, sick: 8, casual: 10, unpaid: null }; // null = unlimited

// ---------- date helpers ----------

function parseISO(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function toISO(date) {
  return date.toISOString().slice(0, 10);
}

function isWorkingDay(iso, holidays = [], weekend = DEFAULT_SETTINGS.weekend) {
  const dow = parseISO(iso).getUTCDay();
  return !weekend.includes(dow) && !holidays.includes(iso);
}

/** Count working days from start to end inclusive. */
function workingDaysBetween(start, end, holidays = [], weekend = DEFAULT_SETTINGS.weekend) {
  if (end < start) return 0;
  let count = 0;
  for (let t = parseISO(start).getTime(); t <= parseISO(end).getTime(); t += DAY_MS) {
    if (isWorkingDay(toISO(new Date(t)), holidays, weekend)) count++;
  }
  return count;
}

/** List the working days (ISO strings) from start to end inclusive. */
function listWorkingDays(start, end, holidays = [], weekend = DEFAULT_SETTINGS.weekend) {
  const out = [];
  if (end < start) return out;
  for (let t = parseISO(start).getTime(); t <= parseISO(end).getTime(); t += DAY_MS) {
    const iso = toISO(new Date(t));
    if (isWorkingDay(iso, holidays, weekend)) out.push(iso);
  }
  return out;
}

/** First and last day of a "YYYY-MM" month. */
function monthBounds(month) {
  const [y, m] = month.split('-').map(Number);
  const first = new Date(Date.UTC(y, m - 1, 1));
  const last = new Date(Date.UTC(y, m, 0));
  return { start: toISO(first), end: toISO(last) };
}

// ---------- attendance ----------

function hhmmToMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

/** Is a check-in time ("HH:MM") late? Late = strictly after start + grace. */
function isLateCheckIn(checkInHHMM, settings = DEFAULT_SETTINGS) {
  const limit = hhmmToMinutes(settings.officeStart) + settings.graceMinutes;
  return hhmmToMinutes(checkInHHMM) > limit;
}

/**
 * Decide the final attendance status of ONE day.
 * input: { checkIn: "HH:MM"|null, checkOut: "HH:MM"|null, onApprovedLeave: bool, dayIsOver: bool }
 * Precedence: on_leave > absent > missing_checkout > half_day > late > present
 * Returns { status, isLate, workedHours }
 */
function attendanceStatus(input, settings = DEFAULT_SETTINGS) {
  const { checkIn, checkOut, onApprovedLeave = false, dayIsOver = true } = input;

  if (!checkIn) {
    if (onApprovedLeave) return { status: 'on_leave', isLate: false, workedHours: 0 };
    return { status: dayIsOver ? 'absent' : 'not_yet', isLate: false, workedHours: 0 };
  }

  const isLate = isLateCheckIn(checkIn, settings);

  if (!checkOut) {
    return {
      status: dayIsOver ? 'missing_checkout' : (isLate ? 'late' : 'present'),
      isLate,
      workedHours: 0,
    };
  }

  const workedHours = (hhmmToMinutes(checkOut) - hhmmToMinutes(checkIn)) / 60;
  if (workedHours < settings.halfDayHours) return { status: 'half_day', isLate, workedHours };
  return { status: isLate ? 'late' : 'present', isLate, workedHours };
}

// ---------- leave ----------

/** Do two inclusive ranges overlap? */
function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart <= bEnd && bStart <= aEnd;
}

/**
 * Validate a leave request.
 * req: { type, start, end }
 * existing: [{ start, end, status }]  (only pending/approved should count)
 * usedDays: days already used/pending of this type this year
 * Returns { ok: true, workingDays } or { ok: false, code, message }
 */
function validateLeave(req, existing, usedDays, holidays = [], weekend = DEFAULT_SETTINGS.weekend, quotas = LEAVE_QUOTAS) {
  if (!req.start || !req.end || req.end < req.start) {
    return { ok: false, code: 'INVALID_DATES', message: 'End date must be on or after start date.' };
  }
  const workingDays = workingDaysBetween(req.start, req.end, holidays, weekend);
  if (workingDays === 0) {
    return { ok: false, code: 'NO_WORKING_DAYS', message: 'The selected dates contain no working days.' };
  }
  const clash = existing.find(
    (e) => ['pending', 'approved'].includes(e.status) && rangesOverlap(req.start, req.end, e.start, e.end)
  );
  if (clash) {
    return { ok: false, code: 'LEAVE_OVERLAP', message: 'You already have leave in this period.' };
  }
  const quota = quotas[req.type];
  if (quota !== null && quota !== undefined && usedDays + workingDays > quota) {
    return {
      ok: false,
      code: 'INSUFFICIENT_BALANCE',
      message: `Only ${Math.max(quota - usedDays, 0)} ${req.type} day(s) left.`,
    };
  }
  return { ok: true, workingDays };
}

// ---------- payroll ----------

function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/** Annual tax for the illustrative slab in the brief. */
function annualTax(annualGross) {
  const g = annualGross;
  if (g <= 600000) return 0;
  if (g <= 1200000) return 0.05 * (g - 600000);
  if (g <= 2400000) return 30000 + 0.15 * (g - 1200000);
  if (g <= 3600000) return 210000 + 0.25 * (g - 2400000);
  return 510000 + 0.35 * (g - 3600000);
}

/**
 * Compute one employee's payslip numbers.
 * input:
 *   basic              monthly basic salary
 *   workingDays        working days in the whole month
 *   employedWorkingDays working days the person was employed in the month (default = workingDays; use fewer for joiners/leavers)
 *   absentDays, unpaidDays, halfDays
 * Returns an object with every line so you can print it on the payslip.
 */
function computePayslip({ basic, workingDays, employedWorkingDays, absentDays = 0, unpaidDays = 0, halfDays = 0 }) {
  const hra = round2(basic * 0.4);
  const medical = round2(basic * 0.1);
  const fullGross = round2(basic * 1.5); // basic + HRA 40% + medical 10%
  const perDay = workingDays > 0 ? fullGross / workingDays : 0;

  const employed = employedWorkingDays === undefined ? workingDays : employedWorkingDays;
  const earnedGross = round2(perDay * employed); // prorated for joiners/leavers

  const deductDays = absentDays + unpaidDays + 0.5 * halfDays;
  const deductions = round2(perDay * deductDays);

  const taxAnnual = round2(annualTax(earnedGross * 12));
  const taxMonthly = round2(taxAnnual / 12);

  const net = round2(earnedGross - deductions - taxMonthly);

  return {
    basic: round2(basic),
    hra,
    medical,
    fullGross,
    perDay: round2(perDay),
    earnedGross,
    deductDays,
    deductions,
    taxAnnual,
    taxMonthly,
    net,
  };
}

module.exports = {
  DEFAULT_SETTINGS,
  LEAVE_QUOTAS,
  parseISO,
  toISO,
  isWorkingDay,
  workingDaysBetween,
  listWorkingDays,
  monthBounds,
  isLateCheckIn,
  attendanceStatus,
  rangesOverlap,
  validateLeave,
  annualTax,
  computePayslip,
  round2,
};

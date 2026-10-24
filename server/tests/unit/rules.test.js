// Run with:  node tests/unit/rules.test.js   (no test framework needed)
const assert = require('assert');
const r = require('../../src/utils/rules');
const g = require('../../src/utils/geo');

let passed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('ok   -', name); }
  catch (e) { console.error('FAIL -', name, '\n      ', e.message); process.exitCode = 1; }
}

// 2026-10-24 is a Saturday, so 2026-10-26 is Monday.
test('weekday is Saturday for 2026-10-24', () => assert.strictEqual(r.parseISO('2026-10-24').getUTCDay(), 6));

test('working days: Mon-Tue = 2', () => assert.strictEqual(r.workingDaysBetween('2026-10-26', '2026-10-27'), 2));
test('working days: Fri-Mon skips weekend = 2', () => assert.strictEqual(r.workingDaysBetween('2026-10-23', '2026-10-26'), 2));
test('working days: weekend only = 0', () => assert.strictEqual(r.workingDaysBetween('2026-10-24', '2026-10-25'), 0));
test('working days: holiday skipped', () => assert.strictEqual(r.workingDaysBetween('2026-10-26', '2026-10-27', ['2026-10-26']), 1));
test('working days: end before start = 0', () => assert.strictEqual(r.workingDaysBetween('2026-10-27', '2026-10-26'), 0));
test('month bounds Oct 2026', () => assert.deepStrictEqual(r.monthBounds('2026-10'), { start: '2026-10-01', end: '2026-10-31' }));
test('Oct 2026 has 22 working days', () => {
  const b = r.monthBounds('2026-10');
  assert.strictEqual(r.workingDaysBetween(b.start, b.end), 22);
});

test('09:15 is NOT late', () => assert.strictEqual(r.isLateCheckIn('09:15'), false));
test('09:16 is late', () => assert.strictEqual(r.isLateCheckIn('09:16'), true));

test('status: on time full day = present', () =>
  assert.strictEqual(r.attendanceStatus({ checkIn: '09:00', checkOut: '17:30' }).status, 'present'));
test('status: late full day = late', () =>
  assert.strictEqual(r.attendanceStatus({ checkIn: '09:30', checkOut: '18:00' }).status, 'late'));
test('status: 4h59 = half_day', () =>
  assert.strictEqual(r.attendanceStatus({ checkIn: '09:00', checkOut: '13:59' }).status, 'half_day'));
test('status: exactly 5h = not half_day', () =>
  assert.strictEqual(r.attendanceStatus({ checkIn: '09:00', checkOut: '14:00' }).status, 'present'));
test('status: late + half day keeps isLate', () => {
  const s = r.attendanceStatus({ checkIn: '10:00', checkOut: '13:00' });
  assert.strictEqual(s.status, 'half_day');
  assert.strictEqual(s.isLate, true);
});
test('status: no check-out after day over = missing_checkout', () =>
  assert.strictEqual(r.attendanceStatus({ checkIn: '09:00', checkOut: null, dayIsOver: true }).status, 'missing_checkout'));
test('status: no record = absent', () =>
  assert.strictEqual(r.attendanceStatus({ checkIn: null, checkOut: null }).status, 'absent'));
test('status: no record but approved leave = on_leave', () =>
  assert.strictEqual(r.attendanceStatus({ checkIn: null, checkOut: null, onApprovedLeave: true }).status, 'on_leave'));

test('leave ok: Mon-Tue casual', () => {
  const res = r.validateLeave({ type: 'casual', start: '2026-10-26', end: '2026-10-27' }, [], 0);
  assert.deepStrictEqual(res, { ok: true, workingDays: 2 });
});
test('leave: weekend only = NO_WORKING_DAYS', () => {
  const res = r.validateLeave({ type: 'casual', start: '2026-10-24', end: '2026-10-25' }, [], 0);
  assert.strictEqual(res.code, 'NO_WORKING_DAYS');
});
test('leave: overlap detected', () => {
  const res = r.validateLeave(
    { type: 'casual', start: '2026-10-27', end: '2026-10-28' },
    [{ start: '2026-10-26', end: '2026-10-27', status: 'approved' }], 0);
  assert.strictEqual(res.code, 'LEAVE_OVERLAP');
});
test('leave: cancelled request does not block', () => {
  const res = r.validateLeave(
    { type: 'casual', start: '2026-10-26', end: '2026-10-26' },
    [{ start: '2026-10-26', end: '2026-10-26', status: 'cancelled' }], 0);
  assert.strictEqual(res.ok, true);
});
test('leave: over balance (sick 8)', () => {
  const res = r.validateLeave({ type: 'sick', start: '2026-10-26', end: '2026-10-27' }, [], 7);
  assert.strictEqual(res.code, 'INSUFFICIENT_BALANCE');
});
test('leave: unpaid never over balance', () => {
  const res = r.validateLeave({ type: 'unpaid', start: '2026-10-26', end: '2026-10-27' }, [], 500);
  assert.strictEqual(res.ok, true);
});

test('tax: 600k annual = 0', () => assert.strictEqual(r.annualTax(600000), 0));
test('tax: 1.2M annual = 30k', () => assert.strictEqual(r.annualTax(1200000), 30000));
test('tax: 1.8M annual = 120k', () => assert.strictEqual(r.annualTax(1800000), 120000));
test('tax: 2.4M annual = 210k', () => assert.strictEqual(r.annualTax(2400000), 210000));
test('tax: 3.6M annual = 510k', () => assert.strictEqual(r.annualTax(3600000), 510000));
test('tax: 4.6M annual = 860k', () => assert.strictEqual(r.annualTax(4600000), 860000));

test('payslip: basic 100000, 22 days, 1 absent, 1 unpaid, 2 half', () => {
  const p = r.computePayslip({ basic: 100000, workingDays: 22, absentDays: 1, unpaidDays: 1, halfDays: 2 });
  assert.strictEqual(p.fullGross, 150000);
  assert.strictEqual(p.perDay, 6818.18);
  assert.strictEqual(p.deductDays, 3);
  assert.strictEqual(p.deductions, 20454.55);
  assert.strictEqual(p.taxMonthly, 10000);
  assert.strictEqual(p.net, 119545.45);
});
test('payslip: low salary pays no tax', () => {
  const p = r.computePayslip({ basic: 30000, workingDays: 22 }); // gross 45k -> 540k/yr
  assert.strictEqual(p.taxMonthly, 0);
  assert.strictEqual(p.net, 45000);
});
test('payslip: joiner prorated (11 of 22 days)', () => {
  const p = r.computePayslip({ basic: 40000, workingDays: 22, employedWorkingDays: 11 });
  assert.strictEqual(p.earnedGross, 30000);
});

test('geo: same point = 0 m', () => assert.strictEqual(Math.round(g.distanceMeters(24.86, 67.0, 24.86, 67.0)), 0));
test('geo: 0.001 deg latitude is about 111 m', () => {
  const d = g.distanceMeters(24.86, 67.0, 24.861, 67.0);
  assert.ok(d > 105 && d < 117, `distance was ${d}`);
});
test('geo: inside radius ok', () => {
  const res = g.checkCameraAttendance({ lat: 24.8605, lng: 67.0, accuracy: 20, facesDetected: 1 }, { lat: 24.86, lng: 67.0, radiusM: 150 });
  assert.strictEqual(res.ok, true);
});
test('geo: outside radius rejected', () => {
  const res = g.checkCameraAttendance({ lat: 24.87, lng: 67.0, accuracy: 20, facesDetected: 1 }, { lat: 24.86, lng: 67.0, radiusM: 150 });
  assert.strictEqual(res.code, 'OUTSIDE_OFFICE');
});
test('geo: two faces rejected', () => {
  const res = g.checkCameraAttendance({ lat: 24.86, lng: 67.0, accuracy: 20, facesDetected: 2 }, { lat: 24.86, lng: 67.0, radiusM: 150 });
  assert.strictEqual(res.code, 'FACE_COUNT');
});
test('geo: poor GPS accuracy rejected', () => {
  const res = g.checkCameraAttendance({ lat: 24.86, lng: 67.0, accuracy: 150, facesDetected: 1 }, { lat: 24.86, lng: 67.0, radiusM: 150 });
  assert.strictEqual(res.code, 'GPS_ACCURACY');
});

console.log(`\n${passed} tests passed`);

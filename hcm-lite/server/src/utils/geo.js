/**
 * Geofence helpers for camera/location attendance (optional bonus).
 * The SERVER decides; the phone/browser only sends lat/lng/accuracy.
 */

const EARTH_RADIUS_M = 6371000;
const toRad = (deg) => (deg * Math.PI) / 180;

/** Haversine distance in metres between two lat/lng points. */
function distanceMeters(lat1, lng1, lat2, lng2) {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(a));
}

/**
 * Decide whether a camera check-in is acceptable.
 * payload: { lat, lng, accuracy, facesDetected }
 * office:  { lat, lng, radiusM }
 */
function checkCameraAttendance(payload, office) {
  if (payload.facesDetected !== 1) {
    return { ok: false, code: 'FACE_COUNT', message: 'Exactly one face must be visible.' };
  }
  if (payload.accuracy === undefined || payload.accuracy > 100) {
    return { ok: false, code: 'GPS_ACCURACY', message: 'GPS accuracy is worse than 100 m.' };
  }
  const distanceM = distanceMeters(payload.lat, payload.lng, office.lat, office.lng);
  if (distanceM > office.radiusM) {
    return { ok: false, code: 'OUTSIDE_OFFICE', message: 'You are outside the office area.', distanceM };
  }
  return { ok: true, distanceM };
}

module.exports = { distanceMeters, checkCameraAttendance };

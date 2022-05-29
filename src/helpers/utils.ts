const MILES_PER_DEGREE_LAT_NYC = 68.96;
const MILES_PER_DEGREE_LONG_NYC = 52.33;

export function calculateDistance(latA, longA, latB, longB) {
  const distLat = latB - latA;
  const distLong = longB - longA;
  return Math.sqrt(distLat * distLat + distLong * distLong);
}

export function calculateDistanceMiles(latA, longA, latB, longB) {
  const distLat = (latB - latA) * MILES_PER_DEGREE_LAT_NYC;
  const distLong = (longB - longA) * MILES_PER_DEGREE_LONG_NYC;
  return Math.sqrt(distLat * distLat + distLong * distLong);
}

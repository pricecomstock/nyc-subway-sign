export function calculateDistance(latA, longA, latB, longB) {
  const distLat = latB - latA;
  const distLong = longB - longA;
  return Math.sqrt(distLat * distLat + distLong * distLong);
}

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  var R = 6371 * 1000;
  var dLat = toRad(lat2 - lat1);
  var dLon = toRad(lon2 - lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
};

const toRad = (value: number) => {
  return (value * Math.PI) / 180;
};

export const distanceToPercentage = (distance: number) => {
  const minValue = 100000;
  const maxValue = 8000000;
  
  // calculate percentage -> the nearer the better
  var percentage = Math.round(((maxValue - distance) / (maxValue - minValue)) * 100);
  if (percentage < 0)
      return 0;
  if (percentage > 100)
      return 100;
  return percentage;
}
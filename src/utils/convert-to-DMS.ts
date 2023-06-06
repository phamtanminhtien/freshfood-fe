export function convertToDMS(latitude: number, longitude: number) {
  var lat = Math.abs(latitude);
  var lon = Math.abs(longitude);

  var latDeg = Math.floor(lat);
  var latMin = Math.floor((lat - latDeg) * 60);
  var latSec = ((lat - latDeg - latMin / 60) * 3600).toFixed(1);

  var lonDeg = Math.floor(lon);
  var lonMin = Math.floor((lon - lonDeg) * 60);
  var lonSec = ((lon - lonDeg - lonMin / 60) * 3600).toFixed(1);

  var latCardinal = latitude >= 0 ? "N" : "S";
  var lonCardinal = longitude >= 0 ? "E" : "W";

  return (
    latDeg +
    "°" +
    latMin +
    "'" +
    latSec +
    '"' +
    latCardinal +
    lonDeg +
    "°" +
    lonMin +
    "'" +
    lonSec +
    '"' +
    lonCardinal
  );
}

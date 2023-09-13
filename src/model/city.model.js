import proj4 from 'proj4';

/**
 *  UTM Zone 33N (WGS84)
 */
proj4.defs('EPSG:25833', '+proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs');

export class City {
  latitude = 0;
  longitude = 0;
  name = "default";
  
  x = 0;
  y = 0;
  airport_delay = 0;

  constructor(name, latitude, longitude, airport_delay) {
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
    this.airport_delay = airport_delay;
    // Calculate Cartesian coordinates
    this.toUTM();
  }

  toUTM() {
    const coordsXY = proj4('EPSG:4326', 'EPSG:25833', [this.latitude, this.longitude]);

    this.x = coordsXY[0] / 1000;
    this.y = coordsXY[1] / 1000;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  distanceTo(city) {
    let distance_x = city.getX() - this.getX();
    let distance_y = city.getY() - this.getY();

    const distance = Math.sqrt(
      Math.pow(distance_x, 2) + Math.pow(distance_y, 2)
    );

    //TODO Implement the delay feature
    
    return distance;
  }

  toString() {
    return `City: ${this.name}\nLatitude: ${this.latitude} degrees\nLongitude: ${this.longitude} degrees\nCartesian Coordinates (x, y): (${this.x}, ${this.y})`;
  }
}

/**
 * Represents a city with geographical coordinates and Cartesian coordinates.
 */
export class City {
    /**
     * Latitude of the city in degrees.
     * @type {number}
     */
    latitude = 0;
  
    /**
     * Longitude of the city in degrees.
     * @type {number}
     */
    longitude = 0;
  
    /**
     * Name of the city.
     * @type {string}
     */
    name = "default";
  
    /**
     * Cartesian x-coordinate of the city.
     * @type {number}
     */
    x = 0;
  
    /**
     * Cartesian y-coordinate of the city.
     * @type {number}
     */
    y = 0;
  
    /**
     * Creates a new City instance.
     * @param {string} name - The name of the city.
     * @param {number} latitude - The latitude of the city in degrees.
     * @param {number} longitude - The longitude of the city in degrees.
     */
    constructor(name, latitude, longitude) {
      this.name = name;
      this.latitude = latitude;
      this.longitude = longitude;
      // Calculate Cartesian coordinates
      this.toCartesian();
    }
  
    /**
     * Calculates and sets the Cartesian coordinates (x, y) based on latitude and longitude.
     */
    toCartesian() {
      const radius = 6371000; // Average Earth radius in meters
      const latitude_radian = this.latitude * (Math.PI / 180);
      const longitude_radian = this.longitude * (Math.PI / 180);
  
      this.x = radius * Math.cos(latitude_radian) * Math.cos(longitude_radian);
      this.y = radius * Math.cos(latitude_radian) * Math.sin(longitude_radian);
    }
  
    /**
     * Get the x-coordinate of the city in Cartesian coordinates.
     * @returns {number} The x-coordinate.
     */
    getX() {
      return this.x;
    }
  
    /**
     * Get the y-coordinate of the city in Cartesian coordinates.
     * @returns {number} The y-coordinate.
     */
    getY() {
      return this.y;
    }
  
    /**
     * Calculates the distance to another city using Cartesian coordinates.
     * @param {City} city - The target city to calculate the distance to.
     * @returns {number} The distance in meters.
     */
    distanceTo(city) {
      let distance_x = Math.abs(this.getX() - city.getX());
      let distance_y = Math.abs(this.getY() - city.getY());
  
      return Math.sqrt(Math.pow(distance_x, 2) + Math.pow(distance_y, 2));
    }
  
    /**
     * Returns a string representation of the city, including its name, latitude, longitude,
     * and Cartesian coordinates.
     * @returns {string} A string representation of the city.
     */
    toString() {
      return `City: ${this.name}\nLatitude: ${this.latitude} degrees\nLongitude: ${this.longitude} degrees\nCartesian Coordinates (x, y): (${this.x}, ${this.y})`;
    }
  }
  
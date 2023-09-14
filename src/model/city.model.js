/**
 * Represents a city with geographical information.
 */
export class City {
  /**
   * Earth radius constant in kilometers.
   * @type {number}
   * @static
   */
  static EARTH_RADIUS = 6371;

  /**
   * Create a new City instance.
   * @param {string} name - The name of the city.
   * @param {number} latitude - The latitude coordinate of the city.
   * @param {number} longitude - The longitude coordinate of the city.
   * @param {number} airportName - The airport name's
   * @param {number} airportDelay - The delay at the city's airport (in hours).
   * @param {string} airportIATA - The airport IATA of the city's
   */
  constructor(name, latitude, longitude, airportDelay, airportName, airportIATA) {
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
    this.airport = {
      airportName,
      airportDelay,
      airportIATA, 
    }
    
    this.cityTraveled = {};
  }

  /**
   * Get the latitude coordinate of the city.
   * @returns {number} - The latitude.
   */
  getLatitude() {
    return this.latitude;
  }

  /**
   * Get the longitude coordinate of the city.
   * @returns {number} - The longitude.
   */
  getLongitude() {
    return this.longitude;
  }

  /**
   * Calculate the distance and time delay to another city.
   * @param {City} city - The destination city.
   * @returns {Object} - An object with distance and time delay.
   */
  distanceTo(city) {
    const distance = this.haversine(city);
    const airplaneSpeed = 800; // Assume constant airplane speed in km/h
    const timeTo = distance / airplaneSpeed;
    const timeDelay = timeTo + this.airport.airportDelay;

    const toCity = city.name;

    this.cityTraveled = {
      city: toCity,
      distance,
      timeTo,
      timeDelay,
    };

    return {
      distance, // The distance between the cities in kilometers
      timeDelay, // The time delay for reaching the destination
    };
  }

  /**
   * Convert degrees to radians.
   * @param {number} degree - The angle in degrees.
   * @returns {number} - The angle in radians.
   */
  toRadian(degree) {
    return (degree * Math.PI) / 180;
  }

  /**
   * Calculate the Haversine distance to another city.
   * @param {City} city - The destination city.
   * @returns {number} - The Haversine distance between the two cities.
   * @see {@link https://parzibyte.me/blog/2022/09/07/javascript-distancia-entre-2-coordenadas/}
   */
  haversine(city) {
    const currentCityLatitude = this.toRadian(this.getLatitude());
    const currentCityLongitude = this.toRadian(this.getLongitude());

    const nextCityLatitude = this.toRadian(city.getLatitude());
    const nextCityLongitude = this.toRadian(city.getLongitude());

    const dLatitude = nextCityLatitude - currentCityLatitude;
    const dLongitude = nextCityLongitude - currentCityLongitude;

    let havSin =
      Math.pow(Math.sin(dLatitude / 2.0), 2) +
      Math.cos(currentCityLatitude) *
        Math.cos(nextCityLatitude) *
        Math.pow(Math.sin(dLongitude / 2.0), 2);

    havSin = 2 * Math.atan2(Math.sqrt(havSin), Math.sqrt(1 - havSin));

    return City.EARTH_RADIUS * havSin;
  }
}

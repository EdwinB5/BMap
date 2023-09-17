import { fetchData } from "../utils/fetch.js";

/**
 * GPSController class represents a controller for GPS data and trilateration calculations.
 */
export class GPSController {
  /**
   * Constructor for GPSController class.
   * Initializes an empty array to store GPS satellite data.
   */
  constructor() {
    this.satellites = [];
  }

  /**
   * Set GPS satellite data for trilateration calculations.
   * @param {Array} gpsCoords - An array of GPS coordinates with latitude, longitude, and distance properties.
   * @returns {GPSController} - The current GPSController instance for method chaining.
   */
  setData(gpsCoords) {
    this.satellites = gpsCoords;
    return this;
  }

  /**
   * Get the stored GPS satellite data.
   * @returns {Array} - An array of GPS coordinates with latitude, longitude, and distance properties.
   */
  getData() {
    return this.satellites;
  }

  /**
   * Perform trilateration calculations based on stored GPS satellite data.
   */
  gpsLocation() {
    const unknownPoint = new locate(this.satellites, { geometry: "earth" });
    return unknownPoint;
  }

  /**
   * Retrieves location information based on the current GPS coordinates using the Nominatim API.
   *
   * @async
   * @returns {Promise<object>} A Promise that resolves with location information including city, town,
   * village, subdistrict, district, state, and country.
   * @throws {Error} Throws an error if there is an issue with the GPS location or the API request fails.
   */
  async getLocationInfo() {
    const unknownPoint = this.gpsLocation();
    const apiURL = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${unknownPoint.lat}&lon=${unknownPoint.lng}`;
    const dataLocation = await fetchData(apiURL);

    return {
      city: dataLocation.address.city,
      town: dataLocation.address.town,
      village: dataLocation.address.village,
      subdistrict: dataLocation.address.subdistrict,
      district: dataLocation.address.district,
      state: dataLocation.address.state,
      country: dataLocation.address.country,
    };
  }
}

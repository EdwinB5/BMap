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
  trilaterate() {
    //TODO
    console.log(":(");
  }
}


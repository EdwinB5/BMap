/**
 * Class TourManager for managing a list of destination cities.
 */
export const TourManager = {
  destinationCities: [],

  /**
   * Adds a destination city to the list.
   * @param {City} city - The city to be added.
   */
  addCity(city) {
    this.destinationCities.push(city);
  },

  /**
   * Retrieves a city from the list by its index.
   * @param {number} index - The index of the city to be retrieved.
   * @returns {City} - The city at the specified index.
   */
  getCity(index) {
    return this.destinationCities[index];
  },

  /**
   * Gets the number of destination cities in the list.
   * @returns {number} - The number of destination cities in the list.
   */
  numberOfCities() {
    return this.destinationCities.length;
  },
};

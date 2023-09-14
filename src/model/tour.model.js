/**
 * Class Tour represents a tour of cities.
 */
import { TourManager } from "./tourmanager.model.js";

export class Tour {
  // Holds the tour of cities
  tour = [];

  // Cache
  fitness = 0;
  distanceTime = 0;

  /**
   * Constructor for Tour class.
   * @param {Array} tour - An optional array representing the tour of cities.
   */
  constructor(tour) {
    // Initialize an empty tour
    this.tour = [];
    this.blankTour();

    // If a tour array is provided, use it
    if (tour) {
      this.tour = tour;
    }
  }

  /**
   * Initialize the tour with null values.
   */
  blankTour() {
    for (let i = 0; i < TourManager.numberOfCities(); i++) {
      this.tour.push(null);
    }
  }

  /**
   * Generates a random individual tour by shuffling the cities.
   */
  generateIndividual() {
    for (
      let cityIndex = 0;
      cityIndex < TourManager.numberOfCities();
      cityIndex++
    ) {
      this.setCity(cityIndex, TourManager.getCity(cityIndex));
    }

    this.shuffle(this.tour);
  }

  /**
   * Get a city from the tour by its position.
   * @param {number} tourPosition - The position of the city in the tour.
   * @returns {City|null} - The city at the specified position, or null if not set.
   */
  getCity(tourPosition) {
    return this.tour[tourPosition];
  }

  /**
   * Set a city at a specific position in the tour.
   * @param {number} tourPosition - The position where the city should be set.
   * @param {City} city - The city to set in the tour.
   */
  setCity(tourPosition, city) {
    this.tour[tourPosition] = city;

    // If the tour has been altered, reset the fitness and distanceTime
    this.fitness = 0;
    this.distanceTime = 0;
  }

  /**
   * Get the fitness of the tour.
   * @returns {number} - The fitness value of the tour.
   */
  getFitness() {
    if (this.fitness === 0) {
      this.fitness = 1 / this.getDistanceTime();
    }

    return this.fitness;
  }

  /**
   * Calculate the total distanceTime of the tour.
   * @returns {number} - The total distance of the tour.
   */
  getDistanceTime() {
    if (this.distanceTime === 0) {
      let tourDistance = 0;
      for (let cityIndex = 0; cityIndex < this.tourSize(); cityIndex++) {
        let fromCity = this.getCity(cityIndex);
        let destinationCity;
        if (cityIndex + 1 < this.tourSize()) {
          destinationCity = this.getCity(cityIndex + 1);
        } else {
          destinationCity = this.getCity(0);
        }
        tourDistance += fromCity.distanceTo(destinationCity).timeDelay;
      }
      this.distanceTime = tourDistance;
    }
    return this.distanceTime;
  }

  /**
   * Get the number of cities in the tour.
   * @returns {number} - The number of cities in the tour.
   */
  tourSize() {
    return this.tour.length;
  }

  /**
   * Check if the tour contains a specific city.
   * @param {City} city - The city to check for.
   * @returns {boolean} - True if the city is in the tour, otherwise false.
   */
  containsCity(city) {
    return this.tour.includes(city);
  }

  /**
   * Shuffle the elements of an array randomly.
   * @param {Array} array - The array to be shuffled.
   */
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}

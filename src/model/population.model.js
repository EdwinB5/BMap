import { Tour } from "./tour.model.js";

/**
 * Represents a population of tours.
 */
export class Population {
  // Holds the population of tours
  tours = [];

  /**
   * Construct a population.
   * @param {number} populationSize - The size of the population.
   * @param {boolean} initialise - Whether to initialize the population.
   */
  constructor(populationSize, initialise) {
    // Initialize the tours array with the specified population size
    this.tours = new Array(populationSize);

    // If we need to initialise a population of tours, do so
    if (initialise) {
      // Loop and create individuals
      for (let i = 0; i < this.populationSize(); i++) {
        const newTour = new Tour();
        newTour.generateIndividual();
        this.saveTour(i, newTour);
      }
    }
  }

  /**
   * Saves a tour to the population.
   * @param {number} index - The index where the tour should be saved.
   * @param {Tour} tour - The tour to be saved.
   */
  saveTour(index, tour) {
    this.tours[index] = tour;
  }

  /**
   * Gets a tour from the population.
   * @param {number} index - The index of the tour to retrieve.
   * @returns {Tour} - The tour at the specified index.
   */
  getTour(index) {
    return this.tours[index];
  }

  /**
   * Gets the best tour in the population.
   * @returns {Tour} - The fittest tour in the population.
   */
  getFittest() {
    let fittest = this.tours[0];
    // Loop through individuals to find the fittest
    for (let i = 1; i < this.populationSize(); i++) {
      if (fittest.getFitness() <= this.getTour(i).getFitness()) {
        fittest = this.getTour(i);
      }
    }
    return fittest;
  }

  /**
   * Gets the population size.
   * @returns {number} - The size of the population.
   */
  populationSize() {
    return this.tours.length;
  }
}

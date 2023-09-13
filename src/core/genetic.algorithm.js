import { Population } from "./population.js";
import { Tour } from "./tour.js";

/**
 * Class GA manages algorithms for evolving a population.
 */
export class GeneticAlgorithm {
  /* GA parameters */
  static mutationRate = 0.015;
  static tournamentSize = 5;
  static elitism = true;

  /**
   * Evolves a population over one generation.
   * @param {Population} pop - The current population.
   * @returns {Population} - The new population after evolution.
   */
  static evolvePopulation(pop) {
    const newPopulation = new Population(pop.populationSize(), false);

    // Keep our best individual if elitism is enabled
    let elitismOffset = 0;
    if (this.elitism) {
      newPopulation.saveTour(0, pop.getFittest());
      elitismOffset = 1;
    }

    // Crossover population
    // Loop over the new population's size and create individuals from
    // current population
    for (let i = elitismOffset; i < newPopulation.populationSize(); i++) {
      // Select parents
      const parent1 = this.tournamentSelection(pop);
      const parent2 = this.tournamentSelection(pop);
      // Crossover parents
      const child = this.crossover(parent1, parent2);
      // Add child to new population
      newPopulation.saveTour(i, child);
    }

    // Mutate the new population a bit to add some new genetic material
    for (let i = elitismOffset; i < newPopulation.populationSize(); i++) {
      this.mutate(newPopulation.getTour(i));
    }

    return newPopulation;
  }

  /**
   * Applies crossover to a set of parents and creates offspring.
   * @param {Tour} parent1 - The first parent.
   * @param {Tour} parent2 - The second parent.
   * @returns {Tour} - The child tour.
   */
  static crossover(parent1, parent2) {
    // Create a new child tour
    const child = new Tour();

    // Get start and end sub-tour positions for parent1's tour
    const startPos = Math.floor(Math.random() * parent1.tourSize());
    const endPos = Math.floor(Math.random() * parent1.tourSize());

    // Loop and add the sub-tour from parent1 to our child
    for (let i = 0; i < child.tourSize(); i++) {
      // If our start position is less than the end position
      if (startPos < endPos && i > startPos && i < endPos) {
        child.setCity(i, parent1.getCity(i));
      } // If our start position is larger
      else if (startPos > endPos) {
        if (!(i < startPos && i > endPos)) {
          child.setCity(i, parent1.getCity(i));
        }
      }
    }

    // Loop through parent2's city tour
    for (let i = 0; i < parent2.tourSize(); i++) {
      // If child doesn't have the city, add it
      if (!child.containsCity(parent2.getCity(i))) {
        // Loop to find a spare position in the child's tour
        for (let ii = 0; ii < child.tourSize(); ii++) {
          // Spare position found, add city
          if (child.getCity(ii) === null) {
            child.setCity(ii, parent2.getCity(i));
            break;
          }
        }
      }
    }
    return child;
  }

  /**
   * Mutate a tour using swap mutation.
   * @param {Tour} tour - The tour to be mutated.
   */
  static mutate(tour) {
    // Loop through tour cities
    for (let tourPos1 = 0; tourPos1 < tour.tourSize(); tourPos1++) {
      // Apply mutation rate
      if (Math.random() < this.mutationRate) {
        // Get a second random position in the tour
        const tourPos2 = Math.floor(Math.random() * tour.tourSize());

        // Get the cities at target position in tour
        const city1 = tour.getCity(tourPos1);
        const city2 = tour.getCity(tourPos2);

        // Swap them around
        tour.setCity(tourPos2, city1);
        tour.setCity(tourPos1, city2);
      }
    }
  }

  /**
   * Selects a candidate tour for crossover using tournament selection.
   * @param {Population} pop - The current population.
   * @returns {Tour} - The selected tour.
   */
  static tournamentSelection(pop) {
    // Create a tournament population
    const tournament = new Population(this.tournamentSize, false);
    // For each place in the tournament, get a random candidate tour and add it
    for (let i = 0; i < this.tournamentSize; i++) {
      const randomId = Math.floor(Math.random() * pop.populationSize());
      tournament.saveTour(i, pop.getTour(randomId));
    }
    // Get the fittest tour
    const fittest = tournament.getFittest();
    return fittest;
  }
}

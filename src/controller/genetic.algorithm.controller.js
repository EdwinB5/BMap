import { City } from "../model/city.model.js";
import { TourManager } from "../model/tourmanager.model.js";
import { Population } from "../model/population.model.js";
import { GeneticAlgorithm } from "../model/genetic.algorithm.js";

/**
 * A controller class for running a genetic algorithm on a set of cities.
 */
export class GeneticAlgorithmController {
  constructor(citiesData) {
    /**
     * An array of city data in the format [name, latitude, longitude, time].
     * Modify this array to include the cities you want to optimize the route for.
     */
    this.citiesData = [
        ["Bogota", 4.60971, -74.08175, 3, "El Dorado International Airport", "BOG"],
        ["Lima", -12.04318, -77.02824, 5, "Jorge Chávez International Airport", "LIM"],
        ["New York", 40.7128, -74.006, 8, "John F. Kennedy International Airport", "JFK"],
        ["London", 51.5074, -0.1278, 7, "Heathrow Airport", "LHR"],
        ["Paris", 48.8566, 2.3522, 6, "Charles de Gaulle Airport", "CDG"],
        ["Tokyo", 35.682839, 139.759455, 10, "Narita International Airport", "NRT"],
        ["Sydney", -33.865143, 151.2099, 9, "Sydney Airport", "SYD"],
        ["Rio de Janeiro", -22.9068, -43.1729, 4, "Rio de Janeiro/Galeão International Airport", "GIG"],
        ["Berlin", 52.52, 13.405, 6, "Berlin Brandenburg Airport", "BER"],
        ["Amsterdam", 52.3676, 4.9041, 7, "Amsterdam Airport Schiphol", "AMS"],
        ["Los Angeles", 34.0522, -118.2437, 7, "Los Angeles International Airport", "LAX"],
      ];
      

    if (citiesData) {
      this.citiesData = citiesData;
    }

    /**
     * The number of generations for the genetic algorithm to run.
     * Adjust this value to control the number of iterations.
     */
    this.numGenerations = 100;
  }

  /**
   * Run the genetic algorithm to optimize the route for the cities.
   */
  runGeneticAlgorithm() {
    // Initialize the TourManager with cities
    for (const cityData of this.citiesData) {
      const city = new City(...cityData);
      TourManager.addCity(city);
    }

    // Initialize the population with 50 routes and randomize them
    let population = new Population(50, true);

    const initialDistance = population.getFittest().getDistanceTime();

    // Evolve the population for the specified number of generations
    for (let i = 0; i < this.numGenerations; i++) {
      population = GeneticAlgorithm.evolvePopulation(population);
    }

    const finalDistance = population.getFittest().getDistanceTime();

    return {
      initialDistance,
      finalDistance,
      fittestTour: population.getFittest(),
    };
  }
}
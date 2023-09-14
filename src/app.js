import { City } from "./model/city.model.js";
import { TourManager } from "./model/tourmanager.model.js";
import { Population } from "./model/population.model.js";
import { GeneticAlgorithm } from "./model/genetic.algorithm.js";

const citiesData = [
  ["Bogota", 4.60971, -74.08175, 3],
  ["Lima", -12.04318, -77.02824, 5],
  ["New York", 40.7128, -74.006, 8],
  ["London", 51.5074, -0.1278, 7],
  ["Paris", 48.8566, 2.3522, 6],
  ["Tokyo", 35.682839, 139.759455, 10],
  ["Sydney", -33.865143, 151.2099, 9],
  ["Rio de Janeiro", -22.9068, -43.1729, 4],
  ["Berlin", 52.52, 13.405, 6],
  ["Amsterdam", 52.3676, 4.9041, 7]
];

const numGenerations = 100;

for (const cityData of citiesData) {
  const city = new City(...cityData);
  TourManager.addCity(city);
}

let population = new Population(50, true);
console.log(`Initial distance: ${population.getFittest().getDistanceTime()}`);

for (let i = 0; i < numGenerations; i++) {
  population = GeneticAlgorithm.evolvePopulation(population);
}

console.log(`Final distance: ${population.getFittest().getDistanceTime()}`);
console.log("Solution:");
console.log(JSON.stringify(population.getFittest(), null, 2));


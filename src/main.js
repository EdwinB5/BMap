import { City } from "./core/city.js";
import { TourManager } from "./core/tourmanager.js";
import { Population } from "./core/population.js";
import { GeneticAlgorithm } from "./core/genetic.algorithm.js";

const bogota = new City("Bogota", 4.60971, -74.08175, 3);
const lima = new City("Lima", -12.04318, -77.02824, 5);
const newYork = new City("New York", 40.7128, -74.006, 8);
const london = new City("London", 51.5074, -0.1278, 7);
const paris = new City("Paris", 48.8566, 2.3522, 6);
const tokyo = new City("Tokyo", 35.682839, 139.759455, 10);
const sydney = new City("Sydney", -33.865143, 151.2099, 9);
const rioDeJaneiro = new City("Rio de Janeiro", -22.9068, -43.1729, 4);
const berlin = new City("Berlin", 52.52, 13.405, 6);
const amsterdam = new City("Amsterdam", 52.3676, 4.9041, 7);

TourManager.addCity(bogota);
TourManager.addCity(lima);
TourManager.addCity(newYork);
TourManager.addCity(london);
TourManager.addCity(paris);
TourManager.addCity(tokyo);
TourManager.addCity(sydney);
TourManager.addCity(rioDeJaneiro);
TourManager.addCity(berlin);
TourManager.addCity(amsterdam);

let population = new Population(50, true);
console.log(`Initial distance: ${population.getFittest().getDistance()}`);

population = GeneticAlgorithm.evolvePopulation(population);
for (let i = 0; i < 100; i++) {
  population = GeneticAlgorithm.evolvePopulation(population);
}
console.log("Finished");
console.log(`Final distance: ${population.getFittest().getDistance()}`);
console.log("Solution:");
console.log(JSON.stringify(population.getFittest(), null, 2));

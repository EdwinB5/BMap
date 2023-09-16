import { GeneticAlgorithmController } from "./controller/genetic.algorithm.controller.js";
import { MapController } from "./controller/map.controller.js";

const dataCities = "./data/argentina.cities.json";

const tspButton = document.getElementById("tsp");

async function loadData() {
  let dataLoaded = [];
  await fetch(dataCities)
    .then((response) => response.json())
    .then((data) => (dataLoaded = data));
  return dataLoaded;
}

const citiesList = await loadData();

const mapController = new MapController();
const algorithmController = new GeneticAlgorithmController(citiesList);

/**
 * Init page map
 */
mapController.initMap();

/**
 * Event handler for the TSP button click.
 * This function triggers the Traveling Salesman Problem (TSP) visualization process.
 * It clears the map, runs the genetic algorithm to generate a solution, initializes the TSP visualization, 
 * and logs the result to the console.
 * @function
 * @param {Event} event - The click event object.
 */
tspButton.addEventListener("click", function (event) {
  // Prevent the default behavior of the button (e.g., form submission)
  event.preventDefault();
  // Clear the map by removing all existing elements
  mapController.cleanMap();
  // Run the genetic algorithm to generate a TSP solution and set the data in the map controller
  mapController.setDataMap(algorithmController.runGeneticAlgorithm());
  // Initialize the TSP visualization on the map
  mapController.initMapTSP();

  // Log the data map and city information to the console for debugging or analysis
  console.log(mapController.getDataMap());
  //console.log(mapController.cities);
});

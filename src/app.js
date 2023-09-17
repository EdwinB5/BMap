import { GeneticAlgorithmController } from "./controller/genetic.algorithm.controller.js";
import { MapController } from "./controller/map.controller.js";
import { GPSController } from "./controller/gps.controller.js";

const dataCities = "./data/latam.cities.json";

const tspButton = document.getElementById("tsp");
const gpsButton = document.getElementById("gps");

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
const gpsController = new GPSController();

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

const gpsCoords = [
  {
    lat: 24.711454873635766,
    lon: 46.67438218019588,
    distance: 977.69,
  },
  {
    lat: 39.65467179595615,
    lon: 66.97572083948319,
    distance: 2169.86,
  },
  {
    lat: 40.78689100382049,
    lon: 14.368456432286543,
    distance: 2749.4,
  },
];

gpsButton.addEventListener("click", function (event) {
  event.preventDefault();
  mapController.cleanMap();
  mapController.setSatelliteData(gpsController.setData(gpsCoords).getData());
  mapController.initGPSMap(gpsController.trilaterate());
  console.log(mapController.getSatelliteData());
});

/**
 * Get the zoom map and set to fly function
 */
mapController.getMap().on("zoomend", function() {
  const currentZoom = mapController.getMap().getZoom();
  mapController.setCurrentZoom(currentZoom);
})
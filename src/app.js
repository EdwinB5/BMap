import { GeneticAlgorithmController } from "./controller/genetic.algorithm.controller.js";
import { MapController } from "./controller/map.controller.js";
import { GPSController } from "./controller/gps.controller.js";
import { Config } from "./config.js";
import { fetchData } from "./utils/fetch.js";

const dataCities = `./data/${Config.map.tsp.file}.json`;
const gpsData = `./data/${Config.map.gps.file}.json`;

const tspButton = document.getElementById("tsp");
const gpsButton = document.getElementById("gps");

const citiesList = await fetchData(dataCities);
const gpsCoords = await fetchData(gpsData);

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
  event.preventDefault();
  mapController.cleanMap();
  mapController.setDataMap(algorithmController.runGeneticAlgorithm());
  mapController.initMapTSP();
  // Log the data map and city information to the console for debugging or analysis
  console.log(mapController.getDataMap());
  //console.log(mapController.cities);
});

/**
 * Event listener for the GPS button click event. When the button is clicked,
 * it performs the following actions:
 * 1. Prevents the default form submission behavior (if applicable).
 * 2. Cleans the existing map display using the mapController.
 * 3. Sets satellite data using the GPS controller.
 * 4. Initializes the GPS map display with updated GPS location and location information.
 * 5. Logs the GPS location and location information to the console.
 *
 * @param {Event} event - The click event object.
 */
gpsButton.addEventListener("click", async function (event) {
  event.preventDefault();
  mapController.cleanMap();
  mapController.setSatelliteData(gpsController.setData(gpsCoords).getData());
  mapController.initGPSMap(
    gpsController.gpsLocation(),
    await gpsController.getLocationInfo()
  );
  // Log the data map and satellite information to the console for debugging or analysis
  console.log(
    gpsController.gpsLocation(),
    await gpsController.getLocationInfo()
  );
});

/**
 * Get the zoom map and set to fly function
 */
mapController.getMap().on("zoomend", function () {
  const currentZoom = mapController.getMap().getZoom();
  mapController.setCurrentZoom(currentZoom);
});

import { GeneticAlgorithmController } from "./controller/genetic.algorithm.controller.js";
import { MapController } from "./controller/map.controller.js";

const dataCities = "./data/latam.cities.json";

async function loadData() {
    let dataLoaded = []
    await fetch(dataCities).then(response => response.json()).then(data => dataLoaded = data);
    return dataLoaded
}

const citiesList = await loadData();

const algorithmController = new GeneticAlgorithmController(citiesList);
const mapController = new MapController();

// Pass all data from execute to the map controller
mapController.setDataMap(algorithmController.runGeneticAlgorithm());
mapController.initMap();

// console.log(mapController.getCities());
// console.log(mapController.getDataMap());
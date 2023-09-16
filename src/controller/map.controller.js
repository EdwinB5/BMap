import { TourManager } from "../model/tourmanager.model.js";

/**
 * MapController class for managing and displaying city data on a map.
 */
export class MapController {
  /** @type {Object} The data map for the controller. */
  dataMap = {};
  /** @type {Array} An array of city data. */
  cities = [];
  /** @type {Object} The Leaflet map object. */
  map = null;
  /** @type {Object} The Leaflet map layer for elements. */
  mapLayer = null;

  /**
   * Create a new MapController instance.
   */
  constructor() {
    // Initialize the MapController with destination cities from TourManager
    this.cities = [];
    this.mapLayer = L.layerGroup();
  }

  /**
   * Set the data map for the controller.
   * @param {Object} dataMap - The data map to set.
   */
  setDataMap(dataMap) {
    this.dataMap = dataMap;
    this.cities = dataMap.fittestTour.tour;
  }

  /**
   * Get the data map from the controller.
   * @returns {Object} The data map.
   */
  getDataMap() {
    return this.dataMap;
  }

  /**
   * Initialize the map with markers and polygons.
   */
  initMap() {
    // Create a Leaflet map with initial view centered on the first city
    this.map = L.map("map").setView([-33, -70], 13);

    // Add a tile layer with OpenStreetMap data
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);
  }

  /**
   * Initializes the Traveling Salesman Problem (TSP) visualization on the map.
   * Centers the map on the first city of the fittest tour, adds markers for each city,
   * and connects cities with polygons based on the fittest tour.
   * @function
   */
  initMapTSP() {
    // Get the first city from the fittest tour for map centering

    let firstCity = this.dataMap.fittestTour.tour[0];

    this.map.flyTo([firstCity.latitude, firstCity.longitude], 13, {
      duration: 2,
      easeLinearity: 0.25,
    });
    // Add markers for each city on the map
    this.cities.forEach((city) => {
      this.addMark(city.latitude, city.longitude, city.name, city.airport);
    });

    // Connect cities with polygons based on the fittest tour
    const citiesTour = this.dataMap.fittestTour.tour;

    for (let i = 0; i <= citiesTour.length; i++) {
      if (i === citiesTour.length - 1) {
        this.addPolygon(citiesTour[i], citiesTour[0]);
        break;
      }
      this.addPolygon(citiesTour[i], citiesTour[i + 1]);
    }

    this.mapLayer.addTo(this.map);
  }

  /**
   * Add a marker for a city on the map.
   * @param {number} latitude - The latitude coordinate of the city.
   * @param {number} longitude - The longitude coordinate of the city.
   * @param {string} name - The name of the city.
   * @param {Object} airport - The airport information object.
   */
  addMark(latitude, longitude, name, airport) {
    let marker = L.marker([latitude, longitude]);
    marker.bindPopup(
      `City: ${name}, Latitude: ${
        Math.round(latitude * 100) / 100
      }°, Longitude: ${longitude}°, Airport: ${
        airport.airportName
      }, Airport IATA: ${airport.airportIATA}, Airport Delay: ${
        airport.airportDelay
      }h`
    );

    this.mapLayer.addLayer(marker);
  }

  formatTime(hours) {
    const minutes = Math.round(hours * 60);

    if (minutes < 60) {
      return `${minutes}m`;
    } else {
      const hoursPart = Math.floor(minutes / 60);
      const minutesPart = minutes % 60;

      if (minutesPart === 0) {
        return `${hoursPart}h`;
      } else {
        return `${hoursPart}h ${minutesPart}m`;
      }
    }
  }

  /**
   * Add a polygon connecting two cities on the map.
   * @param {Object} city - The starting city object.
   * @param {Object} cityTravel - The destination city object.
   */
  addPolygon(city, cityTravel) {
    const roundedDistance = Math.round(city.cityTraveled.distance * 100) / 100;

    // Create a polyline connecting two cities
    const polyline = L.polyline([
      [city.latitude, city.longitude],
      [cityTravel.latitude, cityTravel.longitude],
    ]);

    // Set a random color for the polyline
    const color = this.getRandomColor();
    polyline.setStyle({ color });

    // Add a popup with information about the cities and the route
    polyline.bindPopup(
      `Origin: ${city.name}, Destination: ${
        city.cityTraveled.city
      }, Distance: ${roundedDistance}km, Time fly: ${this.formatTime(
        city.cityTraveled.timeTo
      )}, Time with delay: ${this.formatTime(city.cityTraveled.timeDelay)}`
    );

    // Create a decorator layer to add arrow symbols to the line
    const arrowDecorator = L.polylineDecorator(polyline, {
      patterns: [
        {
          offset: "100%",
          repeat: 100,
          symbol: L.Symbol.arrowHead({
            pixelSize: 20,
            polygon: false,
            pathOptions: { color },
          }),
        },
      ],
    });

    this.mapLayer.addLayer(polyline);
    this.mapLayer.addLayer(arrowDecorator);
  }

  /**
   * Generate a random color in RGB format.
   * @returns {string} The random color string.
   */
  getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
  }

  /**
   * Clears all elements from the map.
   * @function
   */
  cleanMap() {
    this.map.removeLayer(this.mapLayer);
    this.mapLayer = L.layerGroup();
  }
}

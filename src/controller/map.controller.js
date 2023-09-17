import { Config } from "../config.js";

/**
 * MapController class for managing and displaying city data on a map.
 */
export class MapController {
  dataMap = {};
  cities = [];
  map = null;
  mapLayer = null;
  satellites = null;

  /**
   * Create a new MapController instance.
   */
  constructor() {
    // Initialize the MapController with destination cities from TourManager
    this.cities = [];
    this.mapLayer = L.layerGroup();
    this.satellites = [];
    this.currentZoom = 0;
  }

  /**
   * Set the current zoom level for the map.
   * @param {number} zoom - The zoom level to set.
   */
  setCurrentZoom(zoom) {
    this.currentZoom = zoom;
  }

  /**
   * Get the map object.
   * @returns {L.Map} - The Leaflet map object.
   */
  getMap() {
    return this.map;
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
    this.map = L.map("map").setView([-33, -70], Config.map.zoom);

    // Add a tile layer with OpenStreetMap data
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: Config.map.maxZoom,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);

    this.map.setMinZoom(Config.map.minZoom);
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

    this.map.flyTo(
      [firstCity.latitude, firstCity.longitude],
      this.currentZoom,
      {
        duration: Config.map.tsp.duration,
        easeLinearity: Config.map.tsp.easeLinearity,
        animate: Config.map.tsp.animate,
      }
    );

    // Add markers for each city on the map
    this.cities.forEach((city) => {
      this.addMark(city.latitude, city.longitude, city.name, city.airport);
    });

    // Connect cities with polygons based on the fittest tour
    const citiesTour = this.dataMap.fittestTour.tour;

    for (let i = 0; i <= citiesTour.length; i++) {
      if (i === citiesTour.length - 1) {
        this.addPolyline(citiesTour[i], citiesTour[0]);
        break;
      }
      this.addPolyline(citiesTour[i], citiesTour[i + 1]);
    }

    this.mapLayer.addTo(this.map);
  }

  /**
   * Initializes the GPS map with satellite circles, a marker at the specified GPS location, and additional location information.
   *
   * @param {Object} locationGPS - An object containing GPS location information with 'lat' and 'lng' properties.
   * @param {Object} infoGPS - An object containing additional location information.
   */
  initGPSMap(locationGPS, infoGPS) {
    // Add satellite circles to the map based on satellite data.
    this.satellites.forEach((satellite) => {
      this.addCircle(satellite.lat, satellite.lng, satellite.distance);
    });

    // Fly to the specified GPS location on the map.
    this.map.flyTo([locationGPS.lat, locationGPS.lng], Config.map.gps.zoom, {
      duration: Config.map.gps.duration,
      easeLinearity: Config.map.gps.easeLinearity,
      animate: Config.map.gps.animate,
    });

    // Add a marker at the specified GPS location with additional location information.
    this.addMark(locationGPS.lat, locationGPS.lng, null, null, infoGPS);

    // Add the map layer to the map.
    this.mapLayer.addTo(this.map);
  }

  /**
   * Add a circle to the map based on a given latitude, longitude, and radius (distance).
   * @param {number} latitude - The latitude coordinate for the center of the circle.
   * @param {number} longitude - The longitude coordinate for the center of the circle.
   * @param {number} distance - The radius (distance) of the circle in meters.
   */
  addCircle(latitude, longitude, distance) {
    const color = this.getRandomColor();
    let circle = L.circle([latitude, longitude], {
      color: color,
      fillColor: color,
      fillOpacity: 0.5,
      radius: distance,
    });

    this.mapLayer.addLayer(circle);
  }

  /**
   * Set GPS satellite data to be used in the map.
   * @param {Array} satellites - An array of GPS satellite data with latitude, longitude, and other properties.
   */
  setSatelliteData(satellites) {
    this.satellites = satellites;
  }

  /**
   * Get the stored GPS satellite data.
   * @returns {Array} - An array of GPS satellite data with latitude, longitude, and other properties.
   */
  getSatelliteData() {
    return this.satellites;
  }

  /**
   * Add a marker for a city on the map.
   * @param {number} latitude - The latitude coordinate of the city.
   * @param {number} longitude - The longitude coordinate of the city.
   * @param {string} name - The name of the city.
   * @param {Object} airport - The airport information object.
   */
  addMark(latitude, longitude, name, airport, info = null) {
    const color = this.getRandomColor();
    let marker = L.marker([latitude, longitude]);
    try {
      marker.bindPopup(
        `City: ${name}, Latitude: ${
          Math.round(latitude * 100) / 100
        }°, Longitude: ${Math.round(longitude * 100) / 100}°, Airport: ${
          airport.airportName
        }, Airport IATA: ${airport.airportIATA}, Airport Delay: ${
          airport.airportDelay
        }h`
      );
    } catch (error) {
      marker.bindPopup(
        `Latitude: ${Math.round(latitude * 100) / 100}, Longitude: ${
          Math.round(longitude * 100) / 100
        }, Country: ${info.country}, Village: ${info.village}, District: ${
          info.district
        }, Subdistrict: ${info.subdistrict}, State: ${info.state}`
      );
    }
    this.mapLayer.addLayer(marker);
  }

  /**
   * Formats a time duration in hours into a human-readable string.
   * The function converts hours into minutes and returns a string representation
   * in the format "Xh" if the duration is in hours or "Xh Ym" if it includes minutes.
   * @function
   * @param {number} hours - The time duration in hours.
   * @returns {string} - A human-readable time string in the format "Xh" or "Xh Ym".
   */
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
   * Add a polyline connecting two cities on the map.
   * @param {Object} city - The starting city object.
   * @param {Object} cityTravel - The destination city object.
   */
  addPolyline(city, cityTravel) {
    const roundedDistance = Math.round(city.cityTraveled.distance * 100) / 100;
    const opacity = 0.5;

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
          offset: "10%",
          repeat: 100,
          symbol: L.Symbol.arrowHead({
            pixelSize: 20,
            polygon: false,
            pathOptions: { color },
          }),
        },
      ],
    });

    this.mapLayer.addLayer(arrowDecorator);
    this.mapLayer.addLayer(polyline);
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

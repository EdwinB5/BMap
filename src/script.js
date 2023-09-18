import { formatTime } from "./utils/time.js";

/**
 * Styles for the BMap dynamic content, including
 * JQuery document controller
 */
$(document).ready(function () {
  initMenu();
});

/**
 * Initializes the menu and its animation behavior.
 */
function initMenu() {
  const icon = $(".icon");
  const menu = $(".menu");

  icon.html("<span/><span/><span/><span/>");
  menu.addClass("menuClosed");

  const elem = menu.children("div");
  const l = elem.length;

  const opts = {
    startAng: 0,
    range: 360,
    radius: 70,
    nextTime: 50,
    animTime: 300,
    easingShow: "easeOutBack",
    easingHide: "easeInBack",
  };

  const n = opts.range == 360 ? l : l - 1;
  const interval = opts.range / n;

  const tarX = [];
  const tarY = [];

  for (let i = 0; i < l; i++) {
    const ang = ((interval * i + opts.startAng) * Math.PI) / 180;

    tarX[i] = Math.round(Math.cos(ang) * opts.radius);
    tarY[i] = Math.round(Math.sin(ang) * opts.radius);
  }

  icon.click(function (e) {
    if (menu.is(".menuClosed")) {
      for (let i = 0; i < l; i++) {
        (function (j) {
          setTimeout(function () {
            elem
              .eq(j)
              .show()
              .animate(
                {
                  left: tarX[j],
                  top: tarY[j],
                  opacity: 1,
                },
                opts.animTime,
                opts.easingShow,
                function () {
                  if (j == l - 1) {
                    menu.removeClass("menuClosed").addClass("menuOpened");
                    icon.addClass("iconOpened");
                  }
                }
              );
          }, opts.nextTime * j);
        })(i);
      }
    } else if (menu.is(".menuOpened")) {
      for (let i = l - 1; i >= 0; i--) {
        (function (j) {
          setTimeout(function () {
            elem.eq(j).animate(
              {
                left: 0,
                top: 0,
                opacity: 0,
              },
              opts.animTime,
              opts.easingHide,
              function () {
                $(this).hide();

                if (j === 0) {
                  menu.removeClass("menuOpened").addClass("menuClosed");
                  icon.removeClass("iconOpened");
                }
              }
            );
          }, opts.nextTime * (l - j - 1));
        })(i);
      }
    }
    e.preventDefault();
  });
}

/**
 * Loads and displays Traveling Salesman Problem (TSP) content in the specified container.
 * @param {Object} data - The data object containing TSP information.
 * @param {jQuery} container - The jQuery container element where the TSP content will be displayed.
 * @param {string} url - The URL of the HTML template for TSP content.
 */
async function tspContent(data, container, url) {
  // Extract tour city data from the provided data object
  const tourCities = data.fittestTour.tour;

  // Load the TSP content template HTML into the container
  container.load(url, () => {
    // Set the initial and final time distances in the HTML
    $("#init-distance").text(formatTime(data.initialTimeDistance));
    $("#final-distance").text(formatTime(data.finalTimeDistance));

    // Get a reference to the TSP cards container
    const tspCards = $("#tsp-cards");
    tspCards.empty(); // Clear any existing content

    /**
     * Rounds a coordinate value to two decimal places.
     * @param {number} value - The coordinate value to round.
     * @returns {string} - The rounded coordinate value as a string.
     */
    function roundCoordinate(value) {
      return parseFloat(value).toFixed(2);
    }

    /**
     * Loads and appends a TSP card for a tour city.
     * @param {Object} tour - The tour city data.
     * @returns {Promise} - A promise that resolves when the card is loaded and appended.
     */
    function loadAndAppendCard(tour) {
      return new Promise((resolve) => {
        // Clone the TSP card template
        const cardTemplate = tspCards.clone();

        // Load the TSP card HTML template
        cardTemplate.load("./templates/tsp-card.html", () => {
          // Format the time values in hours and minutes
          const timeTo = formatTime(tour.cityTraveled.timeTo);
          const timeDelay = formatTime(tour.cityTraveled.timeDelay);

          // Set data in the TSP card
          cardTemplate.find("#city-name").text(tour.name);
          cardTemplate
            .find("#latitude")
            .text(`${roundCoordinate(tour.latitude)}°`);
          cardTemplate
            .find("#longitude")
            .text(`${roundCoordinate(tour.longitude)}°`);
          cardTemplate.find("#airport-name").text(tour.airport.airportName);
          cardTemplate.find("#airport-delay").text(tour.airport.airportDelay);
          cardTemplate.find("#airport-IATA").text(tour.airport.airportIATA);
          cardTemplate.find("#traveled-city").text(tour.cityTraveled.city);
          cardTemplate
            .find("#distance-to-traveled-city")
            .text(`${roundCoordinate(tour.cityTraveled.distance)}km`);
          cardTemplate.find("#time-to-traveled-city").text(timeTo);
          cardTemplate.find("#time-delay-to-traveled-city").text(timeDelay);

          // Append the TSP card to the container
          tspCards.append(cardTemplate.html());
          resolve(); // Resolve the promise once the card is loaded and appended
        });
      });
    }

    // Load and append TSP cards for all tour cities concurrently
    Promise.all(tourCities.map((tour) => loadAndAppendCard(tour)));
  });
}

/**
 * Loads GPS-related content into a container and populates HTML elements with GPS data.
 *
 * @param {Object} data - GPS data object containing latitude, longitude, and location info.
 * @param {jQuery} container - jQuery object representing the container where content will be loaded.
 * @param {string} url - URL of the HTML template to load.
 */
async function gpsContent(data, container, url) {
  /**
   * Formats a GPS coordinate to include two decimal places and the degree symbol.
   *
   * @param {number} coordinate - The GPS coordinate to format.
   * @returns {string} - Formatted GPS coordinate string.
   */
  function formatGPSCoordinate(coordinate) {
    return `${parseFloat(coordinate).toFixed(2)}°`;
  }

  // Load the HTML template and populate GPS-related HTML elements
  await container.load(url, () => {
    $("#latitude").text(formatGPSCoordinate(data.gpsLocation.lat));
    $("#longitude").text(formatGPSCoordinate(data.gpsLocation.lng));
    $("#city").text(data.locationInfo.city);
    $("#village").text(data.locationInfo.village);
    $("#subdistrict").text(data.locationInfo.subdistrict);
    $("#district").text(data.locationInfo.district);
    $("#state").text(data.locationInfo.state);
    $("#country").text(data.locationInfo.country);
  });
}

/**
 * Loads and displays content for a specific view in the sidebar container.
 * @param {Object} data - The data object containing information for the views.
 * @param {string} viewName - The name of the view to load.
 */
export async function loadContent(data, viewName) {
  // Get a reference to the sidebar container using jQuery
  const container = $("#sidebar-content");

  // Define an array of views, each with a name, data, loadFunction, and URL
  const views = [
    {
      name: "tspContent",
      data: data,
      loadFunction: tspContent,
      url: "./templates/tsp.html",
    },
    {
      name: "gpsContent",
      data: data,
      loadFunction: gpsContent,
      url: "./templates/gps.html",
    },
  ];

  // Find the view object in the array based on the specified viewName
  const view = views.find((view) => view.name === viewName);

  // If the view is found, execute its load function to display the content in the container
  if (view) {
    view.loadFunction(view.data, container, view.url);
  }
}

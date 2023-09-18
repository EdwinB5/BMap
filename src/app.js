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


$(function(){
  var icon = $('.icon'),
   menu = $('.menu');
  createMenu(icon, menu);
});

function createMenu(icon, menu){
  //icon stylize
  icon.html('<span/><span/><span/><span/>');
  
  //menu stylize
  menu.addClass('menuClosed');
  
  var elem = menu.children('div');
  var l = elem.length;
  
  var opts = {
    startAng: 0, //degree
    range: 360,  //degree
    radius: 70,  //pixel
    nextTime: 50, //ms, time for next content to reveal, 0 for all at once
    animTime: 300, //ms, time for animation
    easingShow: 'easeOutBack', //limited strings
    easingHide: 'easeInBack', //limited strings
  }
  
  var n = ((opts.range == 360)? l:l-1);
  var interval = opts.range/n;
  
  var tarX = [], tarY = [];
  for(var i=0; i<l; i++){
    var ang = ((interval*i + opts.startAng)*Math.PI/180);
    
    tarX[i] = Math.round(Math.cos(ang)*opts.radius);
    tarY[i] = Math.round(Math.sin(ang)*opts.radius);
  }
  
  icon.click(function(e){
     if(menu.is('.menuClosed')){
      for(var i=0; i<l; i++){
       (function(j){
        setTimeout(function(){
         elem.eq(j).show().animate({
          'left':tarX[j],
          'top':tarY[j],
          'opacity':1,
         }, opts.animTime, opts.easingShow, function(){
           if(j == l-1){
            menu.removeClass('menuClosed').addClass('menuOpened');
            icon.addClass('iconOpened');
           }
         });
        },opts.nextTime*j);
       })(i);
      }
     } else if(menu.is('.menuOpened')){
      for(var i=l-1; i>=0; i--){
       (function(j){
        setTimeout(function(){
         elem.eq(j).animate({
          'left':0,
          'top':0,
          'opacity':0,
         }, opts.animTime, opts.easingHide, function(){
          $(this).hide();
          
          if(j == 0) {
           menu.removeClass('menuOpened').addClass('menuClosed');
           icon.removeClass('iconOpened');
          }
         });
        },opts.nextTime*(l-j-1));
       })(i);
      }
     }
   e.preventDefault(); 
  });
}

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

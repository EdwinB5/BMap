export const Config = {
  geneticAlgorithm: {
    mutationRate: 0.015,
    elitism: true,
    tournamentSize: 5,
    populationSize: 50,
    numGenerations: 100,
  },
  airplane: {
    speed: 800,
  },
  map: {
    zoom: 10,
    maxZoom: 7,
    minZoom: 3,
    tsp: {
      duration: 0.5,
      easeLinearity: 0.25,
      animate: true,
      file: 'latam.cities'
    },
    gps: {
      zoom: 3,
      duration: 1.5,
      easeLinearity: 0.25,
      animate: true,
      file: 'gps'
    },
  },
};

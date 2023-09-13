import { City } from './model/city.model.js';

const bogota = new City('Bogota', 4.60971, -74.08175);
const peru = new City('Peru', -9.189967, -75.015152)

console.log(bogota);
console.log(peru)
console.log(bogota.distanceTo(peru));

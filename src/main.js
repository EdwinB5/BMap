import { City } from './model/city.model.js';

const bogota = new City('Bogota', 4.60971, -74.08175, 3);
const lima = new City('Lima', -12.04318, -77.02824, 5)

console.log(bogota);
console.log(bogota.distanceTo(lima));
console.log(lima);
console.log(lima.distanceTo(bogota))
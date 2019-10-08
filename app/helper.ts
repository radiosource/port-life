import {App} from "./App";
import {Ship} from "./classes/Ship";
import {config} from "./config/default";

export function shipsTooClose(currentShip: Ship): boolean {
    for (let ship of App.ships) {
        if (
            ship.id !== currentShip.id
            && ship.type === currentShip.type
            && ship.x < currentShip.x
            && getDistance(currentShip, ship) < config.SHIP_WIDTH + config.SAFE_DISTANCE
        ) {
            return true;
        }
    }
    return false;
}

export function getTravelTime(traveler: { x: number, y: number }, target: { x: number, y: number }): number {
    const a = traveler.x - target.x,
        b = traveler.y - target.y,
        c = Math.sqrt(a * a + b * b);

    return 2 * getDistance(traveler, target);
}

export function getDistance(object1: { x: number, y: number }, object2: { x: number, y: number }): number {
    const a = object1.x - object2.x,
        b = object1.y - object2.y;
    return Math.sqrt(a * a + b * b);

}
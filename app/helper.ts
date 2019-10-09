import {App} from "./App";
import {Ship} from "./classes/Ship";
import {config} from "./config/default";

/**
 * Определеяет "уперся" ли данные корабль, в корабль такоего же типа идущий спереди
 * @param {Ship} currentShip - текущий инстанс корбаля
 * @returns {boolean}
 */
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

/**
 * Высчитывает время для анимации, исходя из координат обьекта, и координат точки назначения
 * @param {{x: number; y: number}} traveler
 * @param {{x: number; y: number}} target
 * @returns {number}
 */
export function getTravelTime(traveler: { x: number, y: number }, target: { x: number, y: number }): number {
    return config.TRAVEL_TIME_RATE * getDistance(traveler, target);
}

/**
 * Возвращает дистанцию между двумя точками
 * @param {{x: number; y: number}} object1
 * @param {{x: number; y: number}} object2
 * @returns {number}
 */
export function getDistance(object1: { x: number, y: number }, object2: { x: number, y: number }): number {
    const a = object1.x - object2.x,
        b = object1.y - object2.y;
    return Math.sqrt(a * a + b * b);

}

/**
 * Функция для примеения миксины, взято с доки
 * @param derivedCtor
 * @param {any[]} baseCtors
 */
export function applyMixins(derivedCtor: any, baseCtors: any[]): void {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}
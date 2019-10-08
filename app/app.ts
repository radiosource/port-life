import {getTravelTime, getDistance} from './helper';
import {config} from "./config/default";
import {Ship} from "./classes/Ship";
import {Harbor} from "./classes/Harbor";
import {Dock} from "./classes/Dock";
import {shipTypes} from './config/default';
import {clearInterval} from "timers";

const TWEEN = require('@tweenjs/tween.js').default;
Object.assign(window, {TWEEN});


const eventsListeners = {};
let harbor: Harbor;

export const app = new PIXI.Application({
    width: config.WINDOW_WIDTH,
    height: config.WINDOW_HEIGHT,
    backgroundColor: 0xFFFFFF,
    //backgroundColor: config.WATER_COLOR
});

export const ships: Set<Ship> = new Set();

export function shipsTooClose(currentShip: Ship): boolean {
    for (let ship of ships) {
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


export function runApp(): void {
    Object.assign(window, {eventsListeners, createShip});
    document.body.appendChild(app.view);

    createShip("green");
    setTimeout(createShip.bind(null, "red"), 2000);
    //let intervalId = setInterval(createShip, config.SHIP_CREATION_INTERVAL / 2);
    // Object.assign(window, {stop: () => clearInterval(intervalId)});
    // setTimeout(window.stop, 10000);

    app.ticker.add(() => {

        //createShip()
        //setInterval(createShip, 1000)
    });

    harbor = new Harbor();

    function createShip(type?: string) {
        if (Ship.quantity > 40) return;
        let ship = new Ship(type || getRandomShipType());
        ships.add(ship);
        Object.assign(window, {ships, ship});
    }

    function getRandomShipType(): string {
        const shipTypesList = Object.keys(shipTypes);
        const randomNumber = parseInt(String(Math.random() * 100));
        //return types.shift();
        return shipTypesList[randomNumber % shipTypesList.length];
    }


    function animate(): void {
        requestAnimationFrame(animate);
        TWEEN.update();

    }

    animate();
}

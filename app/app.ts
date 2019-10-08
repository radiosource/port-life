import {config} from "./config/default";
import {Ship} from "./classes/Ship";
import {Harbor} from "./classes/Harbor";
import {Dock} from "./classes/Dock";
import {shipTypes} from './config/default';
import {clearInterval} from "timers";

const TWEEN = require('@tweenjs/tween.js').default;
Object.assign(window, {TWEEN});

let types = ["red", "red", "green"];
const ships: Ship[] = [];
const eventsListeners = {};
let harbor: Harbor;

export const app = new PIXI.Application({
    width: config.WINDOW_WIDTH,
    height: config.WINDOW_HEIGHT,
    backgroundColor: 0xFFFFFF,
    //backgroundColor: config.WATER_COLOR
});

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

export function subscribe(eventName: string, subscriber: any): void {
    if (!(subscriber.handleMessage instanceof Function)) throw Error("subscribe::Invalid subscriber");
    if (!eventsListeners[eventName]) eventsListeners[eventName] = new Set();
    eventsListeners[eventName].add(subscriber);
}

export function unsubscribe(eventName: string, subscriber: any): void {
    if (!eventsListeners[eventName]) return;
    eventsListeners[eventName].delete(subscriber);
}

export function message(eventName: string, initiator: any, target?: any): boolean {
    let result = false;
    if (!(eventsListeners[eventName] instanceof Set)) return result;
    if (target) {
        if (!(target.handleMessage instanceof Function)) throw Error("message::Invalid target!");
        if (eventsListeners[eventName].has(target)) {
            target.handleMessage(eventName, initiator);
            result = true;
        }
    } else {
        for (let listener of eventsListeners[eventName].values()) {
            result = true;
            eventName === 'ship::queueHasMoved' && console.log("queueHasMoved for " + listener.id);
            listener.handleMessage(eventName, initiator);
        }
    }
    return result;
}


export function shipsTooClose(currentShip: Ship): any {
    let filteredShips = ships.filter(
        ship => ship.id !== currentShip.id
            && ship.type === currentShip.type
            && ship.x < currentShip.x
    );
    let _ships = filteredShips
        .filter(ship => getDistance(currentShip, ship) < config.SHIP_WIDTH + config.SAFE_DISTANCE);
    return Boolean(_ships.length);
}


export function runApp(): void {
    Object.assign(window, {eventsListeners, createShip});
    document.body.appendChild(app.view);


    //setTimeout(createShip, 1000);

    //setTimeout(() => ships.forEach(a => a.animation.stop()), 5300);
    createShip("green");

    setTimeout(createShip.bind(null, "green"), 500);

    //setTimeout(createShip.bind(null, "green"), config.SHIP_CREATION_INTERVAL / 2 + 700);
    //setTimeout(createShip.bind(null, "red"), config.SHIP_CREATION_INTERVAL / 2);
    //setTimeout(createShip.bind(null, "red"), config.SHIP_CREATION_INTERVAL / 2);
    // setTimeout(createShip.bind(null, "green"), 10000);
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
        ships.push(ship);
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

    function isFaced(a, b) {
        var ab = a.getBounds();
        var bb = b.getBounds();
        return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
    }

};

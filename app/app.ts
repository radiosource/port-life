import {config} from "./config/default";
import {Ship} from "./classes/Ship";
import {Harbor} from "./classes/Harbor";
import {Dock} from "./classes/Dock";
import {shipTypes} from './config/default';
import {clearInterval} from "timers";

const TWEEN = require('@tweenjs/tween.js').default;
Object.assign(window, {TWEEN});

let types = ["green", "red"];
const ships: Ship[] = [];
let harbor: Harbor;

export const app = new PIXI.Application({
    width: config.WINDOW_WIDTH,
    height: config.WINDOW_HEIGHT,
    //backgroundColor: 0xFFFFFF
    backgroundColor: config.WATER_COLOR
});


export function findSuitableDock(shipHaveCargo: boolean): any {
    return harbor.docs.filter((dock: Dock) => dock.loaded !== shipHaveCargo)[0];
}

export function shipsTooClose(currentShip: Ship): boolean {
    let filteredShips = ships.filter(ship => ship.id !== currentShip.id && ship.type === currentShip.type);
    return Boolean(
        filteredShips
            .filter(ship => Math.abs(currentShip.x - ship.x - ship.width) < config.SAFE_DISTANCE)
            .length
    );
}

export function notify(eventType, target):void {
    [harbor, ...ships].forEach(listener => listener.handleMessage(eventType, target))
}


export function runApp(): void {

    document.body.appendChild(app.view);


    createShip();
    //setTimeout(createShip, 1000);
    //setTimeout(createShip, 2000);
    //setTimeout(() => ships.forEach(a => a.animation.stop()), 5300);
    // let intervalId = setInterval(createShip, config.SHIP_CREATION_INTERVAL / 2);
    // Object.assign(window, {stop: () => clearInterval(intervalId)});
    // setTimeout(window.stop, 10000);

    app.ticker.add(() => {

        //createShip()
        //setInterval(createShip, 1000)
    });

    harbor = new Harbor();

    function createShip() {
        let ship = new Ship(getRandomShipType());
        ships.push(ship);
        Object.assign(window, {ships, ship});
    }

    function getRandomShipType(): string {
        return "red"
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

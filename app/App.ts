import {getTravelTime, getDistance} from './helper';
import {config} from "./config/default";
import {Ship} from "./classes/Ship";
import {Harbor} from "./classes/Harbor";
import {Dock} from "./classes/Dock";
import {shipTypes} from './config/default';
import {clearInterval} from "timers";

const TWEEN = require('@tweenjs/tween.js').default;
Object.assign(window, {TWEEN});


export class App {

    readonly harbor: Harbor;
    static ships: Set<Ship> = new Set();
    static app = new PIXI.Application({
        width: config.WINDOW_WIDTH,
        height: config.WINDOW_HEIGHT,
        backgroundColor: 0xFFFFFF,
        //backgroundColor: config.WATER_COLOR
    });
    static stage = App.app.stage;

    constructor() {
        Object.assign(window, {createShip: this.createShip, ships: App.ships});
        document.body.appendChild(App.app.view);
        this.animate();

        this.harbor = new Harbor();
        this.createShip("green");
        setTimeout(this.createShip.bind(this, "red"), 2000);

        App.app.ticker.add(() => {

        });
    }

    static shipsTooClose(currentShip: Ship): boolean {
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


    protected createShip(type?: string) {
        if (Ship.quantity > 40) return;
        let ship = new Ship(type || this.getRandomShipType());
        App.ships.add(ship);
        Object.assign(window, {ship});
    }

    protected getRandomShipType(): string {
        const shipTypesList = Object.keys(shipTypes);
        const randomNumber = parseInt(String(Math.random() * 100));
        return shipTypesList[randomNumber % shipTypesList.length];
    }

    protected animate(): void {
        requestAnimationFrame(this.animate.bind(this));
        TWEEN.update();

    }

}

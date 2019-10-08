import {config} from "./config/default";
import {Ship} from "./classes/Ship";
import {Harbor} from "./classes/Harbor";
import {Dock} from "./classes/Dock";
import {shipTypes} from './config/default';
import {withMessages} from './mixins/withMessages';
import {clearInterval} from "timers";
import {applyMixins} from './helper';

applyMixins(Ship, [withMessages]);
applyMixins(Dock, [withMessages]);
applyMixins(Harbor, [withMessages]);

const TWEEN = require('@tweenjs/tween.js').default;


export class App {
    intervalId;
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
        document.body.appendChild(App.app.view);
        this.animate();

        this.harbor = new Harbor();
        //this.createShip("green");
        //setTimeout(this.createShip.bind(this, "red"), 2000);
        //this.intervalId = setInterval(this.createShip, config.SHIP_CREATION_INTERVAL / 3);

        Object.assign(window, {
            createShip: this.createShip,
            ships: App.ships,
            stop: () => clearInterval(this.intervalId)
        });

        App.app.ticker.add(() => {

        });
    }

    protected createShip(type?: string): void {
        if (Ship.quantity > 40) return;
        let ship = new Ship(type || App.getRandomShipType());
        App.ships.add(ship);
        Object.assign(window, {ship});
    }

    static getRandomShipType(): string {
        const shipTypesList = Object.keys(shipTypes);
        const randomNumber = parseInt(String(Math.random() * 100));
        return shipTypesList[randomNumber % shipTypesList.length];
    }

    protected animate(): void {
        requestAnimationFrame(this.animate.bind(this));
        TWEEN.update();

    }

}

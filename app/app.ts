import {config} from "./config/default";
import {Ship} from "./classes/Ship";
import {shipTypes} from './config/default';


export function runApp() {
    const ships = [];
    const graphics = new PIXI.Graphics();
    const app = new PIXI.Application({
        width: config.WINDOW_WIDTH,
        height: config.WINDOW_HEIGHT,
        backgroundColor: 0x4169e1
    });
    document.body.appendChild(app.view);
    app.stage.addChild(graphics);

    createShip();
    let intervalId = setInterval(createShip, config.SHIP_CREATION_INTERVAL);

    app.ticker.add(() => {
        //createShip()
        //setInterval(createShip, 1000)
    });

    Object.assign(window, {stop: () => clearInterval(intervalId)});


    function createShip() {
        let ship = new Ship(getRandomShipType());
        ships.push(ship);
        Object.assign(window, {ships});
        renderShip(ship)
    }

    function getRandomShipType(): string {
        const shipTypesList = Object.keys(shipTypes);
        const randomNumber = parseInt(String(Math.random() * 100));
        return shipTypesList[randomNumber % shipTypesList.length];
    }

    function renderShip(ship: Ship): void {
        ship.graphic = graphics.beginFill(ship.color, 1);
        graphics.lineStyle(3, 0x0f0f0f, 1);
        graphics.drawRect(ship.x, ship.y, ship.width, ship.height);
        graphics.endFill();
    }

};
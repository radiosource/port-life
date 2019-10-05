import {config} from "./config/default";
import {Ship} from "./classes/Ship";
import {shipTypes} from './config/default';

const TWEEN = require('@tweenjs/tween.js').default;
Object.assign(window, {TWEEN});
let types = ["green", "red"];

export function runApp() {

    const ships = [];
    const app = new PIXI.Application({
        width: config.WINDOW_WIDTH,
        height: config.WINDOW_HEIGHT,
        //backgroundColor: 0xFFFFFF
        backgroundColor: 0x4169e1
    });
    document.body.appendChild(app.view);

    createShip();
    createShip();
    //setTimeout(createShip, 2000);
    //setTimeout(() => ships.forEach(a => a.animation.stop()), 5300);
    // let intervalId = setInterval(createShip, config.SHIP_CREATION_INTERVAL);
    // Object.assign(window, {stop: () => clearInterval(intervalId)});

    app.ticker.add(() => {
        isFaced(ships[0].graphics, ships[1].graphics);
        //createShip()
        //setInterval(createShip, 1000)
    });


    function createShip() {
        let ship = new Ship(getRandomShipType());
        ships.push(ship);
        Object.assign(window, {ships, ship});
        renderShip(ship)
    }

    function getRandomShipType(): string {
        const shipTypesList = Object.keys(shipTypes);
        const randomNumber = parseInt(String(Math.random() * 100));
        return types.shift();
        return shipTypesList[randomNumber % shipTypesList.length];
    }

    function renderShip(ship: Ship): void {
        const graphics = new PIXI.Graphics();
        graphics.beginFill(ship.color, 1);
        graphics.lineStyle(1, 0x0f0f0f, 1);
        graphics.drawRect(ship.x, ship.y, ship.width, ship.height);
        graphics.endFill();

        ship.graphics = app.stage.addChild(graphics);
        ship.animation = new TWEEN.Tween(ship)
            .to({x: config.WINDOW_WIDTH / 2, y: config.WINDOW_HEIGHT / 2 || ship.y}, 5000)
            //.easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(function (object) {
                object.graphics.x -= object.prevX - object.x;
                object.graphics.y -= object.prevY - object.y;
            })
            .start();
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
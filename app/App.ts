import {config} from "./config/default";
import {Ship} from "./classes/Ship";
import {Harbor} from "./classes/Harbor";
import {shipTypes} from './config/default';
import {Message} from './classes/Message';
import {IWithMessages} from './interfaces/IWithMessages';

import * as PIXI from 'pixi.js'

const TWEEN = require('@tweenjs/tween.js').default;


export class App extends Message implements IWithMessages {
    readonly harbor: Harbor;

    //Неуверен что сделал правильно, когда обьявил корабли и приложение статическими свойствами,
    //нужен был доступ к кораблям в хелпере
    //возможно лучше их заекспортить каким либо другим образом,
    // или обрабатывать взаимодействие здесь а не в хелпере,
    // или выносить таке вещи в какое то подобие стореджа
    static ships: Set<Ship> = new Set();
    static app = new PIXI.Application({
        width: config.WINDOW_WIDTH,
        height: config.WINDOW_HEIGHT,
        backgroundColor: config.WATER_COLOR
    });
    static stage = App.app.stage;

    public handleMessage(eventType: string, target: any): void {
        switch (eventType) {
            case "ship:destroyed" :
                App.ships.delete(target);
                break;
        }
    }

    constructor() {
        super();
        document.body.appendChild(App.app.view);
        this.animate();

        this.harbor = new Harbor();
        this.subscribe(Ship.DESTROYED_MSG);
        this.createShip();
        setInterval(this.createShip, config.SHIP_CREATION_INTERVAL);

        //Только для воспроизведений разных ситуаций в процесе разработки
        // Object.assign(window, {
        //     createShip: this.createShip,
        //     ships: App.ships,
        //     start: () => setInterval(this.createShip, config.SHIP_CREATION_INTERVAL)
        // });
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

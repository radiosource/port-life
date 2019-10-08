import {config} from '../config/default';
import {App} from "../App";
import {Dock} from "./Dock";
import {Ship} from "./Ship";
import {withMessages} from '../mixins/withMessages';

const TWEEN = require('@tweenjs/tween.js').default;


export class Harbor implements withMessages {
    static quantity = 0;
    static gateIsOpen = true;
    static readonly gateX: number = config.WINDOW_WIDTH / 3;
    static readonly gateY: number = config.WINDOW_HEIGHT / 2;
    static readonly gateWidth: number = config.SHIP_WIDTH / 3;

    docs: Dock[] = [];
    protected color: number = 0xd4af37;
    protected graphics: PIXI.Graphics;

    subscribe(event: string): void {
    }

    unsubscribe(event: string): void {
    }

    message(event: string, target?: any): void {
    }

    constructor() {
        if (Harbor.quantity) throw Error("Only one harbor!");
        Harbor.quantity++;
        const graphics = new PIXI.Graphics();
        graphics.beginFill(this.color, 1);
        graphics.drawRect(Harbor.gateX - Harbor.gateWidth, 0, Harbor.gateWidth, Harbor.gateY - config.SHIP_HEIGHT * 4);
        graphics.drawRect(Harbor.gateX - Harbor.gateWidth, Harbor.gateY + config.SHIP_HEIGHT * 4, Harbor.gateWidth, config.WINDOW_HEIGHT);
        graphics.endFill();
        this.graphics = App.stage.addChild(graphics);

        for (let x = 0; x < config.DOCKS_COUNT; x++) {
            this.docs.push(new Dock(config.WINDOW_HEIGHT / 4 * x))
        }
        Object.assign(window, {docs: this.docs});

        this.subscribe("ship::enter");
        this.subscribe("ship::exit");
    }

    public handleMessage(eventType: string, target: Ship) {
        switch (eventType) {
            case "ship::enter":
                Harbor.gateIsOpen = false;//!Harbor.gateIsOpen;
                this.message("harbor:gateClosed");
                break;
            case "ship::exit":
                Harbor.gateIsOpen = true;//!Harbor.gateIsOpen;
                this.message("harbor:gateOpen");
                break;
        }
    }
}
import {config} from '../config/default';
import {App} from "../App";
import {Dock} from "./Dock";
import {Ship} from "./Ship";
import {Message} from "./Message";
import {IWithMessages} from '../interfaces/IWithMessages';
import * as PIXI from 'pixi.js'

export class Harbor extends Message implements IWithMessages {
    static quantity: number = 0;
    static gateIsOpen: boolean = true;
    static readonly gateX: number = config.WINDOW_WIDTH / 3;
    static readonly gateY: number = config.WINDOW_HEIGHT / 2;
    static readonly gateWidth: number = config.SHIP_WIDTH / 3;

    protected readonly docs: Dock[] = [];
    protected readonly color: number = 0xd4af37;
    protected readonly graphics: PIXI.Graphics;

    static readonly GATE_OPEN_MSG: string = "gateOpen";
    static readonly GATE_CLOSED_MSG: string = "gateClosed";

    constructor() {
        super();
        
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

        this.subscribe(Ship.EXIT_MSG);
        this.subscribe(Ship.ENTER_MSG);
    }

    public handleMessage(eventType: string, target: Ship) {
        switch (eventType) {
            case Ship.ENTER_MSG:
                Harbor.gateIsOpen = false;
                this.send(Harbor.GATE_CLOSED_MSG);
                break;
            case Ship.EXIT_MSG:
                Harbor.gateIsOpen = true;
                this.send(Harbor.GATE_OPEN_MSG);
                break;
        }
    }
}
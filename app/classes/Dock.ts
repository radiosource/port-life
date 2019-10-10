import {config} from '../config/default';
import {App} from "../App";
import {Ship} from "./Ship";
import {Message} from "./Message";
import {IDock} from '../interfaces/IDock';
import {IWithMessages} from '../interfaces/IWithMessages';
import * as PIXI from 'pixi.js'

const TWEEN = require('@tweenjs/tween.js').default;


export class Dock implements IDock, IWithMessages {
    static quantity = 0;
    readonly id: number;

    readonly receivingPoints: { x: number, y: number };
    readonly height: number = config.WINDOW_HEIGHT / 4 - 10;
    readonly width: number = config.SHIP_HEIGHT;
    protected readonly color: number = 0xd4af37;

    protected _loaded: boolean = false;
    protected graphics: PIXI.Graphics;
    protected animation: TWEEN.Tween;
    readonly yStart: number;

    static readonly MOVE_TO_DOCK_MSG: string = "moveToDock";
    readonly message: Message = new Message(this);

    constructor(yStart: number) {
        Dock.quantity++;
        this.id = Dock.quantity;
        this.yStart = yStart;
        this.receivingPoints = {y: yStart + this.width / 2, x: this.width + 10};
        this.makeGraphics();

        this.animation = new TWEEN.Tween(this);
        this.message.subscribe(Ship.ARRIVED_AT_THE_GATE_MSG);
    }

    get loaded() {
        return this._loaded;
    }

    set loaded(loaded) {
        this._loaded = loaded;
    }

    protected makeGraphics() {
        let graphics = new PIXI.Graphics();
        graphics.beginFill(this.loaded ? this.color : config.WATER_COLOR, 1);
        graphics.lineStyle(10, this.color, 1);
        graphics.drawRect(0, this.yStart, this.width, this.height);
        graphics.endFill();
        this.graphics && this.graphics.destroy();
        this.graphics = App.stage.addChild(graphics);

    }

    handleMessage(eventType: string, target: any) {
        switch (eventType) {

            case Ship.ARRIVED_AT_THE_GATE_MSG :
                if (this.loaded !== target.loaded) {
                    this.message.subscribe(Ship.MOVE_TO_DOCK_ACCEPTED_MSG);
                    this.message.send(Dock.MOVE_TO_DOCK_MSG, target);
                }
                break;

            case Ship.MOVE_TO_DOCK_ACCEPTED_MSG:
                this.message.unsubscribe(Ship.MOVE_TO_DOCK_ACCEPTED_MSG);
                this.message.unsubscribe(Ship.ARRIVED_AT_THE_GATE_MSG);
                this.message.subscribe(Ship.HANDLE_CARGO_MSG);
                break;

            case Ship.HANDLE_CARGO_MSG :
                this.message.unsubscribe(Ship.HANDLE_CARGO_MSG);
                this.animation = new TWEEN.Tween({})
                    .to({}, config.CARGO_HANDLING_TIME)
                    .onComplete((object) => {
                        this.loaded = !this.loaded;
                        this.makeGraphics();
                        this.message.subscribe(Ship.MOVE_TO_DOCK_ACCEPTED_MSG);
                        this.message.subscribe(Ship.ARRIVED_AT_THE_GATE_MSG);
                        this.message.send(Dock.MOVE_TO_DOCK_MSG);
                    })
                    .start()
                ;
                break;
        }
    }
}
import {config, shipTypes} from '../config/default';
import {Harbor} from "./Harbor";
import {Ship} from "./Ship";
import {app, notify} from "../app";

const TWEEN = require('@tweenjs/tween.js').default;

export class Dock {
    static quantity = 0;
    readonly id: number;

    busy: boolean = false;
    readonly receivingPoints: { x: number, y: number };
    readonly height: number = config.WINDOW_HEIGHT / 4 - 10;
    readonly width: number = config.SHIP_HEIGHT;

    protected _loaded: boolean = false;
    protected color: number = 0xd4af37;
    protected graphics: PIXI.Graphics;
    protected animation: TWEEN.Tween;
    yStart: number;

    constructor(yStart: number) {
        this.id = Dock.quantity;
        this.yStart = yStart;
        this.receivingPoints = {y: yStart + this.width / 2, x: this.width + 10};
        this.makeGraphics();

        this.animation = new TWEEN.Tween(this);
    }

    get loaded() {
        return this._loaded;
    }

    set loaded(loaded) {
        this._loaded = loaded;
        this.busy = false;
    }

    protected makeGraphics() {
        let graphics = new PIXI.Graphics();
        graphics.beginFill(this.loaded ? this.color : config.WATER_COLOR, 1);
        graphics.lineStyle(10, this.color, 1);
        graphics.drawRect(0, this.yStart, this.width, this.height);
        graphics.endFill();
        this.graphics && this.graphics.destroy();
        this.graphics = app.stage.addChild(graphics);
    }

    handleMessage(eventType: string, target: any) {
        console.log("handleMessage", eventType);
        switch (eventType) {
            case "ship::handleCargo" :
                this.animation = new TWEEN.Tween({})
                    .to({}, config.CARGO_HANDLING_TIME)
                    .onComplete(function (object) {
                        this.loaded = !this.loaded;
                        this.makeGraphics();
                    }.bind(this))
                    .start()
                ;
                break;
        }
    }
}
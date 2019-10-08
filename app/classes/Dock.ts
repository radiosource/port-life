import {config, shipTypes} from '../config/default';
import {Harbor} from "./Harbor";
import {Messenger} from "./Messenger";
import {Ship} from "./Ship";
import {App} from "../App";

const TWEEN = require('@tweenjs/tween.js').default;

export class Dock {
    static quantity = 0;
    readonly id: number;

    readonly receivingPoints: { x: number, y: number };
    readonly height: number = config.WINDOW_HEIGHT / 4 - 10;
    readonly width: number = config.SHIP_HEIGHT;

    protected _loaded: boolean = false;
    protected color: number = 0xd4af37;
    protected graphics: PIXI.Graphics;
    protected animation: TWEEN.Tween;
    yStart: number;

    constructor(yStart: number) {
        Dock.quantity++;
        this.id = Dock.quantity;
        this.yStart = yStart;
        this.receivingPoints = {y: yStart + this.width / 2, x: this.width + 10};
        this.makeGraphics();

        this.animation = new TWEEN.Tween(this);
        Messenger.subscribe(`ship::arrivedAtTheGate`, this);
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

            case `ship::arrivedAtTheGate` :
                if (this.loaded !== target.loaded) {
                    if (Messenger.message("dock::moveToDock", this, target)) {
                        Messenger.unsubscribe("ship::arrivedAtTheGate", this);
                        Messenger.subscribe("ship::handleCargo", this);
                    }
                }
                break;


            case "ship::handleCargo" :
                Messenger.unsubscribe("ship::handleCargo", this);
                this.animation = new TWEEN.Tween({})
                    .to({}, config.CARGO_HANDLING_TIME)
                    .onComplete(function (object) {
                        this.loaded = !this.loaded;
                        this.makeGraphics();
                        if(Messenger.message(`dock::moveToDock`, this)){
                            Messenger.subscribe(`ship::handleCargo`, this);
                        }else{
                            Messenger.subscribe(`ship::arrivedAtTheGate`, this);
                        }
                    }.bind(this))
                    .start()
                ;
                break;
        }
    }
}
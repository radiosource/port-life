import {config} from '../config/default';
import {App} from "../App";
import {withMessages} from "../mixins/withMessages";
import {IDock} from '../interfaces/IDock';
import {IWithMessages} from '../interfaces/IWithMessages';

const TWEEN = require('@tweenjs/tween.js').default;

export class Dock implements IDock, withMessages, IWithMessages {
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

    subscribe(event: string): void {
    }

    unsubscribe(event: string): void {
    }

    message(event: string, target?: any): void {
    }

    constructor(yStart: number) {
        Dock.quantity++;
        this.id = Dock.quantity;
        this.yStart = yStart;
        this.receivingPoints = {y: yStart + this.width / 2, x: this.width + 10};
        this.makeGraphics();

        this.animation = new TWEEN.Tween(this);
        this.subscribe(`ship::arrivedAtTheGate`);
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
                    //this.unsubscribe(`ship::arrivedAtTheGate`);
                    this.subscribe("ship::moveToDockAccepted");
                    this.message(`dock::moveToDock`, target);
                }
                break;

            case "ship::moveToDockAccepted":
                this.unsubscribe("ship::moveToDockAccepted");
                this.unsubscribe(`ship::arrivedAtTheGate`);
                this.subscribe(`ship::handleCargo`);
                break;

            case "ship::handleCargo" :
                this.unsubscribe("ship::handleCargo");
                this.animation = new TWEEN.Tween({})
                    .to({}, config.CARGO_HANDLING_TIME)
                    .onComplete((object) => {
                        this.loaded = !this.loaded;
                        this.makeGraphics();
                        this.subscribe("ship::moveToDockAccepted");
                        this.subscribe(`ship::arrivedAtTheGate`);
                        this.message(`dock::moveToDock`);
                    })
                    .start()
                ;
                break;
        }
    }
}
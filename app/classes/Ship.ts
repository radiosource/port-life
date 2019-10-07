import {Harbor} from './Harbor';
import {Dock} from './Dock';
import {IShip} from '../interfaces/IShip';
import {IShipTypes, IShipType} from '../interfaces/IShipTypes';
import {shipTypes, config} from '../config/default';
import {app, shipsTooClose, findSuitableDock, notify, subscribe, unsubscribe, message, getTravelTime} from '../app';

const TWEEN = require('@tweenjs/tween.js').default;


export class Ship implements IShip {

    static quantity = 0;

    readonly id: number;
    readonly width = config.SHIP_WIDTH;
    readonly height = config.SHIP_HEIGHT;
    readonly type: string;
    readonly color: number;

    protected graphics: PIXI.Graphics;
    protected animation: TWEEN.Tween;
    protected _loaded: boolean;
    protected _x: number;
    protected _y: number;
    protected _prevX: number;
    protected _prevY: number;
    protected state: string;

    /**@todo переписать на фабрику
     */
    constructor(type) {
        if (!shipTypes[type]) {
            throw Error(`Invalid ship type - '${type}'`);
        }
        Ship.quantity++;
        this.id = Ship.quantity;
        this._x = shipTypes[type].START_POINTS.X;
        this._y = shipTypes[type].START_POINTS.Y;
        Object.assign(this, shipTypes[type], {type});
        this.makeGraphics();
        this.animation = new TWEEN.Tween(this);
        this.moveToGate();
    }

    protected makeGraphics() {
        let graphics = new PIXI.Graphics();
        graphics.beginFill(this.loaded ? this.color : config.WATER_COLOR, 1);
        graphics.lineStyle(5, this.color, 1);
        graphics.drawRect(this.x, this.y, this.width, this.height);
        graphics.endFill();
        this.graphics && this.graphics.destroy();
        this.graphics = app.stage.addChild(graphics);
    }

    protected moveToGate() {
        this.makeAnimation({x: Harbor.gateX + config.SAFE_DISTANCE, y: this.y}, 5000)
            .onComplete(function () {
                subscribe("dock::moveToDock", this);
                message("ship::arrivedAtTheGate", this);
            }.bind(this))
            .start()

    }

    public handleMessage(eventType: string, target: any) {
        switch (eventType) {
            case "dock::moveToDock":
                unsubscribe("dock::moveToDock", this);
                this.moveToDock(target);
                break;
        }
    }

    protected moveToDock(target: Dock) {
        this.animation = this.makeAnimation({y: Harbor.gateY, x: this.x}, 1000);
        this.animation.chain(
            this.makeAnimation({x: Harbor.gateX - Harbor.gateWidth * 2, y: Harbor.gateY}, 500)
                .chain(this
                    .makeAnimation(target.receivingPoints, 2000)
                    .onComplete(function () {
                        message("ship::handleCargo", this, target);
                        this.animation = new TWEEN.Tween({})
                            .to({}, config.CARGO_HANDLING_TIME)
                            .onComplete(function (object) {
                                this.loaded = !this.loaded;
                                this.makeGraphics();
                                this.moveToStart();
                            }.bind(this))
                            .start()
                    }.bind(this))
                )
        );
        this.animation.start();
    }

    protected moveToStart() {
        this.animation = this.makeAnimation({y: Harbor.gateY, x: Harbor.gateX - Harbor.gateWidth * 2}, 2000);
        this.animation.chain(this
            .makeAnimation({y: config.WINDOW_HEIGHT / 2, x: config.WINDOW_WIDTH}, 5000)
            .onComplete(function () {
                this.graphics.destroy();
            }.bind(this))
        );
        this.animation.start();
    }

    protected makeAnimation(targetPosition: { x: number, y: number }, time: number): TWEEN.Tween {
        time = getTravelTime(this, targetPosition);
        return new TWEEN.Tween(this)
            .to(targetPosition, time)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(this.onAnimationUpdate)
    }

    protected onAnimationUpdate(object: Ship) {
        object.graphics.x -= object.prevX - object.x;
        object.graphics.y -= object.prevY - object.y;
    }

    get loaded(): boolean {
        return this._loaded;
    }

    set loaded(loaded: boolean) {
        this._loaded = loaded;
    }

    set x(x) {
        this._prevX = this._x;
        this._x = x;
    }

    set y(y) {
        this._prevY = this._y;
        this._y = y;
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    get prevX(): number {
        return this._prevX;
    }

    get prevY(): number {
        return this._prevY;
    }

}

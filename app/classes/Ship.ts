import {IShip} from '../interfaces/IShip';
import {IShipTypes, IShipType} from '../interfaces/IShipTypes';
import {shipTypes, config} from '../config/default';

const TWEEN = require('@tweenjs/tween.js').default;
TWEEN.Tween


export class Ship implements IShip {

    static quantity = 0;

    readonly id: number;
    readonly width = config.SHIP_WIDTH;
    readonly height = config.SHIP_HEIGHT;
    readonly type: string;
    readonly color: number;

    protected _graphics: any;
    protected _animation: any;
    protected _loaded: boolean;
    protected _x: number;
    protected _y: number;
    protected _prevX: number;
    protected _prevY: number;


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
    }

    protected makeLoad(): void {
        //notify
    }

    protected makeUnload() {
        //notify
    }

    protected move() {

    }

    protected wait() {

    }

    get animation() {
        return this._animation;
    }

    set animation(animation) {
        if (!(animation instanceof TWEEN.Tween)) {
            throw Error("Argument does'nt instanceof TWEEN.Tween")
        }
        this._animation = animation;
    }

    get graphics() {
        return this._graphics;
    }

    set graphics(graphics) {
        if (!(graphics instanceof PIXI.Graphics)) {
            throw Error("Argument does'nt instanceof PIXI.Graphics")
        }
        this._graphics = graphics;
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

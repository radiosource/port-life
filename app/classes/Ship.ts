import {IShip} from '../interfaces/IShip';
import {IShipTypes, IShipType} from '../interfaces/IShipTypes';
import {shipTypes, config} from '../config/default';


export class Ship implements IShip {

    static quantity = 0;

    readonly id: number;
    readonly width = config.SHIP_WIDTH;
    readonly height = config.SHIP_HEIGHT;
    readonly type: string;
    readonly color: number;

    protected _graphic: any;
    protected _loaded: boolean;
    protected _x: number;
    protected _y: number;


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

    get graphic() {
        return this._graphic;
    }

    set graphic(graphic) {
        if (!(graphic instanceof PIXI.Graphics)) {
            throw Error("Argument does'nt instanceof PIXI.Graphics")
        }
        this._graphic = graphic;
    }

    get loaded(): boolean {
        return this._loaded;
    }

    set loaded(loaded: boolean) {
        this._loaded = loaded;
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

}

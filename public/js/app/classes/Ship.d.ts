import { IShip } from '../interfaces/IShip';
export declare class Ship implements IShip {
    static quantity: number;
    readonly id: number;
    readonly width: number;
    readonly height: number;
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
    constructor(type: any);
    protected makeLoad(): void;
    protected makeUnload(): void;
    protected move(): void;
    protected wait(): void;
    animation: any;
    graphics: any;
    loaded: boolean;
    x: number;
    y: number;
    readonly prevX: number;
    readonly prevY: number;
}

import { IShip } from '../interfaces/IShip';
export declare class Ship implements IShip {
    static quantity: number;
    readonly id: number;
    readonly width: number;
    readonly height: number;
    readonly type: string;
    readonly color: number;
    protected _graphic: any;
    protected _loaded: boolean;
    protected _x: number;
    protected _y: number;
    /**@todo переписать на фабрику
     */
    constructor(type: any);
    protected makeLoad(): void;
    protected makeUnload(): void;
    protected move(): void;
    protected wait(): void;
    graphic: any;
    loaded: boolean;
    readonly x: number;
    readonly y: number;
}

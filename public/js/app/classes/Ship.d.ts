/// <reference types="pixi.js" />
/// <reference types="tween.js" />
import { IShip } from '../interfaces/IShip';
export declare class Ship implements IShip {
    static quantity: number;
    readonly id: number;
    readonly width: number;
    readonly height: number;
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
    constructor(type: any);
    protected makeGraphics(): void;
    protected move(coordinates: any, time: number): TWEEN.Tween;
    handleMessage(eventType: string, target: any): void;
    protected makeAnimation(targetPosition: {
        x: number;
        y: number;
    }, time: number): TWEEN.Tween;
    protected onAnimationUpdate(object: Ship): void;
    loaded: boolean;
    x: number;
    y: number;
    readonly prevX: number;
    readonly prevY: number;
}

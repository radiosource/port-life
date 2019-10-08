/// <reference types="pixi.js" />
/// <reference types="tween.js" />
import { Dock } from './Dock';
import { withMessages } from '../mixins/withMessages';
import { IShip } from '../interfaces/IShip';
export declare class Ship implements withMessages, IShip {
    static quantity: number;
    readonly id: number;
    readonly width: number;
    readonly height: number;
    readonly type: string;
    readonly color: number;
    protected graphics: PIXI.Graphics;
    protected animation: any;
    protected _loaded: boolean;
    protected _x: number;
    protected _y: number;
    protected _prevX: number;
    protected _prevY: number;
    subscribe(event: string): void;
    unsubscribe(event: string): void;
    message(event: string, target?: any): any;
    constructor(type: any);
    protected makeGraphics(): void;
    protected moveToGate(): void;
    handleMessage(eventType: string, target: any): void;
    protected moveToDock(target: Dock): void;
    protected moveToStart(): void;
    protected makeAnimation(targetPosition: {
        x: number;
        y: number;
    }, customOnUpdate?: Function): TWEEN.Tween;
    protected onAnimationUpdate(object: Ship): void;
    loaded: boolean;
    x: number;
    y: number;
    readonly prevX: number;
    readonly prevY: number;
}

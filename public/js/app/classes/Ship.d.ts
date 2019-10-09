/// <reference types="tween.js" />
import { Dock } from './Dock';
import { withMessages } from '../mixins/withMessages';
import { IShip } from '../interfaces/IShip';
import { IWithMessages } from '../interfaces/IWithMessages';
import * as PIXI from 'pixi.js';
export declare class Ship implements withMessages, IShip, IWithMessages {
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
    protected GATE_Y_CORRECTION: number;
    subscribe(event: string): void;
    unsubscribe(event: string): void;
    message(event: string, target?: any): void;
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

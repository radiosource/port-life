/// <reference types="tween.js" />
import { Dock } from './Dock';
import { Message } from "./Message";
import { IShip } from '../interfaces/IShip';
import { IWithMessages } from '../interfaces/IWithMessages';
import * as PIXI from 'pixi.js';
import { AdditionalShipData } from "./AdditionalShipData";
export declare class Ship extends Message implements IShip, IWithMessages {
    static quantity: number;
    readonly id: number;
    readonly width: number;
    readonly height: number;
    readonly type: string;
    protected graphics: PIXI.Graphics;
    protected animation: any;
    protected _x: number;
    protected _y: number;
    protected _prevX: number;
    protected _prevY: number;
    protected GATE_Y_CORRECTION: number;
    static readonly EXIT_MSG: string;
    static readonly ENTER_MSG: string;
    static readonly DESTROYED_MSG: string;
    static readonly HANDLE_CARGO_MSG: string;
    static readonly QUEUE_HAS_MOVED_MSG: string;
    static readonly ARRIVED_AT_THE_GATE_MSG: string;
    static readonly MOVE_TO_DOCK_ACCEPTED_MSG: string;
    protected additionalData: AdditionalShipData;
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
    readonly color: number;
    loaded: boolean;
    x: number;
    y: number;
    readonly prevX: number;
    readonly prevY: number;
}

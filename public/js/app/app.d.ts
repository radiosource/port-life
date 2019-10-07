/// <reference types="pixi.js" />
import { Ship } from "./classes/Ship";
export declare const app: PIXI.Application;
export declare function getTravelTime(traveler: {
    x: number;
    y: number;
}, target: {
    x: number;
    y: number;
}): number;
export declare function subscribe(eventName: string, subscriber: any): void;
export declare function unsubscribe(eventName: string, subscriber: any): void;
export declare function message(eventName: string, initiator: any, target?: any): boolean;
export declare function findSuitableDock(shipHaveCargo: boolean): any;
export declare function shipsTooClose(currentShip: Ship): boolean;
export declare function notify(eventType: any, target: any): void;
export declare function runApp(): void;

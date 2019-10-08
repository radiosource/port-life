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
export declare function getDistance(object1: {
    x: number;
    y: number;
}, object2: {
    x: number;
    y: number;
}): number;
export declare function subscribe(eventName: string, subscriber: any): void;
export declare function unsubscribe(eventName: string, subscriber: any): void;
export declare function message(eventName: string, initiator: any, target?: any): boolean;
export declare function shipsTooClose(currentShip: Ship): any;
export declare function runApp(): void;

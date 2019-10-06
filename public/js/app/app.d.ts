/// <reference types="pixi.js" />
import { Ship } from "./classes/Ship";
export declare const app: PIXI.Application;
export declare function findSuitableDock(shipHaveCargo: boolean): any;
export declare function shipsTooClose(currentShip: Ship): boolean;
export declare function notify(eventType: any, target: any): void;
export declare function runApp(): void;

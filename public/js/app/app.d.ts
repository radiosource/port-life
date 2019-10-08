/// <reference types="pixi.js" />
import { Ship } from "./classes/Ship";
export declare const app: PIXI.Application;
export declare const ships: Set<Ship>;
export declare function shipsTooClose(currentShip: Ship): boolean;
export declare function runApp(): void;

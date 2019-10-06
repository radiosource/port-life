import {IConfig} from '../interfaces/IConfig';
import {IShipTypes} from '../interfaces/IShipTypes';

const SECOND = 1000;
const WINDOW_WIDTH = window.innerWidth;
const WINDOW_HEIGHT = window.innerHeight;
const SHIP_WIDTH = 100;
const SHIP_HEIGHT = 40;

export const shipTypes: IShipTypes = {
    "red": {
        loaded: true,
        color: 0xd6212b,
        START_POINTS: {
            X: WINDOW_WIDTH - SHIP_WIDTH,
            Y: WINDOW_HEIGHT - WINDOW_HEIGHT / 4
        }
    },
    "green": {
        loaded: false,
        color: 0x38ba1d,
        START_POINTS: {
            X: WINDOW_WIDTH - SHIP_WIDTH,
            Y: WINDOW_HEIGHT / 4
        }
    }
};

export const config: IConfig = {
    SECOND,
    SHIP_WIDTH,
    SHIP_HEIGHT,
    WINDOW_WIDTH,
    WINDOW_HEIGHT,
    SAFE_DISTANCE: 20,
    WATER_COLOR: 0x4169e1,
    DOCKS_COUNT: 4,
    CARGO_HANDLING_TIME: SECOND * 1,
    SHIP_CREATION_INTERVAL: SECOND * 8,
};






/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./app/config/default.ts
const SECOND = 1000;
const WINDOW_WIDTH = window.innerWidth;
const WINDOW_HEIGHT = window.innerHeight;
const SHIP_WIDTH = 100;
const SHIP_HEIGHT = 40;
const shipTypes = {
    "red": {
        loaded: true,
        color: 0xd6212b,
        START_POINTS: {
            X: WINDOW_WIDTH - SHIP_WIDTH,
            Y: WINDOW_HEIGHT / 4
        }
    },
    "green": {
        loaded: false,
        color: 0x38ba1d,
        START_POINTS: {
            X: WINDOW_WIDTH - SHIP_WIDTH,
            Y: WINDOW_HEIGHT - WINDOW_HEIGHT / 4
        }
    }
};
const config = {
    SECOND,
    SHIP_WIDTH,
    SHIP_HEIGHT,
    WINDOW_WIDTH,
    WINDOW_HEIGHT,
    DOCKS_COUNT: 4,
    CARGO_HANDLING_TIME: SECOND * 5,
    SHIP_CREATION_INTERVAL: SECOND * 1,
};

// CONCATENATED MODULE: ./app/classes/Ship.ts

class Ship_Ship {
    /**@todo переписать на фабрику
     */
    constructor(type) {
        this.width = config.SHIP_WIDTH;
        this.height = config.SHIP_HEIGHT;
        if (!shipTypes[type]) {
            throw Error(`Invalid ship type - '${type}'`);
        }
        Ship_Ship.quantity++;
        this.id = Ship_Ship.quantity;
        this._x = shipTypes[type].START_POINTS.X;
        this._y = shipTypes[type].START_POINTS.Y;
        Object.assign(this, shipTypes[type], { type });
    }
    makeLoad() {
        //notify
    }
    makeUnload() {
        //notify
    }
    move() {
    }
    wait() {
    }
    get graphic() {
        return this._graphic;
    }
    set graphic(graphic) {
        if (!(graphic instanceof PIXI.Graphics)) {
            throw Error("Argument does'nt instanceof PIXI.Graphics");
        }
        this._graphic = graphic;
    }
    get loaded() {
        return this._loaded;
    }
    set loaded(loaded) {
        this._loaded = loaded;
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
}
Ship_Ship.quantity = 0;

// CONCATENATED MODULE: ./app/app.ts



function runApp() {
    const ships = [];
    const graphics = new PIXI.Graphics();
    const app = new PIXI.Application({
        width: config.WINDOW_WIDTH,
        height: config.WINDOW_HEIGHT,
        backgroundColor: 0x4169e1
    });
    document.body.appendChild(app.view);
    app.stage.addChild(graphics);
    createShip();
    let intervalId = setInterval(createShip, config.SHIP_CREATION_INTERVAL);
    app.ticker.add(() => {
        //createShip()
        //setInterval(createShip, 1000)
    });
    Object.assign(window, { stop: () => clearInterval(intervalId) });
    function createShip() {
        let ship = new Ship_Ship(getRandomShipType());
        ships.push(ship);
        Object.assign(window, { ships });
        renderShip(ship);
    }
    function getRandomShipType() {
        const shipTypesList = Object.keys(shipTypes);
        const randomNumber = parseInt(String(Math.random() * 100));
        return shipTypesList[randomNumber % shipTypesList.length];
    }
    function renderShip(ship) {
        ship.graphic = graphics.beginFill(ship.color, 1);
        graphics.lineStyle(3, 0x0f0f0f, 1);
        graphics.drawRect(ship.x, ship.y, ship.width, ship.height);
        graphics.endFill();
    }
}
;

// CONCATENATED MODULE: ./index.ts

document.addEventListener('DOMContentLoaded', runApp);


/***/ })
/******/ ]);
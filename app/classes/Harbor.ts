import {config} from '../config/default';
import {App} from "../App";
import {Dock} from "./Dock";
import {Ship} from "./Ship";

const TWEEN = require('@tweenjs/tween.js').default;


export class Harbor {
    static quantity = 0;

    static readonly gateX: number = config.WINDOW_WIDTH / 3;
    static readonly gateY: number = config.WINDOW_HEIGHT / 2;
    static readonly gateWidth: number = config.SHIP_WIDTH / 3;

    docs: Dock[] = [];
    protected color: number = 0xd4af37;
    protected graphics: PIXI.Graphics;
    protected animation: TWEEN.Tween;

    constructor() {
        if (Harbor.quantity) throw Error("Only one harbor!");
        Harbor.quantity++;
        const graphics = new PIXI.Graphics();
        graphics.beginFill(this.color, 1);
        graphics.drawRect(Harbor.gateX - Harbor.gateWidth, 0, Harbor.gateWidth, Harbor.gateY - config.SHIP_HEIGHT * 4);
        graphics.drawRect(Harbor.gateX - Harbor.gateWidth, Harbor.gateY + config.SHIP_HEIGHT * 4, Harbor.gateWidth, config.WINDOW_HEIGHT);
        graphics.endFill();
        this.graphics = App.stage.addChild(graphics);

        for (let x = 0; x < config.DOCKS_COUNT; x++) {
            this.docs.push(new Dock(config.WINDOW_HEIGHT / 4 * x))
        }
        Object.assign(window,{docs:this.docs})
    }

    public handleMessage(eventType: string, target: Ship) {
        //console.log("handleMessage", eventType);
        // switch (eventType) {
        //     case("ship::arrivedAtTheGate"):
        //         const suitableDocks = this.docs.filter((dock: Dock) => dock.loaded !== target.loaded && !dock.busy);
        //         if (suitableDocks.length) {
        //             suitableDocks[0].busy = true;
        //             target.handleMessage("harbor::moveToDock", suitableDocks[0]);
        //         }
        //         break;
        // }
    }
}
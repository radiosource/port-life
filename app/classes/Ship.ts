import {Harbor} from './Harbor';
import {Dock} from './Dock';
import {Message} from "./Message";
import {IShip} from '../interfaces/IShip';
import {IWithMessages} from '../interfaces/IWithMessages';
import {shipTypes, config} from '../config/default';
import {App} from '../App';
import {getTravelTime, shipsTooClose} from '../helper';
import * as PIXI from 'pixi.js'
import {AdditionalShipData} from "./AdditionalShipData";

const TWEEN = require('@tweenjs/tween.js').default;


export class Ship extends Message implements IShip, IWithMessages {

    static quantity = 0;

    readonly id: number;
    readonly width = config.SHIP_WIDTH;
    readonly height = config.SHIP_HEIGHT;
    readonly type: string;

    protected graphics: PIXI.Graphics;
    protected animation: any;//если указаь тип TWEEN.Tween, ругается на вызов методов прототипа, не нашел как побороть
    protected _x: number;
    protected _y: number;
    protected _prevX: number;
    protected _prevY: number;

    protected GATE_Y_CORRECTION: number;

    static readonly EXIT_MSG: string = "exit";
    static readonly ENTER_MSG: string = "enter";
    static readonly DESTROYED_MSG: string = "destroyed";
    static readonly HANDLE_CARGO_MSG: string = "handleCargo";
    static readonly QUEUE_HAS_MOVED_MSG: string = "queueHasMoved";
    static readonly ARRIVED_AT_THE_GATE_MSG: string = "arrivedAtTheGate";
    static readonly MOVE_TO_DOCK_ACCEPTED_MSG: string = "moveToDockAccepted";
    protected additionalData: AdditionalShipData;

    constructor(type) {
        super();
        if (!shipTypes[type]) {
            throw Error(`Invalid ship type - '${type}'`);
        }
        Ship.quantity++;
        this.type = type;
        this.id = Ship.quantity;

        this.additionalData = new AdditionalShipData(this.type);
        this._x = this.additionalData.START_POINTS.X;
        this._y = this.additionalData.START_POINTS.Y;
        this.GATE_Y_CORRECTION = (this.type === "green" ? this.height : -this.height) * 2;

        this.makeGraphics();
        this.moveToGate();
    }

    protected makeGraphics(): void {
        let graphics = new PIXI.Graphics();
        graphics.beginFill(this.loaded ? this.color : config.WATER_COLOR, 1);
        graphics.lineStyle(5, this.color, 1);
        graphics.drawRect(this.x, this.y, this.width, this.height);
        graphics.endFill();
        this.graphics && this.graphics.destroy();
        this.graphics = App.stage.addChild(graphics);
    }

    protected moveToGate(): void {
        this.animation = this.makeAnimation({x: Harbor.gateX + config.SAFE_DISTANCE, y: this.y},
            (object) => {
                this.onAnimationUpdate(object);
                if (shipsTooClose(this)) {
                    this.send(Ship.QUEUE_HAS_MOVED_MSG);
                    this.subscribe(Ship.QUEUE_HAS_MOVED_MSG);
                    this.animation.pause();
                }
            })
            .onComplete(() => {
                this.subscribe(Dock.MOVE_TO_DOCK_MSG);
                this.send(Ship.ARRIVED_AT_THE_GATE_MSG);
                this.send(Ship.QUEUE_HAS_MOVED_MSG);
            })
            .start()

    }

    public handleMessage(eventType: string, target: any): void {
        switch (eventType) {
            case Ship.QUEUE_HAS_MOVED_MSG:
                if (this.animation.isPaused() && !shipsTooClose(this)) {
                    this.animation.isPaused() && this.animation.resume();
                    this.unsubscribe(Ship.QUEUE_HAS_MOVED_MSG);
                    this.send(Ship.QUEUE_HAS_MOVED_MSG);
                }
                break;
            case Dock.MOVE_TO_DOCK_MSG:
                if (target.loaded !== this.loaded && Harbor.gateIsOpen) {
                    this.unsubscribe(Dock.MOVE_TO_DOCK_MSG);
                    this.send(Ship.ENTER_MSG);
                    this.send(Ship.MOVE_TO_DOCK_ACCEPTED_MSG, target);
                    this.moveToDock(target);
                }
                break;
        }
    }

    protected moveToDock(target: Dock): void {
        this.animation = this
            .makeAnimation({y: Harbor.gateY - this.GATE_Y_CORRECTION, x: this.x})
            .onComplete(() => {
                this.send(Ship.QUEUE_HAS_MOVED_MSG);
                this.send(Ship.EXIT_MSG);
            });
        this.animation.chain(
            this.makeAnimation({x: Harbor.gateX - Harbor.gateWidth * 2, y: Harbor.gateY - this.GATE_Y_CORRECTION})
                .chain(this
                    .makeAnimation(target.receivingPoints)
                    .onComplete(() => {
                        this.send(Ship.HANDLE_CARGO_MSG, target);
                        this.animation = new TWEEN.Tween({})
                            .to({}, config.CARGO_HANDLING_TIME)
                            .onComplete((object) => {
                                this.loaded = !this.loaded;
                                this.makeGraphics();
                                this.moveToStart();
                            })
                            .start()
                    })
                )
        );
        this.animation.start();
    }

    protected moveToStart(): void {
        this.animation = this
            .makeAnimation({
                y: Harbor.gateY - this.GATE_Y_CORRECTION,
                x: Harbor.gateX - Harbor.gateWidth * 2
            });
        this.animation.chain(this
            .makeAnimation({
                y: config.WINDOW_HEIGHT / 2,
                x: config.WINDOW_WIDTH
            })
            .onComplete(() => {
                this.graphics.destroy();
                this.send(Ship.DESTROYED_MSG)
            })
        )
        ;
        this.animation.start();
    }

    protected makeAnimation(targetPosition: { x: number, y: number }, customOnUpdate?: Function): TWEEN.Tween {
        const time = getTravelTime(this, targetPosition);
        return new TWEEN.Tween(this)
            .to(targetPosition, time)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(customOnUpdate || this.onAnimationUpdate)
    }

    protected onAnimationUpdate(object: Ship): void {
        object.graphics.x -= object.prevX - object.x;
        object.graphics.y -= object.prevY - object.y;
    }


    get color(): number {
        return this.additionalData.color;
    }

    get loaded(): boolean {
        return this.additionalData.loaded;
    }

    set loaded(loaded: boolean) {
        this.additionalData.loaded = loaded;
    }

    set x(x) {
        this._prevX = this._x;
        this._x = x;
    }

    set y(y) {
        this._prevY = this._y;
        this._y = y;
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    get prevX(): number {
        return this._prevX;
    }

    get prevY(): number {
        return this._prevY;
    }

}


import {Harbor} from './Harbor';
import {Dock} from './Dock';
import {withMessages} from '../mixins/withMessages';
import {IShip} from '../interfaces/IShip';
import {shipTypes, config} from '../config/default';
import {App} from '../App';
import {getTravelTime, shipsTooClose} from '../helper';


const TWEEN = require('@tweenjs/tween.js').default;


export class Ship implements withMessages, IShip {

    static quantity = 0;

    readonly id: number;
    readonly width = config.SHIP_WIDTH;
    readonly height = config.SHIP_HEIGHT;
    readonly type: string;
    readonly color: number;

    protected graphics: PIXI.Graphics;
    protected animation: any;//TWEEN.Tween
    protected _loaded: boolean;
    protected _x: number;
    protected _y: number;
    protected _prevX: number;
    protected _prevY: number;

    subscribe(event: string): void {
    }

    unsubscribe(event: string): void {
    }

    message(event: string, target?: any): void {
    }

    constructor(type) {
        if (!shipTypes[type]) {
            throw Error(`Invalid ship type - '${type}'`);
        }
        Ship.quantity++;
        this.id = Ship.quantity;
        this._x = shipTypes[type].START_POINTS.X;
        this._y = shipTypes[type].START_POINTS.Y;
        Object.assign(this, shipTypes[type], {type});
        this.makeGraphics();
        //this.animation = new TWEEN.Tween(this);
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
            function (object) {
                this.onAnimationUpdate(object);
                if (shipsTooClose(this)) {
                    this.message("ship::queueHasMoved");
                    this.subscribe("ship::queueHasMoved");
                    this.animation.pause();
                }
            }.bind(this))
            .onComplete(() => {
                this.subscribe("dock::moveToDock");
                this.message(`ship::arrivedAtTheGate`);
                this.message(`ship::queueHasMoved`);
            })
            .start()

    }

    public handleMessage(eventType: string, target: any): void {
        switch (eventType) {
            case "ship::queueHasMoved":
                if (this.animation.isPaused() && !shipsTooClose(this)) {
                    this.animation.isPaused() && this.animation.resume();
                    this.unsubscribe("ship::queueHasMoved");
                    this.message("ship::queueHasMoved");
                }
                break;
            case "dock::moveToDock":
                if (target.loaded !== this.loaded) {
                    this.unsubscribe("dock::moveToDock");
                    this.message("ship::moveToDockAccepted", target);
                    this.moveToDock(target);
                }
                break;
            case "harbor:gateClosed":
                break;
            case "harbor:gateOpen":
                break;
        }
    }

    protected moveToDock(target: Dock): void {
        this.animation = this
            .makeAnimation({y: Harbor.gateY, x: this.x})
            .onComplete(() => this.message("ship::queueHasMoved"));
        this.animation.chain(
            this.makeAnimation({x: Harbor.gateX - Harbor.gateWidth * 2, y: Harbor.gateY})
                .chain(this
                    .makeAnimation(target.receivingPoints)
                    .onComplete(() => {
                        this.message("ship::handleCargo", target);
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
            .makeAnimation({y: Harbor.gateY, x: Harbor.gateX - Harbor.gateWidth * 2})
            .onComplete(() => this.message("ship::queueHasMoved"));
        this.animation.chain(this
            .makeAnimation({y: config.WINDOW_HEIGHT / 2, x: config.WINDOW_WIDTH})
            .onComplete(() => {
                this.graphics.destroy();
            })
        );
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

    get loaded(): boolean {
        return this._loaded;
    }

    set loaded(loaded: boolean) {
        this._loaded = loaded;
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


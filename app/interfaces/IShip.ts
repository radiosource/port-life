export interface IShip {

    readonly id: number;
    readonly width: number;
    readonly height: number;
    readonly type: string;
    readonly color: number;
    readonly loaded: boolean;

    x: number;
    y: number;
    prevX: number;
    prevY: number;
}
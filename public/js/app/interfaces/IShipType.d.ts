export interface IShipType {
    readonly color: number;
    loaded: boolean;
    START_POINTS: {
        readonly X: number;
        readonly Y: number;
    };
}

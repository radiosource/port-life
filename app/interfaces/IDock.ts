export interface IDock {
    readonly id: number;
    readonly receivingPoints: { x: number, y: number };
    readonly height: number;
    readonly width: number;
    readonly yStart: number;
}
import {IShipType} from '../interfaces/IShipTypes';
import {shipTypes} from '../config/default';

//Наверное все это лучше сразу сделать в конструкторе корабля, а не выносить в отдельный класс из-за нескольких свойств
//А то какой то стремный клас получился, больше поход на абстрактный
//Или создать 2 отдельных класса для красных и зеленых кораблей

export class AdditionalShipData implements IShipType {
    readonly color: number;
    public loaded: boolean;
    readonly START_POINTS: {
        readonly X: number;
        readonly Y: number;
    };

    constructor(type) {
        const currentShipType = shipTypes[type];
        for (let property in currentShipType) {
            this[property] = currentShipType[property];
        }
    }
}
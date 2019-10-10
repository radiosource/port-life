import {Message} from '../classes/Message';

export interface IWithMessages {
    handleMessage(eventType: string, target: any): void;
    readonly message: Message;
}
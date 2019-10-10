import {Messenger} from "./abstracts/Messenger";

//Этот класс собственно воззник, потому что  в кораблях, доках и гавани,
// мне не нравилось каждый раз передавать контекст при вызове subscribe,unsubscribe,message
export class Message {

    protected readonly owner: any;

    constructor(owner: any) {
        this.owner = owner;
    }

    subscribe(event: string): void {
        Messenger.subscribe(event, this.owner);
    }

    unsubscribe(event: string): void {
        Messenger.unsubscribe(event, this.owner);
    }

    send(event: string, target?: any): void {
        Messenger.message(event, this.owner, target);
    }
}
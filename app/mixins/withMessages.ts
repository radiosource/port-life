import {Messenger} from "../classes/Messenger";

export class withMessages {
    subscribe(event: string): void {
        Messenger.subscribe(event, this);
    }

    unsubscribe(event: string): void {
        Messenger.unsubscribe(event, this);
    }

    message(event: string, target?: any): void {
        Messenger.message(event, this, target);
    }
}
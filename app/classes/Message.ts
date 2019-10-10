import {Messenger} from "./abstracts/Messenger";

//Этот класс собственно воззник, потому что  в кораблях, доках и гавани,
// мне не нравилось каждый раз передавать контекст при вызове subscribe,unsubscribe,message

//Не хотел наследовать корабли, гавань и т.д от этого класса, потому что мне кажется нелогичным
//что корабль наследуется от класа, необходимого только для обмена сообщениями,
//думал лучше было бы сделать для него композицию типа this.message = new Message(); и дальше юзать this.message.send...
export abstract class Message {

    subscribe(event: string): void {
        Messenger.subscribe(event, this);
    }

    unsubscribe(event: string): void {
        Messenger.unsubscribe(event, this);
    }

    send(event: string, target?: any): void {
        Messenger.message(event, this, target);
    }
}
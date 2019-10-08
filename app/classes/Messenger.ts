export abstract class Messenger {

    protected static eventsListeners = {};

    static subscribe(eventName: string, subscriber: any): void {
        if (!(subscriber.handleMessage instanceof Function)) throw Error("subscribe::Invalid subscriber");
        if (!Messenger.eventsListeners[eventName]) Messenger.eventsListeners[eventName] = new Set();
        Messenger.eventsListeners[eventName].add(subscriber);
    }

    static unsubscribe(eventName: string, subscriber: any): void {
        if (!Messenger.eventsListeners[eventName]) return;
        Messenger.eventsListeners[eventName].delete(subscriber);
    }

    static message(eventName: string, initiator: any, target?: any): void {
        if (!(Messenger.eventsListeners[eventName] instanceof Set)) return;
        if (target) {
            if (!(target.handleMessage instanceof Function)) throw Error("message::Invalid target!");
            if (Messenger.eventsListeners[eventName].has(target)) {
                target.handleMessage(eventName, initiator);
            }
        } else {
            for (let listener of Messenger.eventsListeners[eventName].values()) {
                listener.handleMessage(eventName, initiator);
            }
        }
    }
}
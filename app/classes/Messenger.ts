//Наверно лучше подписоватся на события, указывая колбек,
// а не все обрабатывать в одной функции-обработчике с свич кейсом.

export abstract class Messenger {

    protected static eventsListeners = {};

    /**
     * Подписывает обьект на событие
     * @param {string} eventName - название события
     * @param subscriber - инстанс подписчика
     */
    static subscribe(eventName: string, subscriber: any): void {
        if (!(subscriber.handleMessage instanceof Function)) throw Error("subscribe::Invalid subscriber");
        if (!Messenger.eventsListeners[eventName]) Messenger.eventsListeners[eventName] = new Set();
        Messenger.eventsListeners[eventName].add(subscriber);
    }

    /**
     * Отписывает обьект
     * @param {string} eventName - название события
     * @param subscriber - инстанс подписчика
     */
    static unsubscribe(eventName: string, subscriber: any): void {
        if (!Messenger.eventsListeners[eventName]) return;
        Messenger.eventsListeners[eventName].delete(subscriber);
    }

    /**
     * Отправляет сообщение всем подписаным обьектам, или конкретному инстансу
     * @param {string} eventName
     * @param initiator
     * @param target - конкретный получатель
     */
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
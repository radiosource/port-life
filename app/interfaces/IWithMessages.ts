export interface IWithMessages {
    handleMessage(eventType: string, target: any): void;
    send(eventType: string, target?: any): void;
    subscribe(eventType: string): void;
    unsubscribe(eventType: string): void;
}
export interface IWithMessages {
    handleMessage(eventType: string, target: any): void;
    subscribe(event: string): void;
    unsubscribe(event: string): void;
    message(event: string, target?: any): void;
}
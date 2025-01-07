type DomainEvent = {
  type: string;
  payload: any;
};

type EventListener = (event: DomainEvent) => void;

export class DomainEventPublisher {
  private listeners: { [eventType: string]: EventListener[] } = {};

  subscribe(eventType: string, listener: EventListener): void {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    this.listeners[eventType].push(listener);
  }

  publish(event: DomainEvent): void {
    const { type, payload } = event;
    const eventListeners = this.listeners[type] || [];
    for (const listener of eventListeners) {
      listener({ type, payload });
    }
  }
}

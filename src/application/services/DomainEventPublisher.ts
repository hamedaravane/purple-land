type Event = { type: string; payload: any };
type Listener = (event: Event) => void;

export class DomainEventPublisher {
  private listeners: { [eventType: string]: Listener[] } = {};

  subscribe(eventType: string, listener: Listener): void {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    this.listeners[eventType].push(listener);
  }

  publish(event: Event): void {
    const eventListeners = this.listeners[event.type];
    if (eventListeners) {
      eventListeners.forEach((listener) => listener(event));
    }
  }
}

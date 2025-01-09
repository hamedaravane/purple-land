export interface IDomainEvent {
  // Marker interface. Each domain event class implements this.
}

export type DomainEventConstructor<T extends IDomainEvent> = new (
  ...args: any[]
) => T;

/**
 * The `DomainEventPublisher` is a simple static event bus that:
 * 1) Allows subscription to domain events by event class.
 * 2) Publishes events by instantiating them, then calling `publish()`.
 * 3) Routes published events to all subscribers.
 *
 * You can enhance this with logs, async handling, or more robust filtering.
 */
export class DomainEventPublisher {
  // A map from "event class name" -> array of listeners.
  private static listeners: Map<string, Array<(event: IDomainEvent) => void>> =
    new Map();

  /**
   * Subscribe to a specific event class. The generic type T ensures
   * you only receive that event type in your callback.
   */
  public static subscribe<T extends IDomainEvent>(
    eventClass: DomainEventConstructor<T>,
    listener: (event: T) => void,
  ) {
    const eventName = eventClass.name;
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName)!.push(listener as (e: IDomainEvent) => void);
  }

  /**
   * Publish an event instance. All listeners for that event class
   * will be invoked with the event data.
   */
  public static publish<T extends IDomainEvent>(event: T) {
    const eventName = event.constructor.name;
    const eventListeners = this.listeners.get(eventName) || [];
    for (const listener of eventListeners) {
      (listener as (ev: T) => void)(event);
    }
  }
}

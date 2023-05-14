import { Alert } from "../yuki"

export enum EventType {
  WEBSOCKET_CONNECT,
  BANK_LOAD,
  BANK_UPDATE,
  ALERT,
}

export type Event = { name: EventType }

export class WebsocketConnectEvent implements Event {
  readonly name = EventType.WEBSOCKET_CONNECT
}

export class BankLoadEvent implements Event {
  readonly name = EventType.BANK_LOAD
}

export class BankUpdateEvent implements Event {
  readonly name = EventType.BANK_UPDATE
}

export class AlertEvent implements Event {
  readonly name = EventType.ALERT
  readonly alert: Alert

  constructor(alert: Alert) {
    this.alert = alert
  }
}

const eventListeners: Map<EventType, Function[]> = new Map()

/** Adds an event listener for the given event type */
export const listen = <E extends Event>(
  eventName: EventType,
  listener: (event: E) => Promise<any>
) => {
  if (!eventListeners.has(eventName)) eventListeners.set(eventName, [])
  eventListeners.get(eventName).push(listener)
}

export const announce = (event: Event) =>
  eventListeners.get(event.name)?.forEach((f) => f(event))

import file from "./file"
import {
  AlertEvent,
  Event,
  BankLoadEvent,
  BankUpdateEvent,
  EventType,
  listen,
  WebsocketConnectEvent,
  announce,
} from "./event"
import { AsyncCache, SyncCache } from "./Cache"

export const randFromRange = (
  iMin: number,
  eMax: number,
  round: boolean = true
): number => {
  let val = iMin + Math.random() * eMax
  if (round) val = Math.floor(val)
  return val
}

export {
  file,
  AlertEvent,
  Event,
  BankLoadEvent,
  BankUpdateEvent,
  EventType,
  listen,
  WebsocketConnectEvent,
  announce,
  AsyncCache,
  SyncCache,
}

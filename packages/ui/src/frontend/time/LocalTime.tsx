"use client";

import { useSyncExternalStore } from "react";
import { formatInstant } from "./format-instant";

export interface LocalTimeProps {
  value: Date | string;
  className?: string;
}

const subscribe = () => () => undefined;
const getBrowserTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
const getServerTimeZone = () => "UTC";

export function LocalTime({ value, className }: LocalTimeProps) {
  const timeZone = useSyncExternalStore(subscribe, getBrowserTimeZone, getServerTimeZone);

  return <time className={className} dateTime={value instanceof Date ? value.toISOString() : value}>{formatInstant(value, timeZone)}</time>;
}

export const ttlMsToSec = (time: number) => time / 1000;
export const ttlSecToMs = (time: number) => time * 1000;

/**
 * TTL in second
 */
export const ttl = {
  minute: 60,
  hour: 60 * 60,
  day: 60 * 60 * 24,
  week: 60 * 60 * 24 * 7,
  month: 60 * 60 * 24 * 7 * 30,
};

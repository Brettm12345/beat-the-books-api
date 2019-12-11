import { map } from 'blend-promise-utils';
import { flip } from 'fp-ts/lib/function';
import { curryN } from 'ramda';

/**
 * Maps a function that returns a promose
 */
export const mapPromise = curryN(2, flip(map));

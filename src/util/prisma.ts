import { map } from 'fp-ts/lib/Array';
import { prop } from 'fp-ts-ramda';
import { pipe } from 'fp-ts/lib/pipeable';

interface Node {
  id: string;
}

type Key = 'connect' | 'disconnect' | 'delete';

const setItems = (key: Key) => <T extends Node>(items: T[]) => ({
  [key]: map(prop('id'))(items)
});

export const [connect, disconnect, deleteItems] = pipe(
  ['connect', 'disconnect', 'delete'],
  map(setItems)
);

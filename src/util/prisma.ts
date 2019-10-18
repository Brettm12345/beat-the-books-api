import { map, pick } from 'ramda';

interface Node {
  id: string;
}

const pickId = <T extends Node>(item: T) => pick(['id'], item);

const getIds = map(pickId);

type Key = 'connect' | 'disconnect' | 'delete';

const setItems = (key: Key) => <T extends Node>(items: T[]) => ({
  [key]: getIds(items)
});

export const connect = setItems('connect');
export const disconnect = setItems('disconnect');
export const deleteItems = setItems('delete');

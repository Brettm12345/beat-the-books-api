import { map, project } from 'ramda';

interface Node {
  id: string;
}

type Key = 'connect' | 'disconnect' | 'delete';

const setItems = (key: Key) => <T extends Node>(items: T[]) => ({
  [key]: project(['id'], items)
});

export const [connect, disconnect, deleteItems] = map(setItems)([
  'connect',
  'disconnect',
  'delete'
]);

import * as R from 'fp-ts/lib/Record';
import { Option } from 'fp-ts/lib/Option';

export const replace = (searchValue: string, replacement: string) => (
  str: string
) => str.replace(searchValue, replacement);

type Lookup = <A>(k: string) => (r: Record<string, A>) => Option<A>;
export const lookup: Lookup = k => r => R.lookup(k, r);

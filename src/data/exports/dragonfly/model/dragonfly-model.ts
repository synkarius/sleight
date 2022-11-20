import { Fn } from '../../../model/fn/fn';
import { DragonflyRule } from './dragonfly-rule';

/** a data format convenient for printing */
export type DragonflyModel = {
  rules: DragonflyRule[];
  fns: Fn[];
  /** builtin fns in DragonflyModel are for wrapper fn printing */
  builtinFns: Fn[];
};

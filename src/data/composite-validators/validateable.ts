import { Action } from '../model/action/action';
import { Command } from '../model/command/command';
import { Context } from '../model/context/context';
import { Fn } from '../model/fn/fn';
import { Spec } from '../model/spec/spec-domain';
import { Variable } from '../model/variable/variable';

export type Validateable = Action | Command | Context | Fn | Spec | Variable;

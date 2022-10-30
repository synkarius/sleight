import { SleightDataInternalFormat } from '../../../data/data-formats';
import { Action } from '../../../data/model/action/action';
import { Command } from '../../../data/model/command/command';
import { Spec } from '../../../data/model/spec/spec-domain';

export type SpellData = {
  spec: Spec;
  action: Action;
  command: Command;
  data: SleightDataInternalFormat;
};

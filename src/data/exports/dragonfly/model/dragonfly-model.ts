import { DragonflyRule } from './dragonfly-rule';
import { DragonflyRuleMetadata } from './dragonfly-rule-metadata';

export type DragonflyModel = {
  rules: DragonflyRule[];
  metadata: DragonflyRuleMetadata;
};

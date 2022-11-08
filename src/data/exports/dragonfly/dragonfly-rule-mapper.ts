import { replaceNonAlphaNumeric } from '../../../core/common/common-functions';
import { MapUtil } from '../../../core/common/map-util';
import { VariableExtractor } from '../../../validation/variable-extraction/variable-extractor';
import { SleightDataInternalFormat } from '../../data-formats';
import { OptionalId } from '../../model/domain';
import { DragonflyRule } from './dragonfly-rule';

export type DragonflyRuleMapper = {
  mapDataToDragonflyRules(data: SleightDataInternalFormat): DragonflyRule[];
};

export class DefaultDragonflyRuleMapper implements DragonflyRuleMapper {
  constructor(private variableExtractor: VariableExtractor) {}

  mapDataToDragonflyRules(data: SleightDataInternalFormat): DragonflyRule[] {
    const result = new Map<string, DragonflyRule>();

    const commandDTOs = Object.values(data.commands);
    for (const commandDTO of commandDTOs) {
      const rule =
        result.get(this.getKey(commandDTO.contextId)) ??
        this.createNewDragonflyRule(commandDTO.contextId, data);
      result.set(this.getKey(commandDTO.contextId), rule);

      // add command
      rule.commands.push(commandDTO);
      // add variables
      commandDTO.actionIds
        .map((actionId) => MapUtil.getOrThrow(data.actions, actionId))
        .flatMap((actionDTO) =>
          this.variableExtractor.extractVariables(actionDTO)
        )
        .map((ev) => MapUtil.getOrThrow(data.variables, ev.variableId))
        .forEach((variableDTO) => rule.variables.push(variableDTO));
    }

    return Array.from(result.values());
  }

  private createNewDragonflyRule(
    contextId: OptionalId,
    data: SleightDataInternalFormat
  ): DragonflyRule {
    const context = !!contextId
      ? MapUtil.getOrThrow(data.contexts, contextId)
      : undefined;
    return {
      contextName: !!context
        ? replaceNonAlphaNumeric(context.name, '_')
        : this.getKeyDefault(),
      context,
      commands: [],
      variables: [],
    };
  }

  private getKey(contextId: OptionalId): string {
    return contextId ?? this.getKeyDefault();
  }

  private getKeyDefault(): string {
    return 'global';
  }
}

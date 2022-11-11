import { replaceNonAlphaNumeric } from '../../../core/common/common-functions';
import { MapUtil } from '../../../core/common/map-util';
import { VariableExtractor } from '../../../validation/variable-extraction/variable-extractor';
import { SleightDataInternalFormat } from '../../data-formats';
import { Command } from '../../model/command/command';
import { OptionalId } from '../../model/domain';
import { DragonflyModel } from './model/dragonfly-model';
import { DragonflyRule } from './model/dragonfly-rule';

export type DragonflyModelMapper = {
  mapDataToDragonflyModel(data: SleightDataInternalFormat): DragonflyModel;
};

export class DefaultDragonflyModelMapper implements DragonflyModelMapper {
  constructor(private variableExtractor: VariableExtractor) {}

  mapDataToDragonflyModel(data: SleightDataInternalFormat): DragonflyModel {
    const result = new Map<string, DragonflyRule>();
    let noopCommandsExist = false;

    const commandDTOs = Object.values(data.commands);
    for (const commandDTO of commandDTOs) {
      const rule =
        result.get(this.getKey(commandDTO.contextId)) ??
        this.createNewDragonflyRule(commandDTO.contextId, data);
      result.set(this.getKey(commandDTO.contextId), rule);

      // add command
      rule.commands.push(commandDTO);
      // add variables
      const variableDTOs = this.getVariablesFromCommand(commandDTO, data);
      variableDTOs.forEach((variableDTO) => rule.extras.push(variableDTO));
      // add defaults
      variableDTOs
        .filter((variableDTO) => !!variableDTO.defaultValue)
        .forEach((variableDTO) => rule.defaults.push(variableDTO));
      // determine whether there are commands with no action
      noopCommandsExist = noopCommandsExist || !variableDTOs.length;
    }

    return {
      rules: Array.from(result.values()),
      metadata: { noopCommandsExist },
    };
  }

  private getVariablesFromCommand(
    commandDTO: Command,
    data: SleightDataInternalFormat
  ) {
    const variableIds = new Set(
      commandDTO.actionIds
        .map((actionId) => MapUtil.getOrThrow(data.actions, actionId))
        .flatMap((actionDTO) =>
          this.variableExtractor.extractVariables(actionDTO)
        )
        .map((ev) => ev.variableId)
    );
    return Array.from(variableIds).map((variableId) =>
      MapUtil.getOrThrow(data.variables, variableId)
    );
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
      extras: [],
      defaults: [],
    };
  }

  private getKey(contextId: OptionalId): string {
    return contextId ?? this.getKeyDefault();
  }

  private getKeyDefault(): string {
    return 'global';
  }
}

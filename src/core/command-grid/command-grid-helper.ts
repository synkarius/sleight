import { SleightDataInternalFormat } from '../../data/data-formats';
import { Action } from '../../data/model/action/action';
import { Command } from '../../data/model/command/command';
import { Context } from '../../data/model/context/context';
import { Spec } from '../../data/model/spec/spec-domain';
import { Variable } from '../../data/model/variable/variable';
import { VariableExtractor } from '../../validation/variable-extraction/variable-extractor';
import { MapUtil } from '../common/map-util';
import { DomainMapper } from '../mappers/mapper';
import { SpecDomainMapper } from '../mappers/spec-domain-mapper';
import { VariableDomainMapper } from '../mappers/variable-domain-mapper';

export const GLOBAL_CONTEXT = 'global';

export type GridItem = {
  command: Command;
  spec: Spec;
  context?: Context;
  actions: Action[];
  variables: Variable[];
};

export type GridFilterCriteria = {
  contextSearch: string;
};

export type CommandGridHelper = {
  mapDataToGridItems: (
    data: Readonly<SleightDataInternalFormat>,
    filterCriteria: GridFilterCriteria
  ) => GridItem[];
};

export class DefaultCommandGridHelper implements CommandGridHelper {
  constructor(
    private actionMapper: DomainMapper<Action, Action>,
    private commandMapper: DomainMapper<Command, Command>,
    private contextMapper: DomainMapper<Context, Context>,
    private specMapper: SpecDomainMapper,
    private variableMapper: VariableDomainMapper,
    private variableExtractor: VariableExtractor
  ) {}

  mapDataToGridItems(
    data: Readonly<SleightDataInternalFormat>,
    filterCriteria: GridFilterCriteria
  ): GridItem[] {
    return Object.values(data.commands)
      .sort((a, b) => this.sortCommands(a, b))
      .map((command) => this.mapCommandToGridItem(command, data))
      .filter((item) => this.filterForSearch(item, filterCriteria));
  }

  private mapCommandToGridItem(
    command: Command,
    data: Readonly<SleightDataInternalFormat>
  ): GridItem {
    const actions = command.actionIds
      .map((actionId) => MapUtil.getOrThrow(data.actions, actionId))
      .map((action) => this.actionMapper.mapToDomain(action));
    return {
      command: this.commandMapper.mapToDomain(command),
      spec: this.specMapper.mapToDomain(
        MapUtil.getOrThrow(data.specs, command.specId),
        data.selectors
      ),
      context: command.contextId
        ? this.contextMapper.mapToDomain(
            MapUtil.getOrThrow(data.contexts, command.contextId)
          )
        : undefined,
      actions,
      variables: actions
        .flatMap((action) => this.variableExtractor.extractVariables(action))
        .map((ev) => ev.variableId)
        .map((variableId) => MapUtil.getOrThrow(data.variables, variableId))
        .map((variableDTO) =>
          this.variableMapper.mapToDomain(variableDTO, data.selectors)
        ),
    };
  }

  private sortCommands(a: Command, b: Command): number {
    return this.getContextKey(a.contextId) < this.getContextKey(b.contextId)
      ? -1
      : 1;
  }

  private filterForSearch(
    item: GridItem,
    filterCriteria: GridFilterCriteria
  ): boolean {
    const contextSearch = filterCriteria.contextSearch;
    const global =
      !item.context &&
      (contextSearch === '' || contextSearch.toLowerCase() === GLOBAL_CONTEXT);
    const contextMatch = !!(
      item.context &&
      (item.context.name.toLowerCase().includes(contextSearch.toLowerCase()) ||
        item.context.matcher
          .toLowerCase()
          .includes(contextSearch.toLowerCase()))
    );
    return global || contextMatch;
  }

  private getContextKey(contextId?: string) {
    return contextId ?? '';
  }
}

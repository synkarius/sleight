import React from 'react';
import { Exporter } from '../data/exports/exporter';
import { Importer } from '../data/imports/json-importer';
import { DomainMapper } from '../core/mappers/mapper';
import { Ided } from '../data/model/domain';
import { Action } from '../data/model/action/action';
import { Command } from '../data/model/command/command';
import { DefaultNamer } from '../core/default-namers/default-namer';
import { Context } from '../data/model/context/context';
import { Selector } from '../data/model/selector/selector-domain';
import { SelectorDTO } from '../data/model/selector/selector-dto';
import { Spec } from '../data/model/spec/spec-domain';
import { SpecDomainMapper } from '../core/mappers/spec-domain-mapper';
import { Variable } from '../data/model/variable/variable';
import { VariableDomainMapper } from '../core/mappers/variable-domain-mapper';
import { VarIdedAndTyped } from '../core/default-namers/variable-default-namer';
import { FieldValidator } from '../validation/field-validator';
import { Cleaner } from '../core/cleaners/cleaner';
import { SpecDTO } from '../data/model/spec/spec-dto';
import { VariableDTO } from '../data/model/variable/variable-dto';

export type Injected = {
  importers: {
    json: Importer;
  };
  exporters: {
    json: Exporter;
    dragonfly: Exporter;
  };
  validators: {
    action: FieldValidator<Action>[];
    command: FieldValidator<Command>[];
    context: FieldValidator<Context>[];
    spec: FieldValidator<Spec>[];
    variable: FieldValidator<Variable>[];
  };
  mappers: {
    action: DomainMapper<Action, Action>;
    command: DomainMapper<Command, Command>;
    context: DomainMapper<Context, Context>;
    selector: DomainMapper<Selector, SelectorDTO>;
    spec: SpecDomainMapper;
    variable: VariableDomainMapper;
  };
  default: {
    namers: {
      action: DefaultNamer<Action>;
      command: DefaultNamer<Command>;
      context: DefaultNamer<Context>;
      spec: DefaultNamer<Ided>;
      variable: DefaultNamer<VarIdedAndTyped>;
    };
  };
  cleaners: {
    action: Cleaner<Action>;
    command: Cleaner<Command>;
    context: Cleaner<Context>;
    selector: Cleaner<SelectorDTO>;
    spec: Cleaner<SpecDTO>;
    variable: Cleaner<VariableDTO>;
  };
};

export const InjectionContext = React.createContext<Injected | undefined>(
  undefined
) as React.Context<Readonly<Injected>>;

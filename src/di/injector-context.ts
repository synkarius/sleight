import React from 'react';
import { Exporter } from '../data/exports/exporter';
import { Importer } from '../data/imports/json-importer';
import { DomainMapper } from '../data/mapper';
import { Ided } from '../features/domain';
import { Action } from '../features/model/action/action';
import { Command } from '../features/model/command/command';
import { DefaultNamer } from '../features/model/common/default-namer';
import { Context } from '../features/model/context/context';
import { Selector } from '../features/model/selector/data/selector-domain';
import { SelectorDTO } from '../features/model/selector/data/selector-dto';
import { Spec } from '../features/model/spec/data/spec-domain';
import { SpecDomainMapper } from '../features/model/spec/data/spec-domain-mapper';
import { Variable } from '../features/model/variable/data/variable';
import { VariableDomainMapper } from '../features/model/variable/data/variable-domain-mapper';
import { VarIdedAndTyped } from '../features/model/variable/variable-default-namer';
import { FieldValidator } from '../validation/field-validator';

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
};

export const InjectionContext = React.createContext<Injected | undefined>(
  undefined
) as React.Context<Readonly<Injected>>;

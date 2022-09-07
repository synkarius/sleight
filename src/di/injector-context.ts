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

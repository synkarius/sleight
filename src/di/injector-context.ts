import React from 'react';
import { Exporter } from '../data/exports/exporter';
import { Importer } from '../data/imports/json-importer';
import { DomainMapper } from '../data/mapper';
import { Action } from '../features/model/action/action';
import { Command } from '../features/model/command/command';
import { Context } from '../features/model/context/context';
import { RoleKey } from '../features/model/role-key/role-key';
import { Selector } from '../features/model/selector/data/selector-domain';
import { SelectorDTO } from '../features/model/selector/data/selector-dto';
import { Spec } from '../features/model/spec/data/spec-domain';
import { SpecDomainMapper } from '../features/model/spec/data/spec-domain-mapper';
import { Variable } from '../features/model/variable/data/variable';
import { VariableDomainMapper } from '../features/model/variable/data/variable-domain-mapper';
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
    roleKey: FieldValidator<RoleKey>[];
    spec: FieldValidator<Spec>[];
    variable: FieldValidator<Variable>[];
  };
  mappers: {
    selector: DomainMapper<Selector, SelectorDTO>;
    spec: SpecDomainMapper;
    variable: VariableDomainMapper;
  };
};

export const InjectionContext = React.createContext<Injected | undefined>(
  undefined
) as React.Context<Readonly<Injected>>;

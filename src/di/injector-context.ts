import React from 'react';
import { Exporter } from '../data/exports/exporter';
import { Importer } from '../data/imports/json-importer';
import { Action } from '../features/model/action/action';
import { Command } from '../features/model/command/command';
import { Context } from '../features/model/context/context';
import { RoleKey } from '../features/model/role-key/role-key';
import { Spec } from '../features/model/spec/data/spec-domain';
import { Variable } from '../features/model/variable/data/variable';
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
};

export const InjectionContext = React.createContext<Injected | undefined>(
  undefined
) as React.Context<Readonly<Injected>>;

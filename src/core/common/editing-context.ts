import React from 'react';
import { DeleteModalConfig } from '../../ui/other-components/DeleteModalComponent';

type SimpleEditingData<P> = {
  localDispatch: React.Dispatch<P>;
};
type EditingData<P> = {
  // P is a payload
  localDispatch: React.Dispatch<P>;
  deleteModalConfig: DeleteModalConfig;
};

/**
 * Ignoring the requirement to add a default context because
 * it's better to have a React error than some Sleight error.
 */
export const createSimpleEditingContext = <T>() =>
  React.createContext<SimpleEditingData<T> | undefined>(
    undefined
  ) as React.Context<SimpleEditingData<T>>;
export const createEditingContext = <T>() =>
  React.createContext<EditingData<T> | undefined>(undefined) as React.Context<
    EditingData<T>
  >;

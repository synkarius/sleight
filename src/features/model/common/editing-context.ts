import React from 'react';

interface EditingData<P> {
  // P is a payload
  localDispatchFn: React.Dispatch<P>;
}

/**
 * Ignoring the requirement to add a default context because
 * it's better to have a React error than some Sleight error.
 */
export const createEditingContext = <T>(): React.Context<EditingData<T>> =>
  // @ts-ignore
  React.createContext();

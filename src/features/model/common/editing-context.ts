import React from 'react';
import { ImproperContextUsageError } from '../../../error/ImproperContextUsageError';

interface EditingData<P> {
  // P is a payload
  localDispatchFn: React.Dispatch<P>;
}
const createDefaultEditingDataState = <P>(): EditingData<P> => {
  return {
    localDispatchFn: (p: P) => {
      throw new ImproperContextUsageError();
    },
  };
};
export const createEditingContext = <T>(): React.Context<EditingData<T>> => {
  return React.createContext(createDefaultEditingDataState<T>());
};

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ResourceType } from '../../../../data/model/resource-types';
import { FnComponent } from '../../../model/fn/FnComponent';
import {
  getEditorCreatePath,
  getEditorEditPath,
} from '../../../navigation/router-fns';
import { RouterV6WorkaroundComponent } from '../RouterV6WorkaroundComponent';

export const ResourcesEditorComponent: React.FC<{}> = (props) => {
  return (
    <>
      <Routes>
        <Route
          path={getEditorCreatePath(ResourceType.Enum.FN)}
          element={<FnComponent fnId={undefined} key={undefined} />}
        />
        <Route
          path={getEditorEditPath(ResourceType.Enum.FN)}
          element={
            <RouterV6WorkaroundComponent
              paramsFn={(params) => {
                const fnId = params['functionId'];
                return <FnComponent fnId={fnId} key={fnId} />;
              }}
            />
          }
        />
      </Routes>
    </>
  );
};

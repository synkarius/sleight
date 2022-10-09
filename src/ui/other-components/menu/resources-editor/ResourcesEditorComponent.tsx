import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ResourceType } from '../../../../data/model/resource-types';
import { FnParentComponent } from '../../../model/fn/FnParentComponent';
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
          element={<FnParentComponent fnId={undefined} key={undefined} />}
        />
        <Route
          path={getEditorEditPath(ResourceType.Enum.FN)}
          element={
            <RouterV6WorkaroundComponent
              paramsFn={(params) => {
                const fnId = params['functionId'];
                return <FnParentComponent fnId={fnId} key={fnId} />;
              }}
            />
          }
        />
      </Routes>
    </>
  );
};

import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Navigation } from './ui/other-components/menu/Navigation';
import { InjectionContext } from './di/injector-context';
import { container } from './di/config/brandi-config';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { EditorViewComponent } from './ui/other-components/views/EditorViewComponent';
import { WizardViewComponent } from './ui/other-components/views/WizardViewComponent';
import { ResourcesEditorViewComponent } from './ui/other-components/views/ResourcesEditorViewComponent';
import { CommandListViewComponent } from './ui/other-components/views/CommandListViewComponent';
import {
  COMMAND_LIST_PATH,
  ELEMENT_EDITOR_PATH,
  PREFERENCES_PATH,
  RESOURCE_EDITOR_PATH,
  WIZARD_PATH,
} from './core/common/consts';
import { PreferencesComponent } from './ui/other-components/menu/preferences/PreferencesComponent';

const App: React.FC<{}> = () => {
  const getPath = (path: string): string => {
    if (path.startsWith('/')) {
      path = path.slice(1);
    }
    return `${path}/*`;
  };

  return (
    <InjectionContext.Provider value={container}>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route
            path={getPath(COMMAND_LIST_PATH)}
            element={<CommandListViewComponent />}
          />
          <Route
            path={getPath(ELEMENT_EDITOR_PATH)}
            element={<EditorViewComponent />}
          />
          <Route
            path={getPath(PREFERENCES_PATH)}
            element={<PreferencesComponent />}
          />
          <Route
            path={getPath(RESOURCE_EDITOR_PATH)}
            element={<ResourcesEditorViewComponent />}
          />
          <Route
            path={getPath(WIZARD_PATH)}
            element={<WizardViewComponent />}
          />
          <Route path="*" element={<Navigate to={WIZARD_PATH} replace />} />
        </Routes>
      </BrowserRouter>
    </InjectionContext.Provider>
  );
};

export default App;

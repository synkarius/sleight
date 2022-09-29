import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Navigation } from './ui/other-components/menu/Navigation';
import { InjectionContext } from './di/injector-context';
import { container } from './di/config/brandi-config';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EditorViewComponent } from './ui/other-components/views/EditorViewComponent';

const App: React.FC<{}> = () => {
  return (
    <InjectionContext.Provider value={container}>
      <Navigation />
      <BrowserRouter>
        <Routes>
          {/* TODO: get rid of this "/*" path when the other 
          views get added and the wizard is default */}
          <Route path="/*" element={<EditorViewComponent />} />
          <Route path="editor/*" element={<EditorViewComponent />} />
        </Routes>
      </BrowserRouter>
    </InjectionContext.Provider>
  );
};

export default App;

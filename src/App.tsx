import 'bootstrap/dist/css/bootstrap.min.css';
import { Navigation } from './ui/other-components/menu/Navigation';
import { SidebarComponent } from './ui/other-components/sidebar/SidebarComponent';
import { Col, Row } from 'react-bootstrap';
import { EditorComponent } from './ui/other-components/menu/editor/EditorComponent';
import { InjectionContext } from './di/injector-context';
import { container } from './di/config/brandi-config';

function App() {
  return (
    <div>
      <InjectionContext.Provider value={container}>
        <Navigation />
        <Row>
          <Col sm="4">
            <SidebarComponent />
          </Col>
          <Col sm="8">
            <EditorComponent />
          </Col>
        </Row>
      </InjectionContext.Provider>
    </div>
  );
}

export default App;

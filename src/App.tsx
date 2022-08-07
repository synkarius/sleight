import 'bootstrap/dist/css/bootstrap.min.css';
import { Navigation } from './features/menu/Navigation';
import { SidebarComponent } from './features/sidebar/SidebarComponent';
import { Col, Row } from 'react-bootstrap';
import { EditorComponent } from './features/menu/editor/EditorComponent';

function App() {
  return (
    <div>
      <Navigation />
      <Row>
        <Col sm="4">
          <SidebarComponent />
        </Col>
        <Col sm="8">
          <EditorComponent />
        </Col>
      </Row>
    </div>
  );
}

export default App;

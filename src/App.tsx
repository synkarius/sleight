import 'bootstrap/dist/css/bootstrap.min.css';
import { Navigation } from './features/menu/Navigation';
import { SidebarComponent } from './features/sidebar/SidebarComponent';
import { Col, Row } from 'react-bootstrap';
import { FocusComponent } from './features/menu/focus/FocusComponent';

function App() {
  return (
    <div>
      <Navigation />
      <Row>
        <Col sm="4">
          <SidebarComponent />
        </Col>
        <Col sm="8">
          <FocusComponent />
        </Col>
      </Row>
    </div>
  );
}

export default App;

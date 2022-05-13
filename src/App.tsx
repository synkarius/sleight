import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ExtraComponent } from './features/model/extra/ExtraComponent';
import { Navigation } from './features/menu/Navigation';
import { SidebarComponent } from './features/sidebar/SidebarComponent';
import { Col, Row } from 'react-bootstrap';
import { useAppSelector } from './app/hooks';
import { ContextComponent } from './features/model/context/ContextComponent';

function App() {
  const focusedContext = useAppSelector((state) => state.context.focused);
  const focusedExtra = useAppSelector((state) => state.extra.focused);

  return (
    <div className="App">
      <Navigation />
      <Row>
        <Col sm="4">
          <SidebarComponent />
        </Col>
        <Col sm="8">
          {focusedContext && <ContextComponent context={focusedContext} />}
          {focusedExtra && <ExtraComponent extra={focusedExtra} />}
        </Col>
      </Row>
    </div>
  );
}

export default App;

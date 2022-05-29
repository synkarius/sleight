import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ExtraComponent } from './features/model/extra/ExtraComponent';
import { Navigation } from './features/menu/Navigation';
import { SidebarComponent } from './features/sidebar/SidebarComponent';
import { Col, Row } from 'react-bootstrap';
import { useAppSelector } from './app/hooks';
import { ContextComponent } from './features/model/context/ContextComponent';
import { ElementType } from './features/model/common/element-types';
import { Context } from './features/model/context/context';
import { FocusComponent } from './features/menu/focus/FocusComponent';

function App() {
  return (
    <div className="App">
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

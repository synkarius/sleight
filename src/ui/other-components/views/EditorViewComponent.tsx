import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { EditorComponent } from '../menu/editor/EditorComponent';
import { SidebarComponent } from '../sidebar/SidebarComponent';

export const EditorViewComponent: React.FC<{}> = () => {
  return (
    <Row>
      <Col sm="4">
        <SidebarComponent />
      </Col>
      <Col sm="8">
        <EditorComponent />
      </Col>
    </Row>
  );
};

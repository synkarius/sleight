import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { ResourcesEditorComponent } from '../menu/resources-editor/ResourcesEditorComponent';
import { ResourcesEditorSidebarComponent } from '../menu/resources-editor/ResourcesEditorSidebarComponent';

export const ResourcesEditorViewComponent: React.FC<{}> = (props) => {
  return (
    <Row>
      <Col sm="4">
        <ResourcesEditorSidebarComponent />
      </Col>
      <Col sm="8">
        <ResourcesEditorComponent />
      </Col>
    </Row>
  );
};

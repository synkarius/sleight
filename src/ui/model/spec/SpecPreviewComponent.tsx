import React from 'react';
import { Card } from 'react-bootstrap';
import { useAppSelector } from '../../../app/hooks';
import { Spec } from '../../../data/model/spec/spec-domain';

import { mapSpecToPreview } from './spec-preview';

export const SpecPreviewComponent: React.FC<{ spec: Spec }> = (props) => {
  const variablesSaved = useAppSelector((state) => state.variable.saved);
  const specPreview = mapSpecToPreview(props.spec, variablesSaved);
  return (
    <Card bg="light" className="mb-3">
      <Card.Header>Spec Preview</Card.Header>
      <Card.Body>
        <Card.Title>This is what you say:</Card.Title>
        <Card.Text>{' "' + specPreview + ' "'}</Card.Text>
      </Card.Body>
    </Card>
  );
};

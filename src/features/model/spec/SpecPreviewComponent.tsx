import React from 'react';
import { Card } from 'react-bootstrap';
import { useAppSelector } from '../../../app/hooks';
import { ExhaustivenessFailureError } from '../../../error/ExhaustivenessFailureError';
import { ReduxFriendlyStringMap } from '../../../util/string-map';
import { VariableDTO } from '../variable/data/variable-dto';
import { Spec, SpecItem } from './data/spec-domain';
import { SpecItemType } from './spec-item-type';

const mapSpecItemToPreview = (
  specItem: SpecItem,
  variablesSaved: ReduxFriendlyStringMap<VariableDTO>
): string => {
  const itemType = specItem.itemType;
  switch (itemType) {
    case SpecItemType.Enum.SELECTOR:
      return (
        '[ ' +
        specItem.selector.items.map((sItem) => sItem.value).join(' | ') +
        ' ]'
      );
    case SpecItemType.Enum.VARIABLE:
      const variableDTO = { ...variablesSaved[specItem.variableId] };
      // TODO: should be returning calculated variable name, but haven't validated it yet
      /* Notes
       * - the name of a variable
       *  - must not be blank
       *  - must be alphanumeric
       *  - must be unique
       */
      return '<variable>';
    default:
      throw new ExhaustivenessFailureError(itemType);
  }
};

export const SpecPreviewComponent: React.FC<{ spec: Spec }> = (props) => {
  const variablesSaved = useAppSelector((state) => state.variable.saved);

  const specPreview =
    props.spec.items
      .map((item) => mapSpecItemToPreview(item, variablesSaved))
      .join(' ') || '';
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

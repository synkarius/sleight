import React from 'react';
import { Card } from 'react-bootstrap';
import { useAppSelector } from '../../../app/hooks';
import { ExhaustivenessFailureError } from '../../../error/ExhaustivenessFailureError';
import { ReduxFriendlyStringMap } from '../../../util/string-map';
import { Selector } from '../selector/selector';
import { Variable } from '../variable/variable';
import { SpecItem } from './spec';
import { SpecItemType } from './spec-item-type';

const mapSpecItemToPreview = (
  specItem: SpecItem,
  selectorsSaved: ReduxFriendlyStringMap<Selector>,
  variablesSaved: ReduxFriendlyStringMap<Variable>
): string => {
  switch (specItem.itemType) {
    case SpecItemType.Enum.SELECTOR:
      const selector = selectorsSaved[specItem.itemId];
      return (
        '[ ' + selector.items.map((sItem) => sItem.value).join(' | ') + ' ]'
      );
    case SpecItemType.Enum.VARIABLE:
      const variable = variablesSaved[specItem.itemId];
      // TODO: should be returning variable.name, but haven't validated it yet
      /* Notes
       * - the name of a variable
       *  - must not be blank
       *  - must be alphanumeric
       *  - must be unique
       */
      return '<variable>';
    default:
      throw new ExhaustivenessFailureError(specItem.itemType);
  }
};

export const SpecPreviewComponent: React.FC<{}> = () => {
  const editingSpec = useAppSelector((state) => state.spec.editing);
  const selectorsSaved = useAppSelector((state) => state.selector.saved);
  const variablesSaved = useAppSelector((state) => state.variable.saved);

  const specPreview =
    editingSpec?.items
      .map((item) => mapSpecItemToPreview(item, selectorsSaved, variablesSaved))
      .join(' ') || '';
  return (
    <>
      {editingSpec && (
        <Card bg="light">
          <Card.Header>Spec Preview</Card.Header>
          <Card.Body>
            <Card.Title>This is what you say:</Card.Title>
            <Card.Text>{' "' + specPreview + ' "'}</Card.Text>
          </Card.Body>
        </Card>
      )}
    </>
  );
};

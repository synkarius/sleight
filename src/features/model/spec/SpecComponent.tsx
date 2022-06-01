import React from 'react';
import { PanelComponent } from '../../ui/PanelComponent';
import { Spec } from './spec';
import { SpecItemComponent } from './SpecItemComponent';

export const SpecComponent: React.FC<{ spec: Spec }> = (props) => {
  return (
    <PanelComponent>
      {props.spec.items.map((specItem) => (
        <SpecItemComponent specItem={specItem} />
      ))}
    </PanelComponent>
  );
};

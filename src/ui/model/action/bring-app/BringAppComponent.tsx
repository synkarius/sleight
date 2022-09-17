import React from 'react';
import { BringAppAction } from '../../../../data/model/action/bring-app/bring-app';
import { ActionValueComponent } from '../ActionValueComponent';
import {
  bringAppPathGroup,
  bringAppStarDirGroup,
  bringAppTitleGroup,
} from './bring-app-action-value-field-group';

export const BringAppComponent: React.FC<{ bringAppAction: BringAppAction }> = (
  props
) => {
  return (
    <>
      <ActionValueComponent
        labelText="App Path"
        descriptionText="path to executable or executable name on system path"
        actionValue={props.bringAppAction.appPath}
        fields={bringAppPathGroup}
      />
      <ActionValueComponent
        labelText="App Title"
        descriptionText="window title to wait for"
        actionValue={props.bringAppAction.appTitle}
        fields={bringAppTitleGroup}
      />
      <ActionValueComponent
        labelText="Start Directory"
        descriptionText="directory to start the app in"
        actionValue={props.bringAppAction.startDir}
        fields={bringAppStarDirGroup}
      />
    </>
  );
};

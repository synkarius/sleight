import React from 'react';
import { Keyboard, Mouse, Pencil } from 'react-bootstrap-icons';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Spell } from '../../../data/wizard/spell';
import { SpellPaths } from '../../../data/wizard/spell-paths';
import { ValidationComponent } from '../../../validation/ValidationComponent';
import { getSimplePath, getTokensPath } from '../../navigation/router-fns';
import { WizardKeyPressSpellComponent } from '../menu/wizard/spells/WizardKeyPressSpellComponent';
import { WizardCardComponent } from '../menu/wizard/WizardCardComponent';

const getPath = (path: SpellPaths.Type): string =>
  getTokensPath([SpellPaths.Enum.SPELLS, path]);

export const WizardViewComponent: React.FC<{}> = (props) => {
  const navigate = useNavigate();

  const iconStyle = { fontSize: '12vw' };
  const editing: Spell = {};

  const goToKeyPress = () => navigate(getPath(SpellPaths.Enum.KEY_PRESS));
  const goToText = () => navigate(getPath(SpellPaths.Enum.TEXT));
  const goToClick = () => navigate(getPath(SpellPaths.Enum.CLICK));

  return (
    <>
      <Routes>
        <Route
          path=""
          element={
            <div className="text-center">
              <WizardCardComponent
                icon={<Keyboard style={iconStyle} />}
                description={'send key press'}
                onClick={goToKeyPress}
              />
              <WizardCardComponent
                icon={<Pencil style={iconStyle} />}
                description={'send text'}
                onClick={goToText}
              />
              <WizardCardComponent
                icon={<Mouse style={iconStyle} />}
                description={'click mouse'}
                onClick={goToClick}
              />
            </div>
          }
        />
        <Route
          path={getSimplePath(SpellPaths.Enum.SPELLS)}
          element={
            // TODO: create a "Spells" component that is this route's element
            // TODO: these validators
            <ValidationComponent<Spell> validators={[]} editing={editing}>
              <Routes>
                <Route
                  path={getSimplePath(SpellPaths.Enum.KEY_PRESS)}
                  element={<WizardKeyPressSpellComponent />}
                />
              </Routes>
            </ValidationComponent>
          }
        />
      </Routes>
    </>
  );
};

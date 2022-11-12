import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { Keyboard, Mouse, Pencil } from 'react-bootstrap-icons';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { SpellType } from '../../../data/wizard/spell-types';
import { getSimplePath, getTokensPath } from '../../navigation/router-fns';
import { WizardClickSpellComponent } from '../menu/wizard/spells/WizardClickSpellComponent';
import { WizardKeyPressSpellComponent } from '../menu/wizard/spells/WizardKeyPressSpellComponent';
import { WizardTextSpellComponent } from '../menu/wizard/spells/WizardTextSpellComponent';
import { WizardCardComponent } from '../menu/wizard/WizardCardComponent';

const ICON_STYLE = { fontSize: '12vw' };
const SPELLS = 'spells';

const getPath = (path: SpellType.Type): string => getTokensPath([SPELLS, path]);

export const WizardViewComponent: React.FC<{}> = () => {
  const navigate = useNavigate();

  /**
   * Here's how the wizards work.
   * 1. User enters bare minimum info required to make (context) + spec + action combo.
   * 2. At each validateable step, said minimum info is converted into as much of
   *    what will be the resulting command as possible.
   * 3. Said partial command is merged into a copy of the redux data and validated.
   * 4. A full validation occurs at the end step, similar to an import validation.
   *
   *
   * There's a problem: after merging the spell's elements into the total data,
   * an element invalid because of duplication may list the wrong duplicate name:
   * namely the spell's element itself.
   */

  const goToKeyPress = () => navigate(getPath(SpellType.Enum.KEY_PRESS));
  const goToText = () => navigate(getPath(SpellType.Enum.TEXT));
  const goToClick = () => navigate(getPath(SpellType.Enum.CLICK));

  return (
    <Routes>
      <Route
        path=""
        element={
          <div className="text-center">
            <WizardCardComponent
              icon={<Keyboard style={ICON_STYLE} />}
              description={'send key press'}
              onClick={goToKeyPress}
            />
            <WizardCardComponent
              icon={<Pencil style={ICON_STYLE} />}
              description={'send text'}
              onClick={goToText}
            />
            <WizardCardComponent
              icon={<Mouse style={ICON_STYLE} />}
              description={'click mouse'}
              onClick={goToClick}
            />
            <Row className="mt-5">
              <Col sm="12">
                ... or explore the existing commands via the command list and
                editor screen
              </Col>
            </Row>
          </div>
        }
      />
      <Route path={getSimplePath(SPELLS)}>
        <Route
          path={getSimplePath(SpellType.Enum.KEY_PRESS)}
          element={<WizardKeyPressSpellComponent />}
        />
        <Route
          path={getSimplePath(SpellType.Enum.TEXT)}
          element={<WizardTextSpellComponent />}
        />
        <Route
          path={getSimplePath(SpellType.Enum.CLICK)}
          element={<WizardClickSpellComponent />}
        />
      </Route>
    </Routes>
  );
};

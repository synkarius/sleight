import { replaceNonAlphaNumeric } from '../../../../../core/common/common-functions';
import { some } from '../../../../../core/common/maybe';
import { container } from '../../../../../di/config/brandi-config';
import { Tokens } from '../../../../../di/config/brandi-tokens';
import { import01 } from '../../../../../test/resources/import-mouse-01.json';
import { import02 } from '../../../../../test/resources/import-mouse-02.json';
import { import03 } from '../../../../../test/resources/import-mouse-03.json';
import { import04 } from '../../../../../test/resources/import-mouse-04.json';
import { import05 } from '../../../../../test/resources/import-mouse-05.json';
import { import06 } from '../../../../../test/resources/import-mouse-06.json';
import { import07 } from '../../../../../test/resources/import-mouse-07.json';
import { import08 } from '../../../../../test/resources/import-mouse-08.json';
import { import09 } from '../../../../../test/resources/import-mouse-09.json';
import { import10 } from '../../../../../test/resources/import-mouse-10.json';
import { castJsonForTest } from '../../../../../test/utils/import-test-json-util';
import {
  ClickMouseAction,
  HoldReleaseMouseAction,
  MoveMouseAction,
} from '../../../../model/action/mouse/mouse';

describe('dragonfly Mouse printer tests', () => {
  const printer = container.get(Tokens.DragonflyMousePrinter);
  const formatMapper = container.get(Tokens.FormatMapper);
  const fmt = (value: string) => replaceNonAlphaNumeric(value, '_');

  it('move abs px: should print entered values correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import07)
    );
    const action: MoveMouseAction = castJsonForTest(import07.actions[0]);

    const expected = 'Function(execute_mouse_move_abs_px, x=1, y=2)';
    const actual = printer.printAction(action, data);
    expect(actual).toEqual(some(expected));
  });

  it('move abs px: should print variables correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import08)
    );
    const action: MoveMouseAction = castJsonForTest(import08.actions[0]);

    const xVar = fmt('variable_c6c21ba3-ff22-47b3-bdf6-7e6e9e742885');
    const yVar = fmt('variable_2ddf1139-714d-4a9a-ba5b-8ab3880ef828');
    const expected = `Function(execute_mouse_move_abs_px, dict(${xVar}="x", ${yVar}="y"))`;
    const actual = printer.printAction(action, data);
    expect(actual).toEqual(some(expected));
  });

  it('move rel px: should print entered values correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import01)
    );
    const action: MoveMouseAction = castJsonForTest(import01.actions[0]);

    const expected = 'Function(execute_mouse_move_rel_px, x=1, y=2)';
    const actual = printer.printAction(action, data);
    expect(actual).toEqual(some(expected));
  });

  it('move rel px: should print variables correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import02)
    );
    const action: MoveMouseAction = castJsonForTest(import02.actions[0]);

    const xVar = fmt('variable_c6c21ba3-ff22-47b3-bdf6-7e6e9e742885');
    const yVar = fmt('variable_2ddf1139-714d-4a9a-ba5b-8ab3880ef828');
    const expected = `Function(execute_mouse_move_rel_px, dict(${xVar}="x", ${yVar}="y"))`;
    const actual = printer.printAction(action, data);
    expect(actual).toEqual(some(expected));
  });

  it('move win pct: should print entered values correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import09)
    );
    const action: MoveMouseAction = castJsonForTest(import09.actions[0]);

    const expected = 'Function(execute_mouse_move_win_pct, x=1, y=2)';
    const actual = printer.printAction(action, data);
    expect(actual).toEqual(some(expected));
  });

  it('move win pct: should print variables correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import10)
    );
    const action: MoveMouseAction = castJsonForTest(import10.actions[0]);

    const xVar = fmt('variable_c6c21ba3-ff22-47b3-bdf6-7e6e9e742885');
    const yVar = fmt('variable_2ddf1139-714d-4a9a-ba5b-8ab3880ef828');
    const expected = `Function(execute_mouse_move_win_pct, dict(${xVar}="x", ${yVar}="y"))`;
    const actual = printer.printAction(action, data);
    expect(actual).toEqual(some(expected));
  });

  it('mouse click: should print entered values correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import03)
    );
    const action: ClickMouseAction = castJsonForTest(import03.actions[0]);

    const expected =
      'Function(execute_mouse_click, button="middle", repeat=3, pause=1)';
    const actual = printer.printAction(action, data);
    expect(actual).toEqual(some(expected));
  });

  it('mouse click: should print variables correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import04)
    );
    const action: ClickMouseAction = castJsonForTest(import04.actions[0]);

    const btnVar = fmt('variable_d38dc993-fb9f-4319-8403-ca72a82cfeb9');
    const repeatVar = fmt('variable_01f08aeb-3f70-4b91-ae34-f80c140a31ba');
    const pauseVar = fmt('variable_3817aca2-a3eb-458d-8060-e0f0939b0863');
    const expected = `Function(execute_mouse_click, dict(${btnVar}="button", ${repeatVar}="repeat", ${pauseVar}="pause"))`;
    const actual = printer.printAction(action, data);
    expect(actual).toEqual(some(expected));
  });

  it('mouse hold/release: should print entered values correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import05)
    );
    const action: HoldReleaseMouseAction = castJsonForTest(import05.actions[0]);

    const expected =
      'Function(execute_mouse_hold_release, button="stepdown", direction="down", pause=3)';
    const actual = printer.printAction(action, data);
    expect(actual).toEqual(some(expected));
  });

  it('mouse hold/release: should print variables correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import06)
    );
    const action: HoldReleaseMouseAction = castJsonForTest(import06.actions[0]);

    const btnVar = fmt('variable_f3b4643c-ccbb-4cf1-9b48-d80e3ad24a10');
    const pauseVar = fmt('variable_7bc04596-ad0d-4527-a862-1e18bf88910a');
    const dirVar = fmt('variable_869e23f3-325a-4f2e-bf77-23deb6df89f7');
    const expected = `Function(execute_mouse_hold_release, dict(${btnVar}="button", ${dirVar}="direction", ${pauseVar}="pause"))`;
    const actual = printer.printAction(action, data);
    expect(actual).toEqual(some(expected));
  });
});

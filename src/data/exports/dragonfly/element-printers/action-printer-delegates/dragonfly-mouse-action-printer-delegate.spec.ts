import { replaceNonAlphaNumeric } from '../../../../../core/common/common-functions';
import { container } from '../../../../../di/config/brandi-config';
import { Tokens } from '../../../../../di/config/brandi-tokens';
import { import01 } from '../../../../../test/resources/import-mouse-01.json';
import { import02 } from '../../../../../test/resources/import-mouse-02.json';
import { import03 } from '../../../../../test/resources/import-mouse-03.json';
import { import04 } from '../../../../../test/resources/import-mouse-04.json';
import { import05 } from '../../../../../test/resources/import-mouse-05.json';
import { import06 } from '../../../../../test/resources/import-mouse-06.json';
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

  it('move: should print entered values correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import01)
    );
    const action: MoveMouseAction = castJsonForTest(import01.actions[0]);

    const expected = 'Mouse("<1, 2>")';
    const actual = printer.printAction(action, data);
    expect(actual).toBe(expected);
  });

  it('move: should print variables correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import02)
    );
    const action: MoveMouseAction = castJsonForTest(import02.actions[0]);

    const xVar = fmt('variable_c6c21ba3-ff22-47b3-bdf6-7e6e9e742885');
    const yVar = fmt('variable_2ddf1139-714d-4a9a-ba5b-8ab3880ef828');
    const expected = `Mouse("<%(${xVar})d, %(${yVar})d>")`;
    const actual = printer.printAction(action, data);
    expect(actual).toBe(expected);
  });

  it('mouse click: should print entered values correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import03)
    );
    const action: ClickMouseAction = castJsonForTest(import03.actions[0]);

    const expected = 'Mouse("middle:3/1")';
    const actual = printer.printAction(action, data);
    expect(actual).toBe(expected);
  });

  it('mouse click: should print variables correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import04)
    );
    const action: ClickMouseAction = castJsonForTest(import04.actions[0]);

    const btnVar = fmt('variable_d38dc993-fb9f-4319-8403-ca72a82cfeb9');
    const repeatVar = fmt('variable_01f08aeb-3f70-4b91-ae34-f80c140a31ba');
    const pauseVar = fmt('variable_3817aca2-a3eb-458d-8060-e0f0939b0863');
    const expected = `Mouse("%(${btnVar})s:%(${repeatVar})d/%(${pauseVar})d")`;
    const actual = printer.printAction(action, data);
    expect(actual).toBe(expected);
  });

  it('mouse hold/release: should print entered values correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import05)
    );
    const action: HoldReleaseMouseAction = castJsonForTest(import05.actions[0]);

    const expected = 'Mouse("kilo:up/14")';
    const actual = printer.printAction(action, data);
    expect(actual).toBe(expected);
  });

  it('mouse hold/release: should print variables correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import06)
    );
    const action: HoldReleaseMouseAction = castJsonForTest(import06.actions[0]);

    const keyVar = fmt('variable_c527fae3-fb30-4f85-b8a2-f8cd39adcaeb');
    const dirVar = fmt('variable_5585a4cd-d671-4d65-8057-0015b0ed10a3');
    const outVar = fmt('variable_b61db350-b08f-460c-a65f-9f2e3cdc3370');
    const expected = `Mouse("as-%(${keyVar})s:%(${dirVar})s/%(${outVar})d")`;
    const actual = printer.printAction(action, data);
    expect(actual).toBe(expected);
  });
});

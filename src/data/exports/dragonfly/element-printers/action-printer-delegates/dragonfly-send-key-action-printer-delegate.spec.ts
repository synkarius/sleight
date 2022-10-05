import { replaceNonAlphaNumeric } from '../../../../../core/common/common-functions';
import { container } from '../../../../../di/config/brandi-config';
import { Tokens } from '../../../../../di/config/brandi-tokens';
import { import01 } from '../../../../../test/resources/import-send-key-01.json';
import { import02 } from '../../../../../test/resources/import-send-key-02.json';
import { import03 } from '../../../../../test/resources/import-send-key-03.json';
import { import04 } from '../../../../../test/resources/import-send-key-04.json';
import { castJsonForTest } from '../../../../../test/utils/import-test-json-util';
import {
  SendKeyHoldReleaseAction,
  SendKeyPressAction,
} from '../../../../model/action/send-key/send-key';

describe('dragonfly SendKey printer tests', () => {
  const printer = container.get(Tokens.DragonflySendKeyPrinter);
  const formatMapper = container.get(Tokens.FormatMapper);
  const fmt = (value: string) => replaceNonAlphaNumeric(value, '_');

  it('key press: should print entered values correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import01)
    );
    const action: SendKeyPressAction = castJsonForTest(import01.actions[0]);

    const expected = 'Key("ca-mike/3:4/1")';
    const actual = printer.printAction(action, data);
    expect(actual).toBe(expected);
  });

  it('key press: should print variables correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import02)
    );
    const action: SendKeyPressAction = castJsonForTest(import02.actions[0]);

    const keyVar = fmt('variable_ff8b413c-fa02-4593-9539-1448ed95bf77');
    const inVar = fmt('variable_48158209-b7bc-4401-a99e-ed9eb291cc8c');
    const reVar = fmt('variable_0cffbe4c-203b-4b8e-ad2d-5f2aaefa83d4');
    const outVar = fmt('variable_e72d4bc7-6ef8-42e4-ac18-2e2795256ea1');
    const expected = `Key("sw-%(${keyVar})s/%(${inVar})d:%(${reVar})d/%(${outVar})d")`;
    const actual = printer.printAction(action, data);
    expect(actual).toBe(expected);
  });

  it('key hold/release: should print entered values correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import03)
    );
    const action: SendKeyHoldReleaseAction = castJsonForTest(
      import03.actions[0]
    );

    const expected = 'Key("kilo:up/14")';
    const actual = printer.printAction(action, data);
    expect(actual).toBe(expected);
  });

  it('key hold/release: should print variables correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import04)
    );
    const action: SendKeyHoldReleaseAction = castJsonForTest(
      import04.actions[0]
    );

    const keyVar = fmt('variable_c527fae3-fb30-4f85-b8a2-f8cd39adcaeb');
    const dirVar = fmt('variable_5585a4cd-d671-4d65-8057-0015b0ed10a3');
    const outVar = fmt('variable_b61db350-b08f-460c-a65f-9f2e3cdc3370');
    const expected = `Key("as-%(${keyVar})s:%(${dirVar})s/%(${outVar})d")`;
    const actual = printer.printAction(action, data);
    expect(actual).toBe(expected);
  });
});

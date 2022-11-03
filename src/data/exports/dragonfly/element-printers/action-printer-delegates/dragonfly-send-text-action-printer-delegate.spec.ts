import { replaceNonAlphaNumeric } from '../../../../../core/common/common-functions';
import { some } from '../../../../../core/common/maybe';
import { container } from '../../../../../di/config/brandi-config';
import { Tokens } from '../../../../../di/config/brandi-tokens';
import { import08 } from '../../../../../test/resources/import-08.json';
import { import09 } from '../../../../../test/resources/import-09.json';
import { castJsonForTest } from '../../../../../test/utils/import-test-json-util';
import { SendTextAction } from '../../../../model/action/send-text/send-text';

describe('dragonfly SendText printer tests', () => {
  const printer = container.get(Tokens.DragonflySendTextPrinter);
  const formatMapper = container.get(Tokens.FormatMapper);
  const fmt = (value: string) => replaceNonAlphaNumeric(value, '_');

  it('should print entered values correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import08)
    );
    const action: SendTextAction = castJsonForTest(import08.actions[0]);

    const expected = 'Text("some text")';
    const actual = printer.printAction(action, data);
    expect(actual).toEqual(some(expected));
  });

  it('should print variables correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import09)
    );
    const action: SendTextAction = castJsonForTest(import09.actions[0]);

    const textVar = fmt('variable_d8c6f89e-59be-4adc-b4d0-66a03e09e8be');
    const expected = `Text("%(${textVar})s")`;
    const actual = printer.printAction(action, data);
    expect(actual).toEqual(some(expected));
  });
});

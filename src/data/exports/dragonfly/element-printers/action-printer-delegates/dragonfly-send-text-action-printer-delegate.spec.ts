import { container } from '../../../../../di/config/brandi-config';
import { Tokens } from '../../../../../di/config/brandi-tokens';
import { import08 } from '../../../../../test/resources/import-08.json';
import { import09 } from '../../../../../test/resources/import-09.json';
import { castJsonForTest } from '../../../../../test/utils/import-test-json-util';
import { SendTextAction } from '../../../../model/action/send-text/send-text';

describe('dragonfly SendText printer tests', () => {
  const printer = container.get(Tokens.DragonflySendTextPrinter);
  const formatMapper = container.get(Tokens.FormatMapper);

  it('should print entered values correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import08)
    );
    const action: SendTextAction = castJsonForTest(import08.actions[0]);

    const expected = 'Text("some text")';
    const actual = printer.printAction(action, data);
    expect(actual).toBe(expected);
  });

  it('should print variables correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import09)
    );
    const action: SendTextAction = castJsonForTest(import09.actions[0]);

    const expected = 'Text("%(variable_text_var)s")';
    const actual = printer.printAction(action, data);
    expect(actual).toBe(expected);
  });
});

import { replaceNonAlphaNumeric } from '../../../../../core/common/common-functions';
import { container } from '../../../../../di/config/brandi-config';
import { Tokens } from '../../../../../di/config/brandi-tokens';
import { import01 } from '../../../../../test/resources/import-pause-action-01.json';
import { import02 } from '../../../../../test/resources/import-pause-action-02.json';
import { castJsonForTest } from '../../../../../test/utils/import-test-json-util';
import { PauseAction } from '../../../../model/action/pause/pause';

describe('dragonfly Pause printer tests', () => {
  const printer = container.get(Tokens.DragonflyPausePrinter);
  const formatMapper = container.get(Tokens.FormatMapper);
  const fmt = (value: string) => replaceNonAlphaNumeric(value, '_');

  it('should print entered values correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import01)
    );
    const action: PauseAction = castJsonForTest(import01.actions[0]);

    const expected = 'Pause(1)';
    const actual = printer.printAction(action, data);
    expect(actual).toBe(expected);
  });

  it('should print variables correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import02)
    );
    const action: PauseAction = castJsonForTest(import02.actions[0]);

    const textVar = fmt('variable_ed48430e-ed5f-44b3-a304-1d733b622549');
    const expected = `Pause("%(${textVar})d")`;
    const actual = printer.printAction(action, data);
    expect(actual).toBe(expected);
  });
});

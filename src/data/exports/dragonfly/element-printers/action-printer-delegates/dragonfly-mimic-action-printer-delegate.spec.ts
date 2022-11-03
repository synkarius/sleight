import { replaceNonAlphaNumeric } from '../../../../../core/common/common-functions';
import { some } from '../../../../../core/common/maybe';
import { container } from '../../../../../di/config/brandi-config';
import { Tokens } from '../../../../../di/config/brandi-tokens';
import { import04 } from '../../../../../test/resources/import-04.json';
import { import05 } from '../../../../../test/resources/import-05.json';
import { castJsonForTest } from '../../../../../test/utils/import-test-json-util';
import { MimicAction } from '../../../../model/action/mimic/mimic';

describe('dragonfly Mimic printer tests', () => {
  const printer = container.get(Tokens.DragonflyMimicPrinter);
  const formatMapper = container.get(Tokens.FormatMapper);
  const fmt = (value: string) => replaceNonAlphaNumeric(value, '_');

  it('should print entered values correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import04)
    );
    const action: MimicAction = castJsonForTest(import04.actions[0]);

    const expected = 'Mimic("these", "three", "words")';
    const actual = printer.printAction(action, data);
    expect(actual).toEqual(some(expected));
  });

  it('should print variables correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import05)
    );
    const action: MimicAction = castJsonForTest(import05.actions[0]);

    const textVar = fmt('variable_9bfe9ee5-ee03-46ef-a202-1f4e08a4a699');
    const expected = `Mimic("%(${textVar})s")`;
    const actual = printer.printAction(action, data);
    expect(actual).toEqual(some(expected));
  });
});

import { container } from '../../../../../di/config/brandi-config';
import { Tokens } from '../../../../../di/config/brandi-tokens';
import { import04 } from '../../../../../test/resources/import-04.json';
import { import05 } from '../../../../../test/resources/import-05.json';
import { castJsonForTest } from '../../../../../test/utils/import-test-json-util';
import { MimicAction } from '../../../../model/action/mimic/mimic';

describe('dragonfly Mimic printer tests', () => {
  const printer = container.get(Tokens.DragonflyMimicPrinter);
  const formatMapper = container.get(Tokens.FormatMapper);

  it('should print entered values correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import04)
    );
    const action: MimicAction = castJsonForTest(import04.actions[0]);

    const expected = 'Mimic("these", "three", "words")';
    const actual = printer.printAction(action, data);
    expect(actual).toBe(expected);
  });

  it('should print variables correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import05)
    );
    const action: MimicAction = castJsonForTest(import05.actions[0]);

    const expected = 'Mimic("%(variable_text_var_1)s")';
    const actual = printer.printAction(action, data);
    expect(actual).toBe(expected);
  });
});

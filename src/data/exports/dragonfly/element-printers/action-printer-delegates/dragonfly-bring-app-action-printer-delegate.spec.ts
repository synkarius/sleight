import { container } from '../../../../../di/config/brandi-config';
import { Tokens } from '../../../../../di/config/brandi-tokens';
import { BringAppAction } from '../../../../model/action/bring-app/bring-app';
import { import02 } from '../../../../../test/resources/import-02.json';
import { import03 } from '../../../../../test/resources/import-03.json';
import { castJsonForTest } from '../../../../../test/utils/import-test-json-util';

describe('dragonfly BringApp printer tests', () => {
  const printer = container.get(Tokens.DragonflyBringAppPrinter);
  const formatMapper = container.get(Tokens.FormatMapper);

  it('should print entered values correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import03)
    );
    const action: BringAppAction = castJsonForTest(import03.actions[0]);

    const expected =
      'BringApp("/some-path", title="Some Title", cwd="/start-dir")';
    const actual = printer.printAction(action, data);
    expect(actual).toBe(expected);
  });

  it('should print variables correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import02)
    );
    const action: BringAppAction = castJsonForTest(import02.actions[0]);
    //

    const expected =
      'BringApp("%(variable_path_var)s", title="%(variable_title_var)s", cwd="%(variable_start_dir_var)s")';
    const actual = printer.printAction(action, data);
    expect(actual).toBe(expected);
  });
});

import { container } from '../../../../../di/config/brandi-config';
import { Tokens } from '../../../../../di/config/brandi-tokens';
import { import06 } from '../../../../../test/resources/import-06.json';
import { import07 } from '../../../../../test/resources/import-07.json';
import { castJsonForTest } from '../../../../../test/utils/import-test-json-util';
import { WaitForWindowAction } from '../../../../model/action/wait-for-window/wait-for-window';

describe('dragonfly WaitForWindow printer tests', () => {
  const printer = container.get(Tokens.DragonflyWaitForWindowPrinter);
  const formatMapper = container.get(Tokens.FormatMapper);

  it('should print entered values correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import07)
    );
    const action: WaitForWindowAction = castJsonForTest(import07.actions[0]);

    const expected =
      'WaitWindow(executable="chrome.exe", title="Gmail", timeout=5)';
    const actual = printer.printAction(action, data);
    expect(actual).toBe(expected);
  });

  it('should print variables correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import06)
    );
    const action: WaitForWindowAction = castJsonForTest(import06.actions[0]);
    //

    const expected =
      'WaitWindow(executable="%(variable_exe_var)s", title="%(variable_title_var)s", timeout="%(variable_wait_var)d")';
    const actual = printer.printAction(action, data);
    expect(actual).toBe(expected);
  });
});

import { replaceNonAlphaNumeric } from '../../../../../core/common/common-functions';
import { some } from '../../../../../core/common/maybe';
import { container } from '../../../../../di/config/brandi-config';
import { Tokens } from '../../../../../di/config/brandi-tokens';
import { import06 } from '../../../../../test/resources/import-06.json';
import { import07 } from '../../../../../test/resources/import-07.json';
import { castJsonForTest } from '../../../../../test/utils/import-test-json-util';
import { WaitForWindowAction } from '../../../../model/action/wait-for-window/wait-for-window';

describe('dragonfly WaitForWindow printer tests', () => {
  const printer = container.get(Tokens.DragonflyWaitForWindowPrinter);
  const formatMapper = container.get(Tokens.FormatMapper);
  const fmt = (value: string) => replaceNonAlphaNumeric(value, '_');

  it('should print entered values correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import07)
    );
    const action: WaitForWindowAction = castJsonForTest(import07.actions[0]);

    const expected =
      'WaitWindow(executable="chrome.exe", title="Gmail", timeout=5)';
    const actual = printer.printAction(action, data);
    expect(actual).toEqual(some(expected));
  });

  it('should print variables correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import06)
    );
    const action: WaitForWindowAction = castJsonForTest(import06.actions[0]);
    //

    const exeVar = fmt('variable_21735747-e088-4001-bd6a-586e2c7b1a2b');
    const titleVar = fmt('variable_c1b1ef49-0d54-4a84-959b-da1adaaa2a97');
    const timeVar = fmt('variable_02162aaf-c78b-469f-912c-1335d671e75e');
    const expected = `WaitWindow(executable="%(${exeVar})s", title="%(${titleVar})s", timeout="%(${timeVar})d")`;
    const actual = printer.printAction(action, data);
    expect(actual).toEqual(some(expected));
  });
});

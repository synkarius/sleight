import { container } from '../../../../../di/config/brandi-config';
import { Tokens } from '../../../../../di/config/brandi-tokens';
import { BringAppAction } from '../../../../model/action/bring-app/bring-app';
import { import02 } from '../../../../../test/resources/import-02.json';
import { import03 } from '../../../../../test/resources/import-03.json';
import { castJsonForTest } from '../../../../../test/utils/import-test-json-util';
import { replaceNonAlphaNumeric } from '../../../../../core/common/common-functions';
import { some } from '../../../../../core/common/maybe';

describe('dragonfly BringApp printer tests', () => {
  const printer = container.get(Tokens.DragonflyBringAppPrinter);
  const formatMapper = container.get(Tokens.FormatMapper);
  const fmt = (value: string) => replaceNonAlphaNumeric(value, '_');

  it('should print entered values correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import03)
    );
    const action: BringAppAction = castJsonForTest(import03.actions[0]);

    const expected =
      'BringApp("/some-path", title="Some Title", cwd="/start-dir")';
    const actual = printer.printAction(action, data);
    expect(actual).toEqual(some(expected));
  });

  it('should print variables correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import02)
    );
    const action: BringAppAction = castJsonForTest(import02.actions[0]);
    //

    const pathVar = fmt('variable_c23384a3-f96b-41a1-9f3b-078b42d88260');
    const titleVar = fmt('variable_dbe6ae9a-33d2-4be7-be61-06ceba432337');
    const startVar = fmt('variable_e470eead-18a6-4049-af33-af6f9d04c959');
    const expected = `BringApp("%(${pathVar})s", title="%(${titleVar})s", cwd="%(${startVar})s")`;
    const actual = printer.printAction(action, data);
    expect(actual).toEqual(some(expected));
  });
});

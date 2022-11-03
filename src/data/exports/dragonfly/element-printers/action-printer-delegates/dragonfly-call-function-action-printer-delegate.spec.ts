import { container } from '../../../../../di/config/brandi-config';
import { Tokens } from '../../../../../di/config/brandi-tokens';
import { BringAppAction } from '../../../../model/action/bring-app/bring-app';
import { import01 } from '../../../../../test/resources/import-call-function-01.json';
import { import02 } from '../../../../../test/resources/import-call-function-02.json';
import { castJsonForTest } from '../../../../../test/utils/import-test-json-util';
import { replaceNonAlphaNumeric } from '../../../../../core/common/common-functions';
import { CallFunctionAction } from '../../../../model/action/call-function/call-function';
import { some } from '../../../../../core/common/maybe';

describe('dragonfly CallFunction printer tests', () => {
  const printer = container.get(Tokens.DragonflyCallFunctionPrinter);
  const formatMapper = container.get(Tokens.FormatMapper);
  const fmt = (value: string) => replaceNonAlphaNumeric(value, '_');

  it('should print entered values correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import01)
    );
    const action: CallFunctionAction = castJsonForTest(import01.actions[0]);

    const expected = 'Function(t1="some value", n1=-20)';
    const actual = printer.printAction(action, data);
    expect(actual).toEqual(some(expected));
  });

  it('should print variables correctly', () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import02)
    );
    const action: CallFunctionAction = castJsonForTest(import02.actions[0]);
    //

    const t1Var = fmt('variable_63d5ad29-3f6d-496f-8a1b-2a033fadcef3');
    const n1Var = fmt('variable_390edf4c-f732-489e-a38d-7680700385f7');
    const expected = `Function(t1="%(${t1Var})s", n1="%(${n1Var})d")`;
    const actual = printer.printAction(action, data);
    expect(actual).toEqual(some(expected));
  });
});

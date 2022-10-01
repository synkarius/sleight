import { createSleightDataInternalFormat } from '../../../data-formats';
import { variable02 } from '../../../../test/resources/variable-02.json';
import { variable03 } from '../../../../test/resources/variable-03.json';
import { variable04 } from '../../../../test/resources/variable-04.json';
import { selector01 } from '../../../../test/resources/selector-01.json';
import { castJsonForTest } from '../../../../test/utils/import-test-json-util';
import { SelectorDTO } from '../../../model/selector/selector-dto';
import {
  ChoiceVariableDTO,
  RangeVariableDTO,
} from '../../../model/variable/variable-dto';
import { SelectorIdWithinVariablesIdRewriter } from './selector-id-within-variables-rewriter';

describe('selector id rewriter tests', () => {
  it("should rewrite variable's selector ids", () => {
    const variable2: RangeVariableDTO = castJsonForTest(variable02);
    const variable3: ChoiceVariableDTO = castJsonForTest(variable03);
    // this selector is used in variable3:
    const selector1: SelectorDTO = castJsonForTest(selector01);
    // variable4 has a different selectorId which shouldn't be changed
    const variable4: ChoiceVariableDTO = castJsonForTest(variable04);
    const variables = {
      [variable2.id]: variable2,
      [variable3.id]: variable3,
      [variable4.id]: variable4,
    };
    const data = {
      ...createSleightDataInternalFormat(),
      variables,
    };
    const newId = 'newId';

    const rewriter = new SelectorIdWithinVariablesIdRewriter();
    const rewrittenData = rewriter.rewriteId(selector1, newId, data);

    const expected = {
      ...createSleightDataInternalFormat(),
      variables: {
        [variable2.id]: variable2,
        [variable3.id]: {
          ...variable3,
          items: [{ ...variable3.items[0], selectorId: newId }],
        },
        [variable4.id]: variable4,
      },
    };
    expect(rewrittenData).toEqual(expected);
  });
});

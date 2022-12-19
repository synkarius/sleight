import { castJsonForTest } from '../../../../test/utils/import-test-json-util';
import { createSleightDataInternalFormat } from '../../../data-formats';
import { spec02 } from '../../../../test/resources/spec-02.json';
import { spec03 } from '../../../../test/resources/spec-03.json';
import { variable01 } from '../../../../test/resources/variable-01.json';
import { VariableDTO } from '../../../model/variable/variable-dto';
import { SpecDTO } from '../../../model/spec/spec-dto';
import { VariableIdWithinSpecsRewriter } from './variable-id-within-specs-rewriter';

describe('variable id rewriter tests', () => {
  it("should rewrite spec's variable id", () => {
    /* variable1 is used in spec2, but not in spec3, so only spec2 should change */
    const variable1: VariableDTO = castJsonForTest(variable01);
    const spec2: SpecDTO = castJsonForTest(spec02);
    const spec3: SpecDTO = castJsonForTest(spec03);
    const specs = { [spec2.id]: spec2, [spec3.id]: spec3 };
    const data = {
      ...createSleightDataInternalFormat(),
      specs,
    };
    const newId = 'newId';

    const rewriter = new VariableIdWithinSpecsRewriter();
    const rewrittenData = rewriter.rewriteId(variable1.id, newId, data);

    const expected = {
      ...createSleightDataInternalFormat(),
      specs: {
        [spec2.id]: {
          ...spec2,
          items: [{ ...spec2.items[0], itemId: newId }],
        },
        [spec3.id]: spec3,
      },
    };
    expect(rewrittenData).toEqual(expected);
  });
});

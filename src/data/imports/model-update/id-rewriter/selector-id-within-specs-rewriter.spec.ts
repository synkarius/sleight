import { createSleightDataInternalFormat } from '../../../data-formats';
import { spec01 } from '../../../../test/resources/spec-01.json';
import { spec05 } from '../../../../test/resources/spec-05.json';
import { selector01 } from '../../../../test/resources/selector-01.json';
import { castJsonForTest } from '../../../../test/utils/import-test-json-util';
import { SpecDTO } from '../../../model/spec/spec-dto';
import { SelectorDTO } from '../../../model/selector/selector-dto';
import { SelectorIdWithinSpecsIdRewriter } from './selector-id-within-specs-rewriter';

describe('selector id rewriter tests', () => {
  it("should rewrite spec's selector ids", () => {
    const spec1: SpecDTO = castJsonForTest(spec01);
    const selector1: SelectorDTO = castJsonForTest(selector01);
    const spec5: SpecDTO = castJsonForTest(spec05);
    const specs = { [spec1.id]: spec1, [spec5.id]: spec5 };
    const data = {
      ...createSleightDataInternalFormat(),
      specs,
    };
    const newId = 'newId';

    const rewriter = new SelectorIdWithinSpecsIdRewriter();
    const rewrittenData = rewriter.rewriteId(selector1.id, newId, data);

    const expected = {
      ...createSleightDataInternalFormat(),
      specs: {
        [spec1.id]: { ...spec1, items: [{ ...spec1.items[0], itemId: newId }] },
        [spec5.id]: spec5,
      },
    };
    expect(rewrittenData).toEqual(expected);
  });
});

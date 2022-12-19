import { container } from '../../../../di/config/brandi-config';
import { Tokens } from '../../../../di/config/brandi-tokens';
import { import01 } from '../../../../test/resources/import-01.json';
import { castJsonForTest } from '../../../../test/utils/import-test-json-util';
import { SleightDataInternalFormat } from '../../../data-formats';
import { DefaultSleightDataIdsRewriter } from './sleight-data-ids-rewriter';
import { IdRewriter, replaceIdInSlice } from '../id-rewriter/id-rewriter';

const ID_1 = 'id1111111111';
const ID_2 = 'id2222222222';

describe('sleight data ids rewriter tests', () => {
  /**
   * This tests that if 2+ id rewriters (for the same element type) are supplied to
   * DefaultSleightDataIdsRewriter, that it will use both (/all)
   * of them and not just the first one.
   *
   * The way it tests this is that the first test rewriter rewrites any id to ID_1
   * and the second rewrites ID_1 to ID_2. Therefore, everything should have id=ID_2
   * at the end.
   */
  it('all id rewriters should be used', () => {
    const formatMapper = container.get(Tokens.FormatMapper);
    const importData: SleightDataInternalFormat =
      formatMapper.externalFormatToInternal(castJsonForTest(import01));
    //

    const rewriter: DefaultSleightDataIdsRewriter =
      setupRewriterWithTestArrays();

    const result = rewriter.rewriteIds(importData);
    const resultIds = getAllIds(result.rewrittenData);
    expect(resultIds).toEqual([ID_2, ID_2, ID_2, ID_2, ID_2, ID_2, ID_2]);
  });
});

const getAllIds = (data: SleightDataInternalFormat): string[] => {
  return [
    ...Object.keys(data.actions),
    ...Object.keys(data.commands),
    ...Object.keys(data.contexts),
    ...Object.keys(data.fns),
    ...Object.keys(data.selectors),
    ...Object.keys(data.specs),
    ...Object.keys(data.variables),
  ];
};

const createTestIdRewriter = (
  fn: (
    oldId: string,
    newId: string,
    data: SleightDataInternalFormat
  ) => SleightDataInternalFormat
): IdRewriter => {
  return {
    rewriteId: fn,
  };
};

const setupRewriterWithTestArrays = (): DefaultSleightDataIdsRewriter => {
  const testActionRewriters = [
    createTestIdRewriter((oldId, _, data) => ({
      ...data,
      actions: replaceIdInSlice(oldId, ID_1, data.actions),
    })),
    createTestIdRewriter((_oldId, _, data) => ({
      ...data,
      actions: replaceIdInSlice(ID_1, ID_2, data.actions),
    })),
  ];
  const testCommandRewriters = [
    createTestIdRewriter((oldId, _, data) => ({
      ...data,
      commands: replaceIdInSlice(oldId, ID_1, data.commands),
    })),
    createTestIdRewriter((_oldId, _, data) => ({
      ...data,
      commands: replaceIdInSlice(ID_1, ID_2, data.commands),
    })),
  ];
  const testContextRewriters = [
    createTestIdRewriter((oldId, _, data) => ({
      ...data,
      contexts: replaceIdInSlice(oldId, ID_1, data.contexts),
    })),
    createTestIdRewriter((_oldId, _, data) => ({
      ...data,
      contexts: replaceIdInSlice(ID_1, ID_2, data.contexts),
    })),
  ];
  const testFnRewriters = [
    createTestIdRewriter((oldId, _, data) => ({
      ...data,
      fns: replaceIdInSlice(oldId, ID_1, data.fns),
    })),
    createTestIdRewriter((_oldId, _, data) => ({
      ...data,
      fns: replaceIdInSlice(ID_1, ID_2, data.fns),
    })),
  ];
  const testSelectorRewriters = [
    createTestIdRewriter((oldId, _, data) => ({
      ...data,
      selectors: replaceIdInSlice(oldId, ID_1, data.selectors),
    })),
    createTestIdRewriter((_oldId, _, data) => ({
      ...data,
      selectors: replaceIdInSlice(ID_1, ID_2, data.selectors),
    })),
  ];
  const testSpecRewriters = [
    createTestIdRewriter((oldId, _, data) => ({
      ...data,
      specs: replaceIdInSlice(oldId, ID_1, data.specs),
    })),
    createTestIdRewriter((_oldId, _, data) => ({
      ...data,
      specs: replaceIdInSlice(ID_1, ID_2, data.specs),
    })),
  ];
  const testVariableRewriters = [
    createTestIdRewriter((oldId, _, data) => ({
      ...data,
      variables: replaceIdInSlice(oldId, ID_1, data.variables),
    })),
    createTestIdRewriter((_oldId, _, data) => ({
      ...data,
      variables: replaceIdInSlice(ID_1, ID_2, data.variables),
    })),
  ];

  return new DefaultSleightDataIdsRewriter(
    testActionRewriters,
    testCommandRewriters,
    testContextRewriters,
    testFnRewriters,
    testSelectorRewriters,
    testSpecRewriters,
    testVariableRewriters
  );
};

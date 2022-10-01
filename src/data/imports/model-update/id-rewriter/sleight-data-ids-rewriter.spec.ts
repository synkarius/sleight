import { container } from '../../../../di/config/brandi-config';
import { Tokens } from '../../../../di/config/brandi-tokens';
import { import01 } from '../../../../test/resources/import-01.json';
import { castJsonForTest } from '../../../../test/utils/import-test-json-util';
import { SleightDataInternalFormat } from '../../../data-formats';
import { DefaultSleightDataIdsRewriter } from './sleight-data-ids-rewriter';
import { IdRewriter, replaceIdInSlice } from '../id-rewriter/id-rewriter';
import { Ided } from '../../../model/domain';

describe('sleight data ids rewriter tests', () => {
  /**
   * This tests that if 2+ id rewriters (for the same element type) are supplied to
   * DefaultSleightDataIdsRewriter, that it will use both (/all)
   * of them and not just the first one.
   *
   * The way it tests this is a bit odd: each element's id rewriter
   * array is passed two nearly identical copies of the same id
   * rewriter. The end result is a duplication of the test data,
   * but with the second copy having a new id.
   *
   * It's not a realistic scenario, but it does test
   * that all passed id rewriters are used.
   */
  it('all id rewriters should be used', () => {
    const formatMapper = container.get(Tokens.FormatMapper);
    const importData: SleightDataInternalFormat =
      formatMapper.externalFormatToInternal(castJsonForTest(import01));
    //
    const id1 = 'id1111111111';
    const id2 = 'id2222222222';

    const rewriter = new DefaultSleightDataIdsRewriter(
      // actions
      [
        createTestIdRewriter((ided, _, data) => ({
          ...data,
          actions: replaceIdInSlice(ided, id1, data.actions),
        })),
        createTestIdRewriter((ided, _, data) => ({
          ...data,
          actions: replaceIdInSlice(ided, id2, data.actions),
        })),
      ],
      // commands: single rewriter, not an array
      {
        rewriteId: (ided, _newId, data): SleightDataInternalFormat => {
          return {
            ...data,
            commands: replaceIdInSlice(ided, id1, data.commands),
          };
        },
      },
      // contexts
      [
        createTestIdRewriter((ided, _, data) => ({
          ...data,
          contexts: replaceIdInSlice(ided, id1, data.contexts),
        })),
        createTestIdRewriter((ided, _, data) => ({
          ...data,
          contexts: replaceIdInSlice(ided, id2, data.contexts),
        })),
      ],
      // selectors
      [
        createTestIdRewriter((ided, _, data) => ({
          ...data,
          selectors: replaceIdInSlice(ided, id1, data.selectors),
        })),
        createTestIdRewriter((ided, _, data) => ({
          ...data,
          selectors: replaceIdInSlice(ided, id2, data.selectors),
        })),
      ],
      // specs
      [
        createTestIdRewriter((ided, _, data) => ({
          ...data,
          specs: replaceIdInSlice(ided, id1, data.specs),
        })),
        createTestIdRewriter((ided, _, data) => ({
          ...data,
          specs: replaceIdInSlice(ided, id2, data.specs),
        })),
      ],
      // variables
      [
        createTestIdRewriter((ided, _, data) => ({
          ...data,
          variables: replaceIdInSlice(ided, id1, data.variables),
        })),
        createTestIdRewriter((ided, _, data) => ({
          ...data,
          variables: replaceIdInSlice(ided, id2, data.variables),
        })),
      ]
    );

    const result = rewriter.rewriteIds(importData);
    const resultIds = getAllIds(result);
    expect(resultIds).toEqual([
      id1,
      id2,
      id1,
      id1,
      id2,
      id1,
      id2,
      id1,
      id2,
      id1,
      id2,
    ]);
  });
});

const getAllIds = (data: SleightDataInternalFormat): string[] => {
  return [
    ...Object.keys(data.actions),
    ...Object.keys(data.commands),
    ...Object.keys(data.contexts),
    ...Object.keys(data.selectors),
    ...Object.keys(data.specs),
    ...Object.keys(data.variables),
  ];
};

const createTestIdRewriter = <T extends Ided>(
  fn: (
    ided: T,
    id: string,
    data: SleightDataInternalFormat
  ) => SleightDataInternalFormat
): IdRewriter<T> => {
  return {
    rewriteId: fn,
  };
};

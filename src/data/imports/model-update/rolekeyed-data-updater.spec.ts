import { container } from '../../../di/config/brandi-config';
import { Tokens } from '../../../di/config/brandi-tokens';
import { castJsonForTest } from '../../../test/utils/import-test-json-util';
import { SleightDataInternalFormat } from '../../data-formats';
import { baseData } from '../../../test/resources/import-rolekeyed-01-base.json';
import { importOverridesData } from '../../../test/resources/import-rolekeyed-01-import-overrides.json';
import { expectedData } from '../../../test/resources/import-rolekeyed-01-expected.json';
import { IdsMap } from './id-rewriter/sleight-data-ids-rewrite-result';

describe('rolekeyed data updater tests', () => {
  const formatMapper = container.get(Tokens.FormatMapper);
  const roleKeyedDataUpdater = container.get(Tokens.RoleKeyedDataUpdater);

  const format = (json: unknown): SleightDataInternalFormat => {
    return formatMapper.externalFormatToInternal(castJsonForTest(json));
  };

  it('should rewrite both ids and foreign keys', () => {
    // existing user data
    const base = format(baseData);
    // import data
    /**
     * these particular overrides change the rolekeyed choice variable's `defaultValue`;
     * this json file does not represent a whole import, just the overrides part of an import - hence the idsMap below
     */
    const overrides = format(importOverridesData);

    // provide an IdsMap to mimic non-rolekeyed data in the import
    const idsMap: IdsMap = {
      actions: {},
      commands: {},
      contexts: {},
      fns: {},
      selectors: {
        ['4de7275a-759b-4dd3-9e99-e2778b59fa29']: 'asdf-rewritten-id-1',
      },
      specs: {},
      variables: {},
    };
    //
    // test updater
    const actual = roleKeyedDataUpdater.update(base, overrides, idsMap);
    // we'd expect `defaultValue` to be updated, and none of the ids to have changed other than the selectorId in the idsMap
    const expected = format(expectedData);

    expect(actual).toEqual(expected);
  });
});

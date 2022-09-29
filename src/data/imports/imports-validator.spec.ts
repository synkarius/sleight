import { container } from '../../di/config/brandi-config';
import { Tokens } from '../../di/config/brandi-tokens';
import { castJsonForTest } from '../../test/utils/import-test-json-util';
import { SleightDataInternalFormat } from '../data-formats';
import { import01 } from '../../test/resources/import-01.json';
import { ImportValidationResultType } from './imports-validator';

describe('imports validator tests', () => {
  it('should invalidate duplicate names', () => {
    const dataMerger = container.get(Tokens.DataMerger);
    const importsValidator = container.get(Tokens.ImportsValidator);
    const importData: SleightDataInternalFormat = castJsonForTest(import01);

    // merge import data on top of itself to create unrolekeyed duplicates
    const merged = dataMerger.merge(importData, importData);

    const result = importsValidator.validateImportedData(merged);

    // TODO: figure out why when there are duplicate action names, duplicate context names
    // and the others don't seem to get picked up
    expect(result.status).toBe(ImportValidationResultType.INVALID);
  });
});

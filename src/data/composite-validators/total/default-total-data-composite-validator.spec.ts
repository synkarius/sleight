import { container } from '../../../di/config/brandi-config';
import { Tokens } from '../../../di/config/brandi-tokens';
import { castJsonForTest } from '../../../test/utils/import-test-json-util';
import { SleightDataInternalFormat } from '../../data-formats';
import { import01 } from '../../../test/resources/import-01.json';
import { CompositeValidationResultType } from '../composite-validation-result';

describe('sleight data validator tests', () => {
  it('should return invalid result when delegates invalidate data', () => {
    const formatMapper = container.get(Tokens.FormatMapper);
    const dataMerger = container.get(Tokens.ImportDataMerger);
    const importsValidator = container.get(Tokens.TotalDataCompositeValidator);
    const importData: SleightDataInternalFormat =
      formatMapper.externalFormatToInternal(castJsonForTest(import01));

    // merge import data on top of itself to create unrolekeyed duplicates
    const merged = dataMerger.merge(importData, importData);
    const result = importsValidator.validateSleightData(merged);

    expect(result.status).toBe(CompositeValidationResultType.INVALID);
    if (result.status === CompositeValidationResultType.INVALID) {
      expect(result.invalidated.length).toBe(2);
      expect(result.invalidated[0].message).toBe(
        'specs must be unique; this spec is duplicated by: "spe-6c564b91-fe35"'
      );
    }
  });
});

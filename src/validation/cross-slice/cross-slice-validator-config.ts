import { ElementType } from '../../common/element-types';
import { Field } from '../validation-field';

export type ValidationConfig = {
  /**
   * `fields` which cause a validation when touched
   */
  touchTriggersValidationFields: Field[];
  /**
   * metadata to construct error messages/results
   */
  editingElementType: ElementType.Type;
};

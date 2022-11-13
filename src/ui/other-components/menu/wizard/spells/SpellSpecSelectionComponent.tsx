import React, { useContext } from 'react';
import { FormControl, FormText } from 'react-bootstrap';
import { fieldName } from '../../../../../validation/field-name';
import { ValidationContext } from '../../../../../validation/validation-context';
import { Field } from '../../../../../validation/validation-field';
import { processErrorResults } from '../../../../../validation/validation-result-processing';
import { FormGroupRowComponent } from '../../../FormGroupRowComponent';

export const SpellSpecSelectionComponent: React.FC<{
  field: Field;
  selector: string;
  setSelector: React.Dispatch<React.SetStateAction<string>>;
}> = (props) => {
  const validationContext = useContext(ValidationContext);

  const fullErrorResults = validationContext.getErrorResults();
  const errorResults = processErrorResults(fullErrorResults);

  return (
    <FormGroupRowComponent
      labelText="Spec Selection"
      errorMessage={errorResults(props.field)}
    >
      <FormControl
        aria-label={fieldName(props.field)}
        type="text"
        onChange={(e) => {
          props.setSelector(e.target.value);
          validationContext.touch(props.field);
        }}
        onBlur={() => validationContext.touch(props.field)}
        isInvalid={!!errorResults(props.field)}
        value={props.selector}
      />
      <FormText className="text-muted">
        what would you like to say to trigger this command?
      </FormText>
    </FormGroupRowComponent>
  );
};

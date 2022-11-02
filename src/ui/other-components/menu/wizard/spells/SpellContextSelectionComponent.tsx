import React, { useContext } from 'react';
import { Col, FormText } from 'react-bootstrap';
import { ValidationContext } from '../../../../../validation/validation-context';
import { Field } from '../../../../../validation/validation-field';
import { processErrorResults } from '../../../../../validation/validation-result-processing';
import { ContextDropdownComponent } from '../../../../model/context/ContextDropdownComponent';
import { FormGroupRowComponent } from '../../../FormGroupRowComponent';

export const SpellContextSelectionComponent: React.FC<{
  field: Field;
  contextId: string;
  setContextId: React.Dispatch<React.SetStateAction<string>>;
}> = (props) => {
  const validationContext = useContext(ValidationContext);

  const fullErrorResults = validationContext.getErrorResults();
  const errorResults = processErrorResults(fullErrorResults);

  return (
    <FormGroupRowComponent
      labelText="Context Selection"
      errorMessage={errorResults([props.field])}
    >
      <ContextDropdownComponent
        field={props.field}
        contextId={props.contextId}
        onChange={(e) => {
          props.setContextId(e.target.value);
          validationContext.touch(props.field);
        }}
        onBlur={() => validationContext.touch(props.field)}
      />
      <FormText className="text-muted">
        where do you want this command to be active?
      </FormText>
      <FormText as={Col} className="text-info">
        hint 1: leave empty for global
      </FormText>
      <FormText as={Col} className="text-info">
        hint 2: add contexts in the Element Editor
      </FormText>
    </FormGroupRowComponent>
  );
};

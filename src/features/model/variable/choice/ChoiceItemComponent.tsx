import { Button, Col, FormControl, FormText, Row } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { Field } from '../../../../validation/validation-field';
import { RequiredAsteriskComponent } from '../../../ui/RequiredAsteriskComponent';
import { SelectorComponent } from '../../selector/SelectorComponent';
import { editChoiceItemValue, removeChoiceItem } from '../variable-reducers';
import { ChoiceItem } from './choice';

export const ChoiceItemComponent: React.FC<{
  choiceItem: ChoiceItem;
  required?: boolean;
}> = (props) => {
  const dispatch = useAppDispatch();
  const selectors = useAppSelector((state) => state.selector.saved);

  const removeHandler = (_e: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(removeChoiceItem({ choiceItemId: props.choiceItem.id }));
  };
  const valueChangedHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      editChoiceItemValue({
        choiceItemId: props.choiceItem.id,
        value: e.target.value,
      })
    );
  };

  const selector = selectors[props.choiceItem.selectorId];

  return (
    <>
      <Row className="mb-3">
        <Col sm="12">
          <span>Choice Item</span>
          <RequiredAsteriskComponent required={!!props.required} />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col sm="5">
          <SelectorComponent
            field={Field.VAR_CHOICE_ITEM_SELECTOR}
            selector={selector}
            showLabel={false}
            selectorItemHandlers={{
              add: () => {
                /*TODO: these functions*/
              },
              change: (i, v) => {},
              delete: (i) => {},
            }}
          />
        </Col>
        <Col sm="5">
          <FormControl
            type="text"
            onChange={valueChangedHandler}
            value={props.choiceItem.value}
          ></FormControl>
          <FormText className="text-muted">
            value (what the action uses)
          </FormText>
        </Col>
        <Col sm="2">
          <Button onClick={removeHandler} variant="warning" type="submit">
            Delete
          </Button>
        </Col>
      </Row>
    </>
  );
};

import { Button, Col, FormControl, FormText, Row } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { SelectorComponent } from '../../selector/SelectorComponent';
import { editChoiceItemValue, removeChoiceItem } from '../extra-reducers';
import { ChoiceItem } from './choice';

export const ChoiceItemComponent: React.FC<{ choiceItem: ChoiceItem }> = (
  props
) => {
  const dispatch = useAppDispatch();
  const selectors = useAppSelector((state) => state.selector.saved);

  const removeHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
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
    <Row className="mb-3">
      <Col sm="5">
        <SelectorComponent selector={selector} showLabel={false} />
      </Col>
      <Col sm="5">
        <FormControl
          type="text"
          onChange={valueChangedHandler}
          value={props.choiceItem.value}
        ></FormControl>
        <FormText className="text-muted">value (what the action uses)</FormText>
      </Col>
      <Col sm="2">
        <Button onClick={removeHandler} variant="primary" type="submit">
          Remove
        </Button>
      </Col>
    </Row>
  );
};

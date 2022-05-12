import { Button, Col, FormControl, FormText, Row } from 'react-bootstrap';
import { useAppDispatch } from '../../../../app/hooks';
import {
  editChoiceItemSelector,
  editChoiceItemValue,
  removeChoiceItem,
} from '../extra-reducers';
import { ChoiceItem } from './choice';

export const ChoiceItemComponent: React.FC<{ choiceItem: ChoiceItem }> = (
  props
) => {
  const dispatch = useAppDispatch();

  const removeHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(removeChoiceItem({ choiceItemId: props.choiceItem.id }));
  };
  const selectorChangedHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      editChoiceItemSelector({
        choiceItemId: props.choiceItem.id,
        selector: e.target.value,
      })
    );
  };
  const valueChangedHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      editChoiceItemValue({
        choiceItemId: props.choiceItem.id,
        value: e.target.value,
      })
    );
  };

  return (
    <Row className="mb-3">
      <Col sm="5">
        <FormControl
          type="text"
          onChange={selectorChangedHandler}
          value={props.choiceItem.selector}
        ></FormControl>
        <FormText className="text-muted">selector (what to say)</FormText>
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

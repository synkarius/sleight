import React from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { ArrowDown, ArrowUp } from 'react-bootstrap-icons';
import { MoveDirection } from '../model/common/move-direction';

export const VerticalMoveableComponent: React.FC<{
  children: React.ReactNode;
  moveFn: (direction: MoveDirection) => void;
  deleteFn: () => void;
}> = (props) => {
  return (
    <Card className="p-2 mb-3">
      <Container>
        <Row>
          <Col sm="10">{props.children}</Col>
          <Col sm="2">
            <Row>
              <Button
                className="mb-3"
                onClick={(_e) => props.moveFn(MoveDirection.UP)}
              >
                Move <ArrowUp />{' '}
              </Button>
            </Row>
            <Row>
              <Button
                className="mb-3"
                variant="warning"
                onClick={(_e) => props.deleteFn()}
              >
                Delete
              </Button>
            </Row>
            <Row>
              <Button
                className="mb-3"
                onClick={(_e) => props.moveFn(MoveDirection.DOWN)}
              >
                Move <ArrowDown />
              </Button>
            </Row>
          </Col>
        </Row>
      </Container>
    </Card>
  );
};

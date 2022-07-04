import { PayloadAction } from '@reduxjs/toolkit';
import React, { useId } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { ArrowDown, ArrowUp } from 'react-bootstrap-icons';
import { useAppDispatch } from '../../app/hooks';
import { MoveDirection } from '../model/common/move-direction';
import { PanelComponent } from './PanelComponent';

// type of custom (generic) props
type VCMProps<M, D> = {
  children: React.ReactNode;
  moveFn: (direction: MoveDirection) => PayloadAction<M>;
  deleteFn: () => PayloadAction<D>;
};

// type of react component
type CustomGenericPropsComponent = <M, D>(
  props: VCMProps<M, D>
) => React.ReactElement<VCMProps<M, D>>;

export const VerticalMoveableComponent: CustomGenericPropsComponent = (
  props
) => {
  const dispatch = useAppDispatch();
  const id = useId();
  return (
    <PanelComponent>
      <Container>
        <Row>
          <Col sm="10">{props.children}</Col>
          <Col sm="2">
            <Row>
              <Button
                className="mb-3"
                onClick={(_e) => dispatch(props.moveFn(MoveDirection.UP))}
              >
                Move <ArrowUp />{' '}
              </Button>
            </Row>
            <Row>
              <Button
                className="mb-3"
                variant="warning"
                onClick={(_e) => dispatch(props.deleteFn())}
              >
                Delete
              </Button>
            </Row>
            <Row>
              <Button
                className="mb-3"
                onClick={(_e) => dispatch(props.moveFn(MoveDirection.DOWN))}
              >
                Move <ArrowDown />
              </Button>
            </Row>
          </Col>
        </Row>
      </Container>
    </PanelComponent>
  );
};

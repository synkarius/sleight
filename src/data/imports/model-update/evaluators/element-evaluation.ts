import { ElementEvaluationType } from './element-evaluation-type';

interface AbstractElementEvaluation<E> {
  evaluationType: ElementEvaluationType;
  candidate: E;
}

interface DiscardEvaluation<E> extends AbstractElementEvaluation<E> {
  evaluationType: typeof ElementEvaluationType.DISCARD;
}

interface OverrideEvaluation<E> extends AbstractElementEvaluation<E> {
  evaluationType: typeof ElementEvaluationType.OVERRIDE;
  overridden: E;
}

interface PassThroughEvaluation<E> extends AbstractElementEvaluation<E> {
  evaluationType: typeof ElementEvaluationType.ID_REWRITE;
}

export type ElementEvaluation<E> =
  | DiscardEvaluation<E>
  | OverrideEvaluation<E>
  | PassThroughEvaluation<E>;

import { Lockable, RoleKeyed } from '../../model/domain';

export enum ModelUpdateEvaluationType {
  DISCARD,
  OVERRIDE,
  ID_REWRITE,
  EVALUATION_FAILURE,
}

interface AbstractModelUpdateEvaluation<E> {
  evaluationType: ModelUpdateEvaluationType;
  candidate: E;
}

interface DiscardEvaluation<E> extends AbstractModelUpdateEvaluation<E> {
  evaluationType: typeof ModelUpdateEvaluationType.DISCARD;
}

interface OverrideEvaluation<E> extends AbstractModelUpdateEvaluation<E> {
  evaluationType: typeof ModelUpdateEvaluationType.OVERRIDE;
  overridden: E;
}

interface PassThroughEvaluation<E> extends AbstractModelUpdateEvaluation<E> {
  evaluationType: typeof ModelUpdateEvaluationType.ID_REWRITE;
}

interface ModelUpdateEvaluationFailure<E>
  extends AbstractModelUpdateEvaluation<E> {
  evaluationType: typeof ModelUpdateEvaluationType.EVALUATION_FAILURE;
}

export type ModelUpdateEvaluation<E> =
  | DiscardEvaluation<E>
  | OverrideEvaluation<E>
  | PassThroughEvaluation<E>
  | ModelUpdateEvaluationFailure<E>;

export type ModelUpdateEvaluator<E extends RoleKeyed & Lockable> = {
  evaluate: (candidate: E, baseDataElements: E[]) => ModelUpdateEvaluation<E>;
};

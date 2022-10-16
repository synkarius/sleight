import { ImportProcessEvaluationType } from './import-process-evaluation-type';

interface AbstractImportProcessEvaluation<E> {
  evaluationType: ImportProcessEvaluationType;
  candidate: E;
}

interface DiscardEvaluation<E> extends AbstractImportProcessEvaluation<E> {
  evaluationType: typeof ImportProcessEvaluationType.DISCARD;
}

interface OverrideEvaluation<E> extends AbstractImportProcessEvaluation<E> {
  evaluationType: typeof ImportProcessEvaluationType.OVERRIDE;
  overridden: E;
}

interface PassThroughEvaluation<E> extends AbstractImportProcessEvaluation<E> {
  evaluationType: typeof ImportProcessEvaluationType.ID_REWRITE;
}

export type ImportProcessEvaluation<E> =
  | DiscardEvaluation<E>
  | OverrideEvaluation<E>
  | PassThroughEvaluation<E>;

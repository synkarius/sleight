import { ImportProcessEvaluation } from './import-process-evaluation';

export type ImportProcessEvaluator<E> = {
  evaluate: (candidate: E, baseDataElements: E[]) => ImportProcessEvaluation<E>;
};

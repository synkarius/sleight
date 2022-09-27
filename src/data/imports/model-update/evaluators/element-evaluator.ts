import { ElementEvaluation } from './element-evaluation';

export type ElementEvaluator<E> = {
  evaluate: (candidate: E, baseDataElements: E[]) => ElementEvaluation<E>;
};

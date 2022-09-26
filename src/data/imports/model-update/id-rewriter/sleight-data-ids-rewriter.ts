import {
  ActionIdRewriterArray,
  ContextIdRewriterArray,
  SelectorIdRewriterArray,
  SpecIdRewriterArray,
  VariableIdRewriterArray,
} from '../../../../di/di-collection-types';
import { NotImplementedError } from '../../../../error/not-implemented-error';
import { SleightDataInternalFormat } from '../../../data-formats';
import { CommandIdRewriter } from './command-id-rewriter';

export type SleightDataIdsRewriter = {
  rewriteIds: (data: SleightDataInternalFormat) => SleightDataInternalFormat;
};

export class DefaultSleightDataIdsRewriter implements SleightDataIdsRewriter {
  constructor(
    private actionIdRewriters: ActionIdRewriterArray,
    private commandIdRewriter: CommandIdRewriter,
    private contextIdRewriters: ContextIdRewriterArray,
    private selectorIdRewriters: SelectorIdRewriterArray,
    private specIdRewriters: SpecIdRewriterArray,
    private variableIdRewriters: VariableIdRewriterArray
  ) {}

  rewriteIds(data: SleightDataInternalFormat): SleightDataInternalFormat {
    throw new NotImplementedError('DefaultSleightDataIdsRewriter');
  }
}

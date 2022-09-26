import { createSleightDataInternalFormat } from '../../../data-formats';
import { Command, createCommand } from '../../../model/command/command';
import { createContext } from '../../../model/context/context';
import { ContextIdWithinCommandsRewriter } from './context-id-within-commands-rewriter';

describe('context id rewriter tests', () => {
  it("should rewrite command's context id", () => {
    const context = createContext();
    const otherContextId = 'asfd';
    const command1: Command = { ...createCommand(), contextId: context.id };
    const command2: Command = { ...createCommand(), contextId: otherContextId };
    const commands = { [command1.id]: command1, [command2.id]: command2 };
    const data = {
      ...createSleightDataInternalFormat(),
      commands,
    };
    const newId = 'newId';

    const rewriter = new ContextIdWithinCommandsRewriter();
    const rewrittenData = rewriter.rewriteId(context, newId, data);

    const expected = {
      ...createSleightDataInternalFormat(),
      commands: {
        [command1.id]: { ...command1, contextId: newId },
        [command2.id]: command2,
      },
    };
    expect(rewrittenData).toEqual(expected);
  });
});

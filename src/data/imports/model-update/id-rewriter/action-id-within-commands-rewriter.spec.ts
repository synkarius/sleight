import { container } from '../../../../di/brandi-config';
import { Tokens } from '../../../../di/brandi-tokens';
import { createSleightDataInternalFormat } from '../../../data-formats';
import { createPauseAction } from '../../../model/action/pause/pause';
import { Command, createCommand } from '../../../model/command/command';

describe('action id rewriter tests', () => {
  it("should rewrite command's action ids", () => {
    const action = createPauseAction();
    const otherActionId = 'asdf';
    const command: Command = {
      ...createCommand(),
      actionIds: [action.id, otherActionId],
    };
    const commands = { [command.id]: command };
    const data = {
      ...createSleightDataInternalFormat(),
      commands,
    };
    const newId = 'newId';

    const rewriter = container.get(Tokens.ActionIdWithinCommandsRewriter);
    const rewrittenData = rewriter.rewriteId(action, newId, data);

    const expected = {
      ...createSleightDataInternalFormat(),
      commands: {
        [command.id]: { ...command, actionIds: [newId, otherActionId] },
      },
    };
    expect(rewrittenData).toEqual(expected);
  });
});

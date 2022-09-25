import { container } from '../../../../di/brandi-config';
import { Tokens } from '../../../../di/brandi-tokens';
import { SleightDataInternalFormat } from '../../../data-formats';
import { createPauseAction } from '../../../model/action/pause/pause';
import { createCommand } from '../../../model/command/command';

const createEmptySleightData = (): SleightDataInternalFormat => ({
  actions: {},
  commands: {},
  contexts: {},
  selectors: {},
  specs: {},
  variables: {},
});

describe('action id rewriter tests', () => {
  it('should rewrite command action ids', () => {
    const action = createPauseAction();
    const command = { ...createCommand(), actionIds: [action.id] };
    const commands = { [command.id]: command };
    const data = {
      ...createEmptySleightData(),
      commands,
    };
    const newId = 'newId';

    const rewriter = container.get(Tokens.CommandActionIdsRewriter);
    const rewrittenData = rewriter.rewriteId(action, newId, data);

    const expected = {
      ...createEmptySleightData(),
      commands: { [command.id]: { ...command, actionIds: [newId] } },
    };
    expect(rewrittenData).toEqual(expected);
  });
});

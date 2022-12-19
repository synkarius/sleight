import { castJsonForTest } from '../../../../test/utils/import-test-json-util';
import { createSleightDataInternalFormat } from '../../../data-formats';
import { Command, createCommand } from '../../../model/command/command';
import { SpecDTO } from '../../../model/spec/spec-dto';
import { SpecIdWithinCommandsRewriter } from './spec-id-within-commands-rewriter';
import { spec01 } from '../../../../test/resources/spec-01.json';

describe('spec id rewriter tests', () => {
  it("should rewrite command's spec id", () => {
    const specDTO: SpecDTO = castJsonForTest(spec01);
    const otherSpecId = 'asdf';
    const command1: Command = { ...createCommand(), specId: specDTO.id };
    const command2: Command = { ...createCommand(), specId: otherSpecId };
    const commands = { [command1.id]: command1, [command2.id]: command2 };
    const data = {
      ...createSleightDataInternalFormat(),
      commands,
    };
    const newId = 'newId';

    const rewriter = new SpecIdWithinCommandsRewriter();
    const rewrittenData = rewriter.rewriteId(specDTO.id, newId, data);

    const expected = {
      ...createSleightDataInternalFormat(),
      commands: {
        [command1.id]: { ...command1, specId: newId },
        [command2.id]: command2,
      },
    };
    expect(rewrittenData).toEqual(expected);
  });
});

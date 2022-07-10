import { ReduxFriendlyStringMap } from '../../../util/string-map';
import { MoveDirection } from '../common/move-direction';
import { createCommand, Command } from './command';
import {
  CommandsState,
  createNewEditingCommand,
  selectCommand,
  saveEditingCommand,
  clearEditingCommand,
  changeEditingCommandName,
  changeEditingCommandRoleKey,
  changeEditingCommandSpecType,
  changeEditingCommandSpecSpecId,
  changeEditingCommandSpecRoleKeyId,
  addActionToEditingCommand,
  changeEditingCommandActionId,
  moveEditingCommandAction,
  deleteEditingCommandAction,
  commandReducer,
} from './command-reducers';
import { CommandSpecType } from './command-spec-type';

const createTestCommand = (id: string): Command => {
  return {
    id: id,
    name: '',
    roleKeyId: null,
    commandSpecType: CommandSpecType.SPEC,
    specId: null,
    specRoleKeyId: null,
    actionIds: [],
  };
};

describe('command reducer', () => {
  const initialState: CommandsState = {
    saved: {},
    editing: null,
  };
  it('should handle initial state', () => {
    expect(commandReducer(undefined, { type: 'unknown' })).toEqual({
      saved: {},
      editing: null,
    });
  });

  it('should handle create new', () => {
    const newObject = createCommand();

    const actual = commandReducer(
      initialState,
      createNewEditingCommand(newObject)
    );

    expect(actual.editing).toEqual(createTestCommand(newObject.id));
  });

  it('should handle save', () => {
    const newObject = createCommand();

    const createdState = commandReducer(
      initialState,
      createNewEditingCommand(newObject)
    );
    const actual = commandReducer(createdState, saveEditingCommand());

    const expected: ReduxFriendlyStringMap<Command> = {};
    expected[newObject.id] = createTestCommand(newObject.id);

    expect(actual.saved).toEqual(expected);
  });

  it('should handle select', () => {
    const newObject = createCommand();

    const createdState = commandReducer(
      initialState,
      createNewEditingCommand(newObject)
    );
    const savedState = commandReducer(createdState, saveEditingCommand());
    const clearedState = commandReducer(savedState, clearEditingCommand());

    const actual = commandReducer(clearedState, selectCommand(newObject.id));
    expect(actual.editing).toEqual(createTestCommand(newObject.id));
  });

  it('should handle clear', () => {
    const createdState = commandReducer(
      initialState,
      createNewEditingCommand(createCommand())
    );

    const actual = commandReducer(createdState, clearEditingCommand());

    expect(actual.editing).toBeNull();
  });

  it('should handle change name', () => {
    const newObject = createCommand();

    const createdState = commandReducer(
      initialState,
      createNewEditingCommand(newObject)
    );

    const actual = commandReducer(
      createdState,
      changeEditingCommandName('asdf')
    );
    expect(actual.editing).toEqual({
      ...createTestCommand(newObject.id),
      name: 'asdf',
    });
  });

  it('should handle change role key', () => {
    const newObject = createCommand();

    const createdState = commandReducer(
      initialState,
      createNewEditingCommand(newObject)
    );

    const actual = commandReducer(
      createdState,
      changeEditingCommandRoleKey('asdf')
    );
    expect(actual.editing).toEqual({
      ...createTestCommand(newObject.id),
      roleKeyId: 'asdf',
    });
  });

  it('should handle change spec type', () => {
    const newObject = createCommand();

    const createdState = commandReducer(
      initialState,
      createNewEditingCommand(newObject)
    );

    const actual = commandReducer(
      createdState,
      changeEditingCommandSpecType('asdf')
    );
    expect(actual.editing).toEqual({
      ...createTestCommand(newObject.id),
      commandSpecType: 'asdf',
    });
  });

  it('should handle change spec id', () => {
    const newObject = createCommand();

    const createdState = commandReducer(
      initialState,
      createNewEditingCommand(newObject)
    );

    const actual = commandReducer(
      createdState,
      changeEditingCommandSpecSpecId('asdf')
    );
    expect(actual.editing).toEqual({
      ...createTestCommand(newObject.id),
      specId: 'asdf',
    });
  });

  it('should handle change spec role key id', () => {
    const newObject = createCommand();

    const createdState = commandReducer(
      initialState,
      createNewEditingCommand(newObject)
    );

    const actual = commandReducer(
      createdState,
      changeEditingCommandSpecRoleKeyId('asdf')
    );
    expect(actual.editing).toEqual({
      ...createTestCommand(newObject.id),
      specRoleKeyId: 'asdf',
    });
  });

  it('should handle add action', () => {
    const newObject = createCommand();

    const createdState = commandReducer(
      initialState,
      createNewEditingCommand(newObject)
    );

    const actual = commandReducer(
      createdState,
      addActionToEditingCommand('asdf')
    );
    expect(actual.editing).toEqual({
      ...createTestCommand(newObject.id),
      actionIds: ['asdf'],
    });
  });

  it('should handle change action id', () => {
    const newObject = createCommand();

    const createdState = commandReducer(
      initialState,
      createNewEditingCommand(newObject)
    );
    const actionAddedState = commandReducer(
      createdState,
      addActionToEditingCommand('asdf-1')
    );
    const actual = commandReducer(
      actionAddedState,
      changeEditingCommandActionId({ index: 0, newActionId: 'asdf-2' })
    );

    expect(actual.editing).toEqual({
      ...createTestCommand(newObject.id),
      actionIds: ['asdf-2'],
    });
  });

  it('should handle move action up', () => {
    const newObject = createCommand();

    const createdState = commandReducer(
      initialState,
      createNewEditingCommand(newObject)
    );
    const actionAddedState1 = commandReducer(
      createdState,
      addActionToEditingCommand('asdf-1')
    );
    const actionAddedState2 = commandReducer(
      actionAddedState1,
      addActionToEditingCommand('asdf-2')
    );
    const actionAddedState3 = commandReducer(
      actionAddedState2,
      addActionToEditingCommand('asdf-3')
    );
    const actual = commandReducer(
      actionAddedState3,
      moveEditingCommandAction({ index: 1, direction: MoveDirection.UP })
    );

    expect(actual.editing).toEqual({
      ...createTestCommand(newObject.id),
      actionIds: ['asdf-2', 'asdf-1', 'asdf-3'],
    });
  });

  it('should handle move action down', () => {
    const newObject = createCommand();

    const createdState = commandReducer(
      initialState,
      createNewEditingCommand(newObject)
    );
    const actionAddedState1 = commandReducer(
      createdState,
      addActionToEditingCommand('asdf-1')
    );
    const actionAddedState2 = commandReducer(
      actionAddedState1,
      addActionToEditingCommand('asdf-2')
    );
    const actionAddedState3 = commandReducer(
      actionAddedState2,
      addActionToEditingCommand('asdf-3')
    );
    const actual = commandReducer(
      actionAddedState3,
      moveEditingCommandAction({ index: 1, direction: MoveDirection.DOWN })
    );

    expect(actual.editing).toEqual({
      ...createTestCommand(newObject.id),
      actionIds: ['asdf-1', 'asdf-3', 'asdf-2'],
    });
  });

  it('should handle move action up out of bounds', () => {
    const newObject = createCommand();

    const createdState = commandReducer(
      initialState,
      createNewEditingCommand(newObject)
    );
    const actionAddedState1 = commandReducer(
      createdState,
      addActionToEditingCommand('asdf-1')
    );
    const actionAddedState2 = commandReducer(
      actionAddedState1,
      addActionToEditingCommand('asdf-2')
    );
    const actionAddedState3 = commandReducer(
      actionAddedState2,
      addActionToEditingCommand('asdf-3')
    );
    const actual = commandReducer(
      actionAddedState3,
      moveEditingCommandAction({ index: 0, direction: MoveDirection.UP })
    );

    expect(actual.editing).toEqual({
      ...createTestCommand(newObject.id),
      actionIds: ['asdf-1', 'asdf-2', 'asdf-3'],
    });
  });

  it('should handle move action down out of bounds', () => {
    const newObject = createCommand();

    const createdState = commandReducer(
      initialState,
      createNewEditingCommand(newObject)
    );
    const actionAddedState1 = commandReducer(
      createdState,
      addActionToEditingCommand('asdf-1')
    );
    const actionAddedState2 = commandReducer(
      actionAddedState1,
      addActionToEditingCommand('asdf-2')
    );
    const actionAddedState3 = commandReducer(
      actionAddedState2,
      addActionToEditingCommand('asdf-3')
    );
    const actual = commandReducer(
      actionAddedState3,
      moveEditingCommandAction({ index: 2, direction: MoveDirection.DOWN })
    );

    expect(actual.editing).toEqual({
      ...createTestCommand(newObject.id),
      actionIds: ['asdf-1', 'asdf-2', 'asdf-3'],
    });
  });

  it('should handle delete action', () => {
    const newObject = createCommand();

    const createdState = commandReducer(
      initialState,
      createNewEditingCommand(newObject)
    );
    const actionAddedState1 = commandReducer(
      createdState,
      addActionToEditingCommand('asdf-1')
    );
    const actionAddedState2 = commandReducer(
      actionAddedState1,
      addActionToEditingCommand('asdf-2')
    );
    const actual = commandReducer(
      actionAddedState2,
      deleteEditingCommandAction(0)
    );

    expect(actual.editing).toEqual({
      ...createTestCommand(newObject.id),
      actionIds: ['asdf-2'],
    });
  });
});

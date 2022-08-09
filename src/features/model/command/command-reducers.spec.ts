import { ReduxFriendlyStringMap } from '../../../util/string-map';
import { MoveDirection } from '../common/move-direction';
import { createCommand, Command } from './command';
import { commandDefaultNamer } from './command-default-namer';
import { CommandReducerActionType } from './command-editing-context';
import {
  CommandsState,
  selectCommand,
  saveEditingCommand,
  commandReduxReducer,
  commandReactReducer,
} from './command-reducers';
import { CommandSpecType } from './command-spec-type';

const createTestCommand = (id: string): Command => {
  return {
    id: id,
    name: '',
    roleKeyId: undefined,
    specType: CommandSpecType.Enum.SPEC,
    specVariableId: undefined,
    specRoleKeyId: undefined,
    actionIds: [],
  };
};

describe('command reducer', () => {
  it('should handle initial state', () => {
    expect(commandReduxReducer(undefined, { type: 'unknown' })).toEqual({
      saved: {},
      editingId: undefined,
    });
  });

  it('should handle save', () => {
    const obj = { ...createCommand(), name: '' };

    const initialState: CommandsState = {
      saved: {},
      editingId: undefined,
    };

    const actual = commandReduxReducer(initialState, saveEditingCommand(obj));

    const expected: ReduxFriendlyStringMap<Command> = {};
    expected[obj.id] = {
      ...createTestCommand(obj.id),
      name: commandDefaultNamer.getDefaultName(obj),
    };

    expect(actual.saved).toEqual(expected);
  });

  it('should handle save with name', () => {
    const obj = { ...createCommand(), name: 'asdf' };

    const initialState: CommandsState = {
      saved: {},
      editingId: undefined,
    };

    const actual = commandReduxReducer(initialState, saveEditingCommand(obj));

    const expected: ReduxFriendlyStringMap<Command> = {};
    expected[obj.id] = obj;

    expect(actual.saved).toEqual(expected);
  });

  it('should handle select', () => {
    const initialState: CommandsState = {
      saved: {},
      editingId: undefined,
    };
    const actual = commandReduxReducer(initialState, selectCommand('asdf'));

    expect(actual).toEqual({
      saved: {},
      editingId: 'asdf',
    });
  });

  it('should handle clear', () => {
    const initialState: CommandsState = {
      saved: {},
      editingId: 'asdf',
    };
    const actual = commandReduxReducer(initialState, selectCommand());

    expect(actual).toEqual({
      saved: {},
      editingId: undefined,
    });
  });

  it('should handle change name', () => {
    const obj = createCommand();

    const actual = commandReactReducer(obj, {
      type: CommandReducerActionType.CHANGE_NAME,
      payload: 'asdf',
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...createTestCommand(obj.id),
      name: 'asdf',
    });
  });

  it('should handle change name to blank', () => {
    const obj = { ...createCommand(), name: 'asdf' };

    const actual = commandReactReducer(obj, {
      type: CommandReducerActionType.CHANGE_NAME,
      payload: '      ',
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...createTestCommand(obj.id),
      name: '',
    });
  });

  it('should handle change role key', () => {
    const obj = createCommand();

    const actual = commandReactReducer(obj, {
      type: CommandReducerActionType.CHANGE_ROLE_KEY,
      payload: 'asdf',
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...createTestCommand(obj.id),
      roleKeyId: 'asdf',
    });
  });

  it('should handle change spec type', () => {
    const obj = createCommand();

    const actual = commandReactReducer(obj, {
      type: CommandReducerActionType.CHANGE_SPEC_TYPE,
      payload: CommandSpecType.Enum.ROLE_KEY,
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...createTestCommand(obj.id),
      specType: CommandSpecType.Enum.ROLE_KEY,
    });
  });

  it('should handle change spec id', () => {
    const obj = createCommand();

    const actual = commandReactReducer(obj, {
      type: CommandReducerActionType.CHANGE_SPEC_VARIABLE_ID,
      payload: 'asdf',
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...createTestCommand(obj.id),
      specVariableId: 'asdf',
    });
  });

  it('should handle change spec role key id', () => {
    const obj = createCommand();

    const actual = commandReactReducer(obj, {
      type: CommandReducerActionType.CHANGE_SPEC_ROLE_KEY_ID,
      payload: 'asdf',
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...createTestCommand(obj.id),
      specRoleKeyId: 'asdf',
    });
  });

  it('should handle add action', () => {
    const obj = createCommand();

    const actual = commandReactReducer(obj, {
      type: CommandReducerActionType.ADD_ACTION,
      payload: 'asdf',
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      actionIds: [...obj.actionIds, 'asdf'],
    });
  });

  it('should handle change action id', () => {
    const obj = createCommand();
    obj.actionIds.push('asdf-1');

    const actual = commandReactReducer(obj, {
      type: CommandReducerActionType.CHANGE_ACTION,
      payload: {
        index: 0,
        newActionId: 'asdf-2',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      actionIds: ['asdf-2'],
    });
  });

  it('should handle move action up', () => {
    const obj = createCommand();
    obj.actionIds.push('asdf-1');
    obj.actionIds.push('asdf-2');
    obj.actionIds.push('asdf-3');

    const actual = commandReactReducer(obj, {
      type: CommandReducerActionType.MOVE_ACTION,
      payload: { index: 1, direction: MoveDirection.UP },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...createTestCommand(obj.id),
      actionIds: ['asdf-2', 'asdf-1', 'asdf-3'],
    });
  });

  it('should handle move action down', () => {
    const obj = createCommand();
    obj.actionIds.push('asdf-1');
    obj.actionIds.push('asdf-2');
    obj.actionIds.push('asdf-3');

    const actual = commandReactReducer(obj, {
      type: CommandReducerActionType.MOVE_ACTION,
      payload: { index: 1, direction: MoveDirection.DOWN },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...createTestCommand(obj.id),
      actionIds: ['asdf-1', 'asdf-3', 'asdf-2'],
    });
  });

  it('should handle move action up out of bounds', () => {
    const obj = createCommand();
    obj.actionIds.push('asdf-1');
    obj.actionIds.push('asdf-2');
    obj.actionIds.push('asdf-3');

    const actual = commandReactReducer(obj, {
      type: CommandReducerActionType.MOVE_ACTION,
      payload: { index: 0, direction: MoveDirection.UP },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...createTestCommand(obj.id),
      actionIds: ['asdf-1', 'asdf-2', 'asdf-3'],
    });
  });

  it('should handle move action down out of bounds', () => {
    const obj = createCommand();
    obj.actionIds.push('asdf-1');
    obj.actionIds.push('asdf-2');
    obj.actionIds.push('asdf-3');

    const actual = commandReactReducer(obj, {
      type: CommandReducerActionType.MOVE_ACTION,
      payload: { index: 2, direction: MoveDirection.DOWN },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...createTestCommand(obj.id),
      actionIds: ['asdf-1', 'asdf-2', 'asdf-3'],
    });
  });

  it('should handle delete action', () => {
    const obj = createCommand();
    obj.actionIds.push('asdf-1');
    obj.actionIds.push('asdf-2');

    const actual = commandReactReducer(obj, {
      type: CommandReducerActionType.DELETE_ACTION,
      payload: 0,
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...createTestCommand(obj.id),
      actionIds: ['asdf-2'],
    });
  });
});

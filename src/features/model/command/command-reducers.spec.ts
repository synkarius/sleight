import { getDefaultInjectionContext } from '../../../app-default-injection-context';
import { SELECT_DEFAULT_VALUE } from '../common/consts';
import { MoveDirection } from '../common/move-direction';
import { createCommand, Command } from './command';
import { CommandReducerActionType } from './command-editing-context';
import {
  CommandsState,
  selectCommand,
  saveCommand,
  commandReduxReducer,
  commandReactReducer,
} from './command-reducers';

describe('command reducer', () => {
  const injected = getDefaultInjectionContext();
  const commandDefaultNamer = injected.default.namers.command;

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

    const actual = commandReduxReducer(initialState, saveCommand(obj));

    const expected: Record<string, Command> = {};
    expected[obj.id] = {
      ...obj,
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

    const actual = commandReduxReducer(initialState, saveCommand(obj));

    const expected: Record<string, Command> = {};
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
      ...obj,
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
      ...obj,
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
      ...obj,
      roleKey: 'asdf',
    });
  });

  it('should handle change context', () => {
    const obj = createCommand();

    const actual = commandReactReducer(obj, {
      type: CommandReducerActionType.CHANGE_CONTEXT,
      payload: 'asdf',
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      contextId: 'asdf',
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
      ...obj,
      specId: 'asdf',
    });
  });

  it('should handle add action', () => {
    const obj = createCommand();

    const actual = commandReactReducer(obj, {
      type: CommandReducerActionType.ADD_ACTION,
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      actionIds: [...obj.actionIds, SELECT_DEFAULT_VALUE],
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
      ...obj,
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
      ...obj,
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
      ...obj,
      actionIds: ['asdf-1', 'asdf-2', 'asdf-3'],
    });
  });

  it('should handle move action down out of bounds', () => {
    const obj: Command = {
      ...createCommand(),
      actionIds: ['asdf-1', 'asdf-2', 'asdf-3'],
    };

    const actual = commandReactReducer(obj, {
      type: CommandReducerActionType.MOVE_ACTION,
      payload: { index: 2, direction: MoveDirection.DOWN },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
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
      ...obj,
      actionIds: ['asdf-2'],
    });
  });
});

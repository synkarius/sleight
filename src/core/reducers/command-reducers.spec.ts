import { UNSELECTED_ID } from '../common/consts';
import { MoveDirection } from '../common/move-direction';
import { createCommand, Command } from '../../data/model/command/command';
import { CommandReducerActionType } from '../../ui/model/command/command-editing-context';
import {
  CommandsState,
  saveCommand,
  commandReduxReducer,
  commandReactReducer,
  deleteCommand,
  setCommands,
} from './command-reducers';
import { Tokens } from '../../di/config/brandi-tokens';
import { container } from '../../di/config/brandi-config';

describe('command reducer', () => {
  const commandDefaultNamer = container.get(Tokens.DefaultNamer_Command);

  it('should handle initial state', () => {
    expect(commandReduxReducer(undefined, { type: 'unknown' })).toEqual({
      saved: {},
    });
  });

  it('should handle save', () => {
    const obj = { ...createCommand(), name: '' };

    const initialState: CommandsState = {
      saved: {},
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
    };

    const actual = commandReduxReducer(initialState, saveCommand(obj));

    const expected: Record<string, Command> = {};
    expected[obj.id] = obj;

    expect(actual.saved).toEqual(expected);
  });

  it('should handle delete', () => {
    const obj = createCommand();

    const preReducerState: CommandsState = {
      saved: { [obj.id]: obj },
    };

    const actual = commandReduxReducer(preReducerState, deleteCommand(obj.id));

    expect(actual.saved).toEqual({});
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
      actionIds: [...obj.actionIds, UNSELECTED_ID],
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

  it('should handle toggle enabled', () => {
    const obj = createCommand();

    const actual = commandReactReducer(obj, {
      type: CommandReducerActionType.TOGGLE_ENABLED,
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      enabled: !obj.enabled,
    });
  });

  it('should handle toggle locked', () => {
    const obj = createCommand();

    const actual = commandReactReducer(obj, {
      type: CommandReducerActionType.TOGGLE_LOCKED,
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      locked: !obj.locked,
    });
  });

  it('should handle set', () => {
    const obj1 = createCommand();
    const preReducerState: CommandsState = {
      saved: { [obj1.id]: obj1 },
    };

    const obj2 = createCommand();
    const newReducerState: CommandsState = {
      saved: { [obj2.id]: obj2 },
    };

    const actual = commandReduxReducer(
      preReducerState,
      setCommands(newReducerState.saved)
    );

    expect(actual).toEqual(newReducerState);
  });
});

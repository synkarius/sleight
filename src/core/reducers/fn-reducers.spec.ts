import { createTextValue } from '../../data/model/action/action-value';
import {
  createPythonFn,
  createPythonFnParameter,
  Fn,
  FnParameter,
} from '../../data/model/fn/fn';
import { VariableType } from '../../data/model/variable/variable-types';
import { NotImplementedError } from '../../error/not-implemented-error';
import { FnReducerActionType } from '../../ui/model/fn/fn-editing-context';
import { MoveDirection } from '../common/move-direction';
import {
  deleteFn,
  fnReactReducer,
  fnReduxReducer,
  FnsState,
  saveFn,
  setFns,
} from './fn-reducers';

describe('fn reducer', () => {
  it('should handle initial state', () => {
    expect(fnReduxReducer(undefined, { type: 'unknown' })).toEqual({
      saved: {},
    });
  });

  it('should handle save', () => {
    const obj: Fn = createPythonFn();

    const prereducerState: FnsState = {
      saved: {},
    };

    const actual = fnReduxReducer(prereducerState, saveFn(obj));
    const expected: Record<string, Fn> = {
      [obj.id]: obj,
    };

    expect(actual.saved).toEqual(expected);
  });

  it('should handle save with name', () => {
    const obj = { ...createPythonFn(), name: 'asdf' };

    const prereducerState: FnsState = {
      saved: {},
    };

    const actual = fnReduxReducer(prereducerState, saveFn(obj));
    const expected: Record<string, Fn> = {
      [obj.id]: { ...obj, name: 'asdf' },
    };

    expect(actual.saved).toEqual(expected);
  });

  it('should handle delete', () => {
    const obj = createPythonFn();

    const preReducerState: FnsState = {
      saved: { [obj.id]: obj },
    };

    const actual = fnReduxReducer(preReducerState, deleteFn(obj.id));

    expect(actual.saved).toEqual({});
  });

  it('should handle change name', () => {
    const obj = createPythonFn();
    const actual = fnReactReducer(obj, {
      type: FnReducerActionType.CHANGE_NAME,
      payload: 'asdf',
    });

    expect(actual).toEqual({
      ...obj,
      name: 'asdf',
    });
  });

  it('should handle change role key', () => {
    const obj = createPythonFn();
    const actual = fnReactReducer(obj, {
      type: FnReducerActionType.CHANGE_ROLE_KEY,
      payload: 'asdf',
    });

    expect(actual).toEqual({
      ...obj,
      roleKey: 'asdf',
    });
  });

  it.skip('should handle change type', () => {
    throw new NotImplementedError('fn reducer test: change type');
  });

  it('should handle change import path', () => {
    const obj = createPythonFn();
    const actual = fnReactReducer(obj, {
      type: FnReducerActionType.CHANGE_IMPORT_PATH,
      payload: 'asdf',
    });

    expect(actual).toEqual<Fn>({
      ...obj,
      importTokens: ['asdf'],
    });
  });

  it('should handle toggle enabled', () => {
    const obj = createPythonFn();

    const actual = fnReactReducer(obj, {
      type: FnReducerActionType.TOGGLE_ENABLED,
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      enabled: !obj.enabled,
    });
  });

  it('should handle toggle locked', () => {
    const obj = createPythonFn();

    const actual = fnReactReducer(obj, {
      type: FnReducerActionType.TOGGLE_LOCKED,
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      locked: !obj.locked,
    });
  });

  it('should handle add parameter', () => {
    const obj = createPythonFn();
    const param = createPythonFnParameter();

    const actual = fnReactReducer(obj, {
      type: FnReducerActionType.ADD_PARAMETER,
      payload: param,
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual<Fn>({
      ...obj,
      parameters: [param],
    });
  });

  it('should handle move parameter up', () => {
    const param1 = createPythonFnParameter();
    const param2 = createPythonFnParameter();
    const param3 = createPythonFnParameter();
    const obj: Fn = {
      ...createPythonFn(),
      parameters: [param1, param2, param3],
    };

    const actual = fnReactReducer(obj, {
      type: FnReducerActionType.MOVE_PARAMETER,
      payload: {
        index: 1,
        direction: MoveDirection.UP,
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual<Fn>({
      ...obj,
      parameters: [param2, param1, param3],
    });
  });

  it('should handle move first parameter up', () => {
    const param1 = createPythonFnParameter();
    const param2 = createPythonFnParameter();
    const param3 = createPythonFnParameter();
    const obj: Fn = {
      ...createPythonFn(),
      parameters: [param1, param2, param3],
    };

    const actual = fnReactReducer(obj, {
      type: FnReducerActionType.MOVE_PARAMETER,
      payload: {
        index: 0,
        direction: MoveDirection.UP,
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual<Fn>({
      ...obj,
      parameters: [param1, param2, param3],
    });
  });

  it('should handle move parameter down', () => {
    const param1 = createPythonFnParameter();
    const param2 = createPythonFnParameter();
    const param3 = createPythonFnParameter();
    const obj: Fn = {
      ...createPythonFn(),
      parameters: [param1, param2, param3],
    };

    const actual = fnReactReducer(obj, {
      type: FnReducerActionType.MOVE_PARAMETER,
      payload: {
        index: 1,
        direction: MoveDirection.DOWN,
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual<Fn>({
      ...obj,
      parameters: [param1, param3, param2],
    });
  });

  it('should handle move last parameter down', () => {
    const param1 = createPythonFnParameter();
    const param2 = createPythonFnParameter();
    const param3 = createPythonFnParameter();
    const obj: Fn = {
      ...createPythonFn(),
      parameters: [param1, param2, param3],
    };

    const actual = fnReactReducer(obj, {
      type: FnReducerActionType.MOVE_PARAMETER,
      payload: {
        index: 2,
        direction: MoveDirection.DOWN,
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual<Fn>({
      ...obj,
      parameters: [param1, param2, param3],
    });
  });

  it('should handle delete parameter', () => {
    const param1 = createPythonFnParameter();
    const param2 = createPythonFnParameter();
    const param3 = createPythonFnParameter();
    const obj: Fn = {
      ...createPythonFn(),
      parameters: [param1, param2, param3],
    };

    const actual = fnReactReducer(obj, {
      type: FnReducerActionType.DELETE_PARAMETER,
      payload: 1,
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual<Fn>({
      ...obj,
      parameters: [param1, param3],
    });
  });

  it('should handle change parameter name', () => {
    const param1 = createPythonFnParameter();
    const param2 = createPythonFnParameter();
    const obj: Fn = {
      ...createPythonFn(),
      parameters: [param1, param2],
    };

    const actual = fnReactReducer(obj, {
      type: FnReducerActionType.CHANGE_PARAMETER_NAME,
      payload: {
        id: param2.id,
        value: 'new-name',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual<Fn>({
      ...obj,
      parameters: [param1, { ...param2, name: 'new-name' }],
    });
  });

  it('should handle change parameter type', () => {
    const param1 = createPythonFnParameter();
    const param2: FnParameter = {
      ...createPythonFnParameter(),
      type: VariableType.Enum.NUMBER,
    };
    const obj: Fn = {
      ...createPythonFn(),
      parameters: [param1, param2],
    };

    const actual = fnReactReducer(obj, {
      type: FnReducerActionType.CHANGE_PARAMETER_TYPE,
      payload: {
        id: param2.id,
        value: VariableType.Enum.ENUM,
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual<Fn>({
      ...obj,
      parameters: [param1, { ...param2, type: VariableType.Enum.ENUM }],
    });
  });

  it('should handle set', () => {
    const obj1 = createPythonFn();
    const preReducerState: FnsState = {
      saved: { [obj1.id]: obj1 },
    };

    const obj2 = createPythonFn();
    const newReducerState: FnsState = {
      saved: { [obj2.id]: obj2 },
    };

    const actual = fnReduxReducer(
      preReducerState,
      setFns(newReducerState.saved)
    );

    expect(actual).toEqual(newReducerState);
  });
});

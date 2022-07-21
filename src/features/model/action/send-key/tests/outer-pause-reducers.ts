// import { createSendKeyPressAction } from '../send-key';
// import {
//   ActionsState,
//   actionReduxReducer,
//   validateOuterPause,
//   resetOuterPause,
// } from '../../action-reducers';
// import { ActionValueType } from '../../action-value/action-value-type';
// import { ActionValueOperation } from '../../action-value/action-value-operation';
// import { SendKeyField } from '../send-key-payloads';
// import { outerPauseValidators } from '../../action-validation';
// import {
//   createSendKeyReduxAction,
//   createTestSendKeyPressAction,
// } from './test-utils';

// describe('action reducer: action.outerPause', () => {
//   it('should handle change action.outerPause.actionValueType', () => {
//     const obj = createSendKeyPressAction();
//     obj.outerPause.actionValueType = ActionValueType.USE_ROLE_KEY;

//     const preReducerState: ActionsState = {
//       saved: {},
//       editing: obj,
//       validationErrors: [],
//     };

//     const actual = actionReduxReducer(
//       preReducerState,
//       createSendKeyReduxAction(
//         ActionValueType.ENTER_VALUE,
//         ActionValueOperation.CHANGE_TYPE,
//         SendKeyField.OUTER_PAUSE
//       )
//     );
//     expect(actual.editing).toEqual({
//       ...obj,
//       outerPause: {
//         ...obj.outerPause,
//         actionValueType: ActionValueType.ENTER_VALUE,
//       },
//     });
//   });

//   it('should handle change action.outerPause.value', () => {
//     const obj = createSendKeyPressAction();

//     const preReducerState: ActionsState = {
//       saved: {},
//       editing: obj,
//       validationErrors: [],
//     };

//     const actual = actionReduxReducer(
//       preReducerState,
//       createSendKeyReduxAction(
//         '123',
//         ActionValueOperation.CHANGE_ENTERED_VALUE,
//         SendKeyField.OUTER_PAUSE
//       )
//     );
//     expect(actual.editing).toEqual({
//       ...obj,
//       outerPause: {
//         ...obj.outerPause,
//         value: 123,
//       },
//     });
//   });

//   it('should handle change action.outerPause.variableId', () => {
//     const obj = createSendKeyPressAction();

//     const preReducerState: ActionsState = {
//       saved: {},
//       editing: obj,
//       validationErrors: [],
//     };

//     const actual = actionReduxReducer(
//       preReducerState,
//       createSendKeyReduxAction(
//         'asdf',
//         ActionValueOperation.CHANGE_VARIABLE_ID,
//         SendKeyField.OUTER_PAUSE
//       )
//     );
//     expect(actual.editing).toEqual({
//       ...obj,
//       outerPause: {
//         ...obj.outerPause,
//         variableId: 'asdf',
//       },
//     });
//   });

//   it('should handle change action.outerPause.roleKeyId', () => {
//     const obj = createSendKeyPressAction();

//     const preReducerState: ActionsState = {
//       saved: {},
//       editing: obj,
//       validationErrors: [],
//     };

//     const actual = actionReduxReducer(
//       preReducerState,
//       createSendKeyReduxAction(
//         'asdf',
//         ActionValueOperation.CHANGE_ROLE_KEY_ID,
//         SendKeyField.OUTER_PAUSE
//       )
//     );
//     expect(actual.editing).toEqual({
//       ...obj,
//       outerPause: {
//         ...obj.outerPause,
//         roleKeyId: 'asdf',
//       },
//     });
//   });

//   it('should handle action.outerPause.variableId invalidation', () => {
//     const obj = createSendKeyPressAction();
//     obj.outerPause.actionValueType = ActionValueType.USE_VARIABLE;
//     const preReducerState: ActionsState = {
//       saved: {},
//       editing: obj,
//       validationErrors: [],
//     };

//     const actual = actionReduxReducer(preReducerState, validateOuterPause());
//     expect(actual.validationErrors).toEqual([
//       outerPauseValidators.variable.error,
//     ]);
//   });

//   it('should handle action.outerPause.variableId validation', () => {
//     const obj = createSendKeyPressAction();
//     obj.outerPause.actionValueType = ActionValueType.USE_VARIABLE;
//     obj.outerPause.variableId = 'a';
//     const preReducerState: ActionsState = {
//       saved: {},
//       editing: obj,
//       validationErrors: [],
//     };

//     const actual = actionReduxReducer(preReducerState, validateOuterPause());
//     expect(actual.validationErrors).toEqual([]);
//   });

//   it('should handle action.outerPause.roleKeyId invalidation', () => {
//     const obj = createSendKeyPressAction();
//     obj.outerPause.actionValueType = ActionValueType.USE_ROLE_KEY;
//     const preReducerState: ActionsState = {
//       saved: {},
//       editing: obj,
//       validationErrors: [],
//     };

//     const actual = actionReduxReducer(preReducerState, validateOuterPause());
//     expect(actual.validationErrors).toEqual([
//       outerPauseValidators.roleKey.error,
//     ]);
//   });

//   it('should handle action.outerPause.roleKeyId validation', () => {
//     const obj = createSendKeyPressAction();
//     obj.outerPause.actionValueType = ActionValueType.USE_ROLE_KEY;
//     obj.outerPause.roleKeyId = 'a';
//     const preReducerState: ActionsState = {
//       saved: {},
//       editing: obj,
//       validationErrors: [],
//     };

//     const actual = actionReduxReducer(preReducerState, validateOuterPause());
//     expect(actual.validationErrors).toEqual([]);
//   });

//   it('should handle outerPause reset', () => {
//     const obj = createSendKeyPressAction();
//     const expectedEditing = createTestSendKeyPressAction(obj.id);
//     obj.outerPause.value = 123;
//     obj.outerPause.variableId = 'asdf';
//     obj.outerPause.roleKeyId = 'asdf';
//     /*
//      * It shouldn't be possible for the actionValue to actually get into
//      * this state where all 3 values are changed and both validation
//      * errors are present. This test just demonstrates that all of that
//      * data is cleared in a reset.
//      */
//     const preReducerState: ActionsState = {
//       saved: {},
//       editing: obj,
//       validationErrors: Object.values(outerPauseValidators).map((v) => v.error),
//     };

//     const actual = actionReduxReducer(preReducerState, resetOuterPause());

//     const expected: ActionsState = {
//       saved: {},
//       editing: expectedEditing,
//       validationErrors: [],
//     };

//     expect(actual).toEqual(expected);
//   });
// });

export {};

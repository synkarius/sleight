/**
 * ActionValueType is how a value gets assigned to an action:
 * <br> ENTER_VALUE: the value is hardcoded
 * <br> USE_VARIABLE: the value is assigned from a variable
 * <br> USE_ROLE_KEY: a variable is assigned from a role key
 */
export class ActionValueType {
    static readonly ENTER_VALUE = "Enter Value";
    static readonly USE_VARIABLE = "Use Variable";
    static readonly USE_ROLE_KEY = "Use Role Key";
    static readonly values = () => [
        ActionValueType.ENTER_VALUE, 
        ActionValueType.USE_VARIABLE, 
        ActionValueType.USE_ROLE_KEY
    ];
};
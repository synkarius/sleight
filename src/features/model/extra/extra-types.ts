// using an enum-like because actual TypeScript enums are madness
export class VariableType {
    static readonly TEXT = "Text";
    static readonly RANGE = "Range";
    static readonly CHOICE = "Choice";
    static readonly values = () => [VariableType.TEXT, VariableType.RANGE, VariableType.CHOICE];
};
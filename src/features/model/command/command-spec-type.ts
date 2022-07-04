export class CommandSpecType {
    static readonly SPEC = "Spec";
    static readonly ROLE_KEY = "Role Key";
    static readonly values = () => [
        CommandSpecType.SPEC, 
        CommandSpecType.ROLE_KEY
    ];
};
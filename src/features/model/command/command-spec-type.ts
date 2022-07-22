export class CommandSpecType {
  static readonly VARIABLE = 'Variable';
  static readonly ROLE_KEY = 'Role Key';
  static readonly values = () => [
    CommandSpecType.VARIABLE,
    CommandSpecType.ROLE_KEY,
  ];
}

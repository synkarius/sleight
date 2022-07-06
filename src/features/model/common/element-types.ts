export class ElementType {
  static readonly ACTION = 'Action';
  static readonly COMMAND = 'Command';
  static readonly CONTEXT = 'Context';
  static readonly ROLE_KEY = 'Role Key';
  static readonly SPEC = 'Spec';
  static readonly VARIABLE = 'Variable';
  static readonly values = () => [
    ElementType.ACTION,
    ElementType.COMMAND,
    ElementType.CONTEXT,
    ElementType.ROLE_KEY,
    ElementType.SPEC,
    ElementType.VARIABLE,
  ];
}

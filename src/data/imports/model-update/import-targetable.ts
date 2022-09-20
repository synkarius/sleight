import { Lockable, RoleKeyed } from '../../model/domain';

export interface ImportTargetable extends RoleKeyed, Lockable {}

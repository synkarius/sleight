import { Ided, Lockable, RoleKeyed } from '../../model/domain';

export interface ImportTargetable extends Ided, RoleKeyed, Lockable {}

import { Ided } from '../../domain'

export interface RoleKey extends Ided {
    value: string
}

export const createRoleKey = ():RoleKey => {
    return {
        id: crypto.randomUUID(),
        value: ''
    }
}
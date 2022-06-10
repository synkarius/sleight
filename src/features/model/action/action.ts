import { RoleKeyed, Named, Ided, Typed } from "../../domain";

export interface ActionItem extends Ided, Typed {}

export interface Action extends Ided, Named, RoleKeyed {
    items:ActionItem[]
}
import { RoleKeyed, Named } from "../../domain";
import { Extra } from "../extra/extra";

export interface Action extends RoleKeyed, Named {
    extras: Extra[]
}
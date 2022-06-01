import { RoleKeyed } from "../../domain";
import { Extra } from "../extra/extra";

export interface Spec extends RoleKeyed {
    selector: string,
    extras: Extra[]
}
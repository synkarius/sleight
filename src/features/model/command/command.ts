import { RoleKeyed, Named } from "../../domain";
import { Action } from "../action/action";
import { Context } from "../context/context";
import { Spec } from "../spec/spec";

export interface Command extends RoleKeyed, Named {
    spec: Spec,
    actions: Action[],
    contexts: Context[]
}
import { ApiKeyed, Named } from "../../domain";
import { Extra } from "../extra/extra";

export interface Action extends ApiKeyed, Named {
    extras: Extra[]
}
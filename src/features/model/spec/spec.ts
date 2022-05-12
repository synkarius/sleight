import { ApiKeyed } from "../../domain";
import { Extra } from "../extra/extra";

export interface Spec extends ApiKeyed {
    selector: string,
    extras: Extra[]
}
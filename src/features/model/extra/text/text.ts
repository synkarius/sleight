import { abstractCreateExtra, ApiKeyed, Ided, Identifiable, Named, Typed } from "../../../domain";
import { VariableType } from '../extra-types';

export interface Text extends ApiKeyed, Named, Ided, Typed {
}

export const createText = (from:Identifiable = null):Text => {
    return abstractCreateExtra(VariableType.TEXT, from);
}
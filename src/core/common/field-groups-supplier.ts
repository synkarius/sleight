import { VariableType } from '../../data/model/variable/variable-types';
import { ExhaustivenessFailureError } from '../../error/exhaustiveness-failure-error';
import {
  ActionValueFieldGroup,
  groupFieldsOf,
} from '../../ui/model/action/action-value-type-name-group';
import {
  bringAppPathGroup,
  bringAppStarDirGroup,
  bringAppTitleGroup,
} from '../../ui/model/action/bring-app/bring-app-action-value-field-group';
import { mimicWordsGroup } from '../../ui/model/action/mimic/mimic-action-value-field-group';
import {
  mMoveXGroup,
  mMoveYGroup,
  mMouseButtonGroup,
  mPauseGroup,
  mRepeatGroup,
  mDirectionGroup,
} from '../../ui/model/action/mouse/mouse-action-value-field-groups';
import { pSecondsGroup } from '../../ui/model/action/pause/pause-action-value-field-group';
import {
  skDirectionGroup,
  skInnerPauseGroup,
  skKeyToSendGroup,
  skOuterPauseGroup,
  skRepeatGroup,
} from '../../ui/model/action/send-key/send-key-action-value-field-groups';
import { stTextGroup } from '../../ui/model/action/send-text/send-text-action-value-field-group';
import {
  wfwExecutableGroup,
  wfwTitleGroup,
  wfwWaitSecondsGroup,
} from '../../ui/model/action/wait-for-window/wait-for-window-action-value-field-group';
import { Field } from '../../validation/validation-field';
import { maybe, Maybe } from './maybe';

export const enum FieldMetaDataType {
  TEXT,
  NUMBER,
  ENUM,
  ANY,
}

interface AbstractFieldMetaData {
  type: FieldMetaDataType;
  fields: Field[];
}

interface NumberFieldMetaData extends AbstractFieldMetaData {
  type: FieldMetaDataType.NUMBER;
  min?: number;
}

interface NonNumberFieldMetaData extends AbstractFieldMetaData {
  type: FieldMetaDataType.TEXT | FieldMetaDataType.ENUM | FieldMetaDataType.ANY;
}

/** Can't just use ActionValueFieldGroup b/c type of CFA parameters is not static. */
type FieldMetaData = NumberFieldMetaData | NonNumberFieldMetaData;

/** Since field metadata is needed by validators and elsewhere, need a way to query it.
 * By convention, the exhaustiveness-checking unit test for this will depend on
 * a naming convention for now.
 */
export type FieldGroupsSupplier = {
  getGroupByField: (field: Field) => Maybe<FieldMetaData>;
  getAllGroups(): FieldMetaData[];
};

export class DefaultFieldGroupsSupplier implements FieldGroupsSupplier {
  private map: Map<Field, FieldMetaData>;
  constructor() {
    this.map = new Map();
  }

  getGroupByField(field: Field): Maybe<FieldMetaData> {
    if (!this.map.size) {
      this.constructMapOnce();
    }
    return maybe(this.map.get(field));
  }

  getAllGroups(): FieldMetaData[] {
    return [
      this.convertFieldGroup(bringAppPathGroup),
      this.convertFieldGroup(bringAppTitleGroup),
      this.convertFieldGroup(bringAppStarDirGroup),
      this.createCFAMetadata(),
      this.convertFieldGroup(mimicWordsGroup),
      this.convertFieldGroup(mMoveXGroup),
      this.convertFieldGroup(mMoveYGroup),
      this.convertFieldGroup(mMouseButtonGroup),
      this.convertFieldGroup(mPauseGroup),
      this.convertFieldGroup(mRepeatGroup),
      this.convertFieldGroup(mDirectionGroup),
      this.convertFieldGroup(pSecondsGroup),
      this.convertFieldGroup(skKeyToSendGroup),
      this.convertFieldGroup(skOuterPauseGroup),
      this.convertFieldGroup(skInnerPauseGroup),
      this.convertFieldGroup(skRepeatGroup),
      this.convertFieldGroup(skDirectionGroup),
      this.convertFieldGroup(stTextGroup),
      this.convertFieldGroup(wfwTitleGroup),
      this.convertFieldGroup(wfwExecutableGroup),
      this.convertFieldGroup(wfwWaitSecondsGroup),
    ];
  }

  private createCFAMetadata() {
    return {
      type: FieldMetaDataType.ANY,
      fields: [
        Field.AC_CALL_FUNC_PARAMETER_RADIO,
        Field.AC_CALL_FUNC_PARAMETER_VALUE,
        Field.AC_CALL_FUNC_PARAMETER_VAR,
      ],
    };
  }

  private constructMapOnce(): void {
    const all = this.getAllGroups();
    for (const group of all) {
      group.fields.forEach((key) => this.map.set(key, group));
    }
  }

  private convertFieldGroup(group: ActionValueFieldGroup): FieldMetaData {
    const groupType = group.type;
    switch (groupType) {
      case VariableType.Enum.TEXT:
        return {
          type: FieldMetaDataType.TEXT,
          fields: groupFieldsOf(group),
        };
      case VariableType.Enum.NUMBER:
        return {
          type: FieldMetaDataType.NUMBER,
          fields: groupFieldsOf(group),
          min: group.min,
        };
      case VariableType.Enum.ENUM:
        return {
          type: FieldMetaDataType.ENUM,
          fields: groupFieldsOf(group),
        };
      default:
        throw new ExhaustivenessFailureError(groupType);
    }
  }
}

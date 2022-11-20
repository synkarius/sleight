import { Container } from 'brandi';
import { DefaultFieldGroupsSupplier } from '../../../core/common/field-groups-supplier';
import { Tokens } from '../brandi-tokens';

export const bindFieldGroupsSupplier = (container: Container): void => {
  container
    .bind(Tokens.FieldGroupsSupplier)
    .toInstance(DefaultFieldGroupsSupplier)
    .inSingletonScope();
};

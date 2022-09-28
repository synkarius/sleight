import { Container } from 'brandi';
import { DefaultRoleKeyedDataUpdater } from '../../../data/imports/model-update/rolekeyed-data-updater';
import { Tokens } from '../brandi-tokens';

export const bindRoleKeyedDataUpdater = (container: Container): void => {
  container
    .bind(Tokens.RoleKeyedDataUpdater)
    .toInstance(DefaultRoleKeyedDataUpdater)
    .inSingletonScope();
};

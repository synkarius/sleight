import { useContext } from 'react';
import { SpellData } from '../../core/mappers/spell/spell-data';
import { saveAction } from '../../core/reducers/action-reducers';
import { saveCommand } from '../../core/reducers/command-reducers';
import { saveSelector } from '../../core/reducers/selector-reducers';
import { saveSpec } from '../../core/reducers/spec-reducers';
import { isSelectorSpecItem } from '../../data/model/spec/spec-domain';
import { Tokens } from '../../di/config/brandi-tokens';
import { InjectionContext } from '../../di/injector-context';
import { useAppDispatch } from '../hooks';

export const useSaveSpell = (): ((spellData: SpellData) => void) => {
  const container = useContext(InjectionContext);
  const reduxDispatch = useAppDispatch();

  return (spellData) => {
    const specMapper = container.get(Tokens.DomainMapper_Spec);
    const selectorMapper = container.get(Tokens.DomainMapper_Selector);
    spellData.spec.items
      .filter(isSelectorSpecItem)
      .map((specItem) => selectorMapper.mapFromDomain(specItem.selector))
      .forEach((selectorDTO) => reduxDispatch(saveSelector(selectorDTO)));
    reduxDispatch(saveSpec(specMapper.mapFromDomain(spellData.spec)));
    reduxDispatch(saveAction(spellData.action));
    reduxDispatch(saveCommand(spellData.command));
  };
};

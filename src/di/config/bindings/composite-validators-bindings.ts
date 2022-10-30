import { Container, injected } from 'brandi';
import { ActionCompositeValidator } from '../../../data/composite-validators/single-item/action-composite-validator';
import { CommandCompositeValidator } from '../../../data/composite-validators/single-item/command-composite-validator';
import { ContextCompositeValidator } from '../../../data/composite-validators/single-item/context-composite-validator';
import { FnCompositeValidator } from '../../../data/composite-validators/single-item/fn-composite-validator';
import { SpecCompositeValidator } from '../../../data/composite-validators/single-item/spec-composite-validator';
import { VariableCompositeValidator } from '../../../data/composite-validators/single-item/variable-composite-validator';
import { DefaultTotalCompositeValidator } from '../../../data/composite-validators/total/default-total-data-composite-validator';
import { Tokens } from '../brandi-tokens';

export const bindCompositeValidators = (container: Container): void => {
  container
    .bind(Tokens.ActionCompositeValidator)
    .toInstance(ActionCompositeValidator)
    .inSingletonScope();
  injected(ActionCompositeValidator, Tokens.Validators_Action);
  container
    .bind(Tokens.CommandCompositeValidator)
    .toInstance(CommandCompositeValidator)
    .inSingletonScope();
  injected(CommandCompositeValidator, Tokens.Validators_Command);
  container
    .bind(Tokens.ContextCompositeValidator)
    .toInstance(ContextCompositeValidator)
    .inSingletonScope();
  injected(ContextCompositeValidator, Tokens.Validators_Context);
  container
    .bind(Tokens.FnCompositeValidator)
    .toInstance(FnCompositeValidator)
    .inSingletonScope();
  injected(FnCompositeValidator, Tokens.Validators_Fn);
  container
    .bind(Tokens.SpecCompositeValidator)
    .toInstance(SpecCompositeValidator)
    .inSingletonScope();
  injected(SpecCompositeValidator, Tokens.Validators_Spec);
  container
    .bind(Tokens.VariableCompositeValidator)
    .toInstance(VariableCompositeValidator)
    .inSingletonScope();
  injected(VariableCompositeValidator, Tokens.Validators_Variable);
  container
    .bind(Tokens.TotalDataCompositeValidator)
    .toInstance(DefaultTotalCompositeValidator)
    .inSingletonScope();
  injected(
    DefaultTotalCompositeValidator,
    Tokens.ActionCompositeValidator,
    Tokens.CommandCompositeValidator,
    Tokens.ContextCompositeValidator,
    Tokens.FnCompositeValidator,
    Tokens.SpecCompositeValidator,
    Tokens.VariableCompositeValidator,
    Tokens.DomainMapper_Action,
    Tokens.DomainMapper_Command,
    Tokens.DomainMapper_Context,
    Tokens.DomainMapper_Fn,
    Tokens.DomainMapper_Spec,
    Tokens.DomainMapper_Variable
  );
};

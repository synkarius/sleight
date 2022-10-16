import { ActionDomainMapperDelegate } from '../core/mappers/action-mapper-delegates/action-domain-mapper-delegate';
import { DragonflyActionPrinterDelegate } from '../data/exports/dragonfly/element-printers/action-printer-delegates/action-printer-delegate';
import { IdRewriter } from '../data/imports/model-update/id-rewriter/id-rewriter';
import { Action } from '../data/model/action/action';
import { Context } from '../data/model/context/context';
import { Fn } from '../data/model/fn/fn';
import { SelectorDTO } from '../data/model/selector/selector-dto';
import { SpecDTO } from '../data/model/spec/spec-dto';
import { VariableDTO } from '../data/model/variable/variable-dto';

/* Presently, there is not a great way to inject arrays of items with Brandi.js.
 * As a workaround, you can inject an array with the items, and then inject the
 * array into the real target.
 *
 * That's what these array classes are for: they're a workaround for this issue.
 * See https://github.com/vovaspace/brandi/issues/27 for updates.
 */

// id rewriters
export class ActionIdRewriterArray extends Array<IdRewriter<Action>> {}
export class ContextIdRewriterArray extends Array<IdRewriter<Context>> {}
export class FnIdRewriterArray extends Array<IdRewriter<Fn>> {}
export class SelectorIdRewriterArray extends Array<IdRewriter<SelectorDTO>> {}
export class SpecIdRewriterArray extends Array<IdRewriter<SpecDTO>> {}
export class VariableIdRewriterArray extends Array<IdRewriter<VariableDTO>> {}
// Dragonfly Action Printer Delegates
export class DragonflyActionPrinterDelegateArray extends Array<DragonflyActionPrinterDelegate> {}
// Action Mapper Delegates
export class ActionDomainMapperDelegateArray extends Array<ActionDomainMapperDelegate> {}

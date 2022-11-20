import { dragonflyNegativizer } from './dragonfly-template-negativizer';
import { dragonflyTemplateSupportFns } from './dragonfly-template-support-fns';

export const dragonflyTemplate = `from dragonfly import Dictation
from dragonfly import ShortIntegerRef
from dragonfly import Choice
#
from dragonfly import AppContext
#
from dragonfly import BringApp
from dragonfly import Function
from dragonfly import Mimic
from dragonfly import Mouse
from dragonfly import Pause
from dragonfly import Key
from dragonfly import Text
from dragonfly import WaitWindow
#
from dragonfly import MappingRule
from dragonfly import Grammar
#
from dragonfly import RuleWrap
from dragonfly import RuleRef
#
{{#importFns}}
{{#printFnImport}}{{id}}{{/printFnImport}}
{{/importFns}}

${dragonflyTemplateSupportFns}

{{#wrapperFns}}
{{#printNegativizerWrapper}}{{id}}{{/printNegativizerWrapper}}
{{/wrapperFns}}

${dragonflyNegativizer}

{{#rules}}
{{#context}}
{{contextName}}_context = {{#printContext}}{{id}}{{/printContext}}
{{contextName}}_grammar = Grammar("{{contextName}}_grammar", context={{contextName}}_context)
{{/context}}
{{^context}}
{{contextName}}_grammar = Grammar("{{contextName}}_grammar")
{{/context}}
{{contextName}}_rule = MappingRule(
    name="{{contextName}}_rule",
    mapping={
        {{#commands}}
        {{#printCommand}}{{id}}{{/printCommand}}
        {{/commands}}
    },
    extras=[
        {{#extras}}
        {{#printVariable}}{{id}}{{/printVariable}},
        {{/extras}}
    ],
    defaults={
        {{#defaults}}
        {{#printDefault}}{{id}}{{/printDefault}},
        {{/defaults}}
        {{#extras}}
        {{#printNegativizerDefault}}{{id}}{{/printNegativizerDefault}}
        {{/extras}}
    }
)
{{/rules}}

{{#rules}}
{{contextName}}_grammar.add_rule({{contextName}}_rule)
{{contextName}}_grammar.load()
{{/rules}}

def unload():
    {{#rules}}
    global {{contextName}}_grammar
    if {{contextName}}_grammar: {{contextName}}_grammar.unload()
    {{contextName}}_grammar = None
    {{/rules}}
`;

const elemNameSuffix = '{{#replaceNonAlphanum}}{{id}}{{/replaceNonAlphanum}}';

export const dragonflyCompactTemplate = `from dragonfly import Dictation
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


no_context_grammar = Grammar("no_context_grammar")
no_context_rule = MappingRule(
    name="no_context_rule",
    mapping={
        {{#commands}}
        {{#printCommand}}{{id}}{{/printCommand}}
        {{/commands}}
    },
    extras=[
        {{#variables}}
        {{#printVariable}}{{id}}{{/printVariable}},
        {{/variables}}
    ],
    defaults={

    }
)

no_context_grammar.add_rule(no_context_rule)
no_context_grammar.load()


{{#contexts}}
context_${elemNameSuffix} = {{#printContext}}{{id}}{{/printContext}}
context_${elemNameSuffix}_grammar = Grammar("context_${elemNameSuffix}", context=context_${elemNameSuffix})
{{/contexts}}

def unload():
    global no_context_grammar
    if no_context_grammar: no_context_grammar.unload()
    no_context_grammar = None
`;

const elemNameSuffix = '{{#replaceNonAlphanum}}{{name}}{{/replaceNonAlphanum}}';

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

# specs
{{#specs}}
spec_${elemNameSuffix} = "{{#printSpec}}{{id}}{{/printSpec}}"
{{/specs}}

# extras
{{#variables}}
variable_${elemNameSuffix} = {{#printVariable}}{{id}}{{/printVariable}}
{{/variables}}

# contexts
{{#contexts}}
context_${elemNameSuffix} = {{#printContext}}{{id}}{{/printContext}}
{{/contexts}}

# actions
{{#actions}}
action_${elemNameSuffix} = {{#printAction}}{{id}}{{/printAction}}
{{/actions}}
`;

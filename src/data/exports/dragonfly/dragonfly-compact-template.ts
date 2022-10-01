const elemNameSuffix = '{{#replaceNonAlphanum}}{{name}}{{/replaceNonAlphanum}}';

export const dragonflyCompactTemplate = `
from dragonfly import Dictation
from dragonfly import ShortIntegerRef
from dragonfly import Choice
from dragonfly import AppContext

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
action_${elemNameSuffix} = None
{{/actions}}
`;

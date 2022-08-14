const selectorVarName = 'selector_{{#removeDashes}}{{id}}{{/removeDashes}}';

export const dragonflyCompactTemplate = `



{{#selectors}}
${selectorVarName} = "{{#trim}} {{#printSelectorItems}}{{id}}{{/printSelectorItems}} {{/trim}}"
{{/selectors}}


`;

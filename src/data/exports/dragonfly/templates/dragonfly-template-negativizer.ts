export const dragonflyNegativizer = `

# method from section 3.2.2 of Dragonfly docs
negativizer_choice = Choice("", { "{{negativizer}}": "-" })
negativizer_default = "+"
negativizer_rule = RuleWrap("", negativizer_choice).rule
# now can reuse the 'negativizer_choice' extra as
# RuleRef(negativizer_rule, "nx"),
# RuleRef(negativizer_rule, "ny"),
# etc. in MappingRule's 'extras'
`;

# Sleight Design Notes

## The Data Model

### Similarities and Differences with Dragonfly

The Sleight data model is similar to Dragonfly's, but has abstracted some things away from the user. Specifically, there is no concept of a grammar or a rule in Sleight.

Likewise, the idea of a selector is only implicit in Dragonfly, and role keys don't exist in the Dragonfly model.

Those differences aside, both have: commands, specs, actions, variables ("extras" in Dragonfly), and contexts. These elements are also common in other voice recognition frameworks.

### Mappers

Redux is a tool which handles global state, which is to say, state that needs to be accessed from DOM nodes which have no parent/child relation to each other. For state local to a React component, React's `useReducer` hook is more appropriate. (TODO: cite docs for both.)

Keeping the state for Sleight's elements local during editing has the benefit that intermediate or invalid state is never saved. This makes it easier to reason about what's in Redux for operations like validation and export.

That said, some of the elements (choice variables and specs specifically) are cross- React slice _and_ need to be editable on the fly rather than by switching screens. This means that the data model for their editing screens will be slightly different than it will be for Redux. Hence, mappers are used to translate between the two data models.

#### Sleight Data Sharing

Role keys allow users to share Sleight data. Let's say a user creates a set of Sleight elements and adds role keys to all of them. Another user can import this set of role-keyed elements and immediately apply them to another set of elements. That's a bit abstract. Here are some examples.

- Replacing English role-keyed specs with Spanish role-keyed specs.
- Replacing macOS role-keyed actions with Linux role-keyed actions.

#### Grammar Update Resilience

TODO this section.

## Other Notes

- functions
  - security implications
    - blessed set
    - discoverability
  - registation file
- share vs export distinction
  - share json files
  - export python files
- versioning

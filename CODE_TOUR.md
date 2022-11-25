# A Guided Tour of Sleight's Code

## The Data Model

Before getting into how Sleight works as an application, let's take a moment to get acquainted with its data model.

Sleight is centered around the concept of a `Command`.

### Commands

A `Command` is something very simply "something you say and something that happens". For example, you say "alpha" and the key "A" is pressed / sent.

### Specs

A `Spec` is the "something you say" part of a command. Some examples might include:

- "close this window"
- "open my email application"
- "double click"

### Variables

Sometimes a spec might include a `Variable`: a choice of things to say as part of the spec. Some examples might include numbers, directions, or letters:

- "press \<some number\>"
- "find words starting with \<some letter\>"
- "turn page \<left/right\>"

### Selectors

A `Selector` is a variable or non-variable chunk of a spec. In the spec "press \<some number\>", there are two selectors: "press" and "\<some number\>". It is useful to break specs apart like this for a few reasons.

1. Validating / processing a spec's variables is easier and less error prone if you don't have to parse strings.
2. Programmatically mass editing specs is likewise easier without parsing strings.

### Actions

An `Action` is the "something that happens" part of a command. This includes key presses, mouse clicks, function calls, etc.

### Contexts

A `Context` is _where_ a command or set of commands is applicable. For example, the command "spellcheck" is not relevant if you're playing chess, and the command "D3 to D4" is not relevant if you're writing emails. Therefore, if possible, in order to reduce command spec-space pollution, commands should only be available in their appropriate contexts, not everywhere. (Of course, sometimes that appropriate context _is_ the global context, like the command "open X application".)

## Kinds of Things

Sleight's code, roughly speaking, consists of four different kinds of things.

### Types and Data

There are lots of files which are just TypeScript type definitions, type guards, and type-related convenience functions. These are mostly React/Redux reducer `type` definitions and [Sleight data](#the-data-model) type definitions.

### React Components

The UI: these are pretty standard. If you know React, you'll be right at home.

### Business Logic Classes

As much as possible, business logic has been kept out of the React components. This increases both reusability and readability. Examples of such business logic classes include:

- [validators](#validators)
- [import and export](#import-and-export)
- [mappers](#mappers)
- etc.

### Reducers

Both Redux and React's `useReducer` are used in Sleight (where each is [appropriate](https://redux.js.org/faq/organizing-state#organizing-state)).

Sleight's take on Redux vs `useReducer`: it should be used locally to handle and validate intermediate state changes. Intermediate / invalid data should not be saved in Redux. This makes it easier to reason about the overall state of the data for operations like validation and export: it may be temporarily invalid within a React component, but it isn't saved that way.

For simplicity, Sleight keeps both kinds of reducer functions in the same files.

## Business Logic

### Dependency Injection

In order to manage the many moving parts which make up Sleight, [Brandi.js](https://brandi.js.org) is used for dependency injection. Thus, a good place to find things is in the `/src/di` directory, where all the Brandi tokens and bindings are.

### Common Business Logic Class Types

This section lists some of the most common kinds of business logic classes used throughout Sleight.

#### Mappers

The way Sleight works internally should not drive its external data model (or its API once that gets implemented). Therefore, there are actually _two_ versions of its data model, the internal version and the external version. This allows the internal representation to change as needed without adding new (immutable) versions to the external representation.

For now, because parts of the internal and external model are identical, the difference is denoted by a "DTO" suffix -- external-only types end in "DTO". (For example, there is the "VariableDTO" external `type` vs the "Variable" internal type.)

All that said, there must exist some procedure to map back and forth between the two models. This is what the `*Mapper` classes are for.

#### Validators

There are lots of ways to make voice command data inconsistent. For example, you could have an action which uses a variable, but not provide that variable in the spec which activates that action in a command.

The `*Validator`s prevent this kind of data corruption at the form level and also during import.

Note: originally, most business logic classes were written as objects which implemented types or interfaces rather than classes. As the need for dependency injection grew, most were changed to class-based implementations. The validators were not, for no other reason than time, and will be changed over in the future.

#### Import and Export

The json import and framework export processes are somewhat complex and involve many steps, such as:

- validating input files
- converting / merging import data
- enforcing the locked/enabled/role key targeting system
- printing Sleight data as commands for other software

These processes have been broken down into smaller manageable chunks as much as possible, which has resulted in an explosion of smaller, simpler files.

A good place to start with the entire import / export process is `Navigation.tsx`.

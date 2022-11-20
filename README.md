# Sleight

Sleight is a tool that lets you make and edit speech commands for other (free) software without knowing Python/etc.

### What Other Software?

[Dragonfly](https://dragonfly2.readthedocs.io) to start, but other frameworks are on the roadmap. (See the roadmap section below.)

## What Problems Does this Solve?

Creating voice commands in Python/ Vocola/ Talon is fairly technical. Sleight aims to lower the bar for all and increase velocity for power users.

Along with these productivity goals, Sleight is looking to improve [shareability/portability](#todo-export-formats) of voice commands and [grammar resilience](#todo-lockability) against framework changes/ updates.

## Where It's At Now

Sleight is very much alpha software at this point. Though it already supports a subset of the Dragonfly specification and can export full Dragonfly rules, there is much which needs to be done.

### Help Wanted

There are various ways you can contribute to Sleight:

- giving feedback: see the [feedback](#feedback) section below.
- expanding/narrowing/ordering the roadmap
- writing documentation
- code contributions
- demos (YouTube/etc.)

### Feedback

Sleight needs:

- bug reports
- UI/UX improvement suggestions
- validation suggestions
  - are there ways to create or import invalid data which Sleight allows?
- feature requests
  - please have _lots_ of patience here
    - alternatively, open a PR ;)
- TypeScript/React best practices suggestions

## Roadmap Thus Far

This is a very rough roadmap at this point, and not necessary in order of importance.

- documentation
- demos
- keyboard shortcuts (customizable)
- exports to other frameworks
  - Caster
  - Vocola
  - Talon
- model changes
  - follow immutable model principle
    - model version adapters
  - aim to provide common "primitives" rather than implement any particular framework's specification
    - add more
    - simplify existing `Action`s
  - get away from resemblance to Dragonfly's model
- web API
  - read-only at first
- cleanup
  - code
  - UI/UX

## Design Philosophy

Sleight has thus far been designed with "strong opinions loosely held". Among them are the following.

### Libraries Usage Should Be Minimized

Sometimes bringing in a library is the best solution, but especially in the JS world, churn is high and packages break often. Therefore, to minimize maintenance, adequate consideration has to be given to the question of when to build versus when to "buy".

The approach that Sleight has taken thus far has been to mostly keep `packages.json` small, building simple utilities for simple jobs and including only a handful of libraries.

### Optimize for Popularity

When choosing a library or a framework, there are multiple ways to decide what's best. You could opt for performance, ergonomics, stability, or any number of other attributes.

Sleight is a project in its infancy, so it has thus far optimized for popularity: React over Vue or Angular; Electron over Tauri; etc. The main idea here is that using popular choices will have the best chance of attracting code contributors.

Popular choices will also likely be decent choices, even if they're not the best choices.

### TypeScript

Versus JavaScript? No competition.

### React Testing Library

RTL's philosophy overlaps (and inspired) Sleight's in two aspects.

1. Tests should access the DOM in the same way the user does. This seems like an obvious accessibility benefit, and forces the developer to care about accessibility if they care about testing.
2. Functional tests provide greater flexibility than unit tests. Fixing unit tests which broke because underlying implementations changed isn't a great use of anyone's time. Unit tests are necessary and useful, but should mainly cover implementation details which overly complicate functional tests.

## Running the Project

In the project directory, you can run:

### `npm run react-start`

This will run the app in the development mode.

You can then open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### `npm run react-test`

This launches the test runner in the interactive watch mode.
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes.

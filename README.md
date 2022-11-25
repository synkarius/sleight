# Sleight

Sleight is a tool that lets you make and edit speech commands for other software without knowing Python / etc.

### What Other Software?

[Dragonfly](https://dragonfly2.readthedocs.io) to start, but other frameworks are on the roadmap. (See the roadmap section below.)

## What Problems Does this Solve?

### Increased Productivity

Creating voice commands in [Dragonfly](https://dragonfly2.readthedocs.io) / [Caster](https://caster.readthedocs.io) / [Vocola](http://vocola.net/v2) / [Talon](https://talonvoice.com) is fairly technical and error prone. Sleight aims to lower the bar to voice command editing / usage for all and increase velocity for power users.

### Shareability / Portability

Over the past few decades, numerous voice command systems have appeared. The syntax that their commands use seems to always converge on something structurally similar. So, at the risk of [xkcd 927](https://xkcd.com/927), Sleight aims to develop and unify that structure through a common data model.

This voice command data model should be shareable, human-readable, extensible, and accomodating of most common voice command needs / usages.

### Grammar Resilience (Merge Conflicts)

The aforementioned frameworks' users often publish sets of commands for others to use.

Let's say you download one of those command sets, and then both you and the author make changes separately. Suppose one of those changes was that both of you changed the same command. You see some of the author's other changes and want them, but you don't want the change to the command that you both changed. This is a "grammar resilience" problem (more commonly known as a merge conflict). Developers solve this with `git` and merge conflict resolution tools, but with a data model as simple as Sleight's, easier solutions (like [granular element lockability](#locked-enabled-and-role-keys)) become feasible.

## Where It's At Now

Sleight is very much alpha software at this point. Though it already supports a subset of the Dragonfly specification and can export full Dragonfly rules, there is much which needs to be done.

### Help Wanted

There are various ways you can contribute to Sleight:

- giving feedback: see the [feedback](#feedback) section below.
- expanding / narrowing / organizing / reworking / ordering the [roadmap](#roadmap-thus-far)
- writing documentation
- code contributions
- demos (YouTube / etc.)

### Feedback

Sleight needs:

- bug reports
- UI / UX improvement suggestions
- validation suggestions
  - are there ways to create or import invalid data which Sleight allows?
- feature requests
  - please have _lots_ of patience here
    - alternatively, open a PR ;)
- TypeScript / React best practices suggestions

## Roadmap Thus Far

This is a very rough roadmap at this point, and not in any particular order.

### UX Improvements

- documentation
- demos
- keyboard shortcuts (customizable)
- more themes / theme switching
- validators offer simple solutions where possible

### Exports to Other Frameworks

- Caster
- Talon
- Vocola
- ???

### Interoperability

- web API
  - read-only at first

### DX Improvements

- documentation
- code cleanup
- more/better logging

### Tech Debt Paydown

- model changes
  - follow immutable model principle
    - model version adapters
  - aim to provide common "primitives" rather than implement any particular framework's specification
    - add more actions
    - simplify existing actions

## Installing Sleight

See the [releases](https://github.com/synkarius/sleight/releases) section for installers / release notes.

## For Devs

### Design Notes

Sleight has thus far been designed with "strong opinions loosely held". See [DESIGN.md](DESIGN.md) for details.

### A Guided Tour of the Code

Where is everything? [Take the tour](CODE_TOUR.md).

### Running the Project

You will need to install `npm`.

Then, in the project directory, you can run:

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

## Locked, Enabled, and Role Keys

The following explains the sharing and resilience features.

### Role Keys

Any Sleight element can be tagged with a `role key`. This allows it to be targeted for update by an import of other Sleight data.

(Role keys must be unique. This is enforced by validators.)

Once an element is tagged, it is targeted for override by an element of the same type and role key in a future import.

This lets command set authors provide commands for users which can be improved or changed later. Examples of such changes might include:

- replacing English role-keyed specs with Spanish role-keyed specs
- replacing macOS role-keyed actions with Linux role-keyed actions

### Locked

Any Sleight element should be able to be locked. This means that it will not be targeted for update even though it has a role key.

This provides users a way to opt-out of specific parts of command set updates without having to deal with something like a merge conflict.

A user could also just remove the role key from the element they want to edit and opt-out of updates for.

### Enabled

Any Sleight element should be able to be enabled for export. Sleight data which is not enabled will not be exported.

(TODO: the enabled flag isn't implemented yet, so everything gets exported.)

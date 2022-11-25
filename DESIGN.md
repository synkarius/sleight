# Design Philosophy

The following principles are neither comprehensive nor final.

## Libraries Usage Should Be Minimized

Sometimes bringing in a library is the best solution, but especially in the JavaScript world, churn is high and packages break often. Therefore, to minimize maintenance, adequate consideration has to be given to the question of when to build versus when to "buy".

The approach that Sleight has taken thus far has been to mostly keep `packages.json` small, building simple utilities for simple jobs and including only a handful of libraries.

## Optimize for Popularity

When choosing a library or a framework, there are multiple ways to decide what's best. You could opt for performance, ergonomics, stability, or any number of other attributes.

Sleight is a project in its infancy, so it has thus far optimized for popularity: React over Vue or Angular; Electron over Tauri; etc. The main idea here is that using popular choices will have the best chance of attracting code contributors.

Popular choices will also likely be decent choices, even if they're not the best choices.

## React Testing Library

RTL's philosophy overlaps (and inspired) Sleight's in two aspects.

1. Tests should access the DOM in the same way the user does. This seems like an obvious accessibility benefit, and forces the developer to care about accessibility if they care about testing.
2. Functional tests provide greater flexibility than unit tests. Fixing unit tests which broke [because underlying implementations changed](https://testing.googleblog.com/2015/01/testing-on-toilet-change-detector-tests.html) isn't a great use of anyone's time. Unit tests are necessary and useful, but should mainly cover implementation details which overly complicate functional tests.

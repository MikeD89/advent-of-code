# Advent of Code
This repository contains my solutions for [Advent of Code](https://adventofcode.com) problems. All solutions are implemented in TypeScript and JavaScript, runnable with modern Node.js.

This is based of T-Hugs' [Advent of Code Template](https://github.com/T-Hugs/advent-of-code)

  * Solutions are contained in the `years/<year>/<day>/index.ts` file. A solution file contains both part 1 and part 2. The data for the problem is saved in a sibling file `data.txt`.
  * Every time a solution is run, the result is cached. The most recently-computed solution is *always* the one that is submitted when `submit.ts` is run.
  * Use the following command to suck down all data for the current year and seed the solution files: `ts-node init suck seed`.
  * The script `run.ts` is intended to make it easy to run any given solution file.  `ts-node run 2019 1` - runs the solution for problem 1 of year 2019
  * All you have to do is run `ts-node submit`. This will submit your *most-recently-computed` solution. 

## Utilities

A file, `util/util.ts` is included with a hodge-podge of functions that may be useful, including:

  * clamp - combine Math.min and Math.max
  * mod - implements the modulo function (as opposed to remainder, which is what `%` is, and produces different results for negative inputs)
  * gcd - greatest common divisor
  * gcdExtended - Google it
  * lcm - least common multiple
  * modInverse
  * modDivide
  * powerMod
  * getPermutations - computes the set of permutations for a given input array
  * powerSet
  * countUniqueElements - Returns the count of each unique element in the array. Think counting each occurrence of a letter in a string.
  * max/min - accepts a map function and returns both the index and value of the max/min element in an array.
  * md5 - early AoC problems relied heavily on getting MD5 digests

Another file, `util/grid.ts`, contains a *very* useful Grid class that can be used in countless AoC problems, including cellular automata helpers. I recommend you take a look at `grid.ts` to get familiar with it - it is well-commented. See the test cases at the end of the file for some examples. You can also directly run `ts-node util/grid` to run the tests/examples.

And finally, the file `util/graph.ts` contains these functions to help with graph and tree traversal:

* topoSort - topological sort
* bfTraverse - lazily traverse a graph breadth-first
* bfSearch - breadth-first search

And finally, `package.json` includes some dependencies from npm that may be useful:

* lodash
* a-star - I really like the API for this one so I've made TypeScript types for it - see `util/@types/global/index.d.ts`.
* fast-levenshtein
* js-combinatorics - Some functions in here probably obviate ones in `util/util.ts`.
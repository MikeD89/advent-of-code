import _, { add, replace } from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2021;
const DAY = 14;
const debug = false;

// solution path: D:\Work\advent-of-code\years\2021\14\index.ts
// data path    : D:\Work\advent-of-code\years\2021\14\data.txt
// problem url  : https://adventofcode.com/2021/day/14

function getChar(obj: Map<string, number>, max: boolean) {
	let b = 0;
	let c = '';
	
	if(max) {
		obj.forEach((v, n) => { if (v>b) {b=v; c=n}});
	} else{
		b = 99999999999999999999999999;
		obj.forEach((v, n) => { if (v<b) {b=v; c=n}});
	}
	return [c, b];
  }

function inc(polymers: Map<string, number>, val: string, n: number) {
	const c = polymers.get(val);
	if(c !== undefined) {
		polymers.set(val, c+n);
	} else {
		polymers.set(val, n);
	}
}

type data = {
	polymers: Map<string, number>,
	replacement:  Map<string, string[]>
}
function loadData(input: string): data {
	const data = input.split("\n");
	const line = data[0]
	const polys = data.splice(2).map(d => d.split(" -> "));

	const polymers = new Map<string, number>();
	const replacement = new Map<string, string[]>();

	for(let [p, r] of polys) {
		replacement.set(p, [p[0] + r, r + p[1]]);
	}

	for(let i = 0; i < line.length - 1; i++) {
		const a = line[i];
		const b = line[i+1];
		inc(polymers, a+b, 1);
	}

	return {polymers, replacement};
}

function cycle(polymers: Map<string, number>, replacement: Map<string, string[]>) {
	const newPolymers = new Map<string, number>();
	
	for(let [key, value] of polymers) {
		if(value > 0) {
			for(const r of replacement.get(key) ?? []) {
				inc(newPolymers, r, value);
			}
		}
	}

	return newPolymers;
}

function count(polymers: Map<string, number>) {
	const characters = new Map<string, number>();
	for(let [key, value] of polymers) {
		inc(characters, key[0], value);
		inc(characters, key[1], value);
	}

	for(let [key, value] of characters) {
		characters.set(key, Math.ceil(value / 2))
	}
	return characters;
}

function doTheThing(input: string, times: number) {
	let {polymers, replacement} = loadData(input);

	for(let i =0; i< times; i++ ){
		polymers = cycle(polymers, replacement);
	}

	const c = count(polymers);
	const min = getChar(c, false);
	const max = getChar(c, true);

	return Number(max[1])-Number(min[1]);
}

async function p2021day14_part1(input: string, ...params: any[]) {
	return doTheThing(input, 10)
}

async function p2021day14_part2(input: string, ...params: any[]) {
	return doTheThing(input, 40)
}

async function run() {
	const iD = [
"NNCB",
"",
"CH -> B",
"HH -> N",
"CB -> H",
"NH -> C",
"HB -> C",
"HC -> B",
"HN -> C",
"NN -> C",
"BH -> H",
"NC -> B",
"NB -> B",
"BN -> B",
"BB -> N",
"BC -> B",
"CC -> N",
"CN -> C",
	].join("\n")
	const part1tests: TestCase[] = [{
		input: iD,
		expected: "1588"
	}];
	const part2tests: TestCase[] = [{
		input: iD,
		expected: "2188189693529"
	}];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day14_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day14_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	if (debug) return;

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day14_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2021day14_part2(input));
	const part2After = performance.now();

	logSolution(14, 2021, part1Solution, part2Solution);

	log(chalk.gray("--- Performance ---"));
	log(chalk.gray(`Part 1: ${util.formatTime(part1After - part1Before)}`));
	log(chalk.gray(`Part 2: ${util.formatTime(part2After - part2Before)}`));
	log();
}

run()
	.then(() => {
		process.exit();
	})
	.catch(error => {
		throw error;
	});

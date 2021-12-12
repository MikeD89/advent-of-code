import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { Grid, Cell } from "../../../util/grid";
import { Stack } from "stack-typescript";
import { exit } from "process";

const YEAR = 2021;
const DAY = 9;

// solution path: D:\Work\advent-of-code\years\2021\09\index.ts
// data path    : D:\Work\advent-of-code\years\2021\09\data.txt
// problem url  : https://adventofcode.com/2021/day/9
function getData(c: Cell) {
	return {
		"n": Number(c.north()?.value ?? 999999999),
		"e": Number(c.east()?.value ?? 9999999999),
		"w": Number(c.west()?.value ?? 9999999999),
		"s": Number(c.south()?.value ?? 999999999),
		"v": Number(c.value),
		"c": c
	}
}

async function p2021day9_part1(input: string, ...params: any[]) {
	let r = 0;

	const g = new Grid({
		serialized: input
	});

	for (let c of g) {
		const d = getData(c);
		if(d.v < d.n && d.v < d.e && d.v < d.w && d.v < d.s) {
			r += (1 + d.v);
		}
	}

	return r;
}

function calcBasin(cell: Cell, checked:  number[], legit: number[]) {
	// Add current cell
	legit.push(cell.index);
	checked.push(cell.index);

	// get all other cells
	const n = cell.north();
	const s = cell.south();
	const e = cell.east();
	const w = cell.west();
	const others = [n, s, e, w]
		.filter((item): item is Cell => !!item)
		.filter(i=>i.value !== "9")

	for(let other of others) {
		const thisN = Number(cell.value) 
		const otherN = Number(other.value)

		// been here before?
		if(checked.includes(other.index)) {
			continue;
		}

		// not a dip?
		if(otherN < thisN) {
			continue;
		}

		// recurse!
		calcBasin(other, checked, legit);
	}

	return legit.length

}

async function p2021day9_part2(input: string, ...params: any[]) {
	const g = new Grid({
		serialized: input
	});

	const lows = []
	for (let c of g) {
		const d = getData(c);
		if(d.v < d.n && d.v < d.e && d.v < d.w && d.v < d.s) {
			lows.push(d);
		}
	}

	const pitSizes = lows.map(d => calcBasin(d.c, [], [])).sort((a, b) => b - a);
	return pitSizes[0] * pitSizes[1] * pitSizes[2];
}

async function run() {
	const part1tests: TestCase[] = [
		{
			"input": [
				"2199943210",
				"3987894921",
				"9856789892",
				"8767896789",
				"9899965678",
			].join("\n"),
			"expected": "15"
		}
	];
	const part2tests: TestCase[] = [
		{
			"input": [
				"2199943210",
				"3987894921",
				"9856789892",
				"8767896789",
				"9899965678",
			].join("\n"),
			"expected": "1134"
		}
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day9_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day9_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day9_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2021day9_part2(input));
	const part2After = performance.now();

	logSolution(9, 2021, part1Solution, part2Solution);

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

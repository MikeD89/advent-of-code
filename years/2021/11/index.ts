import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { Cell, Grid } from "../../../util/grid";
import exp from "constants";
import { off } from "process";

const YEAR = 2021;
const DAY = 11;

const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(String);

// solution path: D:\Work\advent-of-code\years\2021\11\index.ts
// data path    : D:\Work\advent-of-code\years\2021\11\data.txt
// problem url  : https://adventofcode.com/2021/day/11

function inc(c: Cell) {
	const newVal = Number(c.value) + 1;
	c.setValue(newVal.toString());
}

function isNormal(c: Cell) {
	return nums.includes(c.value);
}

function cycle(grid: Grid) { 
	// increment
	for(let c of grid) {
		inc(c);
	}

	// explode
	const explodes = new Set();
	let boomBoomCount: number | undefined = undefined;
	do {
		// Store the size 
		boomBoomCount = explodes.size;

		for(let c of grid) {
			// already gone boom
			if(explodes.has(c.index)) {
				continue;
			}

			// not ready to go boom
			if(Number(c.value) <= 9) {
				continue;
			}

			// boom!
			c.neighbors(true).forEach(inc);
			explodes.add(c.index);
		}
	} while(explodes.size !== boomBoomCount);

	// flatten
	for(let c of grid) {
		if(!isNormal(c)) {
			c.setValue("0")
		}
	}

	return boomBoomCount;
}

function runCycles(grid: Grid, cycles: number) {
	let boomCount = 0;
	for(let i = 0; i < cycles; i++) {
		boomCount += cycle(grid);
	}
	return boomCount
}



async function p2021day11_part1(input: string, ...params: any[]) {
	const g = new Grid({
		serialized: input
	})

	return runCycles(g, 100);
}

async function p2021day11_part2(input: string, ...params: any[]) {
	const g = new Grid({
		serialized: input
	})
	const size = g.rowCount * g.colCount;
	let i = 1;

	do {
		const boomed = cycle(g)
		if(boomed === size) {
			return i;
		}
		
		i+=1;
	} while(true);
}

async function run() {
	const testData = [
		"5483143223",
		"2745854711",
		"5264556173",
		"6141336146",
		"6357385478",
		"4167524645",
		"2176841721",
		"6882881134",
		"4846848554",
		"5283751526",
	].join("\n");
	const part1tests: TestCase[] = [{
		input: testData,
		expected: "1656"
	}];
	const part2tests: TestCase[] = [{
		input: testData,
		expected: "195"
	}];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day11_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day11_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();


	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day11_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2021day11_part2(input));
	const part2After = performance.now();

	logSolution(11, 2021, part1Solution, part2Solution);

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

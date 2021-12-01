import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { exit } from "process";

const YEAR = 2021;
const DAY = 1;

// solution path: D:\Work\advent-of-code\years\2021\01\index.ts
// data path    : D:\Work\advent-of-code\years\2021\01\data.txt
// problem url  : https://adventofcode.com/2021/day/1

async function p2021day1_part1(input: string, ...params: any[]) {
	const data = input.split("\n").map(Number);
	let count = 0;
	for (let i = 1; i <= data.length; i++) {
		if (data[i] > data[i-1]) {
			count += 1;
		}
	}
	return count;
}

async function p2021day1_part2(input: string, ...params: any[]) {
	const data = input.split("\n").map(Number);
	let slidyBoi = undefined
	let count = 0;

	for (let i =0; i < data.length-2; i++) {
		const slidy = data[i] + data[i+1] + data[i+2]
		if(slidyBoi !== undefined && slidy > slidyBoi) {
			count += 1;
		}
		slidyBoi = slidy;
	}

	return count;
}

async function run() {
	const part1tests: TestCase[] = [{"input": "199\n200\n208\n210\n200\n207\n240\n269\n260\n263", "expected": "7"}];
	const part2tests: TestCase[] = [];

	// Run tests
	if(true) {
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day1_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day1_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();
}

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day1_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2021day1_part2(input));
	const part2After = performance.now();

	logSolution(1, 2021, part1Solution, part2Solution);

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

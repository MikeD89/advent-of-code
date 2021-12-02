import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2021;
const DAY = 2;

// solution path: D:\Work\advent-of-code\years\2021\02\index.ts
// data path    : D:\Work\advent-of-code\years\2021\02\data.txt
// problem url  : https://adventofcode.com/2021/day/2

async function p2021day2_part1(input: string, ...params: any[]) {
	const d = input.split("\n").map(s => s.split(" "));
	let hori = 0;
	let depth = 0;
	for (let item of d) {
		const v = Number(item[1])
		switch(item[0]){
			case "forward":
				hori += v;
				break;
			case "down":
				depth += v;
				break;
			case "up":
				depth -= v;
				break;
		}

	}
	return hori * depth;
}

async function p2021day2_part2(input: string, ...params: any[]) {
	const d = input.split("\n").map(s => s.split(" "));
	let hori = 0;
	let depth = 0;
	let aim = 0;
	for (let item of d) {
		const v = Number(item[1])
		switch(item[0]){
			case "forward":
				hori += v;
				depth += (aim * v);
				break;
			case "down":
				aim += v;
				break;
			case "up":
				aim -= v;
				break;
		}

	}
	return hori * depth;
}
async function run() {
	const part1tests: TestCase[] = [];
	const part2tests: TestCase[] = [];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day2_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day2_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day2_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2021day2_part2(input));
	const part2After = performance.now();

	logSolution(2, 2021, part1Solution, part2Solution);

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

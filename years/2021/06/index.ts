import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2021;
const DAY = 6;

// solution path: D:\Work\advent-of-code\years\2021\06\index.ts
// data path    : D:\Work\advent-of-code\years\2021\06\data.txt
// problem url  : https://adventofcode.com/2021/day/6

async function p2021day6_part1(input: string[], ...params: any[]) {
	return sim(input, 80)
}

async function p2021day6_part2(input: string[], ...params: any[]) {
	return sim(input, 256)
}

function sim(input: string[], days: number) {
	let data = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	for (let i of input) {
		const n = Number(i);
		data[n] += 1;
	}

	for (let i=0; i < days; i++) {
		data = simDay(data)
	}

	return data.reduce((a, b) => a+b, 0);
}

function simDay(data: number[]): number[] {
	const expired = data.shift() ?? 0;
	data.push(0);
	data[8] += expired;
	data[6] += expired;
	return data;
}

async function run() {
	const part1tests: TestCase[] = [{
		"input": "3,4,3,1,2",
		"expected": "5934",
	}];
	const part2tests: TestCase[] = [];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day6_part1(testCase.input.split(","), ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day6_part2(testCase.input.split(","), ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await (await util.getInput(DAY, YEAR)).split(",");

	const part1Before = performance.now();
	const part1Solution = String(await p2021day6_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2021day6_part2(input));
	const part2After = performance.now();

	logSolution(6, 2021, part1Solution, part2Solution);

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

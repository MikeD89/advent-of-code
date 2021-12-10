import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { exit } from "process";

const YEAR = 2021;
const DAY = 7;

// solution path: D:\Work\advent-of-code\years\2021\07\index.ts
// data path    : D:\Work\advent-of-code\years\2021\07\data.txt
// problem url  : https://adventofcode.com/2021/day/7

function median(values: number[]){
	values.sort(function(a,b){
	  return a-b;
	});
  
	var half = Math.floor(values.length / 2);
	
	if (values.length % 2)
	  return values[half];
	
	return (values[half - 1] + values[half]) / 2.0;
  }

async function p2021day7_part1(input: string, ...params: any[]) {
	const data = input.split(",").map(Number)
	const m = median(data);
	return data.map(d => d - m).map(Math.abs).reduce((a, b) => a+b, 0);
}

function checkN(data: number[], v: number) {
	return data.map(d => d - v).map(Math.abs).map(n => (n * (n+1)) / 2).reduce((a, b) => a+b, 0);
}

async function p2021day7_part2(input: string, ...params: any[]) {
	const data = input.split(",").map(Number);
	let lowestRange = 999999999999999;
	let lowestI = 999999999999;
	const max = Math.max(...data);
	for (let i = 0; i< max;i++) {
		const val = checkN(data, i);
		
		if (val < lowestRange) {
			lowestRange = val;
			lowestI = i;
		}
	}

	return lowestRange;
}

async function run() {
	const part1tests: TestCase[] = [{
		"input": "16,1,2,0,4,2,7,1,2,14",
		"expected": "37",
	}];
	const part2tests: TestCase[] = [{
		"input": "16,1,2,0,4,2,7,1,2,14",
		"expected": "168",
	}];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day7_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day7_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day7_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2021day7_part2(input));
	const part2After = performance.now();

	logSolution(7, 2021, part1Solution, part2Solution);

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

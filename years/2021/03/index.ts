import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { hasUncaughtExceptionCaptureCallback } from "process";

const YEAR = 2021;
const DAY = 3;

// solution path: D:\Work\advent-of-code\years\2021\03\index.ts
// data path    : D:\Work\advent-of-code\years\2021\03\data.txt
// problem url  : https://adventofcode.com/2021/day/3

async function p2021day3_part1(input: string, ...params: any[]) {
	const data = input.split("\n");

	let gammaCount = [];
	for (let i = 0; i< 12; i++) {gammaCount.push([0,0]) }

	for(let d of data) {
		for (let i = 0; i< 12; i++) {
			gammaCount[i][d[i] === "0" ? 0 : 1] += 1;
		}
	}

	const gammaSum = gammaCount.map(a => a[0] > a[1] ? "0": "1").join("");;
	const gamma = parseInt(gammaSum, 2);

	const epsilonSum = gammaCount.map(a => a[0] < a[1] ? "0": "1").join("");;
	const ep = parseInt(epsilonSum, 2);

	return gamma * ep;
}

function mcb(data: string[], position: number, co2: boolean) {
	let zeros = 0;
	for(let d of data) {
		if(d[position] === "0") {
			zeros += 1;
		}
	}

	let ones = data.length - zeros;

	if (zeros === ones) {
		return co2? "0" : "1";
	}

	if(co2) {
		return zeros < ones ? "0" : "1";
	} else {
		return zeros > ones ? "0" : "1";
	}
}

function search(data: string[], co2: boolean) {
	let searchData = data;
	for (let i =0;i< 12;i++) {
		if(searchData.length === 1) {
			return searchData[0];
		}

		const mc = mcb(searchData, i, co2);
		searchData = searchData.filter(d => d[i] === mc);
	}

	if(searchData.length === 1) {
		return searchData[0];
	}

	throw new Error("FUUUUCK");
}

async function p2021day3_part2(input: string, ...params: any[]) {
	const data = input.split("\n");
	const ogrV = search(data, false);
	const co2V = search(data, true)

	return parseInt(ogrV, 2) * parseInt(co2V, 2);
}

async function run() {
	const part1tests: TestCase[] = [];
	const part2tests: TestCase[] = [];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day3_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day3_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day3_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2021day3_part2(input));
	const part2After = performance.now();

	logSolution(3, 2021, part1Solution, part2Solution);

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

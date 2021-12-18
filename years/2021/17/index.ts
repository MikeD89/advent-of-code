import _, { max } from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import internal from "stream";

const YEAR = 2021;
const DAY = 17;

let maxY = -10000;
let points = []

// solution path: D:\Work\advent-of-code\years\2021\17\index.ts
// data path    : D:\Work\advent-of-code\years\2021\17\data.txt
// problem url  : https://adventofcode.com/2021/day/17

function contains(x: number, y: number, tarX: number[], tarY: number[]) {
	return x >= Math.min(...tarX) && x <= Math.max(...tarX) && y >= Math.min(...tarY) && y <= Math.max(...tarY)
}

function fire(xV: number, yV: number, tarX: number[], tarY: number[], drag: number = 1, gravity: number = 1) {
	let xpos = 0;
	let ypos = 0;

	do{
		xpos += xV;
		ypos += yV;

		maxY = Math.max(ypos, maxY);

		if(contains(xpos, ypos, tarX, tarY)) {
			return true;
		}
		
		xV = xV === 0 ? 0 : (xV < 0 ? xV+drag: xV-drag);
		yV = yV -= gravity;

	} while(ypos > tarY[0])

	return false;
}

async function p2021day17_part1(input: string, ...params: any[]) {	
	const xy = input.split("target area: ")[1].split(", ")
	const x = xy[0].split("=")[1].split("..").map(Number)
	const y = xy[1].split("=")[1].split("..").map(Number)

	let biggestHeight = -1100000;

	// brute force all the way!
	for(let i = -500; i < 500; i++) {
		for(let j = -500; j < 500; j++) {
			maxY = -10000;

			if(fire(i, j, x, y)) {
				biggestHeight = Math.max(maxY, biggestHeight);
				points.push([i, j])
			}
		}
	}

	return biggestHeight;
}

async function p2021day17_part2(input: string, ...params: any[]) {
	return points.length;
}

async function run() {
	const part1tests: TestCase[] = [];
	const part2tests: TestCase[] = [];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day17_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day17_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	let input = await util.getInput(DAY, YEAR);
	// input = "target area: x=20..30, y=-10..-5"


	const part1Before = performance.now();
	const part1Solution = String(await p2021day17_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2021day17_part2(input));
	const part2After = performance.now();

	logSolution(17, 2021, part1Solution, part2Solution);

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

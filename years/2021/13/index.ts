import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { Grid, GridPos } from "../../../util/grid";
import { groupEnd } from "console";

const YEAR = 2021;
const DAY = 13;
const debug = false;

// solution path: D:\Work\advent-of-code\years\2021\13\index.ts
// data path    : D:\Work\advent-of-code\years\2021\13\data.txt
// problem url  : https://adventofcode.com/2021/day/13

function count(grid: Grid) {
	let c = 0;
	for(let cell of grid) {
		if(cell.value === "#") {
			c += 1;
		}
	}
	return c;
}

function fold(grid: Grid, dir: "x" | "y", line: number) {
	// maybe p2 bug - this always folds in the center 
	const newC = dir === "x" ? Math.floor(grid.colCount / 2) : grid.colCount;
	const newR = dir === "y" ? Math.floor(grid.rowCount / 2) : grid.rowCount;

	const newGrid = new Grid({
		colCount: newC,
		rowCount: newR,
		fillWith: "."		
	});

	for (let cell of newGrid) {
		let x = cell.position[1];
		let y = cell.position[0];

		let otherX = dir === "y" ? x : line + (line - x);
		let otherY = dir === "x" ? y : line + (line - y);

		let v = (grid.getCell([y, x])?.value ?? ".") === "#";
		let o = (grid.getCell([otherY, otherX])?.value ?? ".") === "#";

		cell.setValue(v || o ? "#" : ".")
	}

	return newGrid;
}

function getPoints(input: string) {
	return input.split("\n")
	            .filter(s => !s.startsWith("fold along"))
	            .filter(s => s !== "")
	            .map(i => i.split(",").map(Number))
}

function getFolds(input: string) {
	return input.split("\n")
		        .filter(s => s.startsWith("fold along"))
		        .map(s => s.replace("fold along ", ""))
		        .map(i => i.split("=").map(s => s === "x" || s === "y" ? s : Number(s)))
}

function getStartingGrid(input: string) {
	const points = getPoints(input);
	const bigX = points.map(e => e[0]).reduce((a, b) => a>b ? a : b) + 1
	const bigY = points.map(e => e[1]).reduce((a, b) => a>b ? a : b) + 1

	const grid = new Grid({
		colCount: bigX,
		rowCount: bigY,
		fillWith: "."		
	});

	// set points
	points.forEach(s => grid.getCell([s[1], s[0]] as GridPos)?.setValue("#"))

	return grid;
}

async function p2021day13_part1(input: string, ...params: any[]) {
	let grid = getStartingGrid(input);
	const folds = getFolds(input);

	// p1
	grid = fold(grid, folds[0][0] as any, folds[0][1] as any)	
	return count(grid);
}

async function p2021day13_part2(input: string, ...params: any[]) {
	let grid = getStartingGrid(input);
	const folds = getFolds(input);

	// p1
	for(let f of folds) {
		grid = fold(grid, f[0] as any, f[1] as any)	
	}

	grid.log();
}

async function run() {
	const std = [
		"6,10",
		"0,14",
		"9,10",
		"0,3",
		"10,4",
		"4,11",
		"6,0",
		"6,12",
		"4,1",
		"0,13",
		"10,12",
		"3,4",
		"3,0",
		"8,4",
		"1,10",
		"2,14",
		"8,10",
		"9,0",
		"",
		"fold along y=7",
		"fold along x=5",
	].join("\n");
	const part1tests: TestCase[] = [ {
		input: std,
		expected: "17",
	}];
	const part2tests: TestCase[] = [];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day13_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day13_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	if(debug) return;

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day13_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2021day13_part2(input));
	const part2After = performance.now();

	logSolution(13, 2021, part1Solution, part2Solution);

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

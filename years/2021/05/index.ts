import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { exit } from "process";

const YEAR = 2021;
const DAY = 5;

// solution path: D:\Work\advent-of-code\years\2021\05\index.ts
// data path    : D:\Work\advent-of-code\years\2021\05\data.txt
// problem url  : https://adventofcode.com/2021/day/5

function getLine(l: string): number[][] {
	const p = l.split(" -> ");
	const f = p[0].split(",");
	const t = p[1].split(",");

	const fN = [Number(f[0]), Number(f[1])]
	const tN = [Number(t[0]), Number(t[1])]

	return [fN, tN];
}

function isHorizontal(line: number[][]) {
	return line[0][0] === line[1][0] || line[0][1] === line[1][1];
}

function getPoints(line: number[][]) {
	const p = [];

	const startX = line[0][0]; 
	const startY = line[0][1]; 

	const lX = line[1][0] - startX;
	const lY = line[1][1] - startY;
	const m = lX === 0 ? 0 : (lX > 0 ? 1 : -1);
	const n = lY === 0 ? 0 : (lY > 0 ? 1 : -1);

	for(let i = 0; i <= Math.max(Math.abs(lX), Math.abs(lY)); i++){
		p.push((startX + (i * m)) + "," + (startY + (i * n)));
	}

	return p;
}

function countPoints(points: string[]) {
	const count = new Map<string, number>();
	points.forEach(p => {
		const v = count.get(p) ?? 0;
		count.set(p, v + 1)
	})
	return count;
}

function getWithAtLeast(count: Map<string, number>, n: number) {
	let i = 0;
	count.forEach((value, key) => {if(value>=n) i+=1})
	return i;
}

async function p2021day5(input: number[][][], h: boolean) {
	const f = h ? input.filter(isHorizontal) : input;
	const p = f.map(getPoints).flat();
	const c = countPoints(p);
	const v =  getWithAtLeast(c, 2);
	return v;
}

async function run() {
	const part1tests: TestCase[] = [];
	const part2tests: TestCase[] = [];

	// Get input and run program while measuring performance
	const input = await (await util.getInput(DAY, YEAR)).split("\n");
	const d = input.map(getLine);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day5(d, true));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2021day5(d, false));
	const part2After = performance.now();

	logSolution(5, 2021, part1Solution, part2Solution);

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

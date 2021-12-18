import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { Cell, Grid } from "../../../util/grid";
import Graph from "node-dijkstra";

function cloneArray(a: any[]) {
	return Object.assign([], a);
}

const YEAR = 2021;
const DAY = 15;

const lut = [
	[0, 1, 2, 3, 4],
	[1, 2, 3, 4, 5],
	[2, 3, 4, 5, 6],
	[3, 4, 5, 6, 7],
	[4, 5, 6, 7, 8]
]

// solution path: D:\Work\advent-of-code\years\2021\15\index.ts
// data path    : D:\Work\advent-of-code\years\2021\15\data.txt
// problem url  : https://adventofcode.com/2021/day/15

function getRouteCost(input: string) {
	const g = new Grid({
		serialized: input
	})

	const route = new Graph()
	let lastIndex = "0"
	let firstVal = undefined
	
	for (let c  of g) {
		if(firstVal === undefined) {
			firstVal = Number(c.value)
		}
		let n = c.neighbors()
		let nm = new Map<string, number>();
		n.forEach(nn => nm.set(nn.index.toString(), Number(nn.value)))
		route.addNode(c.index.toString(), nm);
		lastIndex = c.index.toString();
	}

	const path = route.path("0", lastIndex)
	const cells: Cell[] = path.map((p: string) => g.getCell((c) => c.index.toString() === p)!!)
	return cells.map(c=>c.value).map(Number).reduce((a, b) => a+b, 0) - (firstVal ?? 0)
}


async function p2021day15_part1(input: string, ...params: any[]) {
	return getRouteCost(input)	
}

async function p2021day15_part2(input: string, ...params: any[]) {
	const data = input.split("\n").map(i => i.split(""))
	const newData: string[][] = []
	for(let i = 0; i < data.length * 5; i++) {
		const a: string[] = []
		for(let j = 0; j < data.length * 5; j++) {
			a.push("0")
		}
		newData.push(a);
	}

	for(let i = 0; i < 5; i++) {
		for(let j = 0; j < 5; j++) {
			const n = lut[i][j]

			for(let y = 0; y < data.length; y++) {
				const line = data[y]
				for(let x = 0; x < line.length; x++) {			
					let num = Number(line[x])

					// hacky way of incrementing from 1->9
					for(let ii = 0; ii < n; ii++) {
						num += 1
						num = num % 10
						num = num === 0 ? 1 : num
					}

					newData[(j * line.length) + y][(i * data.length) + x] = num.toString();
				}
			}
		}
	}
	

	const remade = newData.map(line => line.join("")).join("\n")
	return getRouteCost(remade)

}

async function run() {
	const tD = [
	"1163751742",
	"1381373672",
	"2136511328",
	"3694931569",
	"7463417111",
	"1319128137",
	"1359912421",
	"3125421639",
	"1293138521",
	"2311944581",
	].join("\n")
	const part1tests: TestCase[] = [{
		input: tD,
		expected: "40"
	}];
	const part2tests: TestCase[] = [{
		input: tD,
		expected: "315"
	}];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day15_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day15_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day15_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2021day15_part2(input));
	const part2After = performance.now();

	logSolution(15, 2021, part1Solution, part2Solution);

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


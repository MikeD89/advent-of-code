import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { bfSearch } from "../../../util/graph";
import { exit, off } from "process";

const YEAR = 2021;
const DAY = 12;

function isBig(cave: string) {
	return cave.toUpperCase() === cave;
}

export function cloneArray(a: any[]) {
	return Object.assign([], a);
}
// solution path: D:\Work\advent-of-code\years\2021\12\index.ts
// data path    : D:\Work\advent-of-code\years\2021\12\data.txt
// problem url  : https://adventofcode.com/2021/day/12

function explore(n: string, path: string, paths: string[], visited: string[], network: Map<string, string[]>, extraVisit: string | undefined) {
	if(n === "start" || n === "end" || !isBig(n)) {
		visited.push(n);
	}

	if(n === "end") {
		paths.push(path)
		return
	}

	const connected = network.get(n)!!
	for(let node of connected) {
		let canVisit = false;
		let extra = extraVisit;

		if(extraVisit === undefined) {
			// normal (p1)
			canVisit = !visited.includes(node);
		} else {
			// smol nodes get a bonus try (p2)
			if(node !== "start" && node !== "end" && !isBig(node)) {
				if(visited.includes(node)) {
					if(extraVisit === "") {
						// bypass
						canVisit = true;
						extra = node;
					}
				} else {
					canVisit = true;
				}
			} else {
				canVisit = !visited.includes(node);
			}
		}

		// DIGGY DIGGY HOLE
		if(canVisit) {
			explore(node, path, paths, cloneArray(visited), network, extra)
		}
	}
}

function findNeighbours(d: string[]) {
	// find all neighbours
	const n = new Map<string, string[]>();
	for(const i of d) {
		const l = i.split("-");
		const start = l[0]
		const end = l[1]

		const startN = n.get(start) ?? [];
		const endN = n.get(end) ?? [];

		startN.push(end);
		endN.push(start);

		n.set(start, startN);
		n.set(end, endN);
	}

	return n
}

async function p2021day12_part1(input: string, ...params: any[]) {
	const d = input.split("\n")
	const n = findNeighbours(d);
	const paths: string[] = []
	explore("start", "", paths, [], n, undefined);

	return paths.length;
}

async function p2021day12_part2(input: string, ...params: any[]) {
	const d = input.split("\n")
	const n = findNeighbours(d);
	const paths: string[] = []
	explore("start", "", paths, [], n, "");

	return paths.length;
}

async function run() {
	const sI = [
		"start-A",
		"start-b",
		"A-c",
		"A-b",
		"b-d",
		"A-end",
		"b-end"
	].join("\n")
	const lI = [
		"dc-end",
		"HN-start",
		"start-kj",
		"dc-start",
		"dc-HN",
		"LN-dc",
		"HN-end",
		"kj-sa",
		"kj-HN",
		"kj-dc",
	].join("\n")
	const vI = [
		"fs-end",
		"he-DX",
		"fs-he",
		"start-DX",
		"pj-DX",
		"end-zg",
		"zg-sl",
		"zg-pj",
		"pj-he",
		"RW-he",
		"fs-DX",
		"pj-RW",
		"zg-RW",
		"start-pj",
		"he-WI",
		"zg-he",
		"pj-fs",
		"start-RW",
	].join("\n")
	const part1tests: TestCase[] = [
		{		input: sI, expected: "10"	},
		{		input: lI, expected: "19"	},
		{		input: vI, expected: "226"	}
	];
	const part2tests: TestCase[] = [
		{		input: sI, expected: "36"	},
		{		input: lI, expected: "103"	},
		{		input: vI, expected: "3509"	}
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day12_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day12_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day12_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2021day12_part2(input));
	const part2After = performance.now();

	logSolution(12, 2021, part1Solution, part2Solution);

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

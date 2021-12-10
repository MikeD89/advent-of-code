import _, { keys } from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { Stack } from "stack-typescript";

const YEAR = 2021;
const DAY = 10;

// solution path: D:\Work\advent-of-code\years\2021\10\index.ts
// data path    : D:\Work\advent-of-code\years\2021\10\data.txt
// problem url  : https://adventofcode.com/2021/day/10

const opens = ["(", "[", "{", "<"] as const;
const closes = [")", "]", "}", ">"] as const;
type openT = typeof opens[number];
type closeT = typeof closes[number];

const points = new Map<closeT, number>([
	[")", 3],
	["]", 57],
	["}", 1197],
	[">", 25137]
]);


const completePoints = new Map<closeT, number>([
	[")", 1],
	["]", 2],
	["}", 3],
	[">", 4]
]);

const oTc = new Map<openT, closeT>([
	["(", ")"],
	["[", "]"],
	["{", "}"],
	["<", ">"]
]);

const cTo = new Map<closeT, openT>([
	[")", "("],
	["]", "["],
	["}", "{"],
	[">", "<"]
]);

function getErrorScore(input: string): number {
	let stack = new Stack<string>()
	
	for(let c of input) {
		const cc = opens.find((k) => k === c);
		if(cc) {
			stack.push(cc);
		} else {
			const p = handleClose(stack, c as closeT);
			if(p!= 0) {
				return p;
			}
		}
	}

	return 0;
}

function getRemainingStack(input: string): Stack<string> {
	let stack = new Stack<string>()
	
	for(let c of input) {
		const cc = opens.find((k) => k === c);
		if(cc) {
			stack.push(cc);
		} else {
			const p = handleClose(stack, c as closeT);
			if(p!= 0) {
				// empty stack on "error" to filter them out
				return new Stack<string>();
			}
		}
	}

	return stack;
}


function handleClose(stack: Stack<string>, closeChar: closeT) {
	const p = points.get(closeChar) ?? 0;
	if(stack.length === 0) {
		return p;
	} 

	const openChar = cTo.get(closeChar);
	const top = stack.pop();
	if(openChar !== top) {
		return p;
	}

	return 0;
}


async function p2021day10_part1(input: string, ...params: any[]) {
	return input.split("\n").map(getErrorScore).reduce((a, b) => a+b, 0);
}

function completeString(stack: Stack<string>) {
	let s = "";
	for(let c of stack) {
		s += oTc.get(c as openT);
	}

	return s;	
}

function completeScore(s: string) {
	let total = 0;
	for (let c of s) {
		total = (total * 5) + (completePoints.get(c as closeT) ?? 0);
	}
	return total;
}

async function p2021day10_part2(input: string, ...params: any[]) {
	const data = input.split("\n");
	const d = data
		.map(getRemainingStack)
		.filter(s => s.length !== 0)
		.map(completeString)
		.map(completeScore)
		.sort((a, b) => a-b)
	return d[(Math.floor(d.length / 2))]
}

async function run() {
	const data = [
		    "[({(<(())[]>[[{[]{<()<>>",
			"[(()[<>])]({[<{<<[]>>(",
			"{([(<{}[<>[]}>{[]{[(<()>",
			"(((({<>}<{<{<>}{[]{[]{}",
			"[[<[([]))<([[{}[[()]]]",
			"[{[{({}]{}}([{[{{{}}([]",
			"{<[[]]>}<{[{[{[]{()[[[]",
			"[<(<(<(<{}))><([]([]()",
			"<{([([[(<>()){}]>(<<{{",
			"<{([{{}}[<[[[<>{}]]]>[]]",
	]
	const part1tests: TestCase[] = [{
		"input": data.join("\n"),
		"expected": "26397",
	}];
	const part2tests: TestCase[] = [{
		"input": data.join("\n"),
		"expected": "288957",
	}];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day10_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day10_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();


	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day10_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2021day10_part2(input));
	const part2After = performance.now();

	logSolution(10, 2021, part1Solution, part2Solution);

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

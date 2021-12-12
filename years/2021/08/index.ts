import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2021;
const DAY = 8;

// solution path: D:\Work\advent-of-code\years\2021\08\index.ts
// data path    : D:\Work\advent-of-code\years\2021\08\data.txt
// problem url  : https://adventofcode.com/2021/day/8

const truthTable = {
	0: ["a", "b", "c", "e", "f", "g"],
	1: ["c", "f"],
	2: ["a", "c", "d", "e", "g"],
	3: ["a", "c", "d", "f", "g"],
	4: ["b", "c", "d", "f"],
	5: ["a", "b", "d", "f", "g"],
	6: ["a", "b", "d", "e", "f", "g"],
	7: ["a", "c", "f"],
	8: ["a", "b", "c", "d", "e", "f", "g"],
	9: ["a", "b", "c", "d", "f", "g"],
}

class Data {
	originalLine: string;
	testData: string[];
	inputData: string[];

	constructor(line: string) {
		this.originalLine = line;
		const halves = line.split(" | ");
		this.inputData = halves[0].split(" ");
		this.testData = halves[1].split(" ");
	}

}

async function p2021day8_part1(input: string, ...params: any[]) {
	const data = input.split("\n").map(i => new Data(i));
	return "Not implemented";
}

async function p2021day8_part2(input: string, ...params: any[]) {
	return "Not implemented";
}

async function run() {
	const sD = "acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf"
	const tD = [
		"be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe",
		"edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc",
		"fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg",
		"fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb",
		"aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea",
		"fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb",
		"dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe",
		"bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef",
		"egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb",
		"gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce",
	].join("\n")
	const part1tests: TestCase[] = [
		{ input: sD, expected: "1" }
		// { input: tD, expected: "26" }
	];
	const part2tests: TestCase[] = [];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day8_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day8_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	return

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day8_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2021day8_part2(input));
	const part2After = performance.now();

	logSolution(8, 2021, part1Solution, part2Solution);

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

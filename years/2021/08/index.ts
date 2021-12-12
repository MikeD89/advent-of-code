import _, { clone, Truthy } from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { exit } from "process";
import { throws } from "assert";

const YEAR = 2021;
const DAY = 8;

// solution path: D:\Work\advent-of-code\years\2021\08\index.ts
// data path    : D:\Work\advent-of-code\years\2021\08\data.txt
// problem url  : https://adventofcode.com/2021/day/8

type digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

 
const truthTable = new Map<digit, string[]>([
	[1, ["c", "f"]],
	[7, ["a", "c", "f"]],
	[4, ["b", "c", "d", "f"]],
	[2, ["a", "c", "d", "e", "g"]],
	[3, ["a", "c", "d", "f", "g"]],
	[5, ["a", "b", "d", "f", "g"]],
	[9, ["a", "b", "c", "d", "f", "g"]],
	[0, ["a", "b", "c", "e", "f", "g"]],
	[6, ["a", "b", "d", "e", "f", "g"]],
	[8, ["a", "b", "c", "d", "e", "f", "g"]],
]);

const initialLut = ["a", "b", "c", "d", "e", "f", "g"];

function rm(v: string, a: string[]) {
	const index = a.indexOf(v, 0);
	if (index > -1) {
		a.splice(index, 1);
	}
}
function cloneArray(a: any[]) {
	return Object.assign([], a);
}
function invertLut(poss: string[]) {
	const v = cloneArray(initialLut);
	poss.forEach(p => rm(p, v));
	return v;
}

class Data {
	originalLine: string;
	testData: string[];
	inputData: string[];

	lookupTable: Map<string, string[]>;
	savedLookupTable: Map<string, string[]> | undefined;

	constructor(line: string) {
		this.originalLine = line;
		const halves = line.split(" | ");
		this.inputData = halves[0].split(" ").sort((a, b) => a.length - b.length);
		this.testData = halves[1].split(" ");
		
		// populate lut
		this.lookupTable = new Map<string, string[]>();
		for(let c of initialLut) {
			let d = cloneArray(initialLut);
			this.lookupTable.set(c, d);
		}
	}

	p1() {
		return this.testData.filter(s => s.length === 2 || s.length === 4 || s.length === 3 || s.length === 7).length;
	}

	fixPossibilities(val: digit, poss: string) {
		const possV  = poss.split("");
		const inversePos = invertLut(possV);
		const truthValues = truthTable.get(val)!!;
		const inverseTruth = invertLut(truthValues);

		for (let itv of truthValues) {
			for (let tv of inversePos) {
				rm(tv, this.lookupTable.get(itv)!!)
			}
		}

		for (let itv of inverseTruth) {
			for (let tv of possV) {
				rm(tv, this.lookupTable.get(itv)!!)
			}
		}
	}

	report() {
		console.log(this.lookupTable)
		console.log()
		for (let e of this.lookupTable) {
			if(e[1].length === 1) {
				console.log(e[0] + " --> " + e[1][0])
			}
		}
	}

	save() {
		this.savedLookupTable = new Map();
		for(let e of this.lookupTable) {
			this.savedLookupTable.set(e[0], cloneArray(e[1]))
		}
	}

	rollback() {
		if(this.savedLookupTable) {
			this.lookupTable = new Map();
			for(let e of this.savedLookupTable) {
				this.lookupTable.set(e[0], cloneArray(e[1]))
			}
		}
	}

	isLutComplete() {
		for (let v of this.lookupTable) {
			if(v[1].length !== 1) {
				return false;
			}
		}
		return true;
	}

	isLutValid() {
		for (let v of this.lookupTable) {
			// easy check - have we ran out of options?
			if(v[1].length === 0) {
				return false;
			}
		}

		return true;
	}

	testOption(testDigit: digit, dataLine: number) {
		this.save()
		this.fixPossibilities(testDigit, this.inputData[dataLine]);

		const valid = this.isLutValid()
		const complete = this.isLutComplete()

		this.rollback()

		return [testDigit, dataLine, valid, complete]
	}


	process() {
		// these are known values
		this.fixPossibilities(1, this.inputData[0]);
		this.fixPossibilities(7, this.inputData[1]);
		this.fixPossibilities(4, this.inputData[2]);
		this.fixPossibilities(8, this.inputData[9]);

		// these are options
		// 2, 3, 5 => 3, 4, 5
		// 9, 0, 6 => 6, 7, 8
		const options = [
			[
				this.testOption(2, 3),
				this.testOption(2, 4),
				this.testOption(2, 5),
			],
			[
				this.testOption(3, 3),
				this.testOption(3, 4),
				this.testOption(3, 5),
			],
			[
				this.testOption(5, 3),
				this.testOption(5, 4),
				this.testOption(5, 5),
			],		
			[
				this.testOption(9, 6),
				this.testOption(9, 7),
				this.testOption(9, 8),
			],
			[
				this.testOption(0, 6),
				this.testOption(0, 7),
				this.testOption(0, 8),
			],
			[
				this.testOption(6, 6),
				this.testOption(6, 7),
				this.testOption(6, 8),
			],
		]

		const validOptions = options.map(o => o.filter(v => v[2])) // find only the good ones
			                 .map(o => o[0])                // HAPPY ASSUMPTION TIME WHAT CAN GO WRONG
		validOptions.forEach(o => this.fixPossibilities(o[0] as digit, this.inputData[o[1] as number]))

		// invalid lut means buuuug
		if(!this.isLutComplete()) {
			console.log("INVALID LUT")
			console.log(this.originalLine);
			exit()
		}
	}

	getScore() {
		const truth = new Map<string, number>();
		for(let e of truthTable) {
			const val = e[1].map(c => this.lookupTable.get(c)![0]);
			const v = val.sort().join("");
			truth.set(v, e[0])
		}
		
		//.map(c => this.lookupTable.get(c)![0]).join("")
		return this.testData
			.map(s => s.split("").sort().join(""))
			.map(e => truth.get(e))
			.join("")
	}
}

async function p2021day8_part1(input: string, ...params: any[]) {
	return input.split("\n").map(i => new Data(i)).map(d => d.p1()).reduce((a, b) => a + b, 0);
}

async function p2021day8_part2(input: string, ...params: any[]) {
	const data = input.split("\n").map(i => new Data(i));
	data.forEach(d => d.process())
	return data.map(d => d.getScore()).map(Number).reduce((a, b) => a+b)
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
		{ input: tD, expected: "26" }
	];
	const part2tests: TestCase[] = [
		{ input: sD, expected: "5353" },
		{ input: tD, expected: "61229" }
	];

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

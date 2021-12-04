import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { getTsBuildInfoEmitOutputFilePath } from "typescript";

const YEAR = 2021;
const DAY = 4;

// solution path: D:\Work\advent-of-code\years\2021\04\index.ts
// data path    : D:\Work\advent-of-code\years\2021\04\data.txt
// problem url  : https://adventofcode.com/2021/day/4

class BingoBoard {
	numbers: string[][]
	checked: boolean[][]
	
	constructor(numbersIN: string[]) {
		this.numbers = [];
		this.checked = [];

		for(let numLine of numbersIN) {
			const row = numLine.trim().split(/[ ,]+/);
			row.forEach(r => r.trim());
			if(row.length > 5) {
				throw new Error("UH OH SPAGHETTI OHS")
			}

			this.numbers.push(row);
			this.checked.push(new Array(row.length).fill(false))
		}

		if(this.numbers.length > 5) {
			throw new Error("UH OH SPAGHETTI OHS")
		}
	}

	checkRow() {
		for (let r = 0; r< this.checked.length; r++) {
			const row = this.checked[r];
			const bingo = row.every(Boolean);
			if(bingo) {
				return true;
			}
		}
		return false;
	}

	checkColumn() {
		for (let c = 0; c< this.checked.length; c++) {
			const col = this.checked.map(function(v,_) { return v[c]; });
			const bingo = col.every(Boolean);
			if(bingo) {
				return true;
			}
		}
		return false;
	}

	isABingo() {
		return this.checkRow() || this.checkColumn();		
	}

	submitNumber(n: string) {
		for (let r = 0; r< this.checked.length; r++) {
			const row = this.checked[r];
			for (let c = 0; c< row.length; c++) {
				if(this.numbers[r][c] === n) {
					this.checked[r][c] = true;
				}
			}
		}
	}

	calcScore (n: string) {
		let sum = 0;
		for (let r = 0; r< this.checked.length; r++) {
			const row = this.checked[r];
			for (let c = 0; c< row.length; c++) {
				if(!this.checked[r][c]) {
					sum += Number(this.numbers[r][c]);
				}
			}
		}

		return sum * Number(n);
	}
}

function loadBingo(data: string[], startIndex: number): BingoBoard  {
	const rows = []
	for (let i =0; i< 5; i++) {
		rows.push(data[startIndex + i])
	}	
		
	return new BingoBoard(rows);

}

async function p2021day4_part1(input: string, ...params: any[]) {
	const data = input.split("\n");

	const bingos: BingoBoard[] = [];
	const items = data[0].split(",");

	for(let i = 2; i < data.length-4; i+=6) {
		bingos.push(loadBingo(data, i))	
	}

	for(let i of items) {
		for (let b of bingos) {
			b.submitNumber(i);

			if(b.isABingo()) {
				return b.calcScore(i);
			}
		}
	}

	console.log("RUH OH SHAGGY");
}

async function p2021day4_part2(input: string, ...params: any[]) {
	const data = input.split("\n");

	let bingos: BingoBoard[] = [];
	const items = data[0].split(",");

	let lastWinner: BingoBoard | undefined = undefined;
	let lastWinningN: string | undefined;

	for(let i = 2; i < data.length-4; i+=6) {
		bingos.push(loadBingo(data, i))	
	}

	for(let i of items) {
		for (let b of bingos) {
			b.submitNumber(i);

			if(b.isABingo()) {
				lastWinner = b;
				lastWinningN = i;
			}
			bingos = bingos.filter(b => !b.isABingo())
		}
	}

	return lastWinner?.calcScore(lastWinningN ?? "0") ?? "FUCK";
}

async function run() {
	const part1tests: TestCase[] = [];
	const part2tests: TestCase[] = [];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day4_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day4_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day4_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2021day4_part2(input));
	const part2After = performance.now();

	logSolution(4, 2021, part1Solution, part2Solution);

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

import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2021;
const DAY = 16;

// TYPES
const SUM = 0;
const PRODUCT = 1;
const MIN = 2;
const MAX = 3;
const LITERAL = 4;
const GTE = 5;
const LTE = 6;
const EQ = 7;

// solution path: D:\Work\advent-of-code\years\2021\16\index.ts
// data path    : D:\Work\advent-of-code\years\2021\16\data.txt
// problem url  : https://adventofcode.com/2021/day/16

let verC = 0;
let debug = false;
let print = true;

function p(line: string, prefix: string) {
	if(debug && print) {
		console.log(prefix + line)
	}
}

function hex2bin(hex: string){
    return (parseInt(hex, 16).toString(2)).padStart(4, "0");
}

function bin2int(bin: string) {
	return parseInt(bin, 2 );
}

function decodeLiteral(packet: string, prefix: string) {
	// broken into groups of four bits. + prefix
	let groups = packet.match(/.{1,5}/g)!!;
	groups = groups.filter(g => g.length === 5);

	let i = 0;

	let number: string = ""
	for(let g of groups) {
		i+=5;
		const end = g[0] === "0";
		number += g.slice(1);
		if(end) {
			const v = bin2int(number)
			p("Literal: " + v, prefix)
			return [v, i];
		}
	}

	throw Error("no end of number")
}

type opdata = {
	subpackets: number[]
	index: number;
}

type pkdata = {
	value: number
	packet: string;
}

function decodeOperator(packet: string, prefix: string): opdata {
	const l = packet.length;
	const type = packet[0]
	packet = packet.slice(1)

	let subpackets: number[] = [];

	if (type === "0") {
		// the next 15 bits are a number that represents the total length in bits of the sub-packets contained by this packet.
		const subpacketLength = bin2int(packet.slice(0, 15))
		packet = packet.slice(15)

		p("Sub-Ops: " + subpacketLength, prefix)

		let pkts = packet.slice(0, subpacketLength) 
		do {
			const {packet: pkt, value} = decodePacket(pkts, prefix + "\t")
			subpackets.push(value);
			pkts = pkt;
		} while (pkts.length > 6)

		// how much data did we read?
		return {subpackets, index: subpacketLength + 15 + 1}
	} else {
		// the next 11 bits are a number that represents the number of sub-packets immediately contained by this packet.
		const subpacketCount = bin2int(packet.slice(0, 11))
		packet = packet.slice(11)

		p("Sub-N:   " + subpacketCount, prefix)
		for(let i = 0; i < subpacketCount; i++) {
			const {packet: pkt, value} =  decodePacket(packet, prefix + "\t")
			packet = pkt;
			subpackets.push(value);
		}

		// how much data did we read?
		return {subpackets, index: l - packet.length}
	}
}


function decodePacket(packet: string, prefix: string): pkdata {
	if(packet.indexOf("1") === -1) {
		return {value: 0, packet: ""}
	}

	const version = bin2int(packet.slice(0, 3))
	verC += version;

	const type = bin2int(packet.slice(3, 6))
	packet = packet.slice(6)
	
	p("---", prefix)
	p("Version: " + version, prefix)
	p("Type:    " + type, prefix)
	
	if(type === LITERAL) {
		const [value, index] = decodeLiteral(packet, prefix);
		packet = packet.slice(index)
		return {value, packet}
	} else {
		const {subpackets, index} = decodeOperator(packet, prefix);
		packet = packet.slice(index)

		switch(type) {
			case SUM: 
				return {value: subpackets.reduce((a, b) => a+b), packet}
			case PRODUCT: 
				return {value: subpackets.reduce((a, b) => a*b), packet}
			case MIN: 
				return {value: subpackets.reduce((a, b) => a<b ? a: b, 999999999999999), packet}
			case MAX: 
				return {value: subpackets.reduce((a, b) => a>b ? a: b, 0), packet}
			case GTE: 
				return {value: subpackets[0] > subpackets[1] ? 1: 0, packet}
			case LTE: 
				return {value: subpackets[0] < subpackets[1] ? 1: 0, packet}
			case EQ: 
				return {value: subpackets[0] === subpackets[1] ? 1: 0, packet}
		}
	}

	throw Error("unknown packet")
}

function decodeAll(packet: string, prefix: string) {
	const {value, packet: pkt}= decodePacket(packet, prefix);
	return value;
}

async function p2021day16_part1(input: string, ...params: any[]) {
	const hex = input.split("").map(hex2bin).join("")
	verC = 0;
	decodeAll(hex, "");

	return verC;
}

async function p2021day16_part2(input: string, ...params: any[]) {
	const hex = input.split("").map(hex2bin).join("")
	return decodeAll(hex, "");
}

async function run() {
	const part1tests: TestCase[] = [
	{
		input: "8A004A801A8002F478",
		expected: "16"
	},{
		input: "620080001611562C8802118E34",
		expected: "12"
	},{
		input: "C0015000016115A2E0802F182340",
		expected: "23"
	},{
		input: "A0016C880162017C3686B18A3D4780",
		expected: "31"
	}
];
	const part2tests: TestCase[] = [{ 
	input: "C200B40A82",
	expected: "3"
},{ 
	input: "04005AC33890",
	expected: "54"
},{ 
	input: "880086C3E88112",
	expected: "7"
},{ 
	input: "CE00C43D881120",
	expected: "9"
},{ 
	input: "D8005AC2A8F0",
	expected: "1"
},{ 
	input: "F600BC2D8F",
	expected: "0"
},{ 
	input: "9C005AC2F8F0",
	expected: "0"
},{ 
	input: "9C0141080250320F1802104A08",
	expected: "1"
}];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day16_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day16_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	if(debug) {
		return;
	}

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day16_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2021day16_part2(input));
	const part2After = performance.now();

	logSolution(16, 2021, part1Solution, part2Solution);

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

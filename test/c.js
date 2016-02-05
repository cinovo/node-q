var c = require("../lib/c.js"),
	typed = require("../lib/typed.js"),
	moment = require("moment"),
	assert = require("assert"),
	bignum = require("bignum");

function hexstr_to_bin(str) {
	"use strict";
	return new Buffer(str, "hex");
}

function bin_to_hexstr(b) {
	"use strict";
	return b.toString("hex");
}

// use -8! in q to get the byte representation

describe("c", function() {
	"use strict";
	describe("deserialize", function() {
		describe("little", function() {
			describe("primitives", function() {
				it("boolean", function() { // 1b
					assert.equal(c.deserialize(hexstr_to_bin("010000000a000000ff01")), true);
				});
				describe("guid", function() {
					it("guid", function() { // 0a369037-75d3-b24d-6721-5a1d44d4bed5
						assert.equal(c.deserialize(hexstr_to_bin("0100000019000000fe0a36903775d3b24d67215a1d44d4bed5")), "0a369037-75d3-b24d-6721-5a1d44d4bed5");
					});
					it("null", function() { // 0Ng
						assert.equal(c.deserialize(hexstr_to_bin("0100000019000000fe00000000000000000000000000000000")), null);
					});
				});
				it("byte", function() { // 0x01
					assert.equal(c.deserialize(hexstr_to_bin("010000000a000000fc01")), "1");
				});
				describe("short", function() {
					it("1", function() { // 1h
						assert.equal(c.deserialize(hexstr_to_bin("010000000b000000fb0100")), 1);
					});
					it("null", function() { // 0Nh
						assert.equal(c.deserialize(hexstr_to_bin("010000000b000000fb0080")), null);
					});
					it("Infinity", function() { // 0wh
						assert.equal(c.deserialize(hexstr_to_bin("010000000b000000fbff7f")), Infinity);
					});
					it("-Infinity", function() { // -0wh
						assert.equal(c.deserialize(hexstr_to_bin("010000000b000000fb0180")), -Infinity);
					});
				});
				describe("integer", function() {
					it("1", function() { // 1i
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000fa01000000")), 1);
					});
					it("null", function() { // 0Ni
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000fa00000080")), null);
					});
					it("Infinity", function() { // 0wi
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000faffffff7f")), Infinity);
					});
					it("-Infinity", function() { // -0wi
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000fa01000080")), -Infinity);
					});
				});
				describe("long", function() {
					describe("long2bignum", function() {
						describe("default", function() {
							it("1", function() { // 1j
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f90100000000000000")), 1);
							});
							it("null", function() { // 0Nj
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f90000000000000080")), null);
							});
							it("Infinity", function() { // 0wj
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f9ffffffffffffff7f")), Infinity);
							});
							it("-Infinity", function() { // -0wj
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f90100000000000080")), -Infinity);
							});
						});
						describe("true", function() {
							it("1", function() { // 1j
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f90100000000000000"), undefined, undefined, undefined, true).toNumber(), 1);
							});
							it("null", function() { // 0Nj
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f90000000000000080"), undefined, undefined, undefined, true), null);
							});
							it("Infinity", function() { // 0wj
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f9ffffffffffffff7f"), undefined, undefined, undefined, true), Infinity);
							});
							it("-Infinity", function() { // -0wj
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f90100000000000080"), undefined, undefined, undefined, true), -Infinity);
							});
						});
						describe("false", function() {
							it("1", function() { // 1j
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f90100000000000000"), undefined, undefined, undefined, false), 1);
							});
							it("null", function() { // 0Nj
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f90000000000000080"), undefined, undefined, undefined, false), null);
							});
							it("Infinity", function() { // 0wj
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f9ffffffffffffff7f"), undefined, undefined, undefined, false), Infinity);
							});
							it("-Infinity", function() { // -0wj
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f90100000000000080"), undefined, undefined, undefined, false), -Infinity);
							});
						});
					});
				});
				describe("real", function() {
					it("1", function() { // 1.0e
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000f80000803f")), 1.0);
					});
					it("null", function() { // 0Ne
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000f80000c0ff")), null);
					});
					it("Infinity", function() { // 0we
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000f80000807f")), Infinity);
					});
					it("-Infinity", function() { // -0we
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000f8000080ff")), -Infinity);
					});
				});
				describe("float", function() {
					it("1", function() { // 1.0f
						assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f7000000000000f03f")), 1.0);
					});
					it("null", function() { // 0Nf
						assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f7000000000000f8ff")), null);
					});
					it("Infinity", function() { // 0wf
						assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f7000000000000f07f")), Infinity);
					});
					it("-Infinity", function() { // -0wf
						assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f7000000000000f0ff")), -Infinity);
					});
				});
				describe("char", function() {
					describe("emptyChar2null", function() {
						describe("default", function() {
							it("a", function() { // "a"
								assert.equal(c.deserialize(hexstr_to_bin("010000000a000000f661")), "a");
							});
							it("null", function() { // " "
								assert.equal(c.deserialize(hexstr_to_bin("010000000a000000f620")), null);
							});
						});
						describe("true", function() {
							it("a", function() { // "a"
								assert.equal(c.deserialize(hexstr_to_bin("010000000a000000f661"), undefined, undefined, true), "a");
							});
							it("null", function() { // " "
								assert.equal(c.deserialize(hexstr_to_bin("010000000a000000f620"), undefined, undefined, true), null);
							});
						});
						describe("false", function() {
							it("a", function() { // "a"
								assert.equal(c.deserialize(hexstr_to_bin("010000000a000000f661"), undefined, undefined, false), "a");
							});
							it("null", function() { // " "
								assert.equal(c.deserialize(hexstr_to_bin("010000000a000000f620"), undefined, undefined, false), " ");
							});
						});
					});
				});
				describe("symbol", function() {
					it("length 1", function() { // `a
						assert.equal(c.deserialize(hexstr_to_bin("010000000b000000f56100")), "a");
					});
					it("null", function() { // `
						assert.equal(c.deserialize(hexstr_to_bin("010000000a000000f500")), null);
					});
					it("length 2", function() { // `ab
						assert.equal(c.deserialize(hexstr_to_bin("010000000c000000f5616200")), "ab");
					});
					it("length 3", function() { // `abc
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000f561626300")), "abc");
					});
					it("length 4", function() { // `abcd
						assert.equal(c.deserialize(hexstr_to_bin("010000000e000000f56162636400")), "abcd");
					});
					it("lenth 5", function() { // `abcde
						assert.equal(c.deserialize(hexstr_to_bin("010000000f000000f5616263646500")), "abcde");
					});
					it("unicode", function() { // `$"你"
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000f5e4bda000")), "你");
					});
				});
				describe("nanos2date", function() {
					describe("default", function() {
						it("deserialize_timestamp_little_test", function() { // 2014.06.23D11:34:39.412547000
							assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f4b84d1d352d045706")).getTime(), moment.utc("2014.06.23 11:34:39.412547000", "YYYY.MM.DD HH:mm:ss.SSS").toDate().getTime());
						});
						it("deserialize_timestamp_null_little_test", function() { // 0Np
							assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f40000000000000080")), null);
						});
						it("deserialize_timespan_little_test", function() { // 00:01:00.000000000
							assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f0005847f80d000000")).getTime(), moment.utc("2000.01.01 00:01:00.000", "YYYY.MM.DD HH:mm:ss.SSS").toDate().getTime());
						});
						it("deserialize_timespan_null_little_test", function() { // 0Nn
							assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f00000000000000080")), null);
						});
					});
					describe("true", function() {
						it("deserialize_timestamp_little_test", function() { // 2014.06.23D11:34:39.412547000
							assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f4b84d1d352d045706"), true).getTime(), moment.utc("2014.06.23 11:34:39.412547000", "YYYY.MM.DD HH:mm:ss.SSS").toDate().getTime());
						});
						it("deserialize_timestamp_null_little_test", function() { // 0Np
							assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f40000000000000080"), true), null);
						});
						it("deserialize_timespan_little_test", function() { // 00:01:00.000000000
							assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f0005847f80d000000"), true).getTime(), moment.utc("2000.01.01 00:01:00.000", "YYYY.MM.DD HH:mm:ss.SSS").toDate().getTime());
						});
						it("deserialize_timespan_null_little_test", function() { // 0Nn
							assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f00000000000000080"), true), null);
						});
					});
					describe("false", function() {
						it("deserialize_timestamp_little_test", function() { // 2014.06.23D11:34:39.412547000
							assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f4b84d1d352d045706"), false), 1403523279412547000);
						});
						it("deserialize_timestamp_null_little_test", function() { // 0Np
							assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f40000000000000080"), false), null);
						});
						it("deserialize_timespan_little_test", function() { // 00:01:00.000000000
							assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f0005847f80d000000"), false), 60000000000);
						});
						it("deserialize_timespan_null_little_test", function() { // 0Nn
							assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f00000000000000080"), false), null);
						});
					});
				});
				describe("month", function() {
					it("201401", function() { // 2014.01m
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000f3a8000000")).getTime(), moment.utc("2014.01", "YYYY.MM").toDate().getTime());
					});
					it("null", function() { // 0Nm
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000f300000080")), null);
					});
					it("199501", function() { // 1995.01m
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000f3c4ffffff")).getTime(), moment.utc("1995.01", "YYYY.MM").toDate().getTime());
					});
				});
				describe("date", function() {
					it("20140101", function() { // 2014.01.01
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000f2fa130000")).getTime(), moment.utc("2014.01.91", "YYYY.MM").toDate().getTime());
					});
					it("null", function() { // 0Nd
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000f200000080")), null);
					});
					it("19950101", function() { // 1995.01.01
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000f2def8ffff")).getTime(), moment.utc("1995.01.01", "YYYY.MM").toDate().getTime());
					});
				});
				describe("datetime", function() {
					it("datetime", function() { // 2014.06.23T11:49:31.533
						assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f1facf4b237ea7b440")).getTime(), moment.utc("2014.06.23 11:49:31.533", "YYYY.MM.DD HH:mm:ss.SSS").toDate().getTime());
					});
					it("null", function() { // 0Nz
						assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f1000000000000f8ff")), null);
					});
				});
				describe("minute", function() {
					it("00:01", function() { // 00:01
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000ef01000000")).getTime(), moment.utc("2000.01.01 00:01:00.000", "YYYY.MM.DD HH:mm:ss.SSS").toDate().getTime());
					});
					it("null", function() { // 0Nu
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000ef00000080")), null);
					});
				});
				describe("second", function() {
					it("00:00:01", function() { // 00:00:01
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000ee01000000")).getTime(), moment.utc("2000.01.01 00:00:01.000", "YYYY.MM.DD HH:mm:ss.SSS").toDate().getTime());
					});
					it("null", function() { // 0Nv
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000ee00000080")), null);
					});
				});
				describe("time", function() {
					it("00:00:00.001", function() { // 00:00:00.001
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000ed01000000")).getTime(), moment.utc("2000.01.01 00:00:00.001", "YYYY.MM.DD HH:mm:ss.SSS").toDate().getTime());
					});
					it("null", function() { // 0Nt
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000ed00000080")), null);
					});
				});
			});
			describe("list", function() {
				// TODO test deserialize list for every type
				describe("char", function() {
					it("ab", function() { // "ab"
						assert.deepEqual(c.deserialize(hexstr_to_bin("01000000100000000a00020000006162")), "ab");
					});
					it("unicode", function() { // "你好"
						assert.deepEqual(c.deserialize(hexstr_to_bin("01000000140000000a0006000000e4bda0e5a5bd")), "你好");
					});
				});
			});
			describe("dict", function() {
				it("empty", function() {
					assert.deepEqual(c.deserialize(hexstr_to_bin("010000001500000063000000000000000000000000")), {});
				});
				it("single entry", function() {
					assert.deepEqual(c.deserialize(hexstr_to_bin("010000001f000000630b000100000061000700010000000100000000000000")), {a: 1});
				});
				it("multiple entries same type", function() {
					assert.deepEqual(c.deserialize(hexstr_to_bin("0100000033000000630b0003000000610062006300070003000000010000000000000002000000000000000300000000000000")), {a: 1, b: 2, c: 3});
				});
				it("multiple entries different types", function() {
					assert.deepEqual(c.deserialize(hexstr_to_bin("010000002f000000630b0003000000610062006300000003000000f90100000000000000ff01f70000000000000840")), {a: 1, b: true, c: 3});
				});
			});
			describe("table", function() {
				describe("flipTables", function() {
					describe("default", function() {
						it("multiple rows", function() {
							assert.deepEqual(c.deserialize(hexstr_to_bin("01000000620000006200630b0003000000610062006300000003000000070003000000010000000000000002000000000000000300000000000000010003000000010001090003000000000000000000f03f00000000000000400000000000000840")), [{a: 1, b: true, c: 1}, {a: 2, b: false, c: 2}, {a: 3, b: true, c: 3}]);
						});
						it("no rows", function() {
							assert.deepEqual(c.deserialize(hexstr_to_bin("010000002f0000006200630b0003000000610062006300000003000000070000000000010000000000090000000000")), []);
						});
					});
					describe("true", function() {
						it("multiple rows", function() {
							assert.deepEqual(c.deserialize(hexstr_to_bin("01000000620000006200630b0003000000610062006300000003000000070003000000010000000000000002000000000000000300000000000000010003000000010001090003000000000000000000f03f00000000000000400000000000000840"), undefined, true), [{a: 1, b: true, c: 1}, {a: 2, b: false, c: 2}, {a: 3, b: true, c: 3}]);
						});
						it("no rows", function() {
							assert.deepEqual(c.deserialize(hexstr_to_bin("010000002f0000006200630b0003000000610062006300000003000000070000000000010000000000090000000000"), undefined, true), []);
						});
					});
					describe("false", function() {
						it("multiple rows", function() {
							assert.deepEqual(c.deserialize(hexstr_to_bin("01000000620000006200630b0003000000610062006300000003000000070003000000010000000000000002000000000000000300000000000000010003000000010001090003000000000000000000f03f00000000000000400000000000000840"), undefined, false), {a: [1, 2, 3], b: [true, false, true], c: [1, 2, 3]});
						});
						it("no rows", function() {
							assert.deepEqual(c.deserialize(hexstr_to_bin("010000002f0000006200630b0003000000610062006300000003000000070000000000010000000000090000000000"), undefined, false), {a: [], b: [], c: []});
						});
					});
				});
			});
		});
	});
	describe("serialize", function() {
		describe("infer type", function() {
			describe("little", function() {
				it("Boolean", function() {
					assert.equal(bin_to_hexstr(c.serialize(true)), "010000000a000000ff01");
				});
				it("symbol length 1", function() {
					assert.equal(bin_to_hexstr(c.serialize("`a")), "010000000b000000f56100");
				});
				it("symbol unicode", function() {
					assert.equal(bin_to_hexstr(c.serialize("`你")), "010000000d000000f5e4bda000");
				});
				it("symbol length 2", function() { // `ab
					assert.equal(bin_to_hexstr(c.serialize("`ab")), "010000000c000000f5616200");
				});
				it("symbol length 3", function() { // `abc
					assert.equal(bin_to_hexstr(c.serialize("`abc")), "010000000d000000f561626300");
				});
				it("symbol length 4", function() { // `abcd
					assert.equal(bin_to_hexstr(c.serialize("`abcd")), "010000000e000000f56162636400");
				});
				it("symbol length 5", function() { // `abcde
					assert.equal(bin_to_hexstr(c.serialize("`abcde")), "010000000f000000f5616263646500");
				});
				it("String", function() {
					assert.equal(bin_to_hexstr(c.serialize("abc")), "01000000110000000a0003000000616263");
				});
				it("Number", function() {
					assert.equal(bin_to_hexstr(c.serialize(1.0)), "0100000011000000f7000000000000f03f");
				});
				it("Date", function() {
					assert.equal(bin_to_hexstr(c.serialize(new Date("2014-06-23T11:49:31.533"))), "0100000011000000f1facf4b237ea7b440");
				});
				it("Object", function() {
					assert.equal(bin_to_hexstr(c.serialize({a: 1, b: true, c: 3})), "010000002f000000630b0003000000610062006300000003000000f7000000000000f03fff01f70000000000000840");
				});
				it("Array", function() {
					assert.equal(bin_to_hexstr(c.serialize([1, true, 3])), "0100000022000000000003000000f7000000000000f03fff01f70000000000000840");
				});
				it("Null", function() {
					assert.equal(bin_to_hexstr(c.serialize(null)), "010000000a0000006500");
				});
				it("Infinity", function() {
					assert.equal(bin_to_hexstr(c.serialize(Infinity)), "0100000011000000f7000000000000f07f");
				});
				it("-Infinity", function() {
					assert.equal(bin_to_hexstr(c.serialize(-Infinity)), "0100000011000000f7000000000000f0ff");
				});
			});
		});
		describe("typed", function() {
			describe("little", function() {
				describe("primitives", function() {
					it("boolean", function() { // 1b
						assert.equal(bin_to_hexstr(c.serialize(typed.boolean(true))), "010000000a000000ff01");
					});
					describe("guid", function() {
						it("guid", function() { // 0a369037-75d3-b24d-6721-5a1d44d4bed5
							assert.equal(bin_to_hexstr(c.serialize(typed.guid("0a369037-75d3-b24d-6721-5a1d44d4bed5"))), "0100000019000000fe0a36903775d3b24d67215a1d44d4bed5");
						});
						it("null", function() { // 0Ng
							assert.equal(bin_to_hexstr(c.serialize(typed.guid(null))), "0100000019000000fe00000000000000000000000000000000");
						});
					});
					it("byte", function() { // 0x01
						assert.equal(bin_to_hexstr(c.serialize(typed.byte(1))), "010000000a000000fc01");
					});
					describe("short", function() {
						it("1", function() { // 1h
							assert.equal(bin_to_hexstr(c.serialize(typed.short(1))), "010000000b000000fb0100");
						});
						it("null", function() { // 0Nh
							assert.equal(bin_to_hexstr(c.serialize(typed.short(null))), "010000000b000000fb0080");
						});
						it("Infinity", function() { // 0wh
							assert.equal(bin_to_hexstr(c.serialize(typed.short(Infinity))), "010000000b000000fbff7f");
						});
						it("-Infinity", function() { // -0wh
							assert.equal(bin_to_hexstr(c.serialize(typed.short(-Infinity))), "010000000b000000fb0180");
						});
					});
					describe("integer", function() {
						it("1", function() { // 1i
							assert.equal(bin_to_hexstr(c.serialize(typed.int(1))), "010000000d000000fa01000000");
						});
						it("null", function() { // 0Ni
							assert.equal(bin_to_hexstr(c.serialize(typed.int(null))), "010000000d000000fa00000080");
						});
						it("Infinity", function() { // 0wi
							assert.equal(bin_to_hexstr(c.serialize(typed.int(Infinity))), "010000000d000000faffffff7f");
						});
						it("-Infinity", function() { // -0wi
							assert.equal(bin_to_hexstr(c.serialize(typed.int(-Infinity))), "010000000d000000fa01000080");
						});
					});
					describe("long", function() {
						it("1", function() { // 1j
							assert.equal(bin_to_hexstr(c.serialize(typed.long(bignum("1")))), "0100000011000000f90100000000000000");
						});
						it("null", function() { // 0Nj
							assert.equal(bin_to_hexstr(c.serialize(typed.long(null))), "0100000011000000f90000000000000080");
						});
						it("Infinity", function() { // 0wj
							assert.equal(bin_to_hexstr(c.serialize(typed.long(Infinity))), "0100000011000000f9ffffffffffffff7f");
						});
						it("-Infinity", function() { // -0wj
							assert.equal(bin_to_hexstr(c.serialize(typed.long(-Infinity))), "0100000011000000f90100000000000080");
						});
					});
					describe("real", function() {
						it("1", function() { // 1.0e
							assert.equal(bin_to_hexstr(c.serialize(typed.real(1.0))), "010000000d000000f80000803f");
						});
						it("null", function() { // 0Ne
							assert.equal(bin_to_hexstr(c.serialize(typed.real(null))), "010000000d000000f80000c0ff");
						});
						it("Infinity", function() { // 0we
							assert.equal(bin_to_hexstr(c.serialize(typed.real(Infinity))), "010000000d000000f80000807f");
						});
						it("-Infinity", function() { // -0we
							assert.equal(bin_to_hexstr(c.serialize(typed.real(-Infinity))), "010000000d000000f8000080ff");
						});
					});
					describe("float", function() {
						it("1", function() { // 1.0f
							assert.equal(bin_to_hexstr(c.serialize(typed.float(1.0))), "0100000011000000f7000000000000f03f");
						});
						it("null", function() { // 0Nf
							assert.equal(bin_to_hexstr(c.serialize(typed.float(null))), "0100000011000000f7000000000000f8ff");
						});
						it("Infinity", function() { // 0wf
							assert.equal(bin_to_hexstr(c.serialize(typed.float(Infinity))), "0100000011000000f7000000000000f07f");
						});
						it("-Infinity", function() { // -0wf
							assert.equal(bin_to_hexstr(c.serialize(typed.float(-Infinity))), "0100000011000000f7000000000000f0ff");
						});
					});
					describe("char", function() {
						it("a", function() { // "a"
							assert.equal(bin_to_hexstr(c.serialize(typed.char("a"))), "010000000a000000f661");
						});
						it("null", function() { // " "
							assert.equal(bin_to_hexstr(c.serialize(typed.char(null))), "010000000a000000f620");
						});
					});
					describe("symbol", function() {
						it("length 1", function() { // `a
							assert.equal(bin_to_hexstr(c.serialize(typed.symbol("a"))), "010000000b000000f56100");
						});
						it("unicode", function() { // `你
							assert.equal(bin_to_hexstr(c.serialize(typed.symbol("你"))), "010000000d000000f5e4bda000");
						});
						it("null", function() { // `
							assert.equal(bin_to_hexstr(c.serialize(typed.symbol(null))), "010000000a000000f500");
						});
						it("length 2", function() { // `ab
							assert.equal(bin_to_hexstr(c.serialize(typed.symbol("ab"))), "010000000c000000f5616200");
						});
						it("length 3", function() { // `abc
							assert.equal(bin_to_hexstr(c.serialize(typed.symbol("abc"))), "010000000d000000f561626300");
						});
						it("length 4", function() { // `abcd
							assert.equal(bin_to_hexstr(c.serialize(typed.symbol("abcd"))), "010000000e000000f56162636400");
						});
						it("length 5", function() { // `abcde
							assert.equal(bin_to_hexstr(c.serialize(typed.symbol("abcde"))), "010000000f000000f5616263646500");
						});
					});
					describe("timestamp", function() {
						it("timestamp", function() { // 2014.06.23D11:34:39.412000000
							assert.equal(bin_to_hexstr(c.serialize(typed.timestamp(new Date("2014-06-23T11:34:39.412000000")))), "0100000011000000f400f514352d045706");
						});
						it("null", function() { // 0Np
							assert.equal(bin_to_hexstr(c.serialize(typed.timestamp(null))), "0100000011000000f40000000000000080");
						});
					});	
					describe("month", function() {
						it("201401", function() { // 2014.01m
							 assert.equal(bin_to_hexstr(c.serialize(typed.month(new Date("2014-01-01")))), "010000000d000000f3a8000000");
						});
						it("null", function() { // 0Nm
							 assert.equal(bin_to_hexstr(c.serialize(typed.month(null))), "010000000d000000f300000080");
						});
						it("199501", function() { // 1995.01m
							 assert.equal(bin_to_hexstr(c.serialize(typed.month(new Date("1995-01-01")))), "010000000d000000f3c4ffffff");
						});
					});
					describe("date", function() {
						it("20140101", function() { // 2014.01.01
							assert.equal(bin_to_hexstr(c.serialize(typed.date(new Date("2014-01-01")))), "010000000d000000f2fa130000");
						});
						it("null", function() { // 0Nd
							assert.equal(bin_to_hexstr(c.serialize(typed.date(null))), "010000000d000000f200000080");
						});
						it("19950101", function() { // 1995.01.01
							assert.equal(bin_to_hexstr(c.serialize(typed.date(new Date("1995-01-01")))), "010000000d000000f2def8ffff");
						});
					});
					describe("datetime", function() {
						it("datetime", function() { // 2014.06.23T11:49:31.533
							assert.equal(bin_to_hexstr(c.serialize(typed.datetime(new Date("2014-06-23T11:49:31.533")))), "0100000011000000f1facf4b237ea7b440");
						});
						it("null", function() { // 0Nz
							assert.equal(bin_to_hexstr(c.serialize(typed.datetime(null))), "0100000011000000f1000000000000f8ff");
						});
					});
					describe("timespan", function() {
						it("timespan", function() { // 00:01:00.000000000
							assert.equal(bin_to_hexstr(c.serialize(typed.timespan(new Date("2000-01-01T00:01:00.000")))), "0100000011000000f0005847f80d000000");
						});
						it("null", function() { // 0Nn
							assert.equal(bin_to_hexstr(c.serialize(typed.timespan(null))), "0100000011000000f00000000000000080");
						});
					});
					describe("minute", function() {
						it("minute", function() { // 00:01
							assert.equal(bin_to_hexstr(c.serialize(typed.minute(new Date("2000-01-01T00:01:00.000")))), "010000000d000000ef01000000");
						});
						it("null", function() { // 0Nu
							assert.equal(bin_to_hexstr(c.serialize(typed.minute(null))), "010000000d000000ef00000080");
						});
					});
					describe("second", function() {
						it("second", function() { // 00:00:01
							assert.equal(bin_to_hexstr(c.serialize(typed.second(new Date("2000-01-01T00:00:01.000")))), "010000000d000000ee01000000");
						});
						it("null", function() { // 0Nv
							assert.equal(bin_to_hexstr(c.serialize(typed.second(null))), "010000000d000000ee00000080");
						});
					});
					describe("time", function() {
						it("time", function() { // 00:00:00.001
							assert.equal(bin_to_hexstr(c.serialize(typed.time(new Date("2000-01-01T00:00:00.001")))), "010000000d000000ed01000000");
						});
						it("null", function() { // 0Nt
							assert.equal(bin_to_hexstr(c.serialize(typed.time(null))), "010000000d000000ed00000080");
						});
					});
				});
				describe("list", function() {
					describe("generic", function() {
						it("two values", function() {
							assert.equal(bin_to_hexstr(c.serialize([typed.boolean(true), typed.float(1)])), "0100000019000000000002000000ff01f7000000000000f03f");
						});
						it("three values", function() { // (1l;1b;`a)
							assert.equal(bin_to_hexstr(c.serialize([typed.long(bignum(1)), typed.boolean(true), typed.symbol("a")])), "010000001c000000000003000000f90100000000000000ff01f56100");
						});
						it("list of list", function() {
							assert.equal(bin_to_hexstr(c.serialize([typed.bytes([0, 1, 2, 3, 4])])), "01000000190000000000010000000400050000000001020304");
						});
					});
					describe("typed", function() {
						it("boolean", function() {
							assert.equal(bin_to_hexstr(c.serialize(typed.booleans([true, false]))), "01000000100000000100020000000100");
						});
						it("guid", function() {
							assert.equal(bin_to_hexstr(c.serialize(typed.guids(["0a369037-75d3-b24d-6721-5a1d44d4bed5", "0a369037-75d3-b24d-6721-5a1d44d4bed5"]))), "010000002e0000000200020000000a36903775d3b24d67215a1d44d4bed50a36903775d3b24d67215a1d44d4bed5");
						});
						it("byte", function() {
							assert.equal(bin_to_hexstr(c.serialize(typed.bytes([0, 1, 2, 3, 4]))), "01000000130000000400050000000001020304");
						});
						it("short", function() {
							assert.equal(bin_to_hexstr(c.serialize(typed.shorts([1, 2, 3]))), "0100000014000000050003000000010002000300");
						});
						it("1 integer", function() {
							assert.equal(bin_to_hexstr(c.serialize(typed.ints([1]))), "010000001200000006000100000001000000");
						});
						it("3 integers", function() {
							assert.equal(bin_to_hexstr(c.serialize(typed.ints([1, 2, 3]))), "010000001a000000060003000000010000000200000003000000");
						});
						it("long", function() { //
							assert.equal(bin_to_hexstr(c.serialize(typed.longs([bignum(1), bignum(2), bignum(3)]))), "0100000026000000070003000000010000000000000002000000000000000300000000000000");
						});
						it("real", function() { //
							assert.equal(bin_to_hexstr(c.serialize(typed.reals([1.0, 2.0, 3.0]))), "010000001a0000000800030000000000803f0000004000004040");
						});
						it("float", function() { //
							assert.equal(bin_to_hexstr(c.serialize(typed.floats([1.0, 2.0, 3.0]))), "0100000026000000090003000000000000000000f03f00000000000000400000000000000840");
						});
						it("char", function() { //
							assert.equal(bin_to_hexstr(c.serialize(typed.chars(["a", "b", "c"]))), "01000000110000000a0003000000616263");
						});
						it("symbol", function() { //
							assert.equal(bin_to_hexstr(c.serialize(typed.symbols(["a", "ab", "abc"]))), "01000000170000000b0003000000610061620061626300");
						});
						it("timestamp", function() { // (2014.01.01D12:00:00.000000000;2014.01.02D12:00:00.000000000;2014.01.03D12:00:00.000000000)
							assert.equal(bin_to_hexstr(c.serialize(typed.timestamps([new Date("2014-01-01T12:00:00.000000000"), new Date("2014-01-02T12:00:00.00000000"), new Date("2014-01-03T12:00:00.000000000")]))), "01000000260000000c00030000000080cd0c29eb210600801c9ebd39220600806b2f52882206");
						});
						it("month", function() { // (1995.01m;1995.02m;1995.03m)
							assert.equal(bin_to_hexstr(c.serialize(typed.months([new Date("1995-01-01"), new Date("1995-02-01"), new Date("1995-03-01")]))), "010000001a0000000d0003000000c4ffffffc5ffffffc6ffffff");
						});
						it("date", function() { // (2014.01.01;2014.01.02;2014.01.03)
							assert.equal(bin_to_hexstr(c.serialize(typed.dates([new Date("2014-01-01"), new Date("2014-01-02"), new Date("2014-01-03")]))), "010000001a0000000e0003000000fa130000fb130000fc130000");
						});
						it("datetime", function() { // (2014.06.23T11:49:31.533;2014.06.23T11:49:31.534;2014.06.23T11:49:31.535)
							assert.equal(bin_to_hexstr(c.serialize(typed.datetimes([new Date("2014-06-23T11:49:31.533"), new Date("2014-06-23T11:49:31.534"), new Date("2014-06-23T11:49:31.535")]))), "01000000260000000f0003000000facf4b237ea7b440b0014c237ea7b44066334c237ea7b440");
						});
						it("timespan", function() { // (00:01:00.000000000;00:02:00.000000000;00:03:00.000000000)
							assert.equal(bin_to_hexstr(c.serialize(typed.timespans([new Date("2000-01-01T00:01:00.000"), new Date("2000-01-01T00:02:00.000"), new Date("2000-01-01T00:03:00.000")]))), "0100000026000000100003000000005847f80d00000000b08ef01b0000000008d6e829000000");
						});
						it("minute", function() { // (00:01;00:02;00:03)
							assert.equal(bin_to_hexstr(c.serialize(typed.minutes([new Date("2000-01-01T00:01:00.000"), new Date("2000-01-01T00:02:00.000"), new Date("2000-01-01T00:03:00.000")]))), "010000001a000000110003000000010000000200000003000000");
						});
						it("second", function() { // (00:00:01;00:00:02;00:00:03)
							assert.equal(bin_to_hexstr(c.serialize(typed.seconds([new Date("2000-01-01T00:00:01.000"), new Date("2000-01-01T00:00:02.000"), new Date("2000-01-01T00:00:03.000")]))), "010000001a000000120003000000010000000200000003000000");
						});
						it("time", function() { // (00:00:00.001;00:00:00.002;00:00:00.003)
							assert.equal(bin_to_hexstr(c.serialize(typed.times([new Date("2000-01-01T00:00:00.001"), new Date("2000-01-01T00:00:00.002"), new Date("2000-01-01T00:00:00.003")]))), "010000001a000000130003000000010000000200000003000000");
						});
					});
				});
				// FIXME test serialize dict
				// TODO test serialize table
			});
		});
	});
});

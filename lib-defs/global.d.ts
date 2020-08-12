// https://www.lua.org/manual/5.1/manual.html#5.1

type unknown = any;
type table = {
  [key: number]: any;
  [key: string]: any;
};
type TableKey = number | string;
type thread = {};
type userdata = any;

/**
 * Before starting to run the script, lua collects all arguments in the command
 * line in a global table called arg. The script name is stored at index 0, the
 * first argument after the script name goes to index 1, and so on. Any arguments
 * before the script name (that is, the interpreter name plus the options) go to
 * negative indices. For instance, in the call.
 */
declare let arg: { [index: number]: string };

/**
 * Calls error if the value of its argument v is false (i.e., nil or false);
 * otherwise, returns all its arguments. In case of error, message is the error
 * object; when absent, it defaults to "assertion failed!"
 */
declare function assert(v: boolean, message?: string): void;

/**
 * This function is a generic interface to the garbage collector. It performs
 * different functions according to its first argument, opt.
 *
 * Performs a full garbage-collection cycle. This is the default option.
 */
declare function collectgarbage(opt?: "collect"): void;

/**
 * This function is a generic interface to the garbage collector. It performs
 * different functions according to its first argument, opt.
 *
 * Stops automatic execution of the garbage collector. The collector will run only
 * when explicitly invoked, until a call to restart it.
 */
declare function collectgarbage(opt: "stop"): void;

/**
 * This function is a generic interface to the garbage collector. It performs
 * different functions according to its first argument, opt.
 *
 * Restarts automatic execution of the garbage collector.
 */
declare function collectgarbage(opt: "restart"): void;

/**
 * This function is a generic interface to the garbage collector. It performs
 * different functions according to its first argument, opt.
 *
 * Returns the total memory in use by Lua in Kbytes. The value has a fractional
 * part, so that it multiplied by 1024 gives the exact number of bytes in use by
 * Lua (except for overflows).
 */
declare function collectgarbage(opt: "count"): number;

/**
 * This function is a generic interface to the garbage collector. It performs
 * different functions according to its first argument, opt.
 *
 * Performs a garbage-collection step. The step "size" is controlled by arg. With
 * a zero value, the collector will perform one basic (indivisible) step. For
 * non-zero values, the collector will perform as if that amount of memory (in
 * KBytes) had been allocated by Lua. Returns true if the step finished a
 * collection cycle.
 */
declare function collectgarbage(opt: "step", arg: number): boolean;

/**
 * This function is a generic interface to the garbage collector. It performs
 * different functions according to its first argument, opt.
 *
 * Sets arg as the new value for the pause of the collector (see §2.5). Returns
 * the previous value for pause.
 */
declare function collectgarbage(opt: "setpause", arg: number): number;

/**
 * This function is a generic interface to the garbage collector. It performs
 * different functions according to its first argument, opt.
 *
 * Sets arg as the new value for the step multiplier of the collector (see §2.5).
 * Returns the previous value for step.
 */
declare function collectgarbage(opt: "setstepmul", arg: number): number;

/**
 * This function is a generic interface to the garbage collector. It performs
 * different functions according to its first argument, opt.
 *
 * Returns a boolean that tells whether the collector is running (i.e., not
 * stopped).
 */
declare function collectgarbage(opt: "isrunning"): boolean;

/**
 * Opens the named file and executes its contents as a Lua chunk. When called
 * without arguments, dofile executes the contents of the standard input (stdin).
 * Returns all values returned by the chunk. In case of errors, dofile propagates
 * the error to its caller (that is, dofile does not run in protected mode).
 */
declare function dofile(filename?: string): any;

/**
 * Returns a string containing a binary representation of the given function, so
 * that a later loadstring on this string returns a copy of the function. function
 * must be a Lua function without upvalues.
 */
declare function dump(func: Function, strip?: boolean): string;

/**
 * Terminates the last protected function called and returns message as the error
 * message. Function error never returns.
 *
 * Usually, error adds some information about the error position at the beginning
 * of the message. The level argument specifies how to get the error position.
 * With level 1 (the default), the error position is where the error function was
 * called. Level 2 points the error to where the function that called error was
 * called; and so on. Passing a level 0 avoids the addition of error position
 * information to the message.
 */
declare function error(message: string, level?: 0 | 1 | 2): never;

/**
 * A global variable (not a function) that holds the global environment (that is,
 * _G._G = _G). Lua itself does not use this variable; changing its value does not
 * affect any environment, nor vice-versa. (Use setfenv to change environments.)
 */
declare const _G: { [key: string]: any };

/**
 * Returns the current environment in use by the function. f can be a Lua function
 * or a number that specifies the function at that stack level: Level 1 is the
 * function calling getfenv. If the given function is not a Lua function, or if f
 * is 0, getfenv returns the global environment. The default for f is 1.
 */
declare function getfenv(f?: Function | 0 | 1 | 2): table;

/**
 * If object does not have a metatable, returns nil. Otherwise, if the object's
 * metatable has a "__metatable" field, returns the associated value. Otherwise,
 * returns the metatable of the given object.
 */
declare function getmetatable(object: table): Metatable | null;

/**
 * Returns three values (an iterator function, the table t, and 0) so that the construction
 *
 * `for i,v in ipairs(t) do body end`
 *
 * will iterate over the key–value pairs (1,t[1]), (2,t[2]), ..., up to the first nil value.
 */
/** !TupleReturn */
declare function ipairs<T = table>(
  t: T
): [(t: T, index?: number) => [number, any], T, 0];

/**
 * Loads a chunk using function func to get its pieces. Each call to func must
 * return a string that concatenates with previous results. A return of an empty
 * string, nil, or no value signals the end of the chunk.
 *
 * If there are no errors, returns the compiled chunk as a function; otherwise,
 * returns nil plus the error message. The environment of the returned function is
 * the global environment.
 *
 * chunkname is used as the chunk name for error messages and debug information.
 * When absent, it defaults to "=(load)".
 */
declare function load(
  chunk: string | (() => string | null | undefined),
  chunkname?: string,
  mode?: "b" | "t" | "bt",
  env?: unknown
): () => () => any | [null, string];

/**
 * Similar to load, but gets the chunk from file filename or from the standard
 * input, if no file name is given.
 */
/** !TupleReturn */
declare function loadfile(
  filename?: string,
  mode?: "b" | "t" | "bt",
  env?: unknown
): () => any | [null, string];

/**
 * Similar to load, but gets the chunk from the given string.
 *
 * To load and run a given string, use the idiom
 *      assert(loadstring(s))()
 *
 * When absent, chunkname defaults to the given string.
 */
declare function loadstring(str: string, chunkname?: string): Function | null;

/**
 * Allows a program to traverse all fields of a table. Its first argument is a
 * table and its second argument is an index in this table. next returns the next
 * index of the table and its associated value. When called with nil as its second
 * argument, next returns an initial index and its associated value. When called
 * with the last index, or with nil in an empty table, next returns nil. If the
 * second argument is absent, then it is interpreted as nil. In particular, you
 * can use next(t) to check whether a table is empty.
 *
 * The order in which the indices are enumerated is not specified, even for
 * numeric indices. (To traverse a table in numeric order, use a numerical for or
 * the ipairs function.)
 *
 * The behavior of next is undefined if, during the traversal, you assign any
 * value to a non-existent field in the table. You may however modify existing
 * fields. In particular, you may clear existing fields.
 */
/** !TupleReturn */
declare function next(table: table, index?: TableKey): [TableKey, any] | null;

/**
 * If t has a metamethod __pairs, calls it with t as argument and returns the first three results from the call.
 * Otherwise, returns three values: the next function, the table t, and nil, so that the construction
 *
 * `for k,v in pairs(t) do body end`
 *
 * will iterate over all key–value pairs of table t.
 *
 * See function next for the caveats of modifying the table during its traversal.
 */
/** !TupleReturn */
declare function pairs<T>(
  t: T
): [(t: T, index?: TableKey) => [TableKey, any], T, null];

/**
 * Calls function f with the given arguments in protected mode. This means that
 * any error inside f is not propagated; instead, pcall catches the error and
 * returns a status code. Its first result is the status code (a boolean), which
 * is true if the call succeeds without errors. In such case, pcall also returns
 * all results from the call, after this first result. In case of any error, pcall
 * returns false plus the error message.
 */
/** !TupleReturn */
declare function pcall(f: () => any, ...args: any[]): true | [false, string];

/**
 * Receives any number of arguments, and prints their values to stdout, using the
 * tostring function to convert them to strings. print is not intended for
 * formatted output, but only as a quick way to show a value, typically for
 * debugging. For formatted output, use string.format.
 */
declare function print(...args: any[]): void;

/**
 * Checks whether v1 is equal to v2, without invoking any metamethod. Returns a
 * boolean.
 */
declare function rawequal<T>(v1: T, v2: T): boolean;

/**
 * Gets the real value of table[index], without invoking the __index metamethod.
 * table must be a table; index may be any value.
 */
declare function rawget(table: table, index: TableKey): any;

/**
 * Returns the length of the object v, which must be a table or a string, without
 * invoking the __len metamethod. Returns an integer.
 */
declare function rawlen(v: table | string): number;

/**
 * Sets the real value of table[index] to value, without invoking the __newindex
 * metamethod. table must be a table, index any value different from nil and NaN,
 * and value any Lua value.
 *
 * This function returns table.
 */
declare function rawset<T>(table: T, index: TableKey, value: any): T;

/**
 * If index is a number, returns all arguments after argument number index; a
 * negative number indexes from the end (-1 is the last argument). Otherwise,
 * index must be the string "#", and select returns the total number of extra
 * arguments it received.
 */
declare function select<T>(index: number, ...args: T[]): T[];

/**
 * If index is a number, returns all arguments after argument number index; a
 * negative number indexes from the end (-1 is the last argument). Otherwise,
 * index must be the string "#", and select returns the total number of extra
 * arguments it received.
 */
declare function select<T>(index: "#", ...args: T[]): number;

/**
 * Sets the environment to be used by the given function. f can be a Lua function
 * or a number that specifies the function at that stack level: Level 1 is the
 * function calling setfenv. setfenv returns the given function.
 *
 * As a special case, when f is 0 setfenv changes the environment of the running
 * thread. In this case, setfenv returns no values.
 */
declare function setfenv(f?: Function | 0 | 1 | 2): Function | undefined;
declare function setfenv(
  f: Function | 0 | 1 | 2,
  tbl: table
): Function | undefined;

/**
 * Sets the metatable for the given table. (To change the metatable of other
 * types from Lua code, you must use the debug library (§6.10).) If metatable is
 * nil, removes the metatable of the given table. If the original metatable has
 * a __metatable field, raises an error.
 *
 * This function returns table.
 */
declare function setmetatable<T extends table>(
  table: table,
  metatable?: Metatable<T>
): T;
declare function setmetatable<T extends table>(
  table: T,
  metatable?: Metatable
): T;

/**
 * When called with no base, tonumber tries to convert its argument to a number.
 * If the argument is already a number or a string convertible to a number, then
 * tonumber returns this number; otherwise, it returns nil.
 *
 * The conversion of strings can result in integers or floats, according to the
 * lexical conventions of Lua (see §3.1). (The string may have leading and
 * trailing spaces and a sign.)
 *
 * When called with base, then e must be a string to be interpreted as an
 * integer numeral in that base. The base may be any integer between 2 and 36,
 * inclusive. In bases above 10, the letter 'A' (in either upper or lower case)
 * represents 10, 'B' represents 11, and so forth, with 'Z' representing 35. If
 * the string e is not a valid numeral in the given base, the function returns nil.
 */
declare function tonumber(e: any, base?: number): number | null;

/**
 * Receives a value of any type and converts it to a string in a human-readable
 * format. (For complete control of how numbers are converted, use string.format.)
 *
 * If the metatable of v has a __tostring field, then tostring calls the
 * corresponding value with v as argument, and uses the result of the call as
 * its result.
 */
declare function tostring(v: unknown): string;

/**
 * Returns the type of its only argument, coded as a string. The possible
 * results of this function are "nil" (a string, not the value nil), "number",
 * "string", "boolean", "table", "function", "thread", and "userdata".
 */
declare function type(
  v: any
):
  | "nil"
  | "number"
  | "string"
  | "boolean"
  | "table"
  | "function"
  | "thread"
  | "userdata";

/**
 * A global variable (not a function) that holds a string containing the running
 * Lua version. The current value of this variable is "Lua 5.3".
 */
declare const _VERSION: "Lua 5.1";

/**
 * Returns the elements from the given list. This function is equivalent to
 *
 * `return list[i], list[i+1], ···, list[j]`
 *
 * By default, i is 1 and j is #list.
 */
declare function unpack(list: any[], i?: number, j?: number): any[];

/**
 * This function is similar to pcall, except that it sets a new message handler msgh.
 */
/** !TupleReturn */
declare function xpcall(
  f: () => any,
  msgh: () => any,
  ...args: any[]
): true | [false, string];

// https://www.lua.org/manual/5.1/manual.html#5.6

/**
 * A lightweight JSON library for Lua
 * https://github.com/rxi/json.lua
 */

declare namespace json {
  /**
   * Returns a string representing value encoded in JSON.
   */
  function encode(obj:any): string;

  /**
   * Returns a value representing the decoded JSON string.
   */
  function decode(obj:string): any;

}
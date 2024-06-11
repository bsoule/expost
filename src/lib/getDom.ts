import * as cheerio from "cheerio";
import memoize from "./memoize.js";

const { error } = console;

console.error = (...args: unknown[]) => {
  if (String(args[0]).includes("Failed to load external script")) return;
  error(...args);
};

const getDom = memoize((html: string) => {
  return cheerio.load(html, null, false);
});

export default getDom;

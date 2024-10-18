import { marked } from "marked";
import smartypants from "./extentions/smartypants.js";
import urls from "./extentions/urls.js";
import ids from "./extentions/ids.js";

marked.use(urls, smartypants, ids);

export default function parse(markdown: string): string {
  // WORKAROUND: `marked.parse` shouldn't return a promise if
  // the `async` option has not been set to `true`
  // https://marked.js.org/using_pro#async
  return marked.parse(markdown) as string;
}

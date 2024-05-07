import type sanitize from "sanitize-html";

const HOSTNAMES = ["platform.twitter.com"];

const URLS = [
  "https://gist.github.com/3765191.js?file=gmail_count.rb",
  "https://zapier.com/zapbook/embed/widget.js?iframe=true&guided_zaps=301,302,336",
  "https://ifttt.com/assets/embed_recipe.js",
  "https://www.google.com/trends/embed.js?hl=en-US&q=beeminder,+stickk&date=11/2007+97m&cmpt=q&tz=Etc/GMT%2B7&tz=Etc/GMT%2B7&content=1&cid=TIMESERIES_GRAPH_0&export=5&w=500&h=330",
];

export default function checkScript(
  tagName: string | undefined,
  attribs: sanitize.Attributes,
) {
  if (tagName !== "script") {
    throw new Error("Expected script");
  }

  const { src = "" } = attribs;
  const url = new URL(/https/gm.test(src) ? src : `https:${src}`);

  if (!HOSTNAMES.includes(url.hostname) && !URLS.includes(url.href)) {
    throw new Error(
      "Script not allowed. If the Script is authorized, add it to backend Whitelist." +
        "\r\n" +
        "\r\n" +
        "ESCAPED SCRIPT -- " +
        JSON.stringify(attribs),
    );
  }

  return {
    tagName,
    attribs,
  };
}

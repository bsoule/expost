import getDom from "./getDom.js";

function apply(html: string) {
  const $ = getDom(html);
  const matches = $("*").not("script").not("noscript").not("style");

  matches.each((_, el) => {
    if ($(el).children().length) return;
    if (!$(el).text().length) return;

    const idText = $(el)
      .text()
      .match(/\{#(.*)\}/)?.[1];

    if (!idText) return;

    const newTextContent = $(el)
      .text()
      .replace(/\{#([^}]*?)\}/g, "")
      .trim();

    $(el).attr("id", idText);
    $(el).text(newTextContent);
  });

  return $.html();
}

export default function applyIdsToElements(html: string): string {
  return /\{#.*?\}/.test(html) ? apply(html) : html;
}

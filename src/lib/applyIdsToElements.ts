import getDom from "./getDom.js";

function apply(html: string) {
  const $ = getDom(html);
  const matches = $("*").not("script").not("noscript").not("style");

  matches.each((_, el) => {
    const elHtml = $(el).html();
    if (!elHtml || !$(el).text().includes("{#")) return;

    const idTextMatch = elHtml.match(/\{#(.*)\}/);
    const idText = idTextMatch ? idTextMatch[1] : null;

    if (!idText) return;

    const newHtmlContent = elHtml.replace(/\{#([^}]*?)\}/g, "").trim();

    $(el).attr("id", idText);
    $(el).html(newHtmlContent);
  });

  return $.html();
}

export default function applyIdsToElements(html: string): string {
  return /\{#.*?\}/.test(html) ? apply(html) : html;
}

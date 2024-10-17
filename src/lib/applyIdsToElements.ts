import getDom from "./getDom.js";

function apply(html: string) {
  const $ = getDom(html);
  const matches = $("*").not("script").not("noscript").not("style");

  matches.each((_, el) => {
    const elHtml = $(el).html();
    if (!elHtml) return;

    // Check if the element itself contains the ID pattern
    const idMatch = elHtml.match(/\{#(.*?)\}/);
    if (!idMatch) return;

    const idText = idMatch[1];
    const newHtmlContent = elHtml.replace(/\{#(.*?)\}/, "").trim();

    // Ensure the ID is applied to the correct element
    if (
      $(el)
        .contents()
        .filter(
          (_, node) =>
            node.nodeType === 3 && node.nodeValue?.includes(`{#${idText}}`)
        ).length > 0
    ) {
      $(el).attr("id", idText);
      $(el).html(newHtmlContent);
    }
  });

  return $.html();
}

export default function applyIdsToElements(html: string): string {
  return /\{#.*?\}/.test(html) ? apply(html) : html;
}

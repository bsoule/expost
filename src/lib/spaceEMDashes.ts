export default function spaceEMDashes(html: string): string {
    return html.replace(/ &#8212; /g, "&#8201;&#8212;&#8201;");
}

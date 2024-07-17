import type sanitize from "sanitize-html";

const HOSTNAMES = [
  "www.youtube.com",
  "www.beeminder.com",
  "player.vimeo.com",
  "prezi.com",
  "trends.google.com",
];

const URLS = [
  "https://docs.google.com/presentation/d/1Opomsxe4GJzuE0DMha6_ORUVSdt4M3_8fqO6OepvAj0/embed?start=false&loop=false&delayms=15000",
  "https://docs.google.com/presentation/d/1_-U-fKweYmLgljInHL7h5RmTr42l2WmIjRtUqNnCjso/embed?start=false&loop=false&delayms=15000",
];

export default function checkIframe(
  tagName: string | undefined,
  attribs: sanitize.Attributes,
) {
  if (tagName !== "iframe") {
    throw new Error("Expected iframe");
  }

  const { src = "" } = attribs;
  const url = new URL(/https/gm.test(src) ? src : `https:${src}`);

  if (!HOSTNAMES.includes(url.hostname) && !URLS.includes(url.href)) {
    throw new Error(
      "Iframe src not allowed. If the Iframe src is authorized, add it to backend Whitelist." +
        "\r\n" +
        "\r\n" +
        "ESCAPED Iframe -- " +
        src,
    );
  }

  return {
    tagName,
    attribs,
  };
}

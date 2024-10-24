import type { Tokens } from "marked";

export default {
  tokenizer: {
    url(src: string): Tokens.Link | false {
      const urlRegex = /^https?:\/\/[^\s\]]+/;
      const match = src.match(urlRegex);

      if (match) {
        return {
          type: "link",
          raw: match[0],
          href: match[0],
          text: match[0],
          tokens: [
            {
              type: "text",
              raw: match[0],
              text: match[0],
            },
          ],
        };
      }

      return false;
    },
  },
  renderer: {
    link({ href, text }: Tokens.Link) {
      const emailRegex = /^mailto:\S+@\S+\.\S+$/;
      if (emailRegex.test(href)) {
        return text;
      }

      return false;
    },
  },
};

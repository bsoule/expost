// http://doc.bmndr.co/

function findIdentifiers(markdown: string): string[] {
  const fns = markdown.matchAll(/\$FN\[(.*?)\]/g);
  const ids: string[] = Array.from(fns)
    .map((fn) => fn[1])
    .filter((v): v is string => !!v);

  return [...new Set(ids)];
}

export default function linkFootnotes(markdown: string): string {
  const ids = findIdentifiers(markdown);

  return ids.reduce((acc, id, i) => {
    const regex = new RegExp(`\\$(?:FN\\[)?${id}\\b`, "g");
    const chunks = acc.split(regex);

    return chunks.reduce((acc, chunk, j, arr) => {
      if (j === 0) return chunk;

      const text = `[${i + 1}]`;
      const isEndNote = j === arr.length - 1;
      const htmlId = isEndNote ? id : `${id}${j}`;
      const href = isEndNote ? `${id}1` : id;
      const after = chunk[0] === "]" ? chunk.slice(1) : chunk;

      return `${acc}<a class="footnote" id="${htmlId}" href="#${href}">${text}</a>${after}`;
    });
  }, markdown);
}

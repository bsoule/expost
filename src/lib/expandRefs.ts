// http://doc.bmndr.co/

function findIdentifiers(markdown: string): string[] {
  const fns = markdown.matchAll(/\$REF\[(.*?)\]/g);
  const ids: string[] = Array.from(fns)
    .map((fn) => fn[1])
    .filter((v): v is string => !!v);

  return [...new Set(ids)];
}

export default function expandRefs(markdown: string): string {
  const ids = findIdentifiers(markdown);

  return ids.reduce((acc, id, i) => {
    const regex = new RegExp(`\\$(?:REF\\[)?${id}\\]?`, "g");
    const chunks = acc.split(regex);

    return chunks.reduce((acc, chunk, j) =>
      j === 0 ? chunk : `${acc}${i + 1}${chunk}`,
    );
  }, markdown);
}

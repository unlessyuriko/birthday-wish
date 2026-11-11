export type Measure = (text: string, size: number) => number;

/** Greedy word wrap. A single over-long word is split by characters so nothing overflows. */
export function wrapText(measure: Measure, text: string, size: number, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = '';
  const push = (l: string) => lines.push(l);
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const trial = line ? `${line} ${word}` : word;
    if (measure(trial, size) <= maxWidth) {
      line = trial;
      continue;
    }
    if (line) push(line);
    line = '';
    if (measure(word, size) <= maxWidth) {
      line = word;
    } else {
      let chunk = '';
      for (const ch of word) {
        if (measure(chunk + ch, size) > maxWidth && chunk) {
          push(chunk);
          chunk = ch;
        } else chunk += ch;
      }
      line = chunk;
    }
  }
  if (line) push(line);
  return lines.length ? lines : [''];
}

/** Shrinks the font until the text fits in maxLines, never below minSize. Never truncates. */
export function fitText(measure: Measure, text: string, maxWidth: number, startSize: number, minSize: number, maxLines: number) {
  let size = startSize;
  let lines = wrapText(measure, text, size, maxWidth);
  while (lines.length > maxLines && size > minSize) {
    size = Math.max(minSize, size - 4);
    lines = wrapText(measure, text, size, maxWidth);
  }
  return { size, lines };
}

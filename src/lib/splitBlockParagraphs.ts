/**
 * Split a block's text into separate paragraphs at blank lines.
 * Single line breaks remain inside a paragraph and are rendered with
 * whitespace-pre-line by the block renderers.
 */
export function splitBlockParagraphs(text: string): string[] {
  return text
    .split(/\r?\n(?:[ \t]*\r?\n)+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

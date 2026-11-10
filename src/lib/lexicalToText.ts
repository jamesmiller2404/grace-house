
type LexicalNode = {
  type?: string;
  text?: string;
  children?: LexicalNode[];
  root?: {
    children?: LexicalNode[];
  };
};

export function lexicalToText(node: LexicalNode | null | undefined): string {
  if (!node) return '';

  if (typeof node.text === 'string') return node.text;

  const children = node.children ?? node.root?.children ?? [];
  const parts = children.map(lexicalToText).filter(Boolean);
  const blocks = ['paragraph', 'heading', 'listitem', 'quote'];

  return blocks.includes(node.type ?? '')
    ? parts.join('') + '\n'
    : parts.join('');
}

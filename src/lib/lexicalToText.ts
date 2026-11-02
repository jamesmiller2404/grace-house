export function lexicalToText(node: any): string {
  if (!node) return ''
  if (typeof node.text === 'string') return node.text
  const children: any[] = node.children ?? node.root?.children ?? []
  const parts = children.map(lexicalToText).filter(Boolean)
  const blocks = ['paragraph', 'heading', 'listitem', 'quote']
  return blocks.includes(node.type) ? parts.join('') + '\n' : parts.join('')
}
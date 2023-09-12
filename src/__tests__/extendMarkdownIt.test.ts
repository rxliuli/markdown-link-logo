import MarkdownIt from 'markdown-it'
import { it } from 'vitest'
import { extendMarkdownIt } from '../extendMarkdownIt'

it('should extend markdown-it', () => {
  const md = new MarkdownIt()
  md.use(extendMarkdownIt)
  console.log(md.render('<https://github.com>'))
})

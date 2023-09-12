import MarkdownIt from 'markdown-it'
import { icons } from './icons'

function parseUrl(url: string): URL | undefined {
  try {
    return new URL(url)
  } catch {}
}

export function prefixIcon(md: MarkdownIt) {
  const defaultRender =
    md.renderer.rules.link_open ||
    function (tokens, idx, options, _env, self) {
      return self.renderToken(tokens, idx, options)
    }

  md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    const hrefIndex = tokens[idx].attrIndex('href')
    if (hrefIndex >= 0) {
      const hrefValue = tokens[idx].attrs?.[hrefIndex][1]
      // 检查链接是否符合某种规则，例如链接是否包含 'github.com'
      if (hrefValue) {
        const u = parseUrl(hrefValue)
        if (u) {
          const icon = icons.find((it) => it.link === u.hostname)
          if (icon) {
            const iconRaw = icon.icon.replace(
              '<svg ',
              '<svg class="markdown-link-logo-prefix"',
            )
            // 添加 SVG 前缀
            return `<a href="${hrefValue}" style="display: inline-flex; align-items: center; gap: 4px; vertical-align: bottom;">${iconRaw}`
          }
        }
      }
    }
    return defaultRender(tokens, idx, options, env, self)
  }
}

export function extendMarkdownIt(md: MarkdownIt) {
  return md.use(prefixIcon)
}

import { chain, filter, uniq, uniqBy } from 'lodash-es'
import websites from './assets/website.json'
import { it } from 'vitest'
import { readdir, writeFile } from 'fs/promises'
import pathe from 'pathe'
import { camelCase } from 'change-case'

interface Icon {
  link: string
  icon: string
}

async function scan(): Promise<Icon[]> {
  const iconsPath = pathe.resolve(__dirname, '../assets')
  const icons = (await readdir(iconsPath)).map((it) =>
    pathe.basename(it, '.svg'),
  )
  return websites
    .map((it) => {
      const a = it.split('.')
      return {
        link: it,
        icon: icons.find((i) =>
          i === 'google' && a[a.length - 3] ? false : a[a.length - 2] === i,
        ),
      } as Icon
    })
    .filter((it) => it.icon)
    .map((it) => ({
      ...it,
      icon: pathe.resolve(iconsPath, `${it.icon}.svg`),
    }))
}

function generateCode(list: Icon[], outputPath: string): string {
  const c = list
    .map((it) => {
      const relPath = pathe.relative(pathe.dirname(outputPath), it.icon)
      return `import ${camelCase(it.link)} from './${relPath}?raw'\n`
    })
    .join('')

  return (
    c +
    `export const icons = [
      ${list
        .map(
          (it) => `{ "link": "${it.link}", "icon": ${camelCase(it.link)} },\n`,
        )
        .join('')}
    ]`
  )
}

it('generate icons', async () => {
  const preList: Icon[] = [
    { link: 'youtu.be', icon: 'youtube' },
    { link: 'en.wikipedia.org', icon: 'wikipedia-w' },
    { link: 't.me', icon: 'telegram' },
    { link: 'google.com', icon: 'google' },
    { link: 'docker.com', icon: 'docker' },
    { link: 'play.google.com', icon: 'google-play' },
    { link: 'drive.google.com', icon: 'google-drive' },
    { link: 'firefox.com', icon: 'firefox' },
    { link: 'alipay.com', icon: 'alipay' },
  ].map((it) => ({
    ...it,
    icon: pathe.resolve(__dirname, '../assets', it.icon + '.svg'),
  }))
  const list = uniqBy([...preList, ...(await scan())], (it) => it.link)
  const outputPath = pathe.resolve(__dirname, '../icons.ts')
  const c = generateCode(list, outputPath)
  await writeFile(outputPath, c)
  // console.log(
  //   websites
  //     .slice(0, 50)
  //     .filter((it) => !list.map((it) => it.link).includes(it)),
  // )
})

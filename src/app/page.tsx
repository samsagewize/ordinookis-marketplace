import { promises as fs } from 'fs'
import path from 'path'
import type { Ordinooki } from '@/types'
import { enrichCollection } from '@/lib/collection'
import MarketplaceClient from '@/components/MarketplaceClient'

async function loadCollection(): Promise<Ordinooki[]> {
  const filePath = path.join(process.cwd(), 'public', 'data', 'ordinookis.json')
  const raw = await fs.readFile(filePath, 'utf-8')
  const data: Ordinooki[] = JSON.parse(raw)
  return enrichCollection(data)
}

export default async function Home() {
  const collection = await loadCollection()
  return <MarketplaceClient collection={collection} />
}

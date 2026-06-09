import { createClient } from '@sanity/client'
import { config as loadEnv } from 'dotenv'

loadEnv()

const c = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  token: process.env.SANITY_AUTH_TOKEN!,
  apiVersion: '2025-01-01',
  useCdn: false,
})

async function run() {
  const r = await c.fetch(`*[_type == 'pillar'] | order(number asc) {
    title,
    'concepts': *[_type == 'concept' && pillar._ref == ^._id] | order(number asc) {
      title,
      code,
      'activityCount': count(*[_type == 'activity' && objective->concept._ref == ^._id]),
      'objectiveCount': count(*[_type == 'objective' && concept._ref == ^._id]),
      'objectives': *[_type == 'objective' && concept._ref == ^._id] | order(number asc) {
        objectiveCode,
        title,
        'activityCount': count(*[_type == 'activity' && objective._ref == ^._id])
      }
    }
  }`)
  for (const p of r) {
    console.log(p.title)
    for (const c of p.concepts) {
      const sum = c.objectives.reduce((s: number, o: { activityCount: number }) => s + o.activityCount, 0)
      const note = sum === c.activityCount ? '' : `  ⚠ mismatch (sum=${sum})`
      console.log(`  ${c.code} ${c.title}: ${c.activityCount} act, ${c.objectiveCount} obj${note}`)
      for (const o of c.objectives) {
        console.log(`    ${o.objectiveCode} ${o.title}: ${o.activityCount}`)
      }
    }
  }
}
run().catch((e) => { console.error(e); process.exit(1) })

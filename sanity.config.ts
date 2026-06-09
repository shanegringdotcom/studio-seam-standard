import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { presentationTool } from 'sanity/presentation'
import { schemaTypes } from './schemas'

const PREVIEW_URL =
  process.env.SANITY_STUDIO_PREVIEW_URL || 'https://standard.seamcertification.org'

export default defineConfig({
  name: 'default',
  title: 'SEAM Standard',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool(),
    presentationTool({
      previewUrl: {
        origin: PREVIEW_URL,
        previewMode: { enable: '/api/preview' },
      },
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})

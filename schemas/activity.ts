import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'activity',
  title: 'Activity',
  type: 'document',
  groups: [
    { name: 'header', title: 'Header', default: true },
    { name: 'scope', title: 'Scope' },
    { name: 'requirements', title: 'Requirements' },
    { name: 'indicators', title: 'Indicators' },
    { name: 'scoring', title: 'Scoring' },
    { name: 'documentation', title: 'Documentation' },
    { name: 'definitions', title: 'Definitions' },
    { name: 'guidance', title: 'Guidance' },
    { name: 'sources', title: 'Sources' },
    { name: 'meta', title: 'Meta' },
  ],
  fields: [
    // ─── Header ─────────────────────────────────────────────
    defineField({
      name: 'activityId',
      title: 'Activity ID',
      type: 'string',
      group: 'header',
      description: 'The canonical SEAM activity identifier (e.g. "IAa1.1", "SJa2.4"). Used in cross-references.',
      validation: (r) =>
        r.required().regex(/^[A-Z]{2}a[0-9]+(\.[0-9]+)?$/, {
          name: 'activity ID (e.g. IAa1.1 or SIa1)',
        }),
    }),
    defineField({
      name: 'title',
      title: 'Technical title',
      type: 'string',
      group: 'header',
      description: 'The canonical activity title from the SEAM Standard document. Always shown in the digital Standard and in reviewer/practitioner contexts.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'marketingTitle',
      title: 'Marketing title (optional)',
      type: 'string',
      group: 'header',
      description: 'Optional plain-language alternative used in marketing surfaces (marks listings, audience pages, etc.). Leave blank to fall back to the Technical title.',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'header',
      options: {
        source: (doc) => (doc as { activityId?: string }).activityId?.toLowerCase().replace(/\./g, '-') ?? '',
        maxLength: 64,
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'pillar',
      title: 'Pillar',
      type: 'reference',
      to: [{ type: 'pillar' }],
      group: 'header',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'concept',
      title: 'Concept',
      type: 'reference',
      to: [{ type: 'concept' }],
      group: 'header',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'objective',
      title: 'Objective',
      type: 'reference',
      to: [{ type: 'objective' }],
      group: 'header',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'activityType',
      title: 'Activity type',
      type: 'string',
      group: 'header',
      options: {
        list: [
          { title: 'Driver', value: 'Driver' },
          { title: 'Impact', value: 'Impact' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'ratingSystemApplication',
      title: 'Rating System Application',
      type: 'ratingSystemApplication',
      group: 'header',
    }),
    defineField({
      name: 'markEligible',
      title: 'Mark eligible',
      type: 'boolean',
      group: 'header',
      description: 'When true, this activity can be earned standalone as a SEAM Mark.',
      initialValue: false,
    }),
    defineField({
      name: 'markPrerequisites',
      title: 'Mark prerequisites (optional)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'activity' }] }],
      group: 'header',
      description: 'Other activities that must be completed before this Mark can be earned. Used when activities are combined into a single Mark (e.g. CIa1.2 absorbs CIa1.1, so CIa1.2 lists CIa1.1 here).',
    }),
    defineField({
      name: 'markCombinedWith',
      title: 'Combined-with (optional)',
      type: 'reference',
      to: [{ type: 'activity' }],
      group: 'header',
      description: 'When this activity is Mark-eligible only as part of another activity\'s combined Mark, link to the host activity here (e.g. CIa1.1 is combined with CIa1.2). The activity will be hidden from the standalone Marks listing but shown on the digital Standard as Mark-eligible in association.',
    }),
    defineField({
      name: 'sdgs',
      title: 'UN SDG alignment',
      type: 'array',
      of: [{ type: 'number' }],
      group: 'header',
      description: 'UN Sustainable Development Goal numbers this activity aligns with (per Appendix A).',
      options: { layout: 'tags' },
    }),

    // ─── Scope ──────────────────────────────────────────────
    defineField({
      name: 'scope',
      title: 'Scope',
      type: 'array',
      of: [{ type: 'richText' }],
      group: 'scope',
    }),

    // ─── Requirements ───────────────────────────────────────
    defineField({
      name: 'requirementsLeadIn',
      title: 'Lead-in text (optional)',
      type: 'array',
      of: [{ type: 'richText' }],
      group: 'requirements',
      description: 'Optional paragraph before the requirement groups (e.g. "Due diligence shall cover...").',
    }),
    defineField({
      name: 'requirements',
      title: 'Requirement groups',
      type: 'array',
      of: [{ type: 'requirementGroup' }],
      group: 'requirements',
      description: 'Use groups like "Act to Avoid Harm". For ungrouped activities, use a single group with no heading.',
    }),
    defineField({
      name: 'requirementsSectionFootnote',
      title: 'Section footnote',
      type: 'reference',
      to: [{ type: 'bibliographyEntry' }, { type: 'editorialNote' }],
      group: 'requirements',
      description: 'Optional. The superscript marker next to the "Requirements" header — can be a numbered bibliography reference (e.g. Requirements¹⁶) or an editorial note (e.g. Requirementsⁱⁱ).',
    }),
    defineField({
      name: 'requirementsNotes',
      title: 'Requirements notes (rendered below items)',
      type: 'array',
      of: [{ type: 'richText' }],
      group: 'requirements',
      description: 'Optional "Note:" callout that appears below the requirement items (e.g. IAa1.5\'s clarification about multiple impacted parties per impact).',
    }),

    // ─── Indicators ─────────────────────────────────────────
    defineField({
      name: 'indicators',
      title: 'Indicators',
      type: 'indicators',
      group: 'indicators',
    }),

    // ─── Scoring ────────────────────────────────────────────
    defineField({
      name: 'scoring',
      title: 'Scoring',
      type: 'scoring',
      group: 'scoring',
    }),

    // ─── Documentation ──────────────────────────────────────
    defineField({
      name: 'documentationLeadIn',
      title: 'Lead-in text (optional)',
      type: 'array',
      of: [{ type: 'richText' }],
      group: 'documentation',
      description: 'Optional paragraph(s) before the documentation items (e.g. TGa2.1 explains the SEAM purpose of applying ISO 26000).',
    }),
    defineField({
      name: 'documentationItems',
      title: 'Documentation items',
      type: 'array',
      of: [{ type: 'documentationItem' }],
      group: 'documentation',
    }),
    defineField({
      name: 'documentationTemplates',
      title: 'Documentation templates (optional)',
      type: 'array',
      of: [{ type: 'documentationTemplate' }],
      group: 'documentation',
      description: 'Structured table templates that the owner fills in as evidence (e.g. SJa1.1 Tables 1–4).',
    }),
    defineField({
      name: 'documentationSectionFootnote',
      title: 'Section footnote',
      type: 'reference',
      to: [{ type: 'bibliographyEntry' }, { type: 'editorialNote' }],
      group: 'documentation',
      description: 'Optional. Same as Requirements section footnote — can be a numbered bibliography reference or an editorial note.',
    }),

    // ─── Definitions (per-activity) ─────────────────────────
    defineField({
      name: 'definitions',
      title: 'Definitions (per-activity)',
      type: 'array',
      of: [{ type: 'definition' }],
      group: 'definitions',
      description: 'Activity-scoped terms. Global glossary terms go in the GlossaryTerm document type instead.',
    }),

    // ─── Guidance ───────────────────────────────────────────
    defineField({
      name: 'guidance',
      title: 'Guidance sections',
      type: 'array',
      of: [
        { type: 'guidanceSubsection' },
        { type: 'guidanceSteps' },
        { type: 'guidanceResources' },
        { type: 'guidanceExample' },
        { type: 'guidanceNote' },
        { type: 'guidanceImage' },
      ],
      group: 'guidance',
    }),

    // ─── Referenced Sources ─────────────────────────────────
    defineField({
      name: 'referencedSources',
      title: 'Referenced Sources',
      type: 'array',
      of: [{ type: 'referencedSource' }],
      group: 'sources',
    }),

    // ─── Meta ───────────────────────────────────────────────
    defineField({
      name: 'version',
      title: 'Standard version',
      type: 'string',
      group: 'meta',
      initialValue: '1.1',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'meta',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Published', value: 'published' },
          { title: 'Deprecated', value: 'deprecated' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
    }),
  ],
  preview: {
    select: { title: 'title', activityId: 'activityId', activityType: 'activityType' },
    prepare({ title, activityId, activityType }) {
      return {
        title: `Activity ${activityId} — ${title}`,
        subtitle: activityType,
      }
    },
  },
  orderings: [
    {
      title: 'Activity ID',
      name: 'activityIdAsc',
      by: [{ field: 'activityId', direction: 'asc' }],
    },
  ],
})

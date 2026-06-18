import {defineField, defineType} from 'sanity'

export const reportPhoto = defineType({
  name: 'reportPhoto',
  title: 'Report Photos',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: {hotspot: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'eventDate',
      title: 'Event Date',
      type: 'date',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Union Activity', value: 'Union Activity'},
          {title: 'Cultural', value: 'Cultural'},
          {title: 'Sports', value: 'Sports'},
          {title: 'Academic', value: 'Academic'},
          {title: 'Welfare', value: 'Welfare'},
        ],
      },
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first in the report slider.',
      initialValue: 10,
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'displayOrder',
      by: [{field: 'order', direction: 'asc'}],
    },
    {
      title: 'Event date, newest first',
      name: 'eventDateDesc',
      by: [{field: 'eventDate', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'caption',
      media: 'image',
    },
  },
})
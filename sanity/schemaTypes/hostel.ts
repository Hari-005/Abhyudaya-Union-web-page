import {defineArrayMember, defineField, defineType} from 'sanity'

export const hostel = defineType({
  name: 'hostel',
  title: 'Hostels',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required().max(70),
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: {hotspot: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: 'Girls Hostel', value: 'Girls Hostel'},
          {title: 'Boys Hostel', value: 'Boys Hostel'},
          {title: 'PG', value: 'PG'},
          {title: 'Rental Stay', value: 'Rental Stay'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'distance',
      title: 'Distance From College',
      type: 'string',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'rooms',
      title: 'Rooms',
      type: 'string',
      description: 'Example: Single, 2-sharing and 3-sharing',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'rent',
      title: 'Rent',
      type: 'string',
      description: 'Example: Rs. 5,500 - Rs. 7,000 per month',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Address (Deprecated)',
      type: 'text',
      rows: 3,
      deprecated: {
        reason: 'Address is no longer displayed. Use Distance, Rooms and Rent instead.',
      },
      readOnly: true,
      hidden: ({value}) => value === undefined,
      initialValue: undefined,
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'string',
          validation: (rule) => rule.required().max(30),
        }),
      ],
      options: {layout: 'tags'},
      validation: (rule) => rule.unique().max(8),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first.',
      initialValue: 10,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'distance',
      media: 'image',
    },
  },
})

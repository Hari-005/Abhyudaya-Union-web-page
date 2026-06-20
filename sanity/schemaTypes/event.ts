import {defineField, defineType} from 'sanity'

export const event = defineType({
  name: 'event',
  title: 'Events',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Cultural', value: 'Cultural'},
          {title: 'Sports', value: 'Sports'},
          {title: 'Academic', value: 'Academic'},
          {title: 'Welfare', value: 'Welfare'},
          {title: 'General', value: 'General'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Short Label',
      type: 'string',
      description: 'Small text shown with the date card, for example: Arts fest audition.',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'venue',
      title: 'Venue',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'desk',
      title: 'Desk',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'contactNumber',
      title: 'Contact Number',
      type: 'string',
      description: 'Phone number shown on the event card for student enquiries.',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first.',
      initialValue: 10,
    }),
  ],
  orderings: [
    {
      title: 'Event date, ascending',
      name: 'dateAsc',
      by: [{field: 'date', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'date',
    },
  },
})
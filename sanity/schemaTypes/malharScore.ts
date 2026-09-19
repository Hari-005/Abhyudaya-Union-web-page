import {defineField, defineType} from 'sanity'

export const malharScore = defineType({
  name: 'malharScore',
  title: 'MALHAR Leaderboard',
  type: 'document',
  fields: [
    defineField({
      name: 'department',
      title: 'Department',
      type: 'string',
      options: {
        list: [
          {title: 'Chemical Engineering', value: 'Chemical Engineering'},
          {title: 'Mechanical Engineering', value: 'Mechanical Engineering'},
          {title: 'Electronics & Communication Engineering', value: 'Electronics & Communication Engineering'},
          {title: 'Civil Engineering', value: 'Civil Engineering'},
          {title: 'Computer Science & Design', value: 'Computer Science & Design'},
          {title: 'Applied Electronics & Instrumentation', value: 'Applied Electronics & Instrumentation'},
          {title: 'Electrical & Computer Engineering', value: 'Electrical & Computer Engineering'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'rank',
      title: 'Rank',
      type: 'number',
      description: 'Rank shown on the leaderboard.',
      validation: (rule) => rule.required().min(1).integer(),
    }),
    defineField({
      name: 'points',
      title: 'Points',
      type: 'number',
      validation: (rule) => rule.required().min(0).integer(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first. Use this to break ties or manually arrange rows.',
      initialValue: 10,
    }),
  ],
  orderings: [
    {
      title: 'Rank, ascending',
      name: 'rankAsc',
      by: [
        {field: 'rank', direction: 'asc'},
        {field: 'points', direction: 'desc'},
      ],
    },
  ],
  preview: {
    select: {
      title: 'department',
      rank: 'rank',
      points: 'points',
    },
    prepare({title, rank, points}) {
      return {
        title,
        subtitle: `Rank ${rank || '-'} | ${points ?? 0} points`,
      }
    },
  },
})

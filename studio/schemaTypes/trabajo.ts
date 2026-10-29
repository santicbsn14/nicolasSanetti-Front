import {defineField, defineType} from 'sanity'

// Mismos tres servicios que src/Components/Services/Services.tsx del front
export const SERVICIOS = [
  {title: 'Lavado y peinado', value: 'lavado-y-peinado'},
  {title: 'Corte y barbería', value: 'corte-y-barberia'},
  {title: 'Coloración y mechas', value: 'coloracion-y-mechas'},
]

export const trabajo = defineType({
  name: 'trabajo',
  title: 'Trabajo',
  type: 'document',
  fields: [
    defineField({
      name: 'imagen',
      title: 'Imagen',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'servicio',
      title: 'Servicio',
      type: 'string',
      options: {list: SERVICIOS, layout: 'radio'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'descripcion',
      title: 'Descripción',
      type: 'string',
      validation: (rule) => rule.max(140),
    }),
    defineField({
      name: 'destacado',
      title: 'Destacado',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'activo',
      title: 'Activo',
      description: 'Si está apagado, no se muestra en la web.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'orden',
      title: 'Orden',
      type: 'number',
    }),
  ],
  orderings: [
    {
      title: 'Orden',
      name: 'ordenAsc',
      by: [{field: 'orden', direction: 'asc'}],
    },
    {
      title: 'Más recientes',
      name: 'creadoDesc',
      by: [{field: '_createdAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {servicio: 'servicio', subtitle: 'descripcion', media: 'imagen'},
    prepare: ({servicio, subtitle, media}) => ({
      title: SERVICIOS.find((s) => s.value === servicio)?.title ?? 'Sin servicio',
      subtitle,
      media,
    }),
  },
})

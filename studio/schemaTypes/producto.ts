import {defineArrayMember, defineField, defineType} from 'sanity'

export const producto = defineType({
  name: 'producto',
  title: 'Producto',
  type: 'document',
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre',
      type: 'string',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {source: 'nombre', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'descripcion',
      title: 'Descripción',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.max(600),
    }),
    defineField({
      name: 'imagenes',
      title: 'Imágenes',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Texto alternativo',
              type: 'string',
            }),
          ],
        }),
      ],
      validation: (rule) => rule.required().min(1).max(6),
    }),
    defineField({
      name: 'precio',
      title: 'Precio',
      type: 'number',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'mostrarPrecio',
      title: 'Mostrar precio',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'variantes',
      title: 'Variantes',
      description: 'Por ejemplo, tamaños o tonos.',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'variante',
          title: 'Variante',
          type: 'object',
          fields: [
            defineField({
              name: 'nombre',
              title: 'Nombre',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'precio',
              title: 'Precio',
              type: 'number',
              validation: (rule) => rule.min(0),
            }),
          ],
          preview: {
            select: {title: 'nombre', precio: 'precio'},
            prepare: ({title, precio}) => ({
              title,
              subtitle: typeof precio === 'number' ? `$${precio.toLocaleString('es-AR')}` : 'Sin precio',
            }),
          },
        }),
      ],
    }),
    defineField({
      name: 'categoria',
      title: 'Categoría',
      type: 'string',
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
    select: {title: 'nombre', media: 'imagenes.0', precio: 'precio'},
    prepare: ({title, media, precio}) => ({
      title,
      media,
      subtitle: typeof precio === 'number' ? `$${precio.toLocaleString('es-AR')}` : 'Sin precio',
    }),
  },
})

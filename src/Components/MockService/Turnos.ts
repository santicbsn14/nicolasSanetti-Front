// components/Turnos/servicios.ts
export const serviciosData: Record<string, { titulo: string; descripcion: string; precio: string }[]> = {
    'LAVADO Y PEINADO': [
      {
        titulo: 'Lavado y Brushing',
        descripcion: 'Lavado profundo con productos nutritivos y brushing profesional.',
        precio: '12.000',
      },
      {
        titulo: 'Peinado',
        descripcion: 'Lavado y peinado con acabado brillante. Ideal para eventos.',
        precio: '10.000',
      },
    ],
    'CORTE Y BARBERIA': [
      {
        titulo: 'Corte Clásico',
        descripcion: 'Corte a tijera o máquina con estilo personalizado.',
        precio: '8.000',
      },
    ],
    'COLORACION Y MECHAS': [
      {
        titulo: 'Coloración Completa',
        descripcion: 'Color uniforme con productos que cuidan tu cabello.',
        precio: '15.000',
      },
    ],
  }
  
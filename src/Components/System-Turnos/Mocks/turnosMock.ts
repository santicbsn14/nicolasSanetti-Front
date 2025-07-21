// System-Turnos/Mocks/turnosMock.ts
import { Dayjs } from 'dayjs'

export interface Appointment {
  _id?: string
  client_id: {
    _id: string
    name: string
    phone: string
  }
  hairdresser_id: string
  date_time: Dayjs
  state: 'pending' | 'completed' | 'cancelled'
  service_id: string
  notes?: string[]
}

import dayjs from 'dayjs'

export const turnosMock: Appointment[] = [
  {
    _id: '1',
    client_id: { _id: 'c1', name: 'Lucía García', phone: '1134567890' },
    hairdresser_id: 'h1',
    date_time: dayjs().hour(10).minute(0),
    state: 'pending',
    service_id: 's1'
  },
  {
    _id: '2',
    client_id: { _id: 'c2', name: 'Martín López', phone: '1145678901' },
    hairdresser_id: 'h1',
    date_time: dayjs().hour(12).minute(0),
    state: 'pending',
    service_id: 's2'
  },
  {
    _id: '3',
    client_id: { _id: 'c3', name: 'Sofía Díaz', phone: '1156789012' },
    hairdresser_id: 'h1',
    date_time: dayjs().hour(14).minute(0),
    state: 'pending',
    service_id: 's1'
  }
]

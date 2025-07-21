import type { FC } from 'react'
import Sidebar from '../UI/Sidebar'
import './Layout.css'

const ProfessionalLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="layout">
      <Sidebar />
      <main className="layout__main">{children}</main>
    </div>
  )
}

export default ProfessionalLayout
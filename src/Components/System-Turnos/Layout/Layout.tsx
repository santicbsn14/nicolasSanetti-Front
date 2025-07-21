import { Outlet } from 'react-router-dom'
import Sidebar from '../UI/Sidebar' // o el path real de tu sidebar
import '../Css/Sidebar.css'

const LayoutProfesional = () => {
  return (
    <div className="layout-profesional">
      <Sidebar />
      <div className="layout-profesional__content">
        <Outlet />
      </div>
    </div>
  )
}

export default LayoutProfesional

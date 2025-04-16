import styles from "./Home.module.css"
import Header from '../../../components/Student/Header/Header'
import SideBar from '../../../components/Student/SideBar/SideBar.jsx'
import { useLocation } from 'react-router-dom'

const HomeStudent = () => {
  const location=useLocation()
  const { name } = location.state || { name: '' }

  return (
    <div className={styles['hs-container']}>
      <Header />
      <SideBar />
    </div>
  )
}

export default HomeStudent

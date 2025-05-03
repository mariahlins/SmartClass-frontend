import styles from "./Home.module.css"
import { useLocation } from "react-router-dom"
import Header from "../../../components/Header/Header";
import SideBar from "../../../components/Manager/SideBar/SideBar";

const HomeManager = () => {
    const location = useLocation();
    // eslint-disable-next-line no-unused-vars
    const { name } = location.state || { name: '' }
    // eslint-disable-next-line no-unused-vars
    const userId = localStorage.getItem('userId');
    
  return (
    <div className={styles['hm-manager']}>
      <Header/>
      <SideBar/>
    </div>
  )
}

export default HomeManager

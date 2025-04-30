import styles from "./Home.module.css"
import { useLocation } from "react-router-dom"
import Header from "../../../components/Header/Header";
import SideBar from "../../../components/Manager/SideBar/SideBar";

const HomeManager = () => {
    const location = useLocation();
    const { name } = location.state || { name: '' }

  return (
    <div className={styles['hm-manager']}>
      <Header/>
      <SideBar/>
    </div>
  )
}

export default HomeManager

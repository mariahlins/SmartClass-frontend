import styles from "./Home.module.css"
import { useLocation } from "react-router-dom"
import Header from "../../../components/Header/Header";
import SideBar from "../../../components/Teacher/SideBar/SideBar";

const HomeTeacher = () => {
    const location = useLocation();
    // eslint-disable-next-line no-unused-vars
    const { name } = location.state || { name: '' }
    // eslint-disable-next-line no-unused-vars
    const userId = localStorage.getItem('userId');
    
  return (
    <div className={styles['th-manager']}>
      <Header/>
      <SideBar/>
    </div>
  )
}

export default HomeTeacher;

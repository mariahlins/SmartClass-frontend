import styles from "./Classes.module.css"
import Header from "../../../components/Header/Header";
import SideBar from "../../../components/Manager/SideBar/SideBar";

const ClassesManager = () => {
  return (
    <div className={styles['cls-manager']}>
      <Header/>
      <SideBar/>
    </div>
  )
}

export default ClassesManager

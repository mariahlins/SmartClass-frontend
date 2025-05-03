import styles from "./Users.module.css"
import Header from "../../../components/Header/Header";
import SideBar from "../../../components/Manager/SideBar/SideBar";

const UsersManager = () => {
  return (
    <div className={styles['cls-manager']}>
      <Header/>
      <SideBar/>
    </div>
  )
}

export default UsersManager;

import styles from "./Profile.module.css";
import Header from "../../../components/Student/Header/Header";
import Sidebar from "../../../components/Student/SideBar/SideBar";

const ProfileStudent = () => {
  return (
    <div className={styles["profile-container"]}>
        <Header/>
        <Sidebar/>
    </div>
  )
}

export default ProfileStudent

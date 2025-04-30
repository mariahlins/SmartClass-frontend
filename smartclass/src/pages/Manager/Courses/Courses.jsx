import styles from "./Courses.module.css"
import Header from "../../../components/Header/Header";
import SideBar from "../../../components/Manager/SideBar/SideBar";

const CoursesManager = () => {

  return (
    <div className={styles['crs-manager']}>
      <Header/>
      <SideBar/>
    </div>
  )
}

export default CoursesManager;

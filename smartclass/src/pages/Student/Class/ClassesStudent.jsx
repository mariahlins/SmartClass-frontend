import styles from "./ClassesStudent.module.css";
import Header from "../../../components/Student/Header/Header";
import Sidebar from "../../../components/Student/SideBar/SideBar";

const ClassesStudent = () => {
  return (
    <div className={styles["css-container"]}>
      <Header/>
      <Sidebar/>
    </div>
  )
}

export default ClassesStudent

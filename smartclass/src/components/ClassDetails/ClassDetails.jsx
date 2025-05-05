import { useParams, useLocation } from "react-router-dom";
import { useEffect } from "react";
import TurmaController from "../../../controllers/lms/turmaController";
import styles from "./ClassDetails.module.css";
import Header from "../../components/Header/Header";
import SideBarTh from "../../components/Teacher/SideBar/SideBar";
import SideBarSt from "../../components/Student/SideBar/SideBar";
import SideBarMn from "../../components/Manager/SideBar/SideBar";

const ClassDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const userType = location.state;
  console.log("Tipo de usuário:", userType);

  // useEffect(() => {
  //   async function carregarTurma() {
  //     try {
  //       const response = await TurmaController.buscarTurmaPorId(id);
  //       console.log("Dados da turma:", response.data);
  //     } catch (error) {
  //       console.error("Erro ao carregar turma:", error.message);
  //     }
  //   }

  //   carregarTurma();
  // }, [id]);

  return (
    <div className={styles["td-Teacher"]}>
      <Header />
      {userType === 2? <SideBarTh /> : userType === 1 ? <SideBarSt /> : <SideBarMn />}
      <main className={styles["td-content"]}>
        <h1>Detalhes da Turma</h1>
        <div className={styles["td-details"]}>
          <h2>nome da turma</h2>
          <p><strong>Matéria:</strong>materia</p>
          <p><strong>Curso:</strong> nome do curso</p>
          <p><strong>Professor:</strong> professor</p>
        </div>
      </main>
    </div>
  );
};

export default ClassDetails;
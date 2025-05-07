import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TurmaController from "../../../controllers/lms/turmaController";
import UserController from "../../../controllers/user/userController";
import styles from "./ClassDetails.module.css";
import Header from "../../components/Header/Header";
import SideBarTh from "../../components/Teacher/SideBar/SideBar";
import SideBarSt from "../../components/Student/SideBar/SideBar";
import SideBarMn from "../../components/Manager/SideBar/SideBar";
import StudentsList from "./StudentsList";
import LessonsList from "./LessonsList";
import ActivitiesList from "./ActivitiesList";

const ClassDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const userType = location.state;
  const navigate = useNavigate();
  
  const [error, setError] = useState(null);
  const [turma, setTurma] = useState(null);
  const [loading, setLoading] = useState(true);
  const [professorInfo, setProfessorInfo] = useState(null);
  const [loadingProfessor, setLoadingProfessor] = useState(false);
  const [activeTab, setActiveTab] = useState("alunos");

  useEffect(() => {
    async function carregarTurma() {
      try {
        setLoading(true);
        const response = await TurmaController.listarTurmas();
        console.log("Resposta do listarTurmas:", response);
        
        const turmasArray = Array.isArray(response) ? response : response.data;
        
        if (Array.isArray(turmasArray)) {
          const turmaEncontrada = turmasArray.find(t => t.id === Number(id));
          if (turmaEncontrada) {
            console.log("Dados da turma:", turmaEncontrada);
            setTurma(turmaEncontrada);
            
            if (turmaEncontrada.professor) {
              carregarProfessor(turmaEncontrada.professor);
            }
          } else {
            console.log("Nenhuma turma encontrada com o ID fornecido:", id);
            setError(`Turma com ID ${id} não encontrada`);
          }
        } else {
          console.error("Formato de resposta inválido:", response);
          setError("Formato de resposta inválido ao carregar turma");
        }
      } catch (error) {
        console.error("Erro ao carregar turma:", error.message);
        setError(`Erro ao carregar turma: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
    
    async function carregarProfessor(professorId) {
      setLoadingProfessor(true);
      try {
        console.log("Carregando detalhes do professor:", professorId);
        const professorResponse = await UserController.obterTodosUsuarios(professorId);
        const usuarioData = professorResponse.filter(user => user.id === professorId);
        if (professorResponse && usuarioData) {
          setProfessorInfo(usuarioData[0]);
        }
      } catch (error) {
        console.error("Erro ao carregar professor:", error);
      } finally {
        setLoadingProfessor(false);
      }
    }

    carregarTurma();
  }, [id]);

  const handleVoltar = () => {
    navigate(-1);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className={styles["td-container"]}>
      <Header />
      {userType === 2 ? <SideBarTh userType={userType} /> : userType === 1 ? <SideBarSt userType={userType} /> : <SideBarMn userType={userType} />}
      <main className={styles["td-content"]}>
        <div style={{display:"flex", alignItems:"center", gap:"1rem"}}>
            <button 
              onClick={handleVoltar} 
              className={styles["back-button"]}
            >
              ← Voltar
            </button>
            {loading ? (
              <div>
                <p>Carregando...</p>
              </div>
            ) : (
              <h1 style={{fontFamily:"'Poppins', sans-serif"}}>Turma: {turma?.nome || "Nome não disponível"}</h1>
            )}
        </div>
          {loading ? (
            <p>Carregando detalhes da turma...</p>
          ) : error ? (
            <p className={styles["error-message"]}>{error}</p>
          ) : turma ? (
            <>
            <div className={styles["td-details"]}>
              <h2>{turma.nome}</h2>
              <p><strong>Curso:</strong> {turma.curso ? turma.curso.nome : "Não especificado"}</p>
              <p><strong>Professor:</strong> {
                loadingProfessor 
                  ? "Carregando..." 
                  : professorInfo 
                    ? professorInfo.name
                    : `ID: ${turma.professor}`
              }</p>
              
              <div className={styles["tab-buttons"]}>
                <button 
                  className={`${styles["tab-button"]} ${activeTab === "alunos" ? styles["active"] : ""}`}
                  onClick={() => handleTabChange("alunos")}
                >
                  Alunos
                </button>
                <button 
                  className={`${styles["tab-button"]} ${activeTab === "aulas" ? styles["active"] : ""}`}
                  onClick={() => handleTabChange("aulas")}
                >
                  Aulas
                </button>
                <button 
                  className={`${styles["tab-button"]} ${activeTab === "atividades" ? styles["active"] : ""}`}
                  onClick={() => handleTabChange("atividades")}
                >
                  Atividades
                </button>
              </div>
              
              <div className={styles["tab-content"]}>
                {activeTab === "alunos" && <StudentsList turmaId={turma.id} alunosIds={turma.alunos || []} userType={userType} />}
                {activeTab === "aulas" && <LessonsList turmaId={turma.id} userType={userType} />}
                {activeTab === "atividades" && <ActivitiesList turmaId={turma.id} userType={userType} />}
              </div>
            </div>
          </>
        ) : (
          <p>Nenhuma informação da turma disponível</p>
        )}
      </main>
    </div>
  );
};

export default ClassDetails;
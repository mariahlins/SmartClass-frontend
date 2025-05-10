import { useEffect, useState } from "react";
import styles from "./Classes.module.css";
import Header from "../../../components/Header/Header";
import SideBar from "../../../components/Teacher/SideBar/SideBar";
import TurmaController from "../../../../controllers/lms/turmaController"; 
import CursoController from "../../../../controllers/lms/CursoController"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

const ClassesTeacher = () => {
  const [turmas, setTurmas] = useState([]);
  const [selectedTurma, setSelectedTurma] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    nome: "",
    curso_id: "",
    materia: "",
    professor: "",
  });

  const userId = localStorage.getItem('userId');
  console.log("ID do usuárioooooooooo:", userId);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);  
  const [turmasPerPage] = useState(7); 
  
  useEffect(() => {
    async function carregarTurmas(userId) {
      try {
        console.log("ID do usuário:", userId);
        const response = await TurmaController.listarTurmasProfessor(userId);
        setTurmas(response);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar turmas:", error.message);
      }
    }

    carregarTurmas(userId);
  }, [userId]);

  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  const handleEditModalToggle = (turma = null) => {
    if (turma) {
      setSelectedTurma(turma);
      setEditFormData({
        nome: turma.nome,
        curso_id: turma.curso?.id || "",
        materia: turma.materia,
        professor: turma.professor,
      });
      setShowEditModal(true);
    } else {
      setShowEditModal(false);
      setSelectedTurma(null);
    }
  };

  const handleEditInputChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };


  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await TurmaController.editarTurma(selectedTurma.id, editFormData);
      handleEditModalToggle();
      const response = await TurmaController.listarTurmasProfessor(userId);
      setTurmas(response);
    } catch (error) {
      console.error("Erro ao editar turma:", error.message);
    }
  };

  const handleMateriaClick = (turmaId) => {
    navigate(`/classes/${turmaId}`, {state: 2});
  };

  const indexOfLastTurma = currentPage * turmasPerPage;
  const indexOfFirstTurma = indexOfLastTurma - turmasPerPage;
  const currentTurmas = turmas.slice(indexOfFirstTurma, indexOfLastTurma);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(turmas.length / turmasPerPage);

  return (
    <div className={styles["cm-Teacher"]}>
      <Header />
      <SideBar />
      <main className={styles["cm-content"]}>
        <div className={styles["cm-header"]}>
          <h1>Turmas</h1>
          <button onClick={handleModalToggle}>Criar nova turma</button>
        </div>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <>
            <table className={styles["class-table"]}>
              <thead>
                <tr>
                  <th>Nome da Turma</th>
                  <th>Matéria</th>
                  <th>Curso</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {currentTurmas.map((turma) => (
                  <tr key={turma.id}>
                    <td 
                      style={{textDecoration:"underline", cursor: "pointer"}}
                      onClick={() => handleMateriaClick(turma.id)}
                    >
                      {turma.nome}
                    </td>
                    <td>{turma.materia}</td>
                    <td>{turma.curso?.nome || "Não informado"}</td>
                    <td className={styles["action-buttons"]}>
                      <button 
                        onClick={() => handleEditModalToggle(turma)}
                        className={styles["edit-button"]}
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles["cm-pagination"]}>
              <button 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}
              >
                &#8592;
              </button>
              {[...Array(totalPages).keys()].map((page) => (
                <button 
                  key={page + 1} 
                  onClick={() => handlePageChange(page + 1)} 
                  className={page + 1 === currentPage ? styles.active : ""}
                >
                  {page + 1}
                </button>
              ))}
              <button 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
              >
                &#8594;
              </button>
            </div>
          </>
        )}
      </main>

      {showEditModal && (
        <div className={styles.modal}>
          <div className={styles["modal-content"]}>
            <h2>Editar Turma</h2>
            <form onSubmit={handleEditSubmit}>
              <div className={styles["form-group"]}>
                <label>Nome da Turma</label>
                <input
                  type="text"
                  name="nome"
                  value={editFormData.nome}
                  onChange={handleEditInputChange}
                  required
                />
              </div>

              <div className={styles["form-group"]}>
                <label>Nome da matéria</label>
                <input
                  type="text"
                  name="materia"
                  value={editFormData.materia}
                  onChange={handleEditInputChange}
                  required
                />
              </div>

              <div className={styles["form-buttons"]}>
                <button type="button" 
                        onClick={() => handleEditModalToggle()}
                        className={styles["cm-cancel-button"]}>
                  Cancelar
                </button>
                <button type="submit" className={styles["cm-criar"]}>Salvar Alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassesTeacher;
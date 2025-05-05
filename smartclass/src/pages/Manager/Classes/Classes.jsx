import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Classes.module.css";
import Header from "../../../components/Header/Header";
import SideBar from "../../../components/Manager/SideBar/SideBar";
import TurmaController from "../../../../controllers/lms/turmaController"; 
import CursoController from "../../../../controllers/lms/cursoController"; 
import userController from "../../../../controllers/user/userController"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

const ClassesManager = () => {
  const [turmas, setTurmas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [selectedTurma, setSelectedTurma] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    curso_id: "",
    professor: "",
  });
  const [editFormData, setEditFormData] = useState({
    nome: "",
    curso_id: "",
    professor: "",
  });

  const [currentPage, setCurrentPage] = useState(1);  
  const [turmasPerPage] = useState(7); 

  const navigate = useNavigate();
  
  useEffect(() => {
    async function carregarTurmas() {
      try {
        const response = await TurmaController.listarTurmas();
        setTurmas(response);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar turmas:", error.message);
      }
    }

    async function carregarCursos() {
      try {
        const cursos = await CursoController.listar();
        const formattedCursos = cursos.map(curso => ({
          value: curso.id,
          label: curso.nome,
        }));
        setCursos(formattedCursos);
      } catch (error) {
        console.error('Erro ao buscar cursos:', error);
      }
    }

    async function carregarProfessores() {
      try {
      const usuarios = await userController.obterTodosUsuarios(); 
      const professores = usuarios.filter(usuario => usuario.is_teacher === true);
      setProfessores(professores);
      } catch (error) {
      console.error('Erro ao buscar professores:', error);
      }
    } 

    carregarTurmas();
    carregarCursos();
    carregarProfessores();
  }, []);

  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  const handleEditModalToggle = (turma = null) => {
    if (turma) {
      setSelectedTurma(turma);
      setEditFormData({
        nome: turma.nome,
        curso_id: turma.curso?.id || "",
        professor: turma.professor,
      });
      setShowEditModal(true);
    } else {
      setShowEditModal(false);
      setSelectedTurma(null);
    }
  };

  const handleDeleteConfirmationToggle = (turma = null) => {
    if (turma) {
      setSelectedTurma(turma);
      setShowDeleteConfirmation(true);
    } else {
      setShowDeleteConfirmation(false);
      setSelectedTurma(null);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditInputChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      formData.materia="aaaaaa";
      await TurmaController.criarTurma(formData);
      handleModalToggle();
      const response = await TurmaController.listarTurmas();
      setTurmas(response);
    } catch (error) {
      console.error("Erro ao criar turma:", error.message);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await TurmaController.editarTurma(selectedTurma.id, editFormData);
      handleEditModalToggle();
      const response = await TurmaController.listarTurmas();
      setTurmas(response);
    } catch (error) {
      console.error("Erro ao editar turma:", error.message);
    }
  };

  const handleDeleteTurma = async () => {
    try {
      await TurmaController.deletarTurma(selectedTurma.id);
      handleDeleteConfirmationToggle();
      const response = await TurmaController.listarTurmas();
      setTurmas(response);
    } catch (error) {
      console.error("Erro ao deletar turma:", error.message);
    }
  };

  const indexOfLastTurma = currentPage * turmasPerPage;
  const indexOfFirstTurma = indexOfLastTurma - turmasPerPage;
  const currentTurmas = turmas.slice(indexOfFirstTurma, indexOfLastTurma);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(turmas.length / turmasPerPage);

  const handleMateriaClick = (turmaId) => {
    navigate(`/classes/${turmaId}`, {state: {key: 2}});
  };

  return (
    <div className={styles["cm-manager"]}>
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
                  <th>ID do Professor</th>
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
                    <td>{turma.professor}</td>
                    <td>{turma.curso?.nome || "Não informado"}</td>
                    <td className={styles["action-buttons"]}>
                      <button 
                        onClick={() => handleEditModalToggle(turma)}
                        className={styles["edit-button"]}
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </button> 
                      <button 
                        onClick={() => handleDeleteConfirmationToggle(turma)}
                        className={styles["delete-button"]}
                      >
                        <FontAwesomeIcon icon={faTrash} />
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

      {showModal && (
        <div className={styles.modal}>
          <div className={styles["modal-content"]}>
            <h2>Criar nova turma</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles["form-group"]}>
                <label>Nome da Turma</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles["form-group"]}>
                <label>Curso</label>
                <select
                  name="curso_id"
                  value={formData.curso_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecione um curso</option>
                  {cursos.map((curso) => (
                    <option key={curso.value} value={curso.value}>
                      {curso.label}
                    </option>
                  ))}
                </select>
              </div> 

              <div className={styles["form-group"]}>
                <label>Professor</label>
                <select
                  name="professor"
                  value={formData.professor}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecione um professor</option>
                  {professores.map((professor) => (
                    <option key={professor.id} value={professor.id}>
                      {professor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles["form-buttons"]}>
                <button type="button" 
                        onClick={handleModalToggle}
                        className={styles["cm-cancel-button"]}>
                  Cancelar
                </button>
                <button type="submit" className={styles["cm-criar"]}>Criar Turma</button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                <label>Curso</label>
                <select
                  name="curso_id"
                  value={editFormData.curso_id}
                  onChange={handleEditInputChange}
                  required
                >
                  <option value="">Selecione um curso</option>
                  {cursos.map((curso) => (
                    <option key={curso.value} value={curso.value}>
                      {curso.label}
                    </option>
                  ))}
                </select>
              </div> 

              <div className={styles["form-group"]}>
                <label>Professor</label>
                <select
                  name="professor"
                  value={editFormData.professor}
                  onChange={handleEditInputChange}
                  required
                >
                  <option value="">Selecione um professor</option>
                  {professores.map((professor) => (
                    <option key={professor.id} value={professor.id}>
                      {professor.name}
                    </option>
                  ))}
                </select>
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

      {showDeleteConfirmation && (
        <div className={styles.modal}>
          <div className={styles["modal-content"]}>
            <h2>Confirmar Exclusão</h2>
            <p>Tem certeza que deseja excluir a turma "{selectedTurma?.nome}"?</p>
            <div className={styles["form-buttons"]} style={{marginTop:"20px"}}>
              <button type="button" 
                      onClick={() => handleDeleteConfirmationToggle()}
                      className={styles["cm-cancel-button"]}>
                Cancelar
              </button>
              <button 
                onClick={handleDeleteTurma}
                className={styles["delete-confirm-button"]}
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassesManager;
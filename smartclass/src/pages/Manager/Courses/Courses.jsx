import { useEffect, useState } from "react";
import styles from "./Courses.module.css";
import Header from "../../../components/Header/Header";
import SideBar from "../../../components/Manager/SideBar/SideBar";
import CursoController from "../../../../controllers/lms/CursoController";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

const CoursesManager = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
  });
  const [editFormData, setEditFormData] = useState({
    id: "",
    nome: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    carregarCursos();
  }, []);

  async function carregarCursos() {
    try {
      const response = await CursoController.listar();
      setCourses(response);
      console.log("Cursos carregados:", response);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar cursos:", error.message);
    }
  }

  const totalPages = Math.ceil(courses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCourses = courses.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleModalToggle = () => {
    setShowModal(!showModal);
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
      await CursoController.criarCurso(formData);
      handleModalToggle();
      setFormData({ nome: "" });
      await carregarCursos();
    } catch (error) {
      console.error("Erro ao criar curso:", error.message);
    }
  };

  const handleEdit = (course) => {
    setEditFormData({
      id: course.id,
      nome: course.nome,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await CursoController.editarCurso(editFormData.id, editFormData);
      setShowEditModal(false);
      await carregarCursos();
    } catch (error) {
      console.error("Erro ao atualizar curso:", error.message);
    }
  };

  const handleDelete = (courseId) => {
    setCurrentCourseId(courseId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await CursoController.deletarCurso(currentCourseId);
      setShowDeleteModal(false);
      await carregarCursos();
    } catch (error) {
      console.error("Erro ao deletar curso:", error.message);
    }
  };

  return (
    <div className={styles["cls-manager"]}>
      <Header />
      <SideBar />
      <main className={styles["cls-content"]}>
        <div className={styles["cls-header"]}>
          <h1>Cursos</h1>
          <button onClick={handleModalToggle}>Criar novo curso</button>
        </div>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <>
            <table className={styles["courses-table"]}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {currentCourses.map((course) => (
                  <tr key={course.id}>
                    <td>{course.id}</td>
                    <td>{course.nome}</td>
                    <td className={styles["action-cells"]}>
                      <button 
                        onClick={() => handleEdit(course)}
                        className={styles["edit-button"]}
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      <button 
                        onClick={() => handleDelete(course.id)}
                        className={styles["delete-button"]}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles["cls-pagination"]}>
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                &#8592;
              </button>
              <span>Página {currentPage} de {totalPages}</span>
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                &#8594;
              </button>
            </div>
          </>
        )}
      </main>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles["modal-content"]}>
            <h2>Criar novo curso</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles["form-group"]}>
                <label>Nome do Curso</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Ex.: Direito"
                  required
                />
              </div>
              <div className={styles["form-buttons"]}>
                <button type="button" 
                        onClick={handleModalToggle}
                        className={styles["cls-cancel-button"]}>
                  Cancelar
                </button>
                <button type="submit" className={styles["cls-criar"]}>Criar curso</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className={styles.modal}>
          <div className={styles["modal-content"]}>
            <h2>Editar curso</h2>
            <form onSubmit={handleEditSubmit}>
              <div className={styles["form-group"]}>
                <label>ID do Curso</label>
                <input
                  type="text"
                  value={editFormData.id}
                  disabled
                />
              </div>
              <div className={styles["form-group"]}>
                <label>Nome do Curso</label>
                <input
                  type="text"
                  name="nome"
                  value={editFormData.nome}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              <div className={styles["form-buttons"]}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className={styles["cls-cancel-button"]}
                >
                  Cancelar
                </button>
                <button type="submit" className={styles["cls-criar"]}>Salvar alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className={styles.modal}>
          <div className={styles["modal-content"]}>
            <h2>Confirmar exclusão</h2>
            <p>Tem certeza que deseja excluir este curso?</p>
            <div className={styles["form-buttons"]} style={{marginTop:"1rem"}}>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className={styles["cls-cancel-button"]}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className={styles["delete-confirm-button"]}
              >
                Confirmar exclusão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesManager;
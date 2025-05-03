import { useEffect, useState } from "react";
import styles from "./Courses.module.css";
import Header from "../../../components/Header/Header";
import SideBar from "../../../components/Manager/SideBar/SideBar";
import CursoController from "../../../../controllers/lms/cursoController";

const CoursesManager = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
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

    carregarCursos();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await CursoController.criarCurso(formData);
      handleModalToggle();
      const response = await CursoController.listar();
      setCourses(response);
    } catch (error) {
      console.error("Erro ao criar curso:", error.message);
    }
  };7

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
                </tr>
              </thead>
              <tbody>
                {currentCourses.map((courses) => (
                  <tr key={courses.id}>
                    <td>{courses.id}</td>
                    <td>{courses.nome}</td>
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
    </div>
  );
};

export default CoursesManager;

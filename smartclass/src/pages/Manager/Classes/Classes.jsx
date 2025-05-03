import { useEffect, useState } from "react";
import styles from "./Classes.module.css";
import Header from "../../../components/Header/Header";
import SideBar from "../../../components/Manager/SideBar/SideBar";
import TurmaController from "../../../../controllers/lms/turmaController"; 
import CursoController from "../../../../controllers/lms/cursoController"; 
import userController from "../../../../controllers/user/userController"; 

const ClassesManager = () => {
  const [turmas, setTurmas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    curso_id: "",
    materia: "",
    professor: "",
  });

  const [currentPage, setCurrentPage] = useState(1); // Página atual
  const [turmasPerPage] = useState(7); // Número máximo de turmas por página

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
        const professores = await userController.obterTodosUsuarios(); 
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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await TurmaController.criarTurma(formData);
      handleModalToggle();
      const response = await TurmaController.listarTurmas();
      setTurmas(response);
    } catch (error) {
      console.error("Erro ao criar turma:", error.message);
    }
  };

  // Lógica de paginação
  const indexOfLastTurma = currentPage * turmasPerPage;
  const indexOfFirstTurma = indexOfLastTurma - turmasPerPage;
  const currentTurmas = turmas.slice(indexOfFirstTurma, indexOfLastTurma);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(turmas.length / turmasPerPage);

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
                  <th>Matéria</th>
                  <th>ID do Professor</th>
                  <th>Curso</th>
                </tr>
              </thead>
              <tbody>
                {currentTurmas.map((turma) => (
                  <tr key={turma.id}>
                    <td>{turma.nome}</td>
                    <td>{turma.materia}</td>
                    <td>{turma.professor}</td>
                    <td>{turma.curso?.nome || "Não informado"}</td>
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
                <label>Nome da matéria</label>
                <input
                  type="text"
                  name="materia"
                  value={formData.materia}
                  onChange={handleInputChange}
                  required
                />
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
    </div>
  );
};

export default ClassesManager;

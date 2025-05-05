import { useEffect, useState } from "react";
import styles from "./Courses.module.css";
import Header from "../../../components/Header/Header";
import SideBar from "../../../components/Teacher/SideBar/SideBar";
import CursoController from "../../../../controllers/lms/cursoController";
import UserController from "../../../../controllers/user/userController";

const CoursesTeacher = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true); 

  const userId = localStorage.getItem("userId");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    async function carregarCursos(userId) {
      try {
        const response = await UserController.obterUsuario(userId);
        console.log("Resposta do usuário:", response);
        
        // Verificar se response.cursos existe e é um array
        if (response.cursos) {
          // Se não for um array de objetos, tente obter os cursos diretamente
          if (!Array.isArray(response.cursos) || typeof response.cursos[0] !== 'object') {
            // Tentar buscar os dados completos dos cursos
            const cursoIds = Array.isArray(response.cursos) ? response.cursos : Object.values(response.cursos);
            
            // Se temos IDs de cursos, buscar os detalhes de cada curso
            if (cursoIds && cursoIds.length > 0) {
              const cursosDetalhados = await Promise.all(
                cursoIds.map(async (id) => {
                  try {
                    const detalhesCurso = await CursoController.obterCurso(id);
                    return detalhesCurso;
                  } catch (err) {
                    console.error(`Erro ao carregar detalhes do curso ${id}:`, err);
                    // Retorna um objeto básico com o ID se não conseguir obter detalhes
                    return { id: id, nome: `Curso ${id}` };
                  }
                })
              );
              setCourses(cursosDetalhados);
            } else {
              setCourses([]);
            }
          } else {
            // Se já for um array de objetos, use diretamente
            setCourses(response.cursos);
          }
        } else {
          setCourses([]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar cursos:", error.message);
        setLoading(false);
        setCourses([]);
      }
    }

    carregarCursos(userId);
  }, [userId]);

  const totalPages = Math.ceil(courses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCourses = courses.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className={styles["clt-manager"]}>
      <Header />
      <SideBar />
      <main className={styles["clt-content"]}>
        <div className={styles["clt-header"]}>
          <h1>Cursos</h1>
        </div>
        {loading ? (
          <p>Carregando...</p>
        ) : courses.length === 0 ? (
          <p>Nenhum curso encontrado.</p>
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
                {currentCourses.map((curso) => (
                  <tr key={curso.id}>
                    <td>{curso.id}</td>
                    <td>{curso.nome || `Curso ${curso.id}`}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className={styles["clt-pagination"]}>
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                  &#8592;
                </button>
                <span>Página {currentPage} de {totalPages}</span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                  &#8594;
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default CoursesTeacher;
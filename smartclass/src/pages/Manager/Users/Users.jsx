import { useEffect, useState } from "react";
import styles from "./Users.module.css";
import Header from "../../../components/Header/Header";
import SideBar from "../../../components/Manager/SideBar/SideBar";
import UserController from "../../../../controllers/user/userController";

const UsersManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    async function carregarUsuarios() {
      try {
        const response = await UserController.obterTodosUsuarios();
        setUsers(response);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error.message);
      }
    }

    carregarUsuarios();
  }, []);

  const getUserRole = (user) => {
    if (user.is_manager) return "Administrador";
    if (user.is_teacher) return "Professor";
    if (user.is_student) return "Estudante";
    return "Indefinido";
  };

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = users.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className={styles["cls-manager"]}>
      <Header />
      <SideBar />
      <main className={styles["cls-content"]}>
        <h1>Usuários</h1>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <>
            <table className={styles["user-table"]}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>CPF</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.cpf}</td>
                    <td>{getUserRole(user)}</td>
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
    </div>
  );
};

export default UsersManager;

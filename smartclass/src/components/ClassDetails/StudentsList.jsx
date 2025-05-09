import { useState, useEffect } from "react";
import UserController from "../../../controllers/user/userController";
import TurmaController from "../../../controllers/lms/turmaController";
import styles from "./ClassDetails.module.css";

const StudentsList = ({ turmaId, alunosIds, userType }) => {
  const [alunos, setAlunos] = useState([]);
  const [loadingAlunos, setLoadingAlunos] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const [todosUsuarios, setTodosUsuarios] = useState([]);
  const [usuariosSelecionados, setUsuariosSelecionados] = useState([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [atualizandoTurma, setAtualizandoTurma] = useState(false);
  
  useEffect(() => {
    async function carregarAlunos() {
      if (!alunosIds || alunosIds.length === 0) {
        setAlunos([]);
        return;
      }
      
      setLoadingAlunos(true);
      try {
        console.log("Carregando detalhes dos alunos:", alunosIds);
        const alunosDetalhados = [];
        
        for (const alunoId of alunosIds) {
          try {
            const usuarioResponse = await UserController.obterTodosUsuarios(alunoId);
            const usuarioData = usuarioResponse.filter(user => user.id === alunoId);
            if (usuarioResponse && usuarioData) {
              alunosDetalhados.push(usuarioData[0]);
            } else {
              alunosDetalhados.push({ 
                id: alunoId, 
                error: true, 
                name: "Erro ao carregar"
              });
            }
          } catch (error) {
            console.error(`Erro ao carregar aluno ${alunoId}:`, error);
            alunosDetalhados.push({ 
              id: alunoId, 
              error: true, 
              name: "Erro ao carregar"
            });
          }
        }
        
        setAlunos(alunosDetalhados);
      } catch (error) {
        console.error("Erro ao carregar alunos:", error);
      } finally {
        setLoadingAlunos(false);
      }
    }

    carregarAlunos();
  }, [alunosIds]);

  const abrirModalEditarAlunos = async () => {
    setLoadingUsuarios(true);
    try {
      const response = await UserController.obterTodosUsuarios();
      const filteredResponse = response.filter(user => user.is_student === true);
      setTodosUsuarios(filteredResponse);
      
      const selecionados = response.filter(user => 
        alunosIds && alunosIds.includes(user.id)
      );
      
      setUsuariosSelecionados(selecionados);
      setShowEditModal(true);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      alert("Erro ao carregar usuários. Tente novamente mais tarde.");
    } finally {
      setLoadingUsuarios(false);
    }
  };

  const toggleSelecionarUsuario = (usuario) => {
    const jaExiste = usuariosSelecionados.some(u => u.id === usuario.id);
    
    if (jaExiste) {
      setUsuariosSelecionados(usuariosSelecionados.filter(u => u.id !== usuario.id));
    } else {
      setUsuariosSelecionados([...usuariosSelecionados, usuario]);
    }
  };

  const salvarAlunosTurma = async () => {
    setAtualizandoTurma(true);
    try {
      const idsAlunos = usuariosSelecionados.map(usuario => usuario.id);
      console.log("IDs dos alunos selecionados:", idsAlunos);
      await TurmaController.editarAlunosTurma(turmaId, idsAlunos);
      
      setShowEditModal(false);
      
      alert("Alunos da turma atualizados com sucesso!");
      
      window.location.reload();
    } catch (error) {
      console.error("Erro ao atualizar alunos da turma:", error);
      alert("Erro ao atualizar alunos da turma. Tente novamente.");
    } finally {
      setAtualizandoTurma(false);
    }
  };

  const usuariosFiltrados = todosUsuarios.filter(usuario => {
    const termoBusca = searchTerm.toLowerCase();
    const nome = (usuario.name || '').toLowerCase();
    const email = (usuario.email || '').toLowerCase();
    
    return nome.includes(termoBusca) || email.includes(termoBusca);
  });

  const isUsuarioSelecionado = (usuarioId) => {
    return usuariosSelecionados.some(u => u.id === usuarioId);
  };

  return (
    <div className={styles["student-list"]}>
      <div className={styles["student-list-header"]}>
        <h3>Lista de Alunos</h3>
        {userType!==1 && (
          <button 
            className={styles["edit-students-button"]}
            onClick={abrirModalEditarAlunos}
          >
            Editar Alunos
          </button>
        )}
      </div>
      
      {alunosIds && alunosIds.length > 0 ? (
        <>
          <p>Total de alunos: {alunosIds.length}</p>
          {loadingAlunos ? (
            <p>Carregando detalhes dos alunos...</p>
          ) : (
            <table className={styles["students-table"]}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {alunos.map(aluno => (
                  <tr key={aluno.id} className={aluno.error ? styles["error-row"] : ""}>
                    <td>{aluno.id}</td>
                    <td>{aluno.name || "—"}</td>
                    <td>{aluno.email || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      ) : (
        <div className={styles["no-students"]}>
          <p>Nenhum aluno matriculado nesta turma.</p>
          {!UserController.isStudent && (
            <button 
              className={styles["edit-students-button"]}
              onClick={abrirModalEditarAlunos}
            >
              Adicionar Alunos
            </button>
          )}
        </div>
      )}

      {showEditModal && (
        <div className={styles["modal-overlay"]}>
          <div className={`${styles["modal-content"]} ${styles["large-modal"]}`}>
            <div className={styles["modal-header"]}>
              <h3>Gerenciar Alunos da Turma</h3>
              <button 
                className={styles["close-modal"]}
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>
            <div className={styles["modal-body"]}>
              <div className={styles["search-container"]}>
                <input
                  type="text"
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles["search-input"]}
                />
              </div>
              
              {loadingUsuarios ? (
                <p className={styles["loading-message"]}>Carregando usuários...</p>
              ) : (
                <>
                  <div className={styles["students-selection"]}>
                    <div className={styles["selection-stats"]}>
                      <p>Alunos selecionados: <strong>{usuariosSelecionados.length}</strong></p>
                    </div>
                    
                    <div className={styles["users-list"]}>
                      {usuariosFiltrados.length > 0 ? (
                        usuariosFiltrados.map(usuario => (
                          <div 
                            key={usuario.id}
                            className={`${styles["user-item"]} ${isUsuarioSelecionado(usuario.id) ? styles["selected"] : ""}`}
                            onClick={() => toggleSelecionarUsuario(usuario)}
                          >
                            <div className={styles["user-checkbox"]}>
                              <input
                                type="checkbox"
                                checked={isUsuarioSelecionado(usuario.id)}
                                onChange={() => {}} 
                                id={`user-${usuario.id}`}
                              />
                            </div>
                            <div className={styles["user-info"]}>
                              <label htmlFor={`user-${usuario.id}`} className={styles["user-name"]}>
                                {usuario.name || "Sem nome"}
                              </label>
                              <span className={styles["user-email"]}>{usuario.email}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className={styles["no-results"]}>Nenhum usuário encontrado com o termo "{searchTerm}".</p>
                      )}
                    </div>
                  </div>
                  
                  <div className={styles["form-actions"]}>
                    <button
                      className={styles["cancel-button"]}
                      onClick={() => setShowEditModal(false)}
                      disabled={atualizandoTurma}
                    >
                      Cancelar
                    </button>
                    <button
                      className={styles["submit-button"]}
                      onClick={salvarAlunosTurma}
                      disabled={atualizandoTurma}
                    >
                      {atualizandoTurma ? "Salvando..." : "Salvar Alterações"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsList;
import { useState, useEffect } from "react";
import styles from "./ClassDetails.module.css";
import AulaController from "../../../controllers/lms/aulaController";
import { faEye, faPen, faTrash, faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LessonsList = ({ turmaId, userType }) => {
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aulaModalAberta, setAulaModalAberta] = useState(false);
  const [aulaSelecionada, setAulaSelecionada] = useState(null);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const [showModalCriar, setShowModalCriar] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [turma, setTurma] = useState('');
  const [conteudo, setConteudo] = useState(null);
  const [dataAula, setDataAula] = useState('');

  const [showModalEditar, setShowModalEditar] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editDescricao, setEditDescricao] = useState('');
  const [editTurma, setEditTurma] = useState('');
  const [editConteudo, setEditConteudo] = useState(null);
  const [editDataAula, setEditDataAula] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  const [showModalDeletar, setShowModalDeletar] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    async function carregarAulas() {
      setLoading(true);
      try {
        const aulasObtidas = await AulaController.obterAulasTurma(turmaId);
        console.log("Aulas obtidas:", aulasObtidas);
        setAulas(aulasObtidas);
      } catch (error) {
        console.error("Erro ao carregar aulas:", error);
        setError("Não foi possível carregar as aulas. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    }
  
    if (turmaId) {
      carregarAulas();
    }
  }, [turmaId]);

  const formatarData = (dataString) => {
    if (!dataString) return "Data não definida";
    
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR');
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return "Data inválida";
    }
  };

  const formatarDataParaInput = (dataString) => {
    if (!dataString) return "";
    
    try {
      const data = new Date(dataString);
      return data.toISOString().split('T')[0];
    } catch (error) {
      console.error("Erro ao formatar data para input:", error);
      return "";
    }
  };

  const abrirDetalhesAula = (aula) => {
    setAulaSelecionada(aula);
    setAulaModalAberta(true);
  };

  const fecharModal = () => {
    setAulaModalAberta(false);
    setAulaSelecionada(null);
  };

  const limparFormularioCriacao = () => {
    setTitulo('');
    setDescricao('');
    setTurma('');
    setConteudo(null);
    setDataAula('');
  };

  const handleSubmitCriar = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descricao', descricao);
    formData.append('turma', turma);
    formData.append('conteudo', conteudo);
    formData.append('data_aula', dataAula);
  
    try {
      const result = await AulaController.criarAula(formData);
      console.log('Aula criada:', result);
      setShowModalCriar(false);
      limparFormularioCriacao();
      
      const aulasObtidas = await AulaController.obterAulasTurma(turmaId);
      setAulas(aulasObtidas);
    } catch (error) {
      console.error('Erro ao criar aula:', error);
      alert('Erro ao criar aula. Verifique os dados e tente novamente.');
    }
  };

  const abrirModalEditar = (aula) => {
    setEditId(aula.id);
    setEditTitulo(aula.titulo);
    setEditDescricao(aula.descricao || '');
    setEditTurma(aula.turma);
    setEditDataAula(formatarDataParaInput(aula.data_aula));
    setEditConteudo(null); 
    setShowModalEditar(true);
  };

  const handleSubmitEditar = async (e) => {
    e.preventDefault();
    setEditLoading(true);
  
    const formData = new FormData();
    formData.append('titulo', editTitulo);
    formData.append('descricao', editDescricao);
    formData.append('turma', editTurma);
    formData.append('data_aula', editDataAula);
    
    if (editConteudo) {
      formData.append('conteudo', editConteudo);
    }
  
    try {
      await AulaController.editarAula(editId, formData);
      setShowModalEditar(false);
      
      const aulasObtidas = await AulaController.obterAulasTurma(turmaId);
      setAulas(aulasObtidas);
    } catch (error) {
      console.error('Erro ao editar aula:', error);
      alert('Erro ao editar aula. Verifique os dados e tente novamente.');
    } finally {
      setEditLoading(false);
    }
  };

  const abrirModalDeletar = (aulaId) => {
    setDeleteId(aulaId);
    setShowModalDeletar(true);
  };

  const handleDeletar = async () => {
    setDeleteLoading(true);
    try {
      await AulaController.deletarAula(deleteId);
      setShowModalDeletar(false);
      
      // Recarregar lista de aulas
      const aulasObtidas = await AulaController.obterAulasTurma(turmaId);
      setAulas(aulasObtidas);
    } catch (error) {
      console.error('Erro ao deletar aula:', error);
      alert('Erro ao deletar aula. Tente novamente mais tarde.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const baixarConteudoAula = async (aulaId) => {
    setDownloadLoading(true);
    try {
      const dados = await AulaController.downloadConteudoAula(aulaId);
      
      if (dados && dados.url) {
        const link = document.createElement('a');
        link.href = dados.url;
        link.download = dados.nome || `conteudo-aula-${aulaId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        throw new Error("URL de download não disponível");
      }
    } catch (error) {
      console.error("Erro ao baixar conteúdo:", error);
      alert("Não foi possível baixar o conteúdo. Tente novamente mais tarde.");
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <div className={styles["lessons-list"]}>
      <h3>Aulas Programadas</h3>
      
      {loading ? (
        <p>Carregando aulas...</p>
      ) : error ? (
        <p className={styles["error-message"]}>{error}</p>
      ) : aulas && aulas.length > 0 ? (
        <>
          <p>Total de aulas: {aulas.length}</p>
          <table className={styles["lessons-table"]}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Data</th>
                <th>Descrição</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {aulas.map(aula => (
                <tr key={aula.id}>
                  <td>{aula.id}</td>
                  <td>{aula.titulo}</td>
                  <td>{formatarData(aula.data_aula)}</td>
                  <td>
                    {aula.descricao ? 
                      (aula.descricao.length > 50 ? 
                        `${aula.descricao.substring(0, 50)}...` : 
                        aula.descricao) : 
                      "Sem descrição"}
                  </td>
                  <td>
                    <div className={styles["aula-actions"]}>
                      <button 
                        className={styles["view-details"]}
                        onClick={() => abrirDetalhesAula(aula)}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      {userType !== 1 && (
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button 
                            className={styles["view-details"]}
                            onClick={() => abrirModalEditar(aula)}
                          >
                            <FontAwesomeIcon icon={faPen} />
                          </button>
                          <button 
                            className={styles["view-details"]}
                            onClick={() => abrirModalDeletar(aula.id)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className={styles["add-lesson"]}>
          {userType !== 1 && (
            <button className={styles["add-button"]} onClick={() => setShowModalCriar(true)}>
              + Adicionar Primeira Aula
            </button>
          )}
          </div>
        </>
      ) : (
        <div className={styles["no-lessons"]}>
          <p>Nenhuma aula programada para esta turma.</p>
          {userType !== 1 && (
            <button className={styles["add-button"]} onClick={() => setShowModalCriar(true)}>
              + Adicionar Primeira Aula
            </button>
          )}
        </div>
      )}

      {aulaModalAberta && aulaSelecionada && (
        <div className={styles["modal-overlay"]}>
          <div className={styles["modal-content"]}>
            <div className={styles["modal-header"]}>
                <h3>{aulaSelecionada.titulo}</h3>
                <button className={styles["close-modal"]} onClick={fecharModal}>
                  ×
                </button>
            </div>
            <div className={styles["modal-body"]}>
                <div className={styles["aula-info"]}>
                  <p><strong>Título:</strong> {aulaSelecionada.titulo}</p>
                  <p><strong>ID:</strong> {aulaSelecionada.id}</p>
                  <p><strong>Data:</strong> {formatarData(aulaSelecionada.data_aula)}</p>
                  <p><strong>Descrição:</strong> {aulaSelecionada.descricao || "Sem descrição"}</p>
                </div>
                
                <div className={styles["modal-actions"]}>                
                  <button 
                    className={styles["view-content-modal"]}
                    onClick={() => baixarConteudoAula(aulaSelecionada.id)}
                    disabled={downloadLoading}
                  >
                    {downloadLoading ? "Baixando..." : "Baixar Conteúdo"}
                  </button>
                </div>
            </div>
          </div>
        </div>
      )}

      {showModalCriar && (
        <div className={styles["modal-overlay"]}>
          <div className={styles["modal-content"]}>
            <div className={styles["modal-header"]}>
              <h3>Nova Aula</h3>
              <button className={styles["close-modal"]} onClick={() => setShowModalCriar(false)}>
                ×
              </button>
            </div>
            <div className={styles["modal-body"]}>
              <form onSubmit={handleSubmitCriar} className={styles["aula-form"]}>
                <div className={styles["form-group"]}>
                  <label htmlFor="titulo">Título:</label>
                  <input
                    id="titulo"
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                  />
                </div>
                <div className={styles["form-group"]}>
                  <label htmlFor="descricao">Descrição:</label>
                  <textarea
                    id="descricao"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    required
                  />
                </div>
                <div className={styles["form-group"]}>
                  <label htmlFor="turma">Turma:</label>
                  <input
                    id="turma"
                    type="text"
                    value={turma}
                    onChange={(e) => setTurma(e.target.value)}
                    required
                  />
                </div>
                <div className={styles["form-group"]}>
                  <label htmlFor="conteudo">Conteúdo:</label>
                  <div className={styles["file-upload-wrapper"]}>
                    <label htmlFor="conteudo" className={styles["file-label"]}>
                      {conteudo ? conteudo.name : 
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <FontAwesomeIcon icon={faPaperclip} className={styles["icon"]} />
                         Selecionar arquivo
                      </div>
                      }
                    </label>
                    <input
                      id="conteudo"
                      name="conteudo"
                      type="file"
                      className={styles["file-input"]}
                      onChange={(e) => setConteudo(e.target.files[0])}
                      required
                    />
                  </div>
                </div>
                <div className={styles["form-group"]}>
                  <label htmlFor="dataAula">Data da Aula:</label>
                  <input
                    id="dataAula"
                    type="date"
                    value={dataAula}
                    onChange={(e) => setDataAula(e.target.value)}
                    required
                  />
                </div>
                <div className={styles["form-actions"]}>
                  <button 
                    type="button" 
                    className={styles["cancel-button"]}
                    onClick={() => setShowModalCriar(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className={styles["submit-button"]}>
                    Criar Aula
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showModalEditar && (
        <div className={styles["modal-overlay"]}>
          <div className={styles["modal-content"]}>
            <div className={styles["modal-header"]}>
              <h3>Editar Aula</h3>
              <button className={styles["close-modal"]} onClick={() => setShowModalEditar(false)}>
                ×
              </button>
            </div>
            <div className={styles["modal-body"]}>
              <form onSubmit={handleSubmitEditar} className={styles["aula-form"]}>
                <div className={styles["form-group"]}>
                  <label htmlFor="editTitulo">Título:</label>
                  <input
                    id="editTitulo"
                    type="text"
                    value={editTitulo}
                    onChange={(e) => setEditTitulo(e.target.value)}
                    required
                  />
                </div>
                <div className={styles["form-group"]}>
                  <label htmlFor="editDescricao">Descrição:</label>
                  <textarea
                    id="editDescricao"
                    value={editDescricao}
                    onChange={(e) => setEditDescricao(e.target.value)}
                    required
                  />
                </div>
                <div className={styles["form-group"]}>
                  <label htmlFor="editTurma">Turma:</label>
                  <input
                    id="editTurma"
                    type="text"
                    value={editTurma}
                    onChange={(e) => setEditTurma(e.target.value)}
                    required
                  />
                </div>
                <div className={styles["form-group"]}>
                  <label htmlFor="conteudo">Conteúdo:</label>
                  <div className={styles["file-upload-wrapper"]}>
                    <label htmlFor="conteudo" className={styles["file-label"]}>
                      {conteudo ? conteudo.name : 
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <FontAwesomeIcon icon={faPaperclip} className={styles["icon"]} />
                         Selecionar arquivo
                      </div>
                      }
                    </label>
                    <input
                      id="conteudo"
                      name="conteudo"
                      type="file"
                      className={styles["file-input"]}
                      onChange={(e) => setConteudo(e.target.files[0])}
                    />
                  </div>
                  <small>Deixe em branco para manter o conteúdo atual.</small>
                </div>
                <div className={styles["form-group"]}>
                  <label htmlFor="editDataAula">Data da Aula:</label>
                  <input
                    id="editDataAula"
                    type="date"
                    value={editDataAula}
                    onChange={(e) => setEditDataAula(e.target.value)}
                    required
                  />
                </div>
                <div className={styles["form-actions"]}>
                  <button 
                    type="button" 
                    className={styles["cancel-button"]}
                    onClick={() => setShowModalEditar(false)}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className={styles["submit-button"]}
                    disabled={editLoading}
                  >
                    {editLoading ? "Salvando..." : "Salvar Alterações"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showModalDeletar && (
        <div className={styles["modal-overlay"]}>
          <div className={styles["modal-content"]}>
            <div className={styles["modal-header"]}>
              <h3>Confirmar Exclusão</h3>
              <button className={styles["close-modal"]} onClick={() => setShowModalDeletar(false)}>
                ×
              </button>
            </div>
            <div className={styles["modal-body"]}>
              <p className={styles["confirm-delete-message"]}>
                Tem certeza de que deseja excluir esta aula? Esta ação não pode ser desfeita.
              </p>
              <div className={styles["form-actions"]}>
                <button 
                  className={styles["cancel-button"]}
                  onClick={() => setShowModalDeletar(false)}
                >
                  Cancelar
                </button>
                <button 
                  className={styles["delete-button"]}
                  onClick={handleDeletar}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? "Excluindo..." : "Sim, Excluir"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonsList;
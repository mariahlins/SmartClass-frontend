import { useState, useEffect } from "react";
import styles from "./ClassDetails.module.css";
import AulaController from "../../../controllers/lms/aulaController";
import AtividadeController from "../../../controllers/lms/atividadeController";
import { faEye, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ActivitiesList = ({ turmaId, userType }) => {
  const [atividades, setAtividades] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showModalDeletar, setShowModalDeletar] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const [mostrarModalAdicionar, setMostrarModalAdicionar] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [atividadeEmEdicao, setAtividadeEmEdicao] = useState(null);
  const [aulaIdSelecionada, setAulaIdSelecionada] = useState(null);

  const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);
  
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    data_entrega: "",
    aula: ""
  });
  const [arquivo, setArquivo] = useState(null);
  const [arquivoAtual, setArquivoAtual] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    async function carregarDados() {
      setLoading(true);
      try {
        const aulasObtidas = await AulaController.obterAulasTurma(turmaId);
        setAulas(aulasObtidas);
        console.log("Aulas obtidas:", aulasObtidas);
        
        const todasAtividades = aulasObtidas.flatMap(aula => {
          return (aula.atividades || []).map(atividade => ({
            ...atividade,
            aulaNome: aula.titulo || `Aula ${aula.id}`
          }));
        });
        
        console.log("Todas as atividades obtidas:", todasAtividades);
        setAtividades(todasAtividades);
        
        if (aulasObtidas.length > 0) {
          setAulaIdSelecionada(aulasObtidas[0].id);
        }
      } catch (error) {
        console.error("Erro ao carregar aulas:", error);
        setError("Não foi possível carregar as aulas. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    }
  
    if (turmaId) {
      carregarDados();
    }
  }, [turmaId]);

  const formatarDataParaInput = (dataString) => {
    const data = new Date(dataString);
    return data.toISOString().split('T')[0];
  };

  const handleAdicionarAtividade = () => {
    setFormData({
      titulo: "",
      descricao: "",
      data_entrega: "",
      aula: aulaIdSelecionada || ""
    });
    setArquivo(null);
    setArquivoAtual("");
    setFormError(null);
    
    setMostrarModalAdicionar(true);
  };

  const handleEditarAtividade = (atividade) => {
    setFormData({
      titulo: atividade.titulo || "",
      descricao: atividade.descricao || "",
      data_entrega: formatarDataParaInput(atividade.data_entrega) || "",
      aula: atividade.aula || ""
    });
    
    if (atividade.conteudo) {
      const nomeArquivo = atividade.conteudo.split('/').pop();
      setArquivoAtual(nomeArquivo);
    } else {
      setArquivoAtual("");
    }
    
    setAtividadeEmEdicao(atividade);
    setArquivo(null);
    setFormError(null);
    
    setMostrarModalEditar(true);
  };

  const handleFecharModais = () => {
    setMostrarModalAdicionar(false);
    setMostrarModalEditar(false);
    setAtividadeEmEdicao(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVerDetalhes = (atividade) => {
    setAtividadeSelecionada(atividade);
  };

  const handleVerDetalhesAluno = (atividade) => {
    setAtividadeSelecionada(atividade);
  };

  const handleDownload = async () => {
    try {
      const data = await AtividadeController.downloadConteudoAtividade(atividadeSelecionada.id);
      const url = window.URL.createObjectURL(new Blob([data.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `conteudo_${atividadeSelecionada.id}.pdf`); 
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erro ao baixar conteúdo da atividade:', error.response?.data || error.message);
    }
  };

  const closeModal = () => setAtividadeSelecionada(null);

  const handleFileChange = (e) => {
    setArquivo(e.target.files[0]);
  };

  const handleSubmitAdicionar = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      if (!formData.titulo || !formData.data_entrega || !formData.aula) {
        throw new Error("Por favor, preencha todos os campos obrigatórios.");
      }

      if (!arquivo) {
        throw new Error("Por favor, selecione um arquivo para a atividade.");
      }

      const submitData = new FormData();
      submitData.append("titulo", formData.titulo);
      submitData.append("descricao", formData.descricao);
      submitData.append("data_entrega", formData.data_entrega);
      submitData.append("aula", formData.aula);
      submitData.append("conteudo", arquivo);

      const novaAtividade = await AtividadeController.criarAtividade(submitData);
      
      const aulaSelecionada = aulas.find(aula => aula.id.toString() === formData.aula.toString());
      const atividadeComAula = {
        ...novaAtividade,
        aulaNome: aulaSelecionada ? (aulaSelecionada.titulo || `Aula ${aulaSelecionada.id}`) : `Aula ${formData.aula}`
      };
      
      setAtividades(prev => [...prev, atividadeComAula]);
      
      setMostrarModalAdicionar(false);
      
    } catch (err) {
      setFormError(err.message || "Ocorreu um erro ao criar a atividade. Tente novamente.");
      console.error("Erro ao criar atividade:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitEditar = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      if (!formData.titulo || !formData.data_entrega || !formData.aula) {
        throw new Error("Por favor, preencha todos os campos obrigatórios.");
      }

      const submitData = new FormData();
      submitData.append("titulo", formData.titulo);
      submitData.append("descricao", formData.descricao);
      submitData.append("data_entrega", formData.data_entrega);
      submitData.append("aula", formData.aula);
      
      if (arquivo) {
        submitData.append("conteudo", arquivo);
      }

      const atividadeAtualizada = await AtividadeController.editarAtividade(atividadeEmEdicao.id, submitData);
      
      const aulaSelecionada = aulas.find(aula => aula.id.toString() === formData.aula.toString());
      const atividadeComAula = {
        ...atividadeAtualizada,
        aulaNome: aulaSelecionada ? (aulaSelecionada.titulo || `Aula ${aulaSelecionada.id}`) : `Aula ${formData.aula}`
      };
      
      setAtividades(prev => 
        prev.map(ativ => ativ.id === atividadeEmEdicao.id ? atividadeComAula : ativ)
      );
      
      setMostrarModalEditar(false);
      setAtividadeEmEdicao(null);
      
    } catch (err) {
      setFormError(err.message || "Ocorreu um erro ao atualizar a atividade. Tente novamente.");
      console.error("Erro ao atualizar atividade:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const renderModalAdicionar = () => {
    if (!mostrarModalAdicionar) return null;

    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>Nova Atividade</h3>
            <button 
              className={styles.closeButton}
              onClick={handleFecharModais}
              type="button"
            >
              &times;
            </button>
          </div>
          
          {formError && <p className={styles.errorMessage}>{formError}</p>}
          
          <form onSubmit={handleSubmitAdicionar} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="titulo" className={styles.label}>
                Título*
              </label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="descricao" className={styles.label}>
                Descrição
              </label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                className={styles.textarea}
                rows={4}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="aula" className={styles.label}>
                Aula*
              </label>
              <select
                id="aula"
                name="aula"
                value={formData.aula}
                onChange={handleInputChange}
                className={styles.select}
                required
              >
                <option value="">Selecione uma aula</option>
                {aulas.map(aula => (
                  <option key={aula.id} value={aula.id}>
                    {aula.titulo || `Aula ${aula.id}`}
                  </option>
                ))}
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="data_entrega" className={styles.label}>
                Data de Entrega*
              </label>
              <input
                type="date"
                id="data_entrega"
                name="data_entrega"
                value={formData.data_entrega}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="conteudo" className={styles.label}>
                Arquivo da Atividade*
              </label>
              <input
                type="file"
                id="conteudo"
                name="conteudo"
                onChange={handleFileChange}
                className={styles.fileInput}
                required
              />
            </div>
            
            <div className={styles.buttonGroup}>
              <button 
                type="button" 
                onClick={handleFecharModais}
                className={styles.cancelButton}
                disabled={submitting}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={submitting}
              >
                {submitting ? "Enviando..." : "Criar Atividade"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const abrirModalDeletar = (atividadeId) => {
    setDeleteId(atividadeId);
    setShowModalDeletar(true);
  };

  const handleDeletar = async () => {
    setDeleteLoading(true);
    try {
      await AtividadeController.deletarAtividade(deleteId);
      setShowModalDeletar(false);
      
      const aulasObtidas = await AulaController.obterAulasTurma(turmaId);
      setAulas(aulasObtidas);
    } catch (error) {
      console.error('Erro ao deletar aula:', error);
      alert('Erro ao deletar aula. Tente novamente mais tarde.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const renderModalEditar = () => {
    if (!mostrarModalEditar || !atividadeEmEdicao) return null;

    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>Editar Atividade</h3>
            <button 
              className={styles.closeButton}
              onClick={handleFecharModais}
              type="button"
            >
              &times;
            </button>
          </div>
          
          {formError && <p className={styles.errorMessage}>{formError}</p>}
          
          <form onSubmit={handleSubmitEditar} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="editTitulo" className={styles.label}>
                Título*
              </label>
              <input
                type="text"
                id="editTitulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="editDescricao" className={styles.label}>
                Descrição
              </label>
              <textarea
                id="editDescricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                className={styles.textarea}
                rows={4}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="editAula" className={styles.label}>
                Aula*
              </label>
              <select
                id="editAula"
                name="aula"
                value={formData.aula}
                onChange={handleInputChange}
                className={styles.select}
                required
              >
                <option value="">Selecione uma aula</option>
                {aulas.map(aula => (
                  <option key={aula.id} value={aula.id}>
                    {aula.titulo || `Aula ${aula.id}`}
                  </option>
                ))}
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="editData" className={styles.label}>
                Data de Entrega*
              </label>
              <input
                type="date"
                id="editData"
                name="data_entrega"
                value={formData.data_entrega}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="editConteudo" className={styles.label}>
                Arquivo da Atividade
              </label>
              {arquivoAtual && (
                <div className={styles.currentFile}>
                  <span>Arquivo atual: {arquivoAtual}</span>
                </div>
              )}
              <input
                type="file"
                id="editConteudo"
                name="conteudo"
                onChange={handleFileChange}
                className={styles.fileInput}
              />
              <p className={styles.fileHelp}>
                Selecione um novo arquivo apenas se deseja substituir o atual.
              </p>
            </div>
            
            <div className={styles.buttonGroup}>
              <button 
                type="button" 
                onClick={handleFecharModais}
                className={styles.cancelButton}
                disabled={submitting}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={submitting}
              >
                {submitting ? "Processando..." : "Salvar Alterações"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

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

  return (
    <div className={styles.activitiesContainer}>
      <h2 className={styles.sectionTitle}>Atividades da Turma</h2>
      
      {loading ? (
        <p className={styles.loadingMessage}>Carregando atividades...</p>
      ) : error ? (
        <p className={styles.errorMessage}>{error}</p>
      ) : atividades.length > 0 ? (
        <>
          <div className={styles.activityHeader}>
            <p className={styles.totalCount}>Total de atividades: {atividades.length}</p>
            {userType!==1 && (
              <button 
                className={styles.addButton}
                onClick={handleAdicionarAtividade}
              >
                + Adicionar Nova Atividade
              </button>
            )}
          </div>
          
          <ul className={styles.activitiesList}>
            {atividades.map(atividade => (
              <li key={atividade.id} className={styles.activityCard}>
                <div className={styles.activityHeaderInfo}>
                  <span className={styles.activityType}>
                    {atividade.tipo || "Atividade"}
                  </span>
                </div>

                <h3 className={styles.activityTitle}>{atividade.titulo}</h3>
                
                <div className={styles.activityMetadata}>
                  <span className={styles.activityAula}>
                    Aula: {atividade.aulaNome}
                  </span>
                  <span className={styles.activityDueDate}>
                    Prazo: {formatarData(atividade.data_entrega)}
                  </span>
                </div>
                
                {atividade.descricao && (
                  <div className={styles.activityDescription}>
                    {atividade.descricao}
                  </div>
                )}

                {userType!==1 && (
                  <div className={styles.activityActions}>
                    <button 
                      className={styles["view-details"]}
                      onClick={() => handleVerDetalhes(atividade)}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button 
                      className={styles["view-details"]}
                      onClick={() => handleEditarAtividade(atividade)}
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                    <button 
                      className={styles["view-details"]}
                      onClick={() => abrirModalDeletar(atividade.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                )}
                {userType===1 && (
                  <button 
                      className={styles["view-details"]}
                      onClick={() => handleVerDetalhesAluno(atividade)}
                    >
                      <FontAwesomeIcon icon={faEye} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className={styles.emptyState}>
          <p className={styles.emptyMessage}>
            Nenhuma atividade cadastrada para esta turma.
          </p>
          {userType !== 1 && (
            <button 
              className={styles.addFirstButton}
              onClick={handleAdicionarAtividade}
            >
              + Adicionar Primeira Atividade
            </button>
          )}
        </div>
      )}
      
      {atividadeSelecionada && (
        <div className={styles["modal-overlay"]}>
          <div className={styles["modal-content"]}>
          <div className={styles["modalHeader"]}>
            <h2>{atividadeSelecionada.titulo}</h2>
            <button className={styles["close-modal"]} onClick={closeModal}>
                  ×
              </button>
          </div>
          <div className={styles["modal-body"]}>
            <p><strong>Aula:</strong> {atividadeSelecionada.aula}</p>
            <p><strong>Data de Entrega:</strong> {formatarData(atividadeSelecionada.data_entrega)}</p>
            <p style={{marginTop:".6rem"}}><strong>Descrição da atividade:</strong> {atividadeSelecionada.descricao}</p>
          </div>
            <div className={styles["modal-actions"]} style={{margin:"1rem"}}>  
              <button onClick={handleDownload} className={styles["view-content-modal"]}>Baixar Documento</button>
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
                Tem certeza de que deseja excluir esta atividade? Esta ação não pode ser desfeita.
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

      {renderModalAdicionar()}
      {renderModalEditar()}
    </div>
  );
};

export default ActivitiesList;
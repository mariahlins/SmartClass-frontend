import { useState, useEffect } from "react";
import styles from "./Activity.module.css";
import AvaliacaoController from "../../../controllers/avaliacao/avaliacaoController";
import UserController from "../../../controllers/user/userController"
import AtividadeController from "../../../controllers/lms/atividadeController";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const PendingTeacher = ({ turmaId }) => {
  const [pendingActivities, setPendingActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [nota, setNota] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackRequired, setFeedbackRequired] = useState(false);

  useEffect(() => {
    const fetchPendingActivities = async () => {
      try {
        setLoading(true);
        const todasAtividades = await AvaliacaoController.listarAtividadesAvaliacao();
        const atividadesPendentes = todasAtividades.filter(atividade => atividade.nota === null);
        
        const atividadesComDetalhes = await Promise.all(
          atividadesPendentes.map(async (atividade) => {
            // Buscar informações do aluno pelo ID
            const alunoInfo = await UserController.obterUsuario(atividade.aluno);
            
            // Buscar informações da atividade pelo ID
            const atividadeInfo = await AtividadeController.obterAtividade(atividade.atividade);
            
            return {
              ...atividade,
              aluno: alunoInfo?.name || "Nome não disponível",
              atividade: atividadeInfo?.titulo || "Título não disponível"
            };
          })
        );
        
        setPendingActivities(atividadesComDetalhes);
        setFilteredActivities(atividadesComDetalhes);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao carregar atividades pendentes:", err);
        setError("Não foi possível carregar as atividades pendentes. Por favor, tente novamente mais tarde.");
        setLoading(false);
      }
    };

    fetchPendingActivities();
  }, [turmaId]);

  const openAvaliacaoModal = (activity) => {
    setCurrentActivity(activity);
    setShowModal(true);
    setNota("");
    setFeedback("");
    setFeedbackRequired(false);
    setSubmitSuccess(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentActivity(null);
    setNota("");
    setFeedback("");
  };

  const handleNotaChange = (e) => {
    const notaValue = e.target.value;
    setNota(notaValue);
    
    setFeedbackRequired(parseFloat(notaValue) <= 5);
  };
  
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
    
    if (searchValue.trim() === "") {
      setFilteredActivities(pendingActivities);
    } else {
      const filtered = pendingActivities.filter(activity => 
        activity.aluno.toLowerCase().includes(searchValue) || 
        activity.atividade.toLowerCase().includes(searchValue)
      );
      setFilteredActivities(filtered);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nota) return;
    if (feedbackRequired && !feedback) return;
  
    try {
      setSubmitting(true);
      
      const formData = {
        nota: parseFloat(nota)
      };
      
      if (feedback.trim()) {
        formData.feedback = feedback;
      }
      
      await AvaliacaoController.publicarNotas(currentActivity.id, formData);
      
      setPendingActivities(prev => 
        prev.filter(activity => activity.id !== currentActivity.id)
      );
      
      setSubmitSuccess(true);
      setSubmitting(false);
      
      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (err) {
      console.error("Erro ao publicar nota:", err);
      setError("Erro ao publicar a nota. Por favor, tente novamente.");
      setSubmitting(false);
    }
  };

  const handleDownloadConteudo = (conteudoUrl) => {
    if (conteudoUrl) {
      window.open(conteudoUrl, '_blank');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.pendingActivitiesContainer}>
        <h2 className={styles.sectionTitle}>Atividades Pendentes de Avaliação</h2>
        
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <span className={styles.searchIcon}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </span>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Buscar por aluno ou atividade..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
        
        {loading && (
          <div className={styles.loadingMessage}>
            <p>Carregando atividades pendentes...</p>
          </div>
        )}
        
        {error && (
          <div className={styles.errorMessage}>
            <p>{error}</p>
          </div>
        )}
        
        {!loading && !error && pendingActivities.length === 0 && (
          <div className={styles.emptyState}>
            <p className={styles.emptyMessage}>
              Não há atividades pendentes de avaliação no momento.
            </p>
          </div>
        )}
        
        {!loading && !error && pendingActivities.length > 0 && filteredActivities.length === 0 && (
          <div className={styles.emptyState}>
            <p className={styles.emptyMessage}>
              Nenhuma atividade encontrada para "{searchTerm}".
            </p>
          </div>
        )}
        
        {!loading && !error && filteredActivities.length > 0 && (
          <>
            <div className={styles.activityHeader}>
              <span className={styles.totalCount}>
                {filteredActivities.length} {filteredActivities.length === 1 ? 'atividade pendente' : 'atividades pendentes'} de avaliação
                {searchTerm && (
                  <span className={styles.searchResults}>
                    {" "}(filtrado de {pendingActivities.length} total)
                  </span>
                )}
              </span>
            </div>
            
            <ul className={styles.activitiesList}>
              {filteredActivities.map((activity) => (
                <li key={activity.id} className={styles.activityCard}>
                  <div className={styles.activityContent}>
                    <div className={styles.activityHeaderInfo}>
                      <span className={`${styles.activityStatus} ${styles.pendente}`}>
                        Pendente
                      </span>
                    </div>
                    
                    <h4 className={styles.activityTitle}>{activity.atividade}</h4>
                    <h5 className={styles.activitySubtitle}>Aluno: {activity.aluno}</h5>
                    
                    {activity.conteudo_para_avaliacao ? (
                      <div className={styles.conteudoInfo}>
                        <p>Conteúdo enviado para avaliação</p>
                        <button 
                          className={styles.downloadButton}
                          onClick={() => handleDownloadConteudo(activity.conteudo_para_avaliacao)}
                        >
                          Baixar Conteúdo
                        </button>
                      </div>
                    ) : (
                      <p className={styles.noContent}>Aluno não enviou conteúdo para avaliação</p>
                    )}
                  </div>
                  
                  {activity.conteudo_para_avaliacao && (
                    <div className={styles.activityActions}>
                      <button 
                        className={styles.avaliarButton}
                        onClick={() => openAvaliacaoModal(activity)}
                      >
                        Avaliar
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>{submitSuccess ? "Avaliação Concluída" : "Avaliar Atividade"}</h3>
              <button className={styles.closeModal} onClick={closeModal}>×</button>
            </div>
            
            <div className={styles.modalBody}>
              {submitSuccess ? (
                <div className={styles.successMessage}>
                  <p>Nota publicada com sucesso!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.avaliacaoForm}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Atividade:</label>
                    <p>{currentActivity?.atividade}</p>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Aluno:</label>
                    <p>{currentActivity?.aluno}</p>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="nota" className={styles.label}>Nota:</label>
                    <input
                      type="number"
                      id="nota"
                      className={styles.notaInput}
                      value={nota}
                      onChange={handleNotaChange}
                      min="0"
                      max="10"
                      step="0.1"
                      required
                      placeholder="0.0 - 10.0"
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="feedback" className={styles.label}>
                      Feedback:
                      {feedbackRequired && <span className={styles.required}> (obrigatório para notas até 5.0)</span>}
                    </label>
                    <textarea
                      id="feedback"
                      className={styles.feedbackInput}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      required={feedbackRequired}
                      placeholder="Digite seu feedback para o aluno"
                      rows={4}
                    />
                  </div>
                  
                  <div className={styles.formActions}>
                    <button
                      type="button"
                      className={styles.cancelButton}
                      onClick={closeModal}
                      disabled={submitting}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className={styles.submitButton}
                      disabled={!nota || (feedbackRequired && !feedback) || submitting}
                    >
                      {submitting ? "Enviando..." : "Publicar Nota"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingTeacher;
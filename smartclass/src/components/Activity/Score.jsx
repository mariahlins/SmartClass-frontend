import { useState, useEffect } from "react";
import styles from "./Activity.module.css";
import AvaliacaoController from "../../../controllers/avaliacao/avaliacaoController";
import AtividadeController from "../../../controllers/lms/atividadeController";
import UserController from "../../../controllers/user/userController";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const Score = ({ turmaId, isTeacher = true }) => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [nota, setNota] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [feedbackRequired, setFeedbackRequired] = useState(false);

  const userId = localStorage.getItem("userId");
 
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        
        const todasAtividades = await AvaliacaoController.listarAtividadesAvaliacao();
        
        // Para professores, mostrar todas as atividades avaliadas
        // Para alunos, filtrar apenas as próprias atividades
        let atividadesFiltradas = isTeacher 
          ? todasAtividades.filter(atividade => atividade.nota !== null)
          : todasAtividades.filter(atividade => 
              String(atividade.aluno) === String(userId) && atividade.nota !== null);

        const atividadesCompletas = await Promise.all(
          atividadesFiltradas.map(async (atividade) => {
            try {
              // Buscar detalhes da atividade
              const detalhesAtividade = await AtividadeController.obterAtividade(atividade.atividade);
              
              // Buscar informações do aluno
              const alunoInfo = await UserController.obterUsuario(atividade.aluno);
              
              return {
                ...atividade,
                ...detalhesAtividade,
                titulo: detalhesAtividade?.titulo || "Título não disponível",
                descricao: detalhesAtividade?.descricao || "Descrição não disponível",
                data_entrega: detalhesAtividade?.data_entrega,
                alunoNome: alunoInfo?.name || "Nome não disponível"
              };
            } catch (err) {
              console.error(`Erro ao buscar detalhes da atividade ${atividade.id}:`, err);
              return {
                ...atividade,
                titulo: "Título não disponível",
                descricao: "Descrição não disponível",
                data_entrega: null,
                alunoNome: "Nome não disponível"
              };
            }
          })
        );

        setActivities(atividadesCompletas);
        setFilteredActivities(atividadesCompletas);
        setLoading(false);
        
      } catch (err) {
        console.error("Erro ao carregar atividades:", err);
        setError("Não foi possível carregar as atividades. Por favor, tente novamente mais tarde.");
        setLoading(false);
      }
    };

    fetchActivities();
  }, [turmaId, userId, isTeacher]);

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
    
    if (searchValue.trim() === "") {
      setFilteredActivities(activities);
    } else {
      const filtered = activities.filter(activity => 
        activity.alunoNome.toLowerCase().includes(searchValue) || 
        activity.titulo.toLowerCase().includes(searchValue)
      );
      setFilteredActivities(filtered);
    }
  };

  const openEditModal = (activity) => {
    setCurrentActivity(activity);
    setNota(activity.nota.toString());
    setFeedback(activity.feedback || "");
    setShowModal(true);
    setFeedbackRequired(parseFloat(activity.nota) <= 5);
    setSuccessMessage("");
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentActivity(null);
    setNota("");
    setFeedback("");
    setSuccessMessage("");
  };

  const handleNotaChange = (e) => {
    const notaValue = e.target.value;
    setNota(notaValue);
    
    setFeedbackRequired(parseFloat(notaValue) <= 5);
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
      
      // Enviar a requisição para atualizar a avaliação específica pelo ID
      await AvaliacaoController.publicarNotas(currentActivity.id, formData);
      
      // Atualizar apenas a avaliação específica pelo seu ID (não pelo ID da atividade)
      const updatedActivities = activities.map(activity => {
        // Verificar se é EXATAMENTE a mesma avaliação que estamos editando
        if (activity.id === currentActivity.id) {
          return {
            ...activity,
            nota: parseFloat(nota),
            feedback: feedback.trim() || activity.feedback
          };
        }
        return activity;
      });
      
      setActivities(updatedActivities);
      setFilteredActivities(
        searchTerm.trim() === "" 
          ? updatedActivities 
          : updatedActivities.filter(activity => 
              activity.alunoNome.toLowerCase().includes(searchTerm.toLowerCase()) || 
              activity.titulo.toLowerCase().includes(searchTerm.toLowerCase())
            )
      );
      
      setSuccessMessage("Nota atualizada com sucesso!");
      setSubmitting(false);
      
      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (err) {
      console.error("Erro ao atualizar nota:", err);
      setError("Erro ao atualizar a nota. Por favor, tente novamente.");
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.pendingActivitiesContainer}>
        <h2 className={styles.sectionTitle}>
          {isTeacher ? "Atividades Avaliadas" : "Minhas Atividades Avaliadas"}
        </h2>
        
        {isTeacher && (
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
        )}
        
        {loading && (
          <div className={styles.loadingMessage}>
            <p>Carregando atividades...</p>
          </div>
        )}
        
        {error && (
          <div className={styles.errorMessage}>
            <p>{error}</p>
          </div>
        )}
        
        {!loading && !error && activities.length === 0 && (
          <div className={styles.emptyState}>
            <p className={styles.emptyMessage}>
              {isTeacher 
                ? "Não há atividades avaliadas no momento." 
                : "Você não tem atividades avaliadas no momento."}
            </p>
          </div>
        )}
        
        {!loading && !error && activities.length > 0 && filteredActivities.length === 0 && (
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
                {filteredActivities.length} {filteredActivities.length === 1 ? 'atividade avaliada' : 'atividades avaliadas'}
                {searchTerm && isTeacher && (
                  <span className={styles.searchResults}>
                    {" "}(filtrado de {activities.length} total)
                  </span>
                )}
              </span>
            </div>
            
            <ul className={styles.activitiesList}>
              {filteredActivities.map((activity) => (
                <li key={activity.id} className={styles.activityCard} style={{height:"6.4rem"}}>
                  <div className={styles.activityContent}>
                    <h4 className={styles.activityTitle}>{activity.titulo}</h4>
                    
                    {isTeacher && (
                      <h5 className={styles.activitySubtitle}>Aluno: {activity.alunoNome}</h5>
                    )}
                    
                    <div className={styles.notaContainer}>
                      <span className={styles.notaLabel}>Nota: </span>
                      <span className={`${styles.notaValue} ${parseFloat(activity.nota) <= 5 ? styles.notaBaixa : styles.notaAlta}`}>
                        {activity.nota}
                      </span>
                    </div>
                    
                    {activity.feedback && (
                      <div className={styles.feedbackContainer}>
                        <span className={styles.feedbackLabel}>Feedback:</span>
                        <p className={styles.feedbackText}>{activity.feedback}</p>
                      </div>
                    )}
                  </div>
                  
                  {isTeacher && (
                    <div className={styles.activityActions}>
                      <button 
                        className={styles.submitButton}
                        onClick={() => openEditModal(activity)}
                      >
                        Editar Avaliação
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
              <h3>{successMessage ? "Avaliação Atualizada" : "Editar Avaliação"}</h3>
              <button className={styles.closeModal} onClick={closeModal}>×</button>
            </div>
            
            <div className={styles.modalBody}>
              {successMessage ? (
                <div className={styles.successMessage}>
                  <p>{successMessage}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.avaliacaoForm}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Atividade:</label>
                    <p>{currentActivity?.titulo}</p>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Aluno:</label>
                    <p>{currentActivity?.alunoNome}</p>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="nota" className={styles.label}>Nota: </label>
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
                      {submitting ? "Salvando..." : "Salvar Alterações"}
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

export default Score;
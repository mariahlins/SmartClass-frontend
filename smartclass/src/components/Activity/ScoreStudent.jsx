import { useState, useEffect } from "react";
import AvaliacaoController from "../../../controllers/avaliacao/avaliacaoController";
import AtividadeController from "../../../controllers/lms/atividadeController";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';
import styles from "./Activity.module.css";

// Estilos para o modal
const modalStyles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '80vh',
    overflow: 'auto',
    position: 'relative',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
    color:"#3E238E"
  },
  modalTitle: {
    margin: '0 0 15px 0',
    fontSize: '18px',
    fontWeight: 'bold',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px'
  },
  closeModalBtn: {
    marginTop: '20px',
    padding: '8px 16px',
    backgroundColor: '#3E238E',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    float: 'right'
  },
  feedbackSection: {
    marginBottom: '15px'
  },
  feedbackLabel: {
    fontWeight: 'bold',
    marginBottom: '5px',
    display: 'block'
  },
  feedbackContent: {
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
    border: '1px solid #eee',
    lineHeight: '1.5'
  }
};

const ScoreStudent = ({ turmaId }) => {
  const [pendingActivities, setPendingActivities] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalData, setModalData] = useState(null);

  const alunoId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchPendingActivities = async () => {
      try {
        setLoading(true);
        const todasAtividades = await AvaliacaoController.listarAtividadesAvaliacao();
        const feedbacksData = await AvaliacaoController.listarFeedbacks(alunoId);
        
        // Armazenar os feedbacks
        setFeedbacks(feedbacksData);

        const alunoIdNumerico = Number(alunoId);
        let atividades = todasAtividades.filter(atividade => atividade.aluno === alunoIdNumerico && atividade.nota !== null);
        if (atividades.length === 0) {
          atividades = todasAtividades.filter(atividade => String(atividade.aluno) === String(alunoId) && atividade.nota !== null);
        }

        const atividadesCompletas = await Promise.all(
          atividades.map(async (atividade) => {
            try {
              const detalhesAtividade = await AtividadeController.obterAtividade(atividade.atividade);
              
              // Procurar se existe feedback para essa atividade
              const feedbackAtividade = feedbacksData.find(f => f.atividade === atividade.atividade);
              
              return {
                ...atividade,
                ...detalhesAtividade,
                titulo: detalhesAtividade.titulo || "Título não disponível",
                descricao: detalhesAtividade.descricao,
                data_entrega: detalhesAtividade.data_entrega,
                feedbackTexto: feedbackAtividade ? feedbackAtividade.feedback : null
              };
            } catch (err) {
              console.error(`Erro ao buscar detalhes da atividade ${atividade.id}:`, err);
              return {
                ...atividade,
                titulo: "Título não disponível",
                descricao: "Descrição não disponível",
                data_entrega: null,
                feedbackTexto: null
              };
            }
          })
        );

        setPendingActivities(atividadesCompletas);
        
        // Não mostrar o modal automaticamente
        // Os feedbacks serão exibidos apenas quando o usuário clicar no botão
        
        setLoading(false);

      } catch (err) {
        console.error("Erro ao carregar atividades pendentes:", err);
        setError("Não foi possível carregar as atividades pendentes. Por favor, tente novamente mais tarde.");
        setLoading(false);
      }
    };

    if (alunoId) {
      fetchPendingActivities();
    }
  }, [turmaId, alunoId]);

  const handleCloseFeedbackModal = () => {
    setModalData(null);
  };

  const handleOpenFeedback = (activity) => {
    setModalData({
      feedback: activity.feedbackTexto,
      nota: activity.nota,
      titulo: activity.titulo
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.pendingActivitiesContainer}>
        <h2 className={styles.sectionTitle}>Atividades avaliadas</h2>

        {loading && <p className={styles.loadingMessage}>Carregando atividades...</p>}
        {error && <p className={styles.errorMessage}>{error}</p>}
        {!loading && !error && pendingActivities.length === 0 && (
          <p className={styles.emptyMessage}>Você não tem atividades avaliadas no momento.</p>
        )}

        {!loading && !error && pendingActivities.length > 0 && (
          <>
            <div className={styles.activityHeader}>
              <span className={styles.totalCount}>
                {pendingActivities.length} {pendingActivities.length === 1 ? 'atividade avaliada' : 'atividades avaliadas'}
              </span>
            </div>

            <ul className={styles.activitiesList}>
              {pendingActivities.map((activity) => (
                <li key={activity.id} className={styles.activityCard} style={{height:"5rem"}}>
                  <div className={styles.activityRow} style={{width:"100%"}}>
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                      <h4 className={styles.activityTitle}>{activity.titulo}</h4>
                      <div>
                        <h4 style={{textAlign:"right", marginBottom:".6rem"}} className={styles.activityNota}>Nota: {activity.nota}</h4>
                        {activity.feedbackTexto && activity.feedbackTexto.trim() !== '' && (
                          <button
                            className={styles.submitButton}
                            onClick={() => handleOpenFeedback(activity)}
                            style={{ padding: "4px 8px", display: "flex", alignItems: "center", gap: "6px", backgroundColor:"#6d52c0" }}
                          >
                            Ver feedback
                            <FontAwesomeIcon icon={faCommentDots} />
                          </button>
                        )}

                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {modalData && (
          <div style={modalStyles.modalOverlay} onClick={handleCloseFeedbackModal}>
            <div style={modalStyles.modalContent} onClick={e => e.stopPropagation()}>
              <h3 style={modalStyles.modalTitle}>{modalData.titulo}</h3>
              <p><strong>Nota:</strong> {modalData.nota}</p>
              <div style={{ ...modalStyles.feedbackSection, color: "#3E238E", marginTop:".8rem" }}>
                <p style={modalStyles.feedbackLabel}>Feedback:</p>
                <div style={modalStyles.feedbackContent}>{modalData.feedback}</div>
              </div>
              <button style={modalStyles.closeModalBtn} onClick={handleCloseFeedbackModal}>Fechar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreStudent;
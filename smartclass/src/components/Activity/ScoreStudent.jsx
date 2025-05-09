import { useState, useEffect } from "react";
import styles from "./Activity.module.css";
import AvaliacaoController from "../../../controllers/avaliacao/avaliacaoController";
import AtividadeController from "../../../controllers/lms/atividadeController";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

const ScoreStudent = ({ turmaId }) => {
  const [pendingActivities, setPendingActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalData, setModalData] = useState(null);

  const alunoId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchPendingActivities = async () => {
      try {
        setLoading(true);
        const todasAtividades = await AvaliacaoController.listarAtividadesAvaliacao();

        const alunoIdNumerico = Number(alunoId);
        let atividades = todasAtividades.filter(atividade => atividade.aluno === alunoIdNumerico && atividade.nota !== null);
        if (atividades.length === 0) {
          atividades = todasAtividades.filter(atividade => String(atividade.aluno) === String(alunoId) && atividade.nota !== null);
        }

        const atividadesCompletas = await Promise.all(
          atividades.map(async (atividade) => {
            try {
              const detalhesAtividade = await AtividadeController.obterAtividade(atividade.atividade);
              return {
                ...atividade,
                ...detalhesAtividade,
                titulo: detalhesAtividade.titulo || "Título não disponível",
                descricao: detalhesAtividade.descricao,
                data_entrega: detalhesAtividade.data_entrega
              };
            } catch (err) {
              console.error(`Erro ao buscar detalhes da atividade ${atividade.id}:`, err);
              return {
                ...atividade,
                titulo: "Título não disponível",
                descricao: "Descrição não disponível",
                data_entrega: null
              };
            }
          })
        );

        setPendingActivities(atividadesCompletas);
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
                <li key={activity.id} className={styles.activityCard} style={{height:"4rem"}}>
                  <div className={styles.activityRow} style={{width:"100%"}}>
                  <div style={{display:"flex", justifyContent:"space-between"}}>
                    <h4 className={styles.activityTitle}>{activity.titulo}</h4>
                    <h4 className={styles.activityNota}>Nota: {activity.nota}</h4>
                  </div>
                    {activity.feedback && (
                      <button
                        className={styles.feedbackButton}
                        onClick={() => setModalData({ feedback: activity.feedback, nota: activity.nota, titulo: activity.titulo })}
                      >
                        <FontAwesomeIcon icon={faEye} /> Ver feedback
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {modalData && (
          <div className={styles.modalOverlay} onClick={() => setModalData(null)}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <h3 className={styles.modalTitle}>{modalData.titulo}</h3>
              <p><strong>Nota:</strong> {modalData.nota}</p>
              <p><strong>Feedback:</strong></p>
              <p>{modalData.feedback}</p>
              <button className={styles.closeModalBtn} onClick={() => setModalData(null)}>Fechar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreStudent;

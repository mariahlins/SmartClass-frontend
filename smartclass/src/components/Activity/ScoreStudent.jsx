import { useState, useEffect } from "react";
import styles from "./Activity.module.css";
import AvaliacaoController from "../../../controllers/avaliacao/avaliacaoController";
import AtividadeController from "../../../controllers/lms/atividadeController";

const ScoreStudent = ({ turmaId }) => {
  const [pendingActivities, setPendingActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const alunoId = localStorage.getItem("userId");
 
  useEffect(() => {
    const fetchPendingActivities = async () => {
      
      try {
        setLoading(true);
        
        const todasAtividades = await AvaliacaoController.listarAtividadesAvaliacao();

        if (todasAtividades.length > 0) {
          console.log("Exemplo de aluno ID na lista:", todasAtividades[0].aluno, "tipo:", typeof todasAtividades[0].aluno);
        }

        const alunoIdNumerico = Number(alunoId);
        let atividades = todasAtividades.filter(atividade => atividade.aluno === alunoIdNumerico && atividade.nota !== null);
        console.log("Notas", atividades)

        if (atividades.length === 0) {
          console.log("Tentando filtrar sem conversão...");
          atividades = todasAtividades.filter(atividade => String(atividade.aluno) === String(alunoId) && atividade.nota !== null);
          console.log("Resultado sem conversão:", atividades);
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

        console.log("Atividades com detalhes:", atividadesCompletas);
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
        
        {!loading && !error && pendingActivities.length === 0 && (
          <div className={styles.emptyState}>
            <p className={styles.emptyMessage}>
              Você não tem atividades avaliadas no momento.
            </p>
          </div>
        )}
        
        {!loading && !error && pendingActivities.length > 0 && (
          <>
            <div className={styles.activityHeader}>
              <span className={styles.totalCount}>
                {pendingActivities.length} {pendingActivities.length === 1 ? 'atividade pendente' : 'atividades pendentes'}
              </span>
            </div>
            
            <ul className={styles.activitiesList} style={{display: "flex", justifyContent: "space-between", width: "100%", flexDirection: "column", height:"4rem"}}>
              {pendingActivities.map((activity) => (
                <li key={activity.id} className={styles.activityCard}>
                <div style={{display:"flex", justifyContent:"space-between", width:"95%"}}>
                  
                  <h4 className={styles.activityTitle}>{activity.titulo}</h4>
                  <h4 className={styles.activityTitle}>{activity.nota}</h4>
                  
                </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default ScoreStudent;
import { useState, useEffect } from "react";
import styles from "./Activity.module.css";
import AvaliacaoController from "../../../controllers/avaliacao/avaliacaoController";
import AtividadeController from "../../../controllers/lms/atividadeController";

const PendingStudent = ({ turmaId }) => {
  const [pendingActivities, setPendingActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const alunoId = localStorage.getItem("userId");
 
  useEffect(() => {
    const fetchPendingActivities = async () => {
      console.log("alunoId:", alunoId, "tipo:", typeof alunoId);
      
      try {
        setLoading(true);
        
        const todasAtividades = await AvaliacaoController.listarAtividadesAvaliacao();

        if (todasAtividades.length > 0) {
          console.log("Exemplo de aluno ID na lista:", todasAtividades[0].aluno, "tipo:", typeof todasAtividades[0].aluno);
        }

        const alunoIdNumerico = Number(alunoId);
        let atividades = todasAtividades.filter(atividade => atividade.aluno === alunoIdNumerico && atividade.nota == null);

        if (atividades.length === 0) {
          console.log("Tentando filtrar sem conversão...");
          atividades = todasAtividades.filter(atividade => String(atividade.aluno) === String(alunoId) && atividade.nota == null);
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

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const openSubmitModal = (activity) => {
    setCurrentActivity(activity);
    setShowModal(true);
    setSelectedFile(null);
    setSubmitSuccess(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentActivity(null);
    setSelectedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !currentActivity) return;
  
    try {
      setSubmitting(true);

      console.log("Submitting activity:", currentActivity.id, alunoId, selectedFile);
      
      await AvaliacaoController.enviarAtividade(
        currentActivity.id,   
        alunoId,             
        selectedFile         
      );
      
      setPendingActivities(prev => 
        prev.filter(activity => activity.id !== currentActivity.id)
      );
      
      setSubmitSuccess(true);
      setSubmitting(false);
      
      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (err) {
      console.error("Error submitting activity content:", err);
      setError("Erro ao enviar o conteúdo. Por favor, tente novamente.");
      setSubmitting(false);
    }
  };

  const formatarData = (dataString) => {
    if (!dataString) return "Data não disponível";
    try {
      return new Date(dataString).toLocaleDateString('pt-BR');
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      return "Data inválida";
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.pendingActivitiesContainer}>
        <h2 className={styles.sectionTitle}>Atividades Pendentes de Nota</h2>
        
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
              Você não tem atividades pendentes de envio no momento.
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
            
            <ul className={styles.activitiesList} style={{display: "flex", justifyContent: "space-between", width: "100%", flexDirection: "column"}}>
              {pendingActivities.map((activity) => (
                <li key={activity.id} className={styles.activityCard}>
                <div>
                  <div className={styles.activityHeaderInfo}>
                    <span className={`${styles.activityStatus} ${styles.pendente}`}>
                      Atividade não avaliada
                    </span>
                  </div>
                  
                  <h4 className={styles.activityTitle}>{activity.titulo}</h4>
                  
                  {activity.descricao && (
                    <p className={styles.activityDescription}>
                      {activity.descricao}
                    </p>
                  )}
                  
                  <div className={styles.activityMetadata}>
                    <span>Data limite: {formatarData(activity.data_entrega)}</span>
                  </div>
                  
                </div>
                {!activity.conteudo_para_avaliacao && (
                  <div className={styles.activityActions}>
                    <button 
                      className={styles.submitButton}
                      onClick={() => openSubmitModal(activity)}
                    >
                      Enviar Conteúdo
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
              <h3>{submitSuccess ? "Envio Concluído" : "Enviar Conteúdo"}</h3>
              <button className={styles.closeModal} onClick={closeModal}>×</button>
            </div>
            
            <div className={styles.modalBody}>
              {submitSuccess ? (
                <div className={styles.successMessage}>
                  <p>Conteúdo enviado com sucesso!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.submitForm}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Atividade:</label>
                    <p>{currentActivity?.titulo}</p>
                  </div>
                  
                  {currentActivity?.descricao && (
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Descrição:</label>
                      <p>{currentActivity.descricao}</p>
                    </div>
                  )}
                  
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Data limite:</label>
                    <p>{currentActivity?.data_entrega ? formatarData(currentActivity.data_entrega) : "Não especificada"}</p>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Arquivo para avaliação:</label>
                    <div className={styles.fileUploadWrapper}>
                      <label className={styles.fileLabel}>
                        {selectedFile ? selectedFile.name : "Selecionar arquivo"}
                        <input
                          type="file"
                          className={styles.fileInput}
                          onChange={handleFileChange}
                          required
                        />
                      </label>
                    </div>
                    {selectedFile && (
                      <p className={styles.currentFile}>Arquivo selecionado: {selectedFile.name}</p>
                    )}
                    <small className={styles.fileHelp}>
                      Formatos aceitos: PDF, DOC, DOCX, JPG, PNG (máx. 10MB)
                    </small>
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
                      disabled={!selectedFile || submitting}
                    >
                      {submitting ? "Enviando..." : "Enviar"}
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

export default PendingStudent;
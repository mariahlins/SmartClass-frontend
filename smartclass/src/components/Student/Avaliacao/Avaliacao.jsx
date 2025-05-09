import { useState } from "react";
import styles from "../../Activity/Activity.module.css";
import AvaliacaoController from "../../../../controllers/avaliacao/avaliacaoController";

const AvaliacaoButton = ({ activity, buttonText = "Enviar Avaliação", buttonClassName = "" }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState("");
  const [activityExists, setActivityExists] = useState(false);
  
  const alunoId = localStorage.getItem("userId");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const openModal = () => {
    setShowModal(true);
    setSelectedFile(null);
    setSubmitSuccess(false);
    setError("");
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !activity) return;
  
    try {
      setSubmitting(true);
      setError("");

      await AvaliacaoController.enviarAtividade(
        activity.id,   
        alunoId,             
        selectedFile         
      );
      
      setSubmitSuccess(true);
      setSubmitting(false);
      setActivityExists(true);
      
      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (err) {
      console.error("Error submitting activity content:", err);
      setError("Erro ao enviar o conteúdo. Por favor, tente novamente.");
      setSubmitting(false);
    }
  };
  
  return (
    <>
      {!activityExists && (
        <button 
          className={buttonClassName || styles.avaliarButton} 
          onClick={openModal}
          style={{backgroundColor:"#5f30ed", color:"#fff", padding:"6px 12px", borderRadius:"6px", border:"2px solid #5f30ed"}}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#4b24c9"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "#5f30ed"}
          >
          {buttonText}
        </button>
      )}

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
                    <p>{activity?.titulo}</p>
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
                  
                  {error && (
                    <div className={styles.errorMessage}>
                      <p>{error}</p>
                    </div>
                  )}
                  
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
    </>
  );
};

export default AvaliacaoButton;
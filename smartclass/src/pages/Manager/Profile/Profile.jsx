import { useEffect, useState } from "react";
import styles from "./Profile.module.css";
import Header from "../../../components/Header/Header";
import Sidebar from "../../../components/Manager/SideBar/SideBar";
import UserController from "../../../../controllers/user/userController";

const ProfileManager = () => {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    password:"",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await UserController.obterUsuario(userId);
        setUserData(response);
        console.log("Dados do usuário:", response);
        setFormData({
          name: response.name || "",
          email: response.email || "",
          cpf: response.cpf || "",
        });
        setLoading(false);
      } catch (error) {
        console.error("Erro ao obter usuário:", error.response ? error.response.data : error.message);
        setMessage({ 
          text: "Erro ao carregar os dados do usuário. Tente novamente mais tarde.",
          type: "error"
        });
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setFormData({
      name: userData.name || "",
      email: userData.email || "",
      cpf: userData.cpf || "",
    });
    setEditMode(false);
    setMessage({ text: "", type: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await UserController.atualizarUsuario(userId, formData);
      
      setUserData({
        ...userData,
        ...formData
      });
      
      setEditMode(false);
      setMessage({ 
        text: "Perfil atualizado com sucesso!",
        type: "success"
      });
      setLoading(false);
      
      // Esconde a mensagem após 3 segundos
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 3000);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error.response ? error.response.data : error.message);
      setMessage({ 
        text: error.response?.data?.error || "Erro ao atualizar o perfil. Tente novamente.",
        type: "error"
      });
      setLoading(false);
    }
  };

  return (
    <div className={styles["profiles-container"]}>
      <Header />
      <Sidebar />
      <div className={styles["profiles-content"]}>
        <div className={styles["profiles-border"]}>
          {loading ? (
            <div className={styles["profiles-info"]}>
              <p>Carregando dados do usuário...</p>
            </div>
          ) : userData ? (
            <div className={styles["profiles-info"]}>
              <div className={styles["profile-header"]}>
                <h2>Informações do perfil</h2>
                {!editMode ? (
                  <button 
                    className={styles["edit-button"]} 
                    onClick={handleEdit}
                  >
                    Editar Perfil
                  </button>
                ) : null}
              </div>
              
              {message.text && (
                <div className={`${styles["message"]} ${styles[message.type]}`}>
                  {message.text}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className={styles["form-group"]}>
                  <label htmlFor="name">Nome:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!editMode}
                    className={!editMode ? styles["disabled-input"] : ""}
                  />
                </div>
                
                <div className={styles["form-group"]}>
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!editMode}
                    className={!editMode ? styles["disabled-input"] : ""}
                  />
                </div>
                
                <div className={styles["form-group"]}>
                  <label htmlFor="cpf">CPF:</label>
                  <input
                    type="text"
                    id="cpf"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    disabled={!editMode}
                    className={!editMode ? styles["disabled-input"] : ""}
                  />
                </div>
                
                {editMode && (
                  <div>
                      <div className={styles["form-group"]}>
                          <label htmlFor="name">Senha:</label>
                          <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={!editMode}
                            placeholder="Digite sua nova senha"
                            className={!editMode ? styles["disabled-input"] : ""}
                          />
                      </div>
                      <div className={styles["button-group"]}>
                      <button 
                          type="button" 
                          className={styles["cancel-button"]} 
                          onClick={handleCancel}
                          disabled={loading}
                        >
                          Cancelar
                        </button>
                        <button 
                          type="submit" 
                              className={styles["save-button"]}
                          disabled={loading}
                        >
                          {loading ? "Salvando..." : "Salvar"}
                        </button>
                      </div>
                  </div>
                )}
              </form>
            </div>
          ) : (
            <div className={styles["profiles-info"]}>
              <p>Nenhum dado de usuário encontrado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileManager;
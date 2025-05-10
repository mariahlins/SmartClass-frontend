import { useState, useEffect } from 'react';
import styles from './Modal.module.css'; 
import AuthController from '../../../../controllers/authController';

const CreateUserModal = ({ isOpen, onClose, onUserCreated }) => {
  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    email: "",
    password: "",
    role: "manager",
    is_manager: true,
    is_teacher: false,
    is_student: false
  });

    const formatCPF = (value) => {
        const cleanedValue = value.replace(/\D/g, '');

        let formattedValue = cleanedValue.replace(/(\d{3})(\d)/, '$1.$2');
        formattedValue = formattedValue.replace(/(\d{3})(\d)/, '$1.$2'); 
        formattedValue = formattedValue.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

        return formattedValue;
    };

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        cpf: "",
        email: "",
        password: "",
        role: "manager",
        is_manager: true,
        is_teacher: false,
        is_student: false
      });
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'cpf' ? formatCPF(value) : (type === 'checkbox' ? checked : value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      formData.role = "manager";
      formData.cpf = formData.cpf.replace(/\D/g, '');
      const response = await AuthController.register(formData);
      console.log("Usuário criado:", response);
      
      onClose();
      
      if (onUserCreated) {
        onUserCreated();
      }
    } catch (error) {
      console.error("Erro ao criar usuário:", error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Criar novo administrador</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Nome</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder='Ex.: Paulo Silva Dos Santos'
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder='example@email.com'
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>CPF</label>
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              placeholder='123.123.123-10'
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Senha</label>
            <input
              type="password"
              name="password"
              placeholder='Digite a senha'
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
 
          <div className={styles.formButtons}>
            <button 
              type="button" 
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className={styles.createButton}
            >
              Criar Usuário
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
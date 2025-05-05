import { useState, useEffect } from 'react';
import styles from './Modal.module.css'; 
import AuthController from '../../../../controllers/authController';
import CursoController from '../../../../controllers/lms/cursoController';

const NewStudent = ({ isOpen, onClose, onUserCreated }) => {
  const [cursos, setCursos] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    email: "",
    password: "",
    role: "student",
    curso: "",
    is_manager: false,
    is_teacher: false,
    is_student: true
  });

  useEffect(() => {
    async function carregarCursos() {
      try {
        const cursos = await CursoController.listar();
        const formattedCursos = cursos.map(curso => ({
          value: curso.id,
          label: curso.nome,
        }));
        setCursos(formattedCursos);
      } catch (error) {
        console.error('Erro ao buscar cursos:', error);
      }
    }

    if (isOpen) {
      carregarCursos();
      setFormData({
        name: "",
        cpf: "",
        email: "",
        password: "",
        role: "student",
        curso: "",
        is_manager: false,
        is_teacher: false,
        is_student: true
      });
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      formData.role = "student";
      console.log("Dados do formulário:", formData);
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
        <h2>Criar novo usuário</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Nome</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
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
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Senha</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div> 

            <div className={styles.formGroup}>
            <label>Curso</label>
            <select
                name="curso"
                value={formData.curso}
                onChange={handleInputChange}
                required
            >
                <option value="">Selecione um curso</option>
                {cursos.map((curso) => (
                <option key={curso.value} value={curso.value}>
                    {curso.label}
                </option>
                ))}
            </select>
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

export default NewStudent;
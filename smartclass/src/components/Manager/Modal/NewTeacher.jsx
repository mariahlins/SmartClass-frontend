import { useState, useEffect } from 'react';
import styles from './Modal.module.css'; 
import AuthController from '../../../../controllers/authController';
import CursoController from '../../../../controllers/lms/CursoController';

const NewTeacher = ({ isOpen, onClose, onUserCreated }) => {
  const [cursos, setCursos] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    email: "",
    password: "",
    role: "teacher",
    cursos: [],
    is_manager: false,
    is_teacher: true,
    is_student: false
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
        role: "teacher",
        cursos: [],
        is_manager: false,
        is_teacher: true,
        is_student: false
      });
    }
  }, [isOpen]);

    const formatCPF = (value) => {
        const cleanedValue = value.replace(/\D/g, '');

        let formattedValue = cleanedValue.replace(/(\d{3})(\d)/, '$1.$2');
        formattedValue = formattedValue.replace(/(\d{3})(\d)/, '$1.$2'); 
        formattedValue = formattedValue.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

        return formattedValue;
    };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'cpf' ? formatCPF(value) : (type === 'checkbox' ? checked : value),
    });
  };

  const handleCursoCheckboxChange = (e) => {
    const { value, checked } = e.target;
    const id = parseInt(value);

    setFormData((prevData) => {
      const updatedCursos = checked
        ? [...prevData.cursos, id]
        : prevData.cursos.filter((cursoId) => cursoId !== id);

      return { ...prevData, cursos: updatedCursos };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      formData.cpf = formData.cpf.replace(/\D/g, ''),
      formData.role = "teacher";
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
        <h2>Criar novo professor</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Nome</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              placeholder='Paulo Silva Dos Santos'
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
              placeholder='Digite a nova senha'
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div> 

          <div className={styles.formGroup}>
            <label>Cursos</label>
            <div className={styles.checkboxGroup}>
              {cursos.map((curso) => (
                <label key={curso.value} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    value={curso.value}
                    checked={formData.cursos.includes(curso.value)}
                    onChange={handleCursoCheckboxChange}
                  />
                  {curso.label}
                </label>
              ))}
            </div>
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

export default NewTeacher;

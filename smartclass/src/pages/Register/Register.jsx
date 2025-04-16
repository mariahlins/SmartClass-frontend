import styles from './Register.module.css';
import { useState, useEffect } from 'react';
import AuthController from '../../../controllers/AuthController';
import CursoController from '../../../controllers/CursoController';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        cpf: '',
        email: '',
        password: '',
        confirmPassword: '',
        curso: '',
    });

    const [cursos, setCursos] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCursos = async () => {
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
        };

        fetchCursos();
    }, []);

    useEffect(() => {
        setPasswordMatch(formData.password === formData.confirmPassword);
    }, [formData.password, formData.confirmPassword]);

    const formatCPF = (value) => {
        const cleanedValue = value.replace(/\D/g, '');

        let formattedValue = cleanedValue.replace(/(\d{3})(\d)/, '$1.$2');
        formattedValue = formattedValue.replace(/(\d{3})(\d)/, '$1.$2');
        formattedValue = formattedValue.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

        return formattedValue;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'cpf') {
            const formattedValue = formatCPF(value);
            setFormData({ ...formData, [name]: formattedValue });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleCursoChange = (selectedOption) => {
        setFormData({ ...formData, curso: selectedOption.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.curso) {
            alert('Por favor, selecione um curso.');
            return;
        }
        
        if (!passwordMatch) {
            alert('As senhas não coincidem!');
            return;
        }

        try {
            const dataToSend = {
                ...formData,
                cpf: formData.cpf.replace(/\D/g, ''),
                confirmPassword: undefined
            };
    
            const response = await AuthController.register(dataToSend);
            
            setFormData({
                name: '',
                cpf: '',
                email: '',
                password: '',
                confirmPassword: '',
                curso: '',
            });
            
            alert('Cadastro realizado com sucesso!');
            navigate('/');
        } catch (error) {
            if (error.response && error.response.status === 409) {
                if (error.response.data.error === 'CPF already exists') {
                    alert('CPF já cadastrado');
                } else if (error.response.data.error === 'Email already exists') {
                    alert('Email já cadastrado');
                } else {
                    alert('Erro ao realizar cadastro');
                }
            } else {
                alert('Erro ao realizar cadastro');
            }
        }
    };

    return (
        <div className={styles['rgstr-container']}>
            <div className={styles['rgstr-content']}>
                <h1>Faça seu registro!</h1>
                <div className={styles['input-group-rgstr']}>
                    <form onSubmit={handleSubmit} className={styles['rgstr-form']}>
                        <label className={styles['rgstr-label']}>Nome</label>
                        <input
                            type="text"
                            name="name"
                            className={styles['rgstr-input']}
                            placeholder="Nome completo"
                            value={formData.name}
                            onChange={handleChange}
                            required 
                        />
                        
                        <label className={styles['rgstr-label']}>CPF</label>
                        <input
                            type="text"
                            name="cpf"
                            className={styles['rgstr-input']}
                            placeholder="111.111.111-11"
                            value={formData.cpf}
                            onChange={handleChange}
                            maxLength={14}
                            required 
                        />     
                        
                        <label className={styles['rgstr-label']}>Email</label>
                        <input
                            type="email"
                            name="email"
                            className={styles['rgstr-input']}
                            placeholder="email@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required 
                        />
                        
                        <label className={styles['rgstr-label']}>Curso</label>
                        <Select
                            options={cursos}
                            onChange={handleCursoChange}
                            placeholder="Selecione um curso"
                            className={styles['rgstr-select']}
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    borderRadius: '0.5rem',
                                    color: '#fafafa',
                                    boxShadow: 'none',
                                    '&:hover': {
                                        borderColor: 'rgba(255, 255, 255, 0.5)',
                                    },
                                }),
                                singleValue: (base) => ({
                                    ...base,
                                    color: '#fafafa',
                                }),
                                placeholder: (base) => ({
                                    ...base,
                                    color: 'rgba(255, 255, 255, 0.7)',
                                }),
                                menu: (base) => ({
                                    ...base,
                                    backgroundColor: '#6a11cb',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    borderRadius: '0.5rem',
                                }),
                                option: (base, { isFocused }) => ({
                                    ...base,
                                    backgroundColor: isFocused ? '#8a63f2' : '#6a11cb',
                                    color: '#fafafa',
                                    '&:active': {
                                        backgroundColor: '#8a63f2',
                                    },
                                }),
                                dropdownIndicator: (base) => ({
                                    ...base,
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    '&:hover': {
                                        color: '#fafafa',
                                    },
                                }),
                                indicatorSeparator: (base) => ({
                                    ...base,
                                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                }),
                            }}
                            required 
                        />
                        
                        <label className={styles['rgstr-label']}>Senha</label>
                        <div className={styles['password-input-wrapper']}>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className={`${styles['rgstr-input']} ${styles['password-input']}`}
                                placeholder="Senha"
                                value={formData.password}
                                onChange={handleChange}
                                required 
                            />
                            <span 
                                className={styles['password-toggle-icon']}
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        
                        <label className={styles['rgstr-label']}>Confirmar Senha</label>
                        <div className={styles['password-input-wrapper']}>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                className={`${styles['rgstr-input']} ${styles['password-input']} ${!passwordMatch && styles['password-mismatch']}`}
                                placeholder="Confirme sua senha"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required 
                            />
                            <span 
                                className={styles['password-toggle-icon']}
                                onClick={toggleConfirmPasswordVisibility}
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        {!passwordMatch && (
                            <p className={styles['error-message']}>As senhas não coincidem!</p>
                        )}
                        
                        <button 
                            type="submit" 
                            className={styles['rgstr-btn']}
                            disabled={!passwordMatch}
                        >
                            Registrar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
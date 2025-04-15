import styles from './Login.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthController from '../../../controllers/AuthController';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const [formData, setFormData] = useState({
        cpf: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    
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

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = {
                ...formData,
                cpf: formData.cpf.replace(/\D/g, ''),
            };

            const response = await AuthController.login(dataToSend);

            localStorage.setItem('accessToken', response.access);
            localStorage.setItem('refreshToken', response.refresh);

            if (localStorage.getItem('accessToken') && localStorage.getItem('refreshToken')) {
                alert('Login efetuado com sucesso!');
            }

        } catch (error) {
            console.error('Erro ao enviar dados:', error);
        }
    };

  return (
    <div className={styles["lgn-container"]}>
        <div className={styles['lgn-content']}>
        <div className={styles['lgn-content2']}>
            <h1>SmartClass</h1>
            <h4>Conecte-se ao aprendizado!</h4>
        </div>
        <div className={styles['lgn-content2']}>
            <div className={styles["input-group-login"]}>
                <form onSubmit={handleSubmit} className={styles['login-form']}>
                    <label className={styles['lgn-label']}>CPF</label>
                        <input
                            className={styles['lgn-input']}
                            type="text"
                            name="cpf"
                            placeholder="111.111.111-11"
                            value={formData.cpf}
                            onChange={handleChange}
                            maxLength={14}
                        />
                    <label className={styles['lgn-label']}>Senha</label>
                    <div className={styles['password-input-wrapper']}>
                        <input
                            className={styles['lgn-input']}
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Senha"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <span 
                            className={styles['password-toggle-icon']}
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <p className={styles['register-link']}>
                            Não tem uma conta?{' '}
                            <span onClick={() => navigate('/register')}>Cadastre-se</span>
                    </p>
                    <button type="submit" className={styles['login-button']}>Entrar</button>
                </form>
            </div>
            </div>
        </div>
    </div>
  )
}

export default Login
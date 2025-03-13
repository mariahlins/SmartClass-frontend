import styles from './Login.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthController from '../../../controllers/AuthController';

const Login = () => {
    const [formData, setFormData] = useState({
        cpf: '',
        password: '',
    });

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
            <h1>SmartClass</h1>
            <h4>Conecte-se ao aprendizado!</h4>
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
                        <input
                            className={styles['lgn-input']}
                            type="password"
                            name="password"
                            placeholder="Senha"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    <p className={styles['register-link']}>
                            Não tem uma conta?{' '}
                            <span onClick={() => navigate('/register')}>Cadastre-se</span>
                    </p>
                    <button type="submit" className={styles['login-button']}>Entrar</button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Login
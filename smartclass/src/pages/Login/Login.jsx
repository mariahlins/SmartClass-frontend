import styles from './Login.module.css'
import { useState } from 'react'
import axios from 'axios';

const Login = () => {
    const [formData, setFormData] = useState({
        cpf:'',
        password:'',
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try {
          console.log("Enviando dados:", formData);
          const response = await axios.post('http://127.0.0.1:8000/api/auth/login/', formData, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          console.log('Resposta do servidor:', response.data);
        } catch (error) {
          console.error('Erro ao enviar dados:', error.response ? error.response.data : error.message);
        }
        console.log(formData)
    }

  return (
    <div className={styles["lgn-container"]}>
        <div className={styles['lgn-content']}>
            <h1>SmartClass</h1>
            <h4>Conecte-se ao aprendizado!</h4>
            <div className={styles["input-group-login"]}>
                <form onSubmit={handleSubmit} className={styles['login-form']}>
                    <label className={styles['lgn-label']}>CPF:</label>
                        <input
                            className={styles['lgn-input']}
                            type="text"
                            name="cpf"
                            placeholder="111.111.111-11"
                            value={formData.cpf}
                            onChange={handleChange}
                        />
                    <label className={styles['lgn-label']}>Password</label>
                        <input
                            className={styles['lgn-input']}
                            type="password"
                            name="password"
                            placeholder="Senha"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    <a className={styles['esqueceu-senha']} href=''>Esqueceu sua senha?</a>
                    <button type="submit" className={styles['login-button']}>Entrar</button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Login
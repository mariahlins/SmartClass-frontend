import api from '../services/api';

class LoginController {
    static async login(formData) {
        try {
            const response = await api.post('auth/login/', formData);
            return response.data;
        } catch (error) {
            console.error('Erro ao enviar dados:', error.response ? error.response.data : error.message);
            throw error;
        }
    }
}

export default LoginController;
import api from '../services/api';

class AuthController {
    static async login(formData) {
        try {
            const response = await api.post('auth/login/', formData);
            return response.data;
        } catch (error) {
            console.error('Erro ao enviar dados:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    static async verifyRole(requiredRole) {
        try {
            const response = await api.post('auth/verify-role/', { 
                role: requiredRole 
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao verificar o papel do usuário:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    static async register(formData){
        try{
            const response = await api.post('auth/register/', formData);
            return response.data;
        }catch(error){
            console.error('Erro ao enviar dados:', error.response ? error.response.data : error.message);
            throw error;
        }
    }
}

export default AuthController;
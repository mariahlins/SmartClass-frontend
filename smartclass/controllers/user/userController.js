import api from '../../services/api';

class UserController{
    // Metodo para obter os dados de um usuario pelo id
    static async obterUsuario(userId){
        try{
            const response = await api.get(`auth/users/${userId}/`);
            return response.data;
        }catch(error){
            console.error('Erro ao obter usuário:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    // Metodo para atualizar os dados de um usuario pelo id
    static async atualizarUsuario(userId, formData){
        try{
            const response = await api.put(`auth/users/${userId}/`, formData);
            return response.data;
        }catch(error){
            console.error('Erro ao atualizar usuário:', error.response ? error.response.data : error.message);
            throw error;
        }
    }
}

export default UserController;
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
            const response = await api.patch(`auth/users/${userId}/update`, formData);
            return response.data;
        }catch(error){
            console.error('Erro ao atualizar usuário:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    // Metodo para listar todos os usuarios
    static async obterTodosUsuarios() {
        try {
          const response = await api.get('auth/users/');
          return response.data;
        } catch (error) {
          console.error('Erro ao obter lista de usuários:', error.response ? error.response.data : error.message);
          throw error;
        }
    }

    // Metodo para deletar um usuario pelo id
    static async deletarUsuario(userId){
        try{
            const response = await api.delete(`auth/users/${userId}/delete`);
            return response.data;
        }catch(error){
            console.error('Erro ao deletar usuário:', error.response ? error.response.data : error.message);
            throw error;
        }
    }
}

export default UserController;
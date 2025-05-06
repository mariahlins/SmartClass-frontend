import api from '../../services/api';

class AtividadeController{
    // Metodo para obter os dados de uma atividade pelo id 
    static async obterAtividade(atividadeId){
        try{
            const response = await api.get(`lms/atividades/${atividadeId}/`);
            return response.data;
        }catch(error){
            console.error('Erro ao obter atividade:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    // Metodo que dado o id de um usuario (aluno ou professor) retorna as atividades desse usuario
    static async obterAtividadesUsuario(usuarioId){
        try{
            const response = await api.get(`lms/atividades/${usuarioId}/get_atividades_usuario/`);
            return response.data;
        }catch(error){
            console.error('Erro ao obter atividades do usuario:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    // Metodo que lista todas as atividades cadastradas no sistema pelos professores
    static async listarAtividades(){
        try{
            const response = await api.get('lms/atividades/');
            return response.data;
        }catch(error){
            console.error('Erro ao listar atividades:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    // Metodo em que o aluno pode baixar o conteudo de uma atividade enviada pelo professor
    static async downloadConteudoAtividade(atividadeId){
        try{
            const response = await api.get(`lms/atividades/${atividadeId}/download_conteudo/`);
            return response.data;
        }catch(error){
            console.error('Erro ao baixar conteudo da atividade:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    // Metodo destinado ao professor para criar uma nova atividade recebe obrigatoriamente o conteudo da atividade (deve ser um arquivo)
    static async criarAtividade(formData){
        try{
            const response = await api.post('lms/atividades/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        }catch(error){
            console.error('Erro ao criar atividade:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    // Metodo destinado ao professor para editar as informacoes de uma atividade pode tambem receber o conteudo da atividade (deve ser um arquivo)
    static async editarAtividade(atividadeId, formData){
        try{
            const response = await api.patch(`lms/atividades/${atividadeId}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        }catch(error){
            console.error('Erro ao editar atividade:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    // Metodo destinado ao professor para deletar uma atividade
    static async deletarAtividade(atividadeId){
        try{
            const response = await api.delete(`lms/atividades/${atividadeId}/`);
            return response.data;
        }catch(error){
            console.error('Erro ao deletar atividade:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

}

export default AtividadeController;
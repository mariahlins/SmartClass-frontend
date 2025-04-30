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

    // Metodo para realizar o download do conteudo de uma atividade
    static async downloadConteudoAtividade(atividadeId){
        try{
            const response = await api.get(`lms/atividades/${atividadeId}/download_conteudo/`);
            return response.data;
        }catch(error){
            console.error('Erro ao baixar conteudo da atividade:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

}

export default AtividadeController;
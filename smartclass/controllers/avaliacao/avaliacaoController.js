import api from '../../services/api';

class AvaliacaoController{
    // Metodo para o aluno enviar a atividade para a avaliacao do professor
    static async enviarAtividade(formData){
        try{
            const response = await api.post('avaliacao/avaliacao_atividade/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        }catch(error){
            console.error('Erro ao enviar atividade:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    // Metodo para o aluno atualizar a atividade enviada para a avaliacao do professor
    static async atualizarAtividadeEnviada(atividadeId, formData){
        try{
            const response = await api.patch(`avaliacao/avaliacao_atividade/${atividadeId}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        }catch(error){
            console.error('Erro ao atualizar atividade enviada:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

}

export default AvaliacaoController;
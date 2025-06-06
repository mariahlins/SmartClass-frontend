import api from '../../services/api';

class AvaliacaoController{
    // Metodo para o aluno enviar a atividade para a avaliacao do professor
    static async enviarAtividade(atividade, aluno, arquivo) {
        try {
          const formData = new FormData();
          
          formData.append('atividade', atividade);
          formData.append('aluno', aluno);
          formData.append('conteudo_para_avaliacao', arquivo);
          
          const response = await api.post('avaliacao/avaliacao_atividade/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          return response.data;
        } catch (error) {
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

    // Metodo destinado ao professor para fazer o download da atividade enviada pelo aluno
    static async downloadAtiviadeAvaliacao(alunoId, atividadeId){
        try{
            const response = await api.get(`avaliacao/avaliacao_atividade/${alunoId}/atividade/${atividadeId}/`);
            return response.data;
        }catch(error){
            console.error('Erro ao baixar atividade para avaliacao:', error.response ? error.response.data : error.message);
            throw error;
        }	
    }

    /* Verificar a lógica da publicação de notas na documentacao de endpoints pag 7 */
    static async publicarNotas(atividadeId, formData){
        try{
            const response = await api.patch(`avaliacao/avaliacao_atividade/${atividadeId}/publicar_nota/`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log("AAAAAAAAAAAAAA",response)
            return response.data;
        }catch(error){  
            console.error('Erro ao publicar notas:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    // Metodo para listar as todas as atividades que o alunos enviaram para avaliacao
    static async listarAtividadesAvaliacao(){
        try{
            const response = await api.get('avaliacao/avaliacao_atividade/');
            console.log("LISTAR AVALIAÇÕES: ",response)
            return response.data;
        }catch(error){
            console.error('Erro ao listar atividades para avaliacao:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    static async listarFeedbacks(userId){
        try{
            const response = await api.get(`recomendacao/recomendacao/${userId}/get_aluno_recomendacoes/`);
            return response.data;
        }catch(error){
            console.error('Erro ao listar atividades para avaliacao:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    // Metodo para obtener os dados de uma atividade enviada para avaliacao pelo aluno
    static async obterAtividadeAvaliacao(atividadeId){
        try{
            const response = await api.get(`avaliacao/avaliacao_atividade/${atividadeId}/get_atividades_by_id/`);
            console.log("RESPONSEEEEEEEE ",atividadeId,response)
            return response.data;
        }catch(error){
            console.error('Erro ao obter atividade para avaliacao:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    // Metodo que dado o id de uma atividade postada pelo professor, retorna as atividades enviadas pelos alunos
    static async obterAtividadesByAtividadeId(atividadeId){
        try{
            const response = await api.get(`avaliacao/avaliacao_atividade/${atividadeId}/get_atividades_by_id/`);
            return response.data;
        }catch(error){
            console.error('Erro ao obter atividades por atividadeId:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    // Metodo para deletar uma atividade enviada para avaliacao pelo aluno
    static async deletarAtividadeAvaliacao(atividadeId){
        try{
            const response = await api.delete(`avaliacao/avaliacao_atividade/${atividadeId}/`);
            return response.data;
        }catch(error){
            console.error('Erro ao deletar atividade para avaliacao:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

}

export default AvaliacaoController;
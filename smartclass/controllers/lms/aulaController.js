import api from '../../services/api';

class AulaController{
    // Metodo para obter os dados de uma aula pelo id
    static async obterAula(aulaId){
        try{
            const response = await api.get(`lms/aulas/${aulaId}/`);
            return response.data;
        }catch(error){
            console.error('Erro ao obter aula:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    // Metodo para realizar o download do conteudo de uma aula
    static async downloadConteudoAula(aulaId){
        try{
            const response = await api.get(`lms/aulas/${aulaId}/download_conteudo/`);
            return response.data;
        }catch(error){
            console.error('Erro ao baixar conteudo da aula:', error.response ? error.response.data : error.message);
            throw error;
        }
    }
}

export default AulaController;
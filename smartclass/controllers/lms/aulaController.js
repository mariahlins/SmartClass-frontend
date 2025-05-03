import api from '../../services/api';

class AulaController{

    // Metodo para listar todas as aulas
    static async listarAulas(){
        try{
            const response = await api.get('lms/aulas/');
            return response.data;
        }catch(error){
            console.error('Erro ao listar aulas:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

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

    // Metodo em que os alunos podem realizar o download do conteudo de uma aula
    static async downloadConteudoAula(aulaId){
        try{
            const response = await api.get(`lms/aulas/${aulaId}/download_conteudo/`);
            return response.data;
        }catch(error){
            console.error('Erro ao baixar conteudo da aula:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    // Metodo destinado ao professor para criar uma nova aula tambem recebe o conteudo da aula (deve ser um arquivo)
    static async criarAula(formData){
        try{
            const response = await api.post('lms/aulas/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        }catch(error){
            console.error('Erro ao criar aula:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    // Metodo destinado ao professor para editar as informacoes de uma aula pode tambem receber o conteudo da aula (deve ser um arquivo)
    static async editarAula(aulaId, formData){
        try{
            const response = await api.patch(`lms/aulas/${aulaId}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        }catch(error){
            console.error('Erro ao editar aula:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    // Metodo destinado ao professor para deletar uma aula
    static async deletarAula(aulaId){
        try{
            const response = await api.delete(`lms/aulas/${aulaId}/`);
            return response.data;
        }catch(error){
            console.error('Erro ao deletar aula:', error.response ? error.response.data : error.message);
            throw error;
        }
    }


}

export default AulaController;
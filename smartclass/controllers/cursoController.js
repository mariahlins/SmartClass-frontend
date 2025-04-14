import api from '../services/api';

class CursoController{
    static async listar(){
        try{
            const response = await api.get('lms/cursos/');
            return response.data;
        }catch(error){
            console.error('Erro ao listar cursos:', error.response ? error.response.data : error.message);
            throw error;
        }
    }
}

export default CursoController;
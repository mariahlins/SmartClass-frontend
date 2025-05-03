import api from '../../services/api';

class CursoController{

    // Metodo para listar todos cursos existentes
    static async listar(){
        try{
            const response = await api.get('lms/cursos/');
            return response.data;
        }catch(error){
            console.error('Erro ao listar cursos:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    // Metodo para obter as informacoes de um curso pelo id
    static async obterCurso(idCurso){
        try{
            const response = await api.get(`lms/cursos/${idCurso}/`);
            return response.data;
        }catch(error){
            console.error('Erro ao obter curso:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    // Metodo destinado ao manager para criar um novo curso
    static async criarCurso(formData){
        try{
            const response = await api.post('lms/cursos/', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        }catch(error){
            console.error('Erro ao criar curso:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    // Metodo destinado ao manager para editar as informacoes de um curso
    static async editarCurso(idCurso, formData){
        try{
            const response = await api.patch(`lms/cursos/${idCurso}/`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        }catch(error){
            console.error('Erro ao editar curso:', error.response ? error.response.data : error.message);
            throw error;
        }
    
    }

    // Metodo destinado ao manager para deletar um curso
    static async deletarCurso(idCurso){
        try{
            const response = await api.delete(`lms/cursos/${idCurso}/`);
            return response.data;
        }catch(error){
            console.error('Erro ao deletar curso:', error.response ? error.response.data : error.message);
            throw error;
        }
    }
}
export default CursoController;
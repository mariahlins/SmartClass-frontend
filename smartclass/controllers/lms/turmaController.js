import api from '../../services/api';

class TurmaController{
    // Metodo para listar todas as turmas de um aluno
    static async listarTurmasAluno(alunoId){
        try{
            const response = await api.get(`lms/turmas/${alunoId}/get_turmas_aluno/`)
            return response.data;
        }catch(error){
            console.error('Erro ao listar turmas do aluno:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    // Metodo para obter os dados de uma turma pelo id
    static async obterTurma(turmaId){
        try{
            const response = await api.get(`lms/tirmas/${turmaId}/`)
            return response.data;
        }catch(error){
            console.error('Erro ao obter turma:', error.response ? error.response.data : error.message);
            throw error;
        }
    }
}

export default TurmaController;
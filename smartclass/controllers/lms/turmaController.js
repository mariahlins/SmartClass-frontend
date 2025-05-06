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

    // Metodo para listar todas as turmas de um professor
    static async listarTurmasProfessor(professorId){
        try{
            const response = await api.get(`lms/turmas/${professorId}/get_turmas_professor/`)
            return response.data;
        }catch(error){
            console.error('Erro ao listar turmas do professor:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    // Metodo para listar todas as turmas existentes
    static async listarTurmas(){
        try{
            const response = await api.get('lms/turmas/')
            return response.data;
        }catch(error){
            console.error('Erro ao listar turmas:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    // Metodo que dado o id de uma turma retorna as atividades dessa turma
    static async obterAtividadesTurma(turmaId){
        try{
            const response = await api.get(`lms/turmas/${turmaId}/get_atividades_turma/`)
            return response.data;
        }catch(error){
            console.error('Erro ao obter atividades da turma:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    // Metodo que dado o id de um professor retorna as turmas desse professor
    static async obterTurmasProfesor(professorId){
        try{
            const response = await api.get(`lms/turmas/${professorId}/get_turmas_professor/`)
            return response.data;
        }catch(error){
            console.error('Erro ao obter turmas do professor:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    // Metodo destinado ao professor para criar uma nova turma
    static async criarTurma(formData){
        try{
            const response = await api.post('lms/turmas/', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        }catch(error){
            console.error('Erro ao criar turma:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    // Metodo destinado ao professor para editar as informacoes de uma turma
    static async editarTurma(turmaId, formData){
        try{
            const response = await api.patch(`lms/turmas/${turmaId}/`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        }catch(error){
            console.error('Erro ao editar turma:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    /* Metodo destinado ao professor que edita os alunos de uma turma
    !! ATENCAO: Deve receber apenas uma lista com os ids dos alunos alunos:[1,2,3,4..]!! */
    static async editarAlunosTurma(turmaId, formData){
        try{
            const response = await api.patch(`lms/turmas/${turmaId}/update_alunos_turma/`, formData,{
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        }catch(error){
            console.error('Erro ao editar alunos da turma:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    // Metodo destinado ao professor para deletar uma turma
    static async deletarTurma(turmaId){
        try{
            const response = await api.delete(`lms/turmas/${turmaId}/`)
            return response.data;
        }catch(error){
            console.error('Erro ao deletar turma:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

}

export default TurmaController;
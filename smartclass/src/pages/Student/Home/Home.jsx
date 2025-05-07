import styles from "./Home.module.css"
import Header from '../../../components/Header/Header'
import SideBar from '../../../components/Student/SideBar/SideBar.jsx'
import { useLocation, useNavigate } from 'react-router-dom'
import TurmaController from "../../../../controllers/lms/turmaController.js"
import { useEffect, useState } from "react"

const HomeStudent = () => {
  const location = useLocation()
  const navigate = useNavigate()
  // eslint-disable-next-line no-unused-vars
  const { name } = location.state || { name: '' }
  const id = localStorage.getItem('userId')
  console.log('ID do aluno:', id)
  
  const [turmas, setTurmas] = useState([])
  const [mensagem, setMensagem] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInfo = async () => {
      if (!id) {
        setMensagem('ID do aluno não encontrado')
        setLoading(false)
        return
      }
      
      try {
        setLoading(true)
        const response = await TurmaController.listarTurmasAluno(id)
        console.log('Turmas do aluno:', response)
        setTurmas(response || [])
        setLoading(false)
      } catch (error) {
        console.error('Erro ao buscar informações:', error.response ? error.response.data : error.message)
        
        if (error.response && error.response.data && error.response.data.error === 'Aluno não está matriculado em nenhuma turma') {
          setMensagem('Você não está matriculado em nenhuma turma no momento.')
        } else {
          setMensagem('Erro ao carregar as turmas. Tente novamente mais tarde.')
        }
        
        setLoading(false)
      }
    }
    
    fetchInfo()
  }, [id])

  const handleMateriaClick = (turmaId) => {
    navigate(`/classes/${turmaId}`, {state: 1});
  };

  return (
    <div className={styles['hs-container']}>
      <SideBar />
      <Header />
      <div className={styles['hs-content']}>
        <div className={styles["hs-turmas"]}>
          <h1>Portal do Aluno</h1>
          <h2>Listagem de turmas atuais</h2>
          
          {loading ? (
            <p>Carregando turmas...</p>
          ) : mensagem ? (
            <div className={styles['message-container']}>
              <p>{mensagem}</p>
            </div>
          ) : turmas.length > 0 ? (
            <div className={styles['turmas-container']}>
              <table className={styles["class-table"]}>
                <thead>
                  <tr>
                    <th>Nome da Turma</th>
                    <th>ID do Professor</th>
                    <th>Curso</th>
                  </tr>
                </thead>
                <tbody>
                  {turmas.map((turma) => (
                    <tr key={turma.id}>
                      <td 
                          style={{textDecoration:"underline", cursor: "pointer"}}
                          onClick={() => handleMateriaClick(turma.id)}
                        >
                        {turma.nome}
                      </td>
                      <td>{turma.professor}</td>
                      <td>{turma.curso?.nome || "Não informado"}</td> 
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles['message-container']}>
              <p>Nenhuma turma encontrada.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomeStudent
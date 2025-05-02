import styles from "./Home.module.css"
import Header from '../../../components/Header/Header'
import SideBar from '../../../components/Student/SideBar/SideBar.jsx'
import { useLocation } from 'react-router-dom'
import TurmaController from "../../../../controllers/lms/turmaController.js"
import { useEffect, useState } from "react"

const HomeStudent = () => {
  const location = useLocation()
  // eslint-disable-next-line no-unused-vars
  const { name } = location.state || { name: '' }
  const { id } = location.state || { id: '' }
  console.log("ID ALUNO", id)
  localStorage.setItem('userId', id);

  
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
        setTurmas(response.data || [])
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

  return (
    <div className={styles['hs-container']}>
      <SideBar />
      <Header />
      <div className={styles['hs-content']}>
        <div className={styles["hs-turmas"]}>
          <h1>Portal do Aluno</h1>
          
          {loading ? (
            <p>Carregando turmas...</p>
          ) : mensagem ? (
            <div className={styles['message-container']}>
              <p>{mensagem}</p>
            </div>
          ) : turmas.length > 0 ? (
            <div className={styles['turmas-container']}>
              {turmas.map((turma) => (
                <div key={turma.id} className={styles['turma-card']}>
                  <h3>{turma.nome}</h3>
                  {/* Adicione mais informações das turmas aqui */}
                </div>
              ))}
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
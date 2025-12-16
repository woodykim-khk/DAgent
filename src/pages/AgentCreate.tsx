import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import AgentForm from '../components/AgentForm'
import './AgentCreate.css'

export default function AgentCreate() {
  const navigate = useNavigate()
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (agentData: any) => {
    setIsSaving(true)
    // 실제로는 API 호출
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    navigate('/')
  }

  return (
    <div className="agent-create">
      <div className="page-header">
        <div className="header-left">
          <button onClick={() => navigate('/')} className="back-button">
            <ArrowLeft size={20} />
          </button>
          <h2>AI 에이전트</h2>
        </div>
      </div>
      <AgentForm onSave={handleSave} isSaving={isSaving} />
    </div>
  )
}


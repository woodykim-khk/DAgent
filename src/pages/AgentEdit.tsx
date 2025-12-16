import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import AgentForm from '../components/AgentForm'
import { Agent } from '../types/agent'
import './AgentEdit.css'

export default function AgentEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    // 실제로는 API 호출
    const mockAgent: Agent = {
      id: id || '1',
      name: '인사팀 에이전트',
      description: '인사 관련 업무를 처리하는 에이전트',
      organizationId: 'org1',
      organizationName: '인사팀',
      status: 'active',
      createdAt: '2024-01-15',
      createdBy: 'user1',
      languageModel: 'gemini-2.5-pro',
      useSearchGrounding: true,
      referenceData: {
        tasks: true,
        wiki: true,
        drive: false,
        customGuidelines: '친절하고 전문적인 톤으로 답변',
      },
      triggers: [
        { id: 't1', type: 'keyword', content: '일정', keywords: ['일정', '스케줄', '데드라인'] },
      ],
      behaviors: [
        { id: 'b1', action: 'message', autoReply: true, approvalRequired: false, approvalTarget: 'trigger_user' },
      ],
      permissions: {
        managers: ['user1'],
        accessLevel: 'all',
        messengerAccess: 'all',
      },
      answerCount: 142,
      recommendationCount: 38,
    }
    setAgent(mockAgent)
  }, [id])

  const handleSave = async (agentData: any) => {
    setIsSaving(true)
    // 실제로는 API 호출
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    navigate('/')
  }

  const handleDelete = async () => {
    if (!confirm('에이전트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return
    }
    setIsDeleting(true)
    // 실제로는 API 호출
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsDeleting(false)
    navigate('/')
  }

  if (!agent) {
    return <div>로딩 중...</div>
  }

  return (
    <div className="agent-edit">
      <div className="page-header">
        <div className="header-left">
          <button onClick={() => navigate('/')} className="back-button">
            <ArrowLeft size={20} />
          </button>
          <h2>AI 에이전트</h2>
        </div>
        <div className="header-actions">
          <button
            onClick={handleDelete}
            className="delete-button"
            disabled={isDeleting}
          >
            <Trash2 size={16} />
            삭제
          </button>
        </div>
      </div>
      <AgentForm agent={agent} onSave={handleSave} isSaving={isSaving} />
    </div>
  )
}


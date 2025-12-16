import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MessageSquare, Zap, Calendar } from 'lucide-react'
import { AgentActivity as AgentActivityType, Agent } from '../types/agent'
import './AgentActivity.css'

export default function AgentActivity() {
  const { id } = useParams()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [activities, setActivities] = useState<AgentActivityType[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'replies' | 'triggers'>('all')

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
      triggers: [],
      behaviors: [],
      permissions: {
        managers: ['user1'],
        accessLevel: 'all',
        messengerAccess: 'all',
      },
      answerCount: 142,
      recommendationCount: 38,
    }
    setAgent(mockAgent)

    const mockActivities: AgentActivityType[] = [
      {
        id: 'a1',
        agentId: id || '1',
        type: 'reply',
        content: '프로젝트 일정을 확인했습니다. 다음 주 월요일까지 완료 예정입니다.',
        timestamp: '2024-01-20T10:30:00',
        channelId: 'ch1',
        channelName: '프로젝트 진행 상황',
      },
      {
        id: 'a2',
        agentId: id || '1',
        type: 'trigger',
        content: '키워드 "일정" 탐지',
        timestamp: '2024-01-20T10:25:00',
        channelId: 'ch1',
        channelName: '프로젝트 진행 상황',
        triggerKeyword: '일정',
      },
      {
        id: 'a3',
        agentId: id || '1',
        type: 'reply',
        content: '업무 우선순위를 정리해드리겠습니다.',
        timestamp: '2024-01-20T09:15:00',
        channelId: 'ch2',
        channelName: '팀 회의',
      },
    ]
    setActivities(mockActivities)
  }, [id])

  const filteredActivities = activities.filter(activity => {
    if (activeTab === 'all') return true
    if (activeTab === 'replies') return activity.type === 'reply'
    if (activeTab === 'triggers') return activity.type === 'trigger'
    return true
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (!agent) {
    return <div>로딩 중...</div>
  }

  return (
    <div className="agent-activity">
      <div className="page-header">
        <Link to="/" className="back-button">
          <ArrowLeft size={20} />
          뒤로
        </Link>
        <div>
          <h2>{agent.name} 활동 이력</h2>
          <p className="subtitle">에이전트의 답변 및 트리거 발동 이력을 확인할 수 있습니다.</p>
        </div>
      </div>

      <div className="activity-tabs">
        <button
          className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          전체
        </button>
        <button
          className={`tab ${activeTab === 'replies' ? 'active' : ''}`}
          onClick={() => setActiveTab('replies')}
        >
          <MessageSquare size={16} />
          답변 이력
        </button>
        <button
          className={`tab ${activeTab === 'triggers' ? 'active' : ''}`}
          onClick={() => setActiveTab('triggers')}
        >
          <Zap size={16} />
          트리거 발동
        </button>
      </div>

      <div className="activity-stats">
        <div className="stat-card">
          <div className="stat-value">{agent.answerCount}</div>
          <div className="stat-label">총 답변 수</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{activities.filter(a => a.type === 'trigger').length}</div>
          <div className="stat-label">트리거 발동</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{new Set(activities.map(a => a.channelId)).size}</div>
          <div className="stat-label">참여 대화방</div>
        </div>
      </div>

      <div className="activity-list">
        {filteredActivities.length === 0 ? (
          <div className="empty-state">
            <MessageSquare size={48} />
            <h3>활동 이력이 없습니다</h3>
            <p>에이전트가 활동을 시작하면 이력이 표시됩니다.</p>
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">
                {activity.type === 'reply' ? (
                  <MessageSquare size={20} />
                ) : (
                  <Zap size={20} />
                )}
              </div>
              <div className="activity-content">
                <div className="activity-header">
                  <span className="activity-type">
                    {activity.type === 'reply' ? '답변' : '트리거 발동'}
                  </span>
                  {activity.channelName && (
                    <span className="channel-name">{activity.channelName}</span>
                  )}
                  <span className="activity-time">
                    <Calendar size={14} />
                    {formatDate(activity.timestamp)}
                  </span>
                </div>
                <div className="activity-body">
                  {activity.type === 'reply' ? (
                    <p>{activity.content}</p>
                  ) : (
                    <div>
                      <p><strong>키워드:</strong> {activity.triggerKeyword}</p>
                      <p>{activity.content}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}


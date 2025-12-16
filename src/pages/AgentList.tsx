import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, Bot, Trash2 } from 'lucide-react'
import { Agent, LicenseInfo } from '../types/agent'
import './AgentList.css'

export default function AgentList() {
  const navigate = useNavigate()
  const [agents, setAgents] = useState<Agent[]>([])
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [licenseInfo] = useState<LicenseInfo>({
    standard: 5,
    premium: 3,
    maxAgents: 20,
    currentAgents: 0,
  })

  useEffect(() => {
    // 임시 데이터
    const mockAgents: Agent[] = [
      {
        id: '1',
        name: '인사팀 에이전트',
        description: '인사 관련 업무를 처리하는 에이전트',
        organizationId: 'org1',
        organizationName: '인사팀',
        status: 'active',
        createdAt: '2024.01.15',
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
      },
      {
        id: '2',
        name: '고객 지원팀 에이전트',
        description: '고객 문의에 자동으로 답변하는 에이전트',
        organizationId: 'org2',
        organizationName: '고객지원팀',
        status: 'paused',
        createdAt: '2024.01.10',
        createdBy: 'user2',
        languageModel: 'gpt-5.1',
        useSearchGrounding: false,
        referenceData: {
          tasks: false,
          wiki: true,
          drive: true,
          customGuidelines: '',
        },
        triggers: [],
        behaviors: [],
        permissions: {
          managers: ['user2'],
          accessLevel: 'all',
          messengerAccess: 'all',
        },
        answerCount: 89,
        recommendationCount: 25,
      },
    ]
    setAgents(mockAgents)
  }, [])

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    return dateString || 'YYYY.MM.DD'
  }

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('에이전트를 삭제하시겠습니까?')) {
      setAgents(agents.filter(a => a.id !== id))
    }
  }

  return (
    <div className="agent-list-page">
      <div className="page-header">
        <div className="header-left">
          <button onClick={() => navigate(-1)} className="back-button">
            <ArrowLeft size={20} />
          </button>
          <h2>AI 에이전트</h2>
        </div>
      </div>

      <div className="list-controls">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="봇 이름 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">상태: 전체</option>
          <option value="active">사용 중</option>
          <option value="paused">일시 정지</option>
        </select>
        <button className="update-button">↓ 업데이트</button>
      </div>

      <div className="table-container">
        <table className="agent-table">
          <thead>
            <tr>
              <th>사진</th>
              <th>이름</th>
              <th>설명</th>
              <th>생성일</th>
              <th>조직</th>
              <th>상태</th>
              <th>관리</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {filteredAgents.map((agent) => (
              <tr
                key={agent.id}
                className={selectedAgent === agent.id ? 'selected' : ''}
                onClick={() => setSelectedAgent(agent.id)}
              >
                <td>
                  {agent.profileImage ? (
                    <img src={agent.profileImage} alt={agent.name} className="agent-photo" />
                  ) : (
                    <div className="agent-photo-placeholder">
                      <Bot size={20} />
                    </div>
                  )}
                </td>
                <td className="agent-name">{agent.name}</td>
                <td className="agent-description">{agent.description}</td>
                <td>{formatDate(agent.createdAt)}</td>
                <td>{agent.organizationName}</td>
                <td>
                  <span className={`status-badge ${agent.status}`}>
                    {agent.status === 'active' ? '사용 중' : '일시 정지'}
                  </span>
                </td>
                <td>
                  <Link
                    to={`/agents/${agent.id}/edit`}
                    className="action-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    관리
                  </Link>
                </td>
                <td>
                  <button
                    className="delete-link"
                    onClick={(e) => handleDelete(agent.id, e)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAgents.length === 0 && (
          <div className="empty-state">
            <Bot size={48} />
            <h3>에이전트가 없습니다</h3>
            <p>검색 조건에 맞는 에이전트를 찾을 수 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}


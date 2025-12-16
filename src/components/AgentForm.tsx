import { useState } from 'react'
import { Save, X, Plus, Edit2, CheckCircle, XCircle } from 'lucide-react'
import { Agent, Trigger, Action, ReferenceDataItem, ExternalIntegration } from '../types/agent'
import './AgentForm.css'

interface AgentFormProps {
  agent?: Agent
  onSave: (data: any) => void
  isSaving: boolean
}

export default function AgentForm({ agent, onSave, isSaving }: AgentFormProps) {
  const [activeTab, setActiveTab] = useState('basic')
  const [editingCommand, setEditingCommand] = useState<string | null>(null)
  const [showReferenceDialog, setShowReferenceDialog] = useState(false)
  const [referenceDialogType, setReferenceDialogType] = useState<'tasks' | 'wiki' | 'drive' | null>(null)
  const [selectedReferences, setSelectedReferences] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: agent?.name || '',
    description: agent?.description || '',
    organizationId: agent?.organizationId || '',
    profileImage: agent?.profileImage || '',
    languageModel: agent?.languageModel || 'gemini-2.5-pro',
    useSearchGrounding: agent?.useSearchGrounding ?? false,
    referenceData: {
      items: agent?.referenceData?.items || [],
      customGuidelines: agent?.referenceData?.customGuidelines || '',
    },
    appIntegration: agent?.appIntegration || {
      token: '',
      serverUrl: '',
      appId: '',
      tokenScope: [],
    },
    triggers: agent?.triggers || [
      {
        id: 't1',
        name: '건강검진휴가',
        type: 'keyword',
        keywords: ['건강 검진 휴가', '건강검진'],
      },
      {
        id: 't2',
        name: '휴가 문의하는 경우',
        type: 'natural',
        content: '휴가 관련 문의가 있거나, 누군가 궁금해하는 경우',
      },
      {
        id: 't3',
        name: '@휴가쟁이 check',
        type: 'command',
        commandKeyword: '@휴가쟁이 /check',
        content: '휴가 잔여일 조회',
      },
    ],
    actions: agent?.actions || [],
    behaviors: agent?.behaviors || [
      {
        id: 'b1',
        triggerId: 't1',
        action: 'message',
        autoReply: true,
        approvalRequired: false,
        approvalTarget: 'trigger_user',
      },
      {
        id: 'b2',
        triggerId: 't1',
        action: 'notification',
        autoReply: false,
        approvalRequired: false,
        approvalTarget: 'trigger_user',
        notificationConfig: {
          webhookUrl: 'https://webhook.example.com/notify',
          messageTemplate: '{user}님이 일정 관련 키워드를 사용했습니다',
          includeContext: true,
        },
      },
      {
        id: 'b3',
        triggerId: 't2',
        action: 'both',
        autoReply: true,
        approvalRequired: false,
        approvalTarget: 'trigger_user',
        notificationConfig: {
          webhookUrl: 'https://webhook.example.com/project',
          messageTemplate: '프로젝트 진행 상황 질문이 감지되었습니다',
          includeContext: true,
        },
      },
    ],
    permissions: agent?.permissions || {
      managers: [],
      accessLevel: 'all',
      messengerAccess: 'all',
    },
    skills: agent?.skills || {
      responseMode: 'command',
      helpMessage: '사용 가능한 명령어를 확인하려면 @앱이름 help를 입력하세요.',
      commands: [
        { id: 'help', keyword: 'help', description: '사용법 안내', responseType: 'text' },
      ],
    },
    mcpServers: agent?.mcpServers || [],
    externalIntegrations: agent?.externalIntegrations || (() => {
      // 기존 데이터를 통합된 형식으로 변환
      const integrations: ExternalIntegration[] = []
      if (agent?.appIntegration?.serverUrl) {
        integrations.push({
          id: 'app-1',
          type: 'app',
          name: 'APP 연동',
          serverUrl: agent.appIntegration.serverUrl,
          enabled: true,
          token: agent.appIntegration.token,
          appId: agent.appIntegration.appId,
          tokenScope: agent.appIntegration.tokenScope,
        })
      }
      if (agent?.mcpServers) {
        agent.mcpServers.forEach((mcp, index) => {
          integrations.push({
            id: mcp.id || `mcp-${index}`,
            type: 'mcp',
            name: mcp.name,
            serverUrl: mcp.serverUrl,
            enabled: mcp.enabled,
            status: mcp.status,
            apiKey: mcp.apiKey,
            tools: mcp.tools,
            resources: mcp.resources,
          })
        })
      }
      return integrations
    })(),
  })

  const tabs = [
    { id: 'basic', label: '기본 정보' },
    { id: 'data', label: '데이터 설정' },
    { id: 'integration', label: '트리거 설정' },
    { id: 'behavior', label: '행동 설정' },
    { id: 'permission', label: '권한 설정' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }


  const removeTrigger = (id: string) => {
    setFormData({
      ...formData,
      triggers: formData.triggers.filter(t => t.id !== id),
    })
  }

  const updateTrigger = (id: string, updates: Partial<Trigger>) => {
    setFormData({
      ...formData,
      triggers: formData.triggers.map(t =>
        t.id === id ? { ...t, ...updates } : t
      ),
    })
  }


  return (
    <form onSubmit={handleSubmit} className="agent-form">
      <div className="form-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="form-content">
        {activeTab === 'basic' && (
          <div className="form-section">
            <h3>기본 정보</h3>
            <div className="form-group">
              <label>에이전트 이름 *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="에이전트 이름을 입력하세요"
                required
                maxLength={50}
              />
            </div>
            <div className="form-group">
              <label>프로필 이미지</label>
              <input
                type="url"
                value={formData.profileImage}
                onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                placeholder="이미지 URL을 입력하세요"
              />
            </div>
            <div className="form-group">
              <label>에이전트 설명 *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="에이전트를 간략하게 설명하세요 (50자 이내)"
                required
                maxLength={50}
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>조직 정보 *</label>
              <select
                value={formData.organizationId}
                onChange={(e) => setFormData({ ...formData, organizationId: e.target.value })}
                required
              >
                <option value="">조직을 선택하세요</option>
                <option value="org1">개발팀</option>
                <option value="org2">디자인팀</option>
                <option value="org3">기획팀</option>
              </select>
            </div>

            <div className="form-group">
              <h4>🔗 외부 연동</h4>
              <p className="section-description">
                APP 연동 및 MCP 서버 연동을 통합 관리합니다.
              </p>
              <div className="external-integration-list">
                {formData.externalIntegrations!.map((integration) => (
                  <div key={integration.id} className="external-integration-item">
                    <div className="external-integration-header">
                      <div className="external-integration-info">
                        <div className="external-integration-name-row">
                          <span className={`integration-type-badge ${integration.type}`}>
                            {integration.type === 'app' ? 'APP' : 'MCP'}
                          </span>
                          <span className="external-integration-name">{integration.name}</span>
                          {integration.status && (
                            <span className={`integration-status-badge ${integration.status}`}>
                              {integration.status === 'connected' && <CheckCircle size={14} />}
                              {integration.status === 'disconnected' && <XCircle size={14} />}
                              {integration.status === 'error' && <XCircle size={14} />}
                              {integration.status === 'connected' ? '연결됨' : integration.status === 'error' ? '오류' : '연결 안됨'}
                            </span>
                          )}
                        </div>
                        <span className="external-integration-url">{integration.serverUrl}</span>
                      </div>
                      <div className="external-integration-actions">
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={integration.enabled}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                externalIntegrations: formData.externalIntegrations!.map(i =>
                                  i.id === integration.id ? { ...i, enabled: e.target.checked } : i
                                ),
                              })
                            }}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              externalIntegrations: formData.externalIntegrations!.filter(i => i.id !== integration.id),
                            })
                          }}
                          className="remove-button"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                    {editingCommand === integration.id && (
                      <div className="external-integration-edit-form">
                        <div className="form-group">
                          <label>연동 이름 *</label>
                          <input
                            type="text"
                            value={integration.name}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                externalIntegrations: formData.externalIntegrations!.map(i =>
                                  i.id === integration.id ? { ...i, name: e.target.value } : i
                                ),
                              })
                            }}
                            placeholder={integration.type === 'app' ? 'APP 연동 이름' : 'MCP 서버 이름'}
                          />
                        </div>
                        <div className="form-group">
                          <label>서버 URL *</label>
                          <input
                            type="url"
                            value={integration.serverUrl}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                externalIntegrations: formData.externalIntegrations!.map(i =>
                                  i.id === integration.id ? { ...i, serverUrl: e.target.value } : i
                                ),
                              })
                            }}
                            placeholder="https://example.com/api"
                          />
                        </div>
                        {integration.type === 'app' && (
                          <>
                            <div className="form-group">
                              <label>토큰</label>
                              <div className="token-input-group">
                                <input
                                  type="text"
                                  value={integration.token || ''}
                                  onChange={(e) => {
                                    setFormData({
                                      ...formData,
                                      externalIntegrations: formData.externalIntegrations!.map(i =>
                                        i.id === integration.id ? { ...i, token: e.target.value } : i
                                      ),
                                    })
                                  }}
                                  placeholder="토큰을 입력하세요"
                                />
                                <button type="button" className="token-button">
                                  생성
                                </button>
                              </div>
                            </div>
                            <div className="form-group">
                              <label>App ID</label>
                              <input
                                type="text"
                                value={integration.appId || ''}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    externalIntegrations: formData.externalIntegrations!.map(i =>
                                      i.id === integration.id ? { ...i, appId: e.target.value } : i
                                    ),
                                  })
                                }}
                                placeholder="App ID"
                              />
                            </div>
                          </>
                        )}
                        {integration.type === 'mcp' && (
                          <div className="form-group">
                            <label>인증 토큰 (선택)</label>
                            <input
                              type="password"
                              value={integration.apiKey || ''}
                              onChange={(e) => {
                                setFormData({
                                  ...formData,
                                  externalIntegrations: formData.externalIntegrations!.map(i =>
                                    i.id === integration.id ? { ...i, apiKey: e.target.value } : i
                                  ),
                                })
                              }}
                              placeholder="인증 토큰 (필요한 경우)"
                            />
                          </div>
                        )}
                        <div className="form-group">
                          <button
                            type="button"
                            onClick={() => setEditingCommand(editingCommand === integration.id ? null : integration.id)}
                            className="save-button"
                          >
                            저장
                          </button>
                        </div>
                      </div>
                    )}
                    {editingCommand !== integration.id && (
                      <button
                        type="button"
                        onClick={() => setEditingCommand(editingCommand === integration.id ? null : integration.id)}
                        className="edit-button"
                      >
                        <Edit2 size={16} />
                        편집
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="external-integration-add-buttons">
                <button
                  type="button"
                  onClick={() => {
                    const newIntegration: ExternalIntegration = {
                      id: `app-${Date.now()}`,
                      type: 'app',
                      name: '새 APP 연동',
                      serverUrl: '',
                      enabled: true,
                      token: '',
                      appId: '',
                    }
                    setFormData({
                      ...formData,
                      externalIntegrations: [...formData.externalIntegrations!, newIntegration],
                    })
                    setEditingCommand(newIntegration.id)
                  }}
                  className="add-button"
                >
                  <Plus size={16} />
                  APP 연동 추가
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const newIntegration: ExternalIntegration = {
                      id: `mcp-${Date.now()}`,
                      type: 'mcp',
                      name: '새 MCP 서버',
                      serverUrl: '',
                      enabled: true,
                    }
                    setFormData({
                      ...formData,
                      externalIntegrations: [...formData.externalIntegrations!, newIntegration],
                    })
                    setEditingCommand(newIntegration.id)
                  }}
                  className="add-button"
                >
                  <Plus size={16} />
                  MCP 서버 추가
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="form-section">
            <h3>데이터 설정</h3>
            <div className="form-group">
              <label>언어 모델 선택 *</label>
              <select
                value={formData.languageModel}
                onChange={(e) => setFormData({ ...formData, languageModel: e.target.value })}
                required
              >
                <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                <option value="gpt-5.1">GPT-5.1</option>
                <option value="claude-sonnet-4">Claude Sonnet 4</option>
              </select>
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.useSearchGrounding}
                  onChange={(e) => setFormData({ ...formData, useSearchGrounding: e.target.checked })}
                />
                검색 그라운딩 이용
              </label>
            </div>
            <div className="form-group">
              <label>참조 데이터</label>
              <div className="reference-data-list">
                {formData.referenceData.items.map((item) => (
                  <div key={item.id} className="reference-data-item">
                    <div className="reference-data-header">
                      <div className="reference-data-info">
                        <span className="reference-data-name">{item.name}</span>
                        <span className="reference-data-type">{item.type === 'tasks' ? '업무' : item.type === 'wiki' ? '위키' : item.type === 'drive' ? '드라이브' : '커스텀'}</span>
                      </div>
                      <div className="reference-data-actions">
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={item.enabled}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                referenceData: {
                                  ...formData.referenceData,
                                  items: formData.referenceData.items.map(i =>
                                    i.id === item.id ? { ...i, enabled: e.target.checked } : i
                                  ),
                                },
                              })
                            }}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              referenceData: {
                                ...formData.referenceData,
                                items: formData.referenceData.items.filter(i => i.id !== item.id),
                              },
                            })
                          }}
                          className="remove-button"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {formData.referenceData.items.length === 0 && (
                  <div className="empty-reference-data">
                    참조 데이터가 없습니다. 추가 버튼을 클릭하여 추가하세요.
                  </div>
                )}
              </div>
              <div className="reference-data-add-buttons">
                <button
                  type="button"
                  onClick={() => {
                    setReferenceDialogType('tasks')
                    setShowReferenceDialog(true)
                    setSelectedReferences([])
                  }}
                  className="add-reference-button"
                >
                  <Plus size={16} />
                  업무 추가
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReferenceDialogType('wiki')
                    setShowReferenceDialog(true)
                    setSelectedReferences([])
                  }}
                  className="add-reference-button"
                >
                  <Plus size={16} />
                  위키 추가
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReferenceDialogType('drive')
                    setShowReferenceDialog(true)
                    setSelectedReferences([])
                  }}
                  className="add-reference-button"
                >
                  <Plus size={16} />
                  드라이브 추가
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>상세 지침</label>
              <textarea
                value={formData.referenceData.customGuidelines}
                onChange={(e) => setFormData({
                  ...formData,
                  referenceData: { ...formData.referenceData, customGuidelines: e.target.value },
                })}
                placeholder="에이전트가 참고할 정보나 선호하는 답변 스타일을 자유롭게 작성하세요"
                rows={6}
              />
            </div>
          </div>
        )}

        {activeTab === 'basic' && (
          <div className="form-section">
            <div className="form-group">
              <h4>🔗 외부 연동</h4>
              <p className="section-description">
                APP 연동 및 MCP 서버 연동을 통합 관리합니다.
              </p>
              <div className="external-integration-list">
                {formData.externalIntegrations!.map((integration) => (
                  <div key={integration.id} className="external-integration-item">
                    <div className="external-integration-header">
                      <div className="external-integration-info">
                        <div className="external-integration-name-row">
                          <span className={`integration-type-badge ${integration.type}`}>
                            {integration.type === 'app' ? 'APP' : 'MCP'}
                          </span>
                          <span className="external-integration-name">{integration.name}</span>
                          {integration.status && (
                            <span className={`integration-status-badge ${integration.status}`}>
                              {integration.status === 'connected' && <CheckCircle size={14} />}
                              {integration.status === 'disconnected' && <XCircle size={14} />}
                              {integration.status === 'error' && <XCircle size={14} />}
                              {integration.status === 'connected' ? '연결됨' : integration.status === 'error' ? '오류' : '연결 안됨'}
                            </span>
                          )}
                        </div>
                        <span className="external-integration-url">{integration.serverUrl}</span>
                      </div>
                      <div className="external-integration-actions">
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={integration.enabled}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                externalIntegrations: formData.externalIntegrations!.map(i =>
                                  i.id === integration.id ? { ...i, enabled: e.target.checked } : i
                                ),
                              })
                            }}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              externalIntegrations: formData.externalIntegrations!.filter(i => i.id !== integration.id),
                            })
                          }}
                          className="remove-button"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                    {editingCommand === integration.id && (
                      <div className="external-integration-edit-form">
                        <div className="form-group">
                          <label>연동 이름 *</label>
                          <input
                            type="text"
                            value={integration.name}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                externalIntegrations: formData.externalIntegrations!.map(i =>
                                  i.id === integration.id ? { ...i, name: e.target.value } : i
                                ),
                              })
                            }}
                            placeholder={integration.type === 'app' ? 'APP 연동 이름' : 'MCP 서버 이름'}
                          />
                        </div>
                        <div className="form-group">
                          <label>서버 URL *</label>
                          <input
                            type="url"
                            value={integration.serverUrl}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                externalIntegrations: formData.externalIntegrations!.map(i =>
                                  i.id === integration.id ? { ...i, serverUrl: e.target.value } : i
                                ),
                              })
                            }}
                            placeholder="https://example.com/api"
                          />
                        </div>
                        {integration.type === 'app' && (
                          <>
                            <div className="form-group">
                              <label>토큰</label>
                              <div className="token-input-group">
                                <input
                                  type="text"
                                  value={integration.token || ''}
                                  onChange={(e) => {
                                    setFormData({
                                      ...formData,
                                      externalIntegrations: formData.externalIntegrations!.map(i =>
                                        i.id === integration.id ? { ...i, token: e.target.value } : i
                                      ),
                                    })
                                  }}
                                  placeholder="토큰을 입력하세요"
                                />
                                <button type="button" className="token-button">
                                  생성
                                </button>
                              </div>
                            </div>
                            <div className="form-group">
                              <label>App ID</label>
                              <input
                                type="text"
                                value={integration.appId || ''}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    externalIntegrations: formData.externalIntegrations!.map(i =>
                                      i.id === integration.id ? { ...i, appId: e.target.value } : i
                                    ),
                                  })
                                }}
                                placeholder="App ID"
                              />
                            </div>
                          </>
                        )}
                        {integration.type === 'mcp' && (
                          <div className="form-group">
                            <label>인증 토큰 (선택)</label>
                            <input
                              type="password"
                              value={integration.apiKey || ''}
                              onChange={(e) => {
                                setFormData({
                                  ...formData,
                                  externalIntegrations: formData.externalIntegrations!.map(i =>
                                    i.id === integration.id ? { ...i, apiKey: e.target.value } : i
                                  ),
                                })
                              }}
                              placeholder="인증 토큰 (필요한 경우)"
                            />
                          </div>
                        )}
                        {integration.type === 'app' && (
                          <div className="form-group">
                            <label>토큰 범위 (선택)</label>
                            <input
                              type="text"
                              value={integration.tokenScope?.join(', ') || ''}
                              onChange={(e) => {
                                setFormData({
                                  ...formData,
                                  externalIntegrations: formData.externalIntegrations!.map(i =>
                                    i.id === integration.id ? {
                                      ...i,
                                      tokenScope: e.target.value.split(',').map(s => s.trim()).filter(s => s),
                                    } : i
                                  ),
                                })
                              }}
                              placeholder="토큰 범위를 쉼표로 구분하여 입력"
                            />
                          </div>
                        )}
                        <div className="form-group">
                          <button
                            type="button"
                            onClick={async () => {
                              // 연결 테스트 로직
                              setFormData({
                                ...formData,
                                externalIntegrations: formData.externalIntegrations!.map(i =>
                                  i.id === integration.id ? { ...i, status: 'connected' } : i
                                ),
                              })
                            }}
                            className="test-connection-button"
                          >
                            연결 테스트
                          </button>
                        </div>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setEditingCommand(editingCommand === integration.id ? null : integration.id)}
                      className="edit-button"
                    >
                      <Edit2 size={16} />
                      {editingCommand === integration.id ? '닫기' : '편집'}
                    </button>
                  </div>
                ))}
                {formData.externalIntegrations!.length === 0 && (
                  <div className="empty-reference-data">
                    외부 연동이 없습니다. 추가 버튼을 클릭하여 추가하세요.
                  </div>
                )}
              </div>
              <div className="external-integration-add-buttons">
                <button
                  type="button"
                  onClick={() => {
                    const newIntegration: ExternalIntegration = {
                      id: `app${Date.now()}`,
                      type: 'app',
                      name: 'APP 연동',
                      serverUrl: '',
                      enabled: false,
                    }
                    setFormData({
                      ...formData,
                      externalIntegrations: [...formData.externalIntegrations!, newIntegration],
                    })
                    setEditingCommand(newIntegration.id)
                  }}
                  className="add-reference-button"
                >
                  <Plus size={16} />
                  APP 연동 추가
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const newIntegration: ExternalIntegration = {
                      id: `mcp${Date.now()}`,
                      type: 'mcp',
                      name: '',
                      serverUrl: '',
                      enabled: false,
                      status: 'disconnected',
                    }
                    setFormData({
                      ...formData,
                      externalIntegrations: [...formData.externalIntegrations!, newIntegration],
                    })
                    setEditingCommand(newIntegration.id)
                  }}
                  className="add-reference-button"
                >
                  <Plus size={16} />
                  MCP 서버 추가
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'integration' && (
          <div className="form-section">
            <div className="trigger-settings-header">
              <div>
                <h3>트리거 설정</h3>
                <p className="section-description">
                  에이전트가 자동으로 동작하도록 트리거를 설정하세요. 각 트리거 유형을 선택적으로 추가할 수 있습니다.
                </p>
              </div>
            </div>

            {/* 트리거 타입 선택 카드 */}
            <div className="trigger-type-cards">
              <div className="trigger-type-card" onClick={() => {
                const newTrigger: Trigger = {
                  id: `t${Date.now()}`,
                  name: '',
                  type: 'natural',
                  content: '',
                }
                setFormData({
                  ...formData,
                  triggers: [...formData.triggers, newTrigger],
                })
              }}>
                <div className="trigger-card-icon">💬</div>
                <div className="trigger-card-content">
                  <h5>자연어 트리거</h5>
                  <p>자연어로 트리거 조건을 설정합니다</p>
                </div>
                <Plus size={20} className="trigger-card-add" />
              </div>

              <div className="trigger-type-card" onClick={() => {
                const newTrigger: Trigger = {
                  id: `t${Date.now()}`,
                  name: '',
                  type: 'keyword',
                  keywords: [],
                  content: '',
                }
                setFormData({
                  ...formData,
                  triggers: [...formData.triggers, newTrigger],
                })
              }}>
                <div className="trigger-card-icon">🔑</div>
                <div className="trigger-card-content">
                  <h5>키워드 트리거</h5>
                  <p>특정 키워드 탐지 시 발동합니다</p>
                </div>
                <Plus size={20} className="trigger-card-add" />
              </div>

              <div className="trigger-type-card" onClick={() => {
                const newTrigger: Trigger = {
                  id: `t${Date.now()}`,
                  name: '',
                  type: 'command',
                  commandKeyword: '',
                  content: '',
                }
                setFormData({
                  ...formData,
                  triggers: [...formData.triggers, newTrigger],
                })
              }}>
                <div className="trigger-card-icon">⚡</div>
                <div className="trigger-card-content">
                  <h5>명령어 트리거</h5>
                  <p>명령어 키워드로 발동합니다</p>
                </div>
                <Plus size={20} className="trigger-card-add" />
              </div>
            </div>

            {/* 트리거 목록 */}
            {formData.triggers.length > 0 && (
              <div className="trigger-list-compact">
                {formData.triggers.map((trigger) => (
                  <div key={trigger.id} className="trigger-item-compact">
                    <div className="trigger-item-header-compact">
                      <div className="trigger-item-info">
                        <span className="trigger-type-badge">
                          {trigger.type === 'natural' && '💬 자연어'}
                          {trigger.type === 'keyword' && '🔑 키워드'}
                          {trigger.type === 'command' && '⚡ 명령어'}
                        </span>
                        <span className="trigger-preview">
                          {trigger.name || '트리거명 없음'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTrigger(trigger.id)}
                        className="remove-button"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="trigger-item-form">
                      <div className="form-group">
                        <label>트리거명 *</label>
                        <input
                          type="text"
                          value={trigger.name}
                          onChange={(e) => updateTrigger(trigger.id, { name: e.target.value })}
                          placeholder="예: 휴가 문의하는 경우"
                        />
                      </div>
                      {trigger.type === 'natural' && (
                        <div className="form-group">
                          <label>트리거 내용</label>
                          <textarea
                            value={trigger.content || ''}
                            onChange={(e) => updateTrigger(trigger.id, { content: e.target.value })}
                            placeholder="어떤 내용에 대해 동작하도록 자연어로 설정하세요"
                            rows={2}
                          />
                        </div>
                      )}
                      {trigger.type === 'keyword' && (
                        <div className="form-group">
                          <label>키워드 (쉼표로 구분)</label>
                          <input
                            type="text"
                            value={trigger.keywords?.join(', ') || ''}
                            onChange={(e) => updateTrigger(trigger.id, {
                              keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k),
                            })}
                            placeholder="일정, 스케줄, 데드라인"
                          />
                          <p className="help-text">키워드가 탐지되면 최근 30개 말풍선을 통해 맥락을 파악합니다.</p>
                        </div>
                      )}
                      {trigger.type === 'command' && (
                        <>
                          <div className="form-group">
                            <label>명령어 키워드</label>
                            <input
                              type="text"
                              value={trigger.commandKeyword || ''}
                              onChange={(e) => updateTrigger(trigger.id, { commandKeyword: e.target.value })}
                              placeholder="@앱이름 create, @앱이름 status 등"
                            />
                            <p className="help-text">@앱이름 + 명령어 키워드 형식으로 입력하세요.</p>
                          </div>
                          <div className="form-group">
                            <label>설명 (선택)</label>
                            <input
                              type="text"
                              value={trigger.content || ''}
                              onChange={(e) => updateTrigger(trigger.id, { content: e.target.value })}
                              placeholder="이 명령어에 대한 설명"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {formData.triggers.length === 0 && (
              <div className="empty-trigger-message">
                <p>위의 카드를 클릭하여 트리거를 추가하세요.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'behavior' && (
          <div className="form-section">
            <h3>액션 설정</h3>
            <p className="section-description">
              트리거 설정에서 지정한 트리거에 대해 에이전트가 수행할 액션을 설정하세요. 여러 액션을 설정하면 AI가 상황에 맞는 최적의 액션을 자동으로 선택합니다.
            </p>

            {formData.triggers.length === 0 ? (
              <div className="empty-trigger-message">
                <p>먼저 "트리거 설정" 탭에서 트리거를 설정해주세요.</p>
              </div>
            ) : (
              formData.triggers.map((trigger) => {
                const triggerActions = (formData.actions || []).filter(a => a.triggerId === trigger.id)

                return (
                  <div key={trigger.id} className="behavior-item">
                    <div className="behavior-header">
                      <h4>
                        {trigger.name || '트리거명 없음'}
                        <span className="trigger-type-badge-small">
                          {trigger.type === 'keyword' && '🔑 키워드'}
                          {trigger.type === 'command' && '⚡ 명령어'}
                          {trigger.type === 'natural' && '💬 자연어'}
                        </span>
                      </h4>
                    </div>

                    <div className="behavior-list">
                      {triggerActions.map((action) => (
                        <div key={action.id} className="behavior-config-item">
                          <div className="behavior-config-header">
                            <span className="behavior-action-label">
                              {action.type === 'dooray_messenger' && '💬 Dooray! 메신저에서 답변'}
                              {action.type === 'dooray_task' && '📋 Dooray! 업무로 생성'}
                              {action.type === 'external_app' && '🔗 외부 APP에서 처리'}
                              {action.type === 'mcp_server' && '⚙️ MCP 서버 연동 처리'}
                            </span>
                            <div className="behavior-action-priority">
                              <label>우선순위:</label>
                              <input
                                type="number"
                                min="1"
                                value={action.priority}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    actions: (formData.actions || []).map(a =>
                                      a.id === action.id ? { ...a, priority: parseInt(e.target.value) || 1 } : a
                                    ),
                                  })
                                }}
                                className="priority-input"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  actions: (formData.actions || []).filter(a => a.id !== action.id),
                                })
                              }}
                              className="remove-button"
                            >
                              <X size={16} />
                            </button>
                          </div>

                          <div className="form-group">
                            <label>액션 유형</label>
                            <select
                              value={action.type}
                              onChange={(e) => {
                                const newType = e.target.value as Action['type']
                                setFormData({
                                  ...formData,
                                  actions: (formData.actions || []).map(a =>
                                    a.id === action.id ? {
                                      ...a,
                                      type: newType,
                                      messengerConfig: newType === 'dooray_messenger' ? { replyMode: 'auto' } : undefined,
                                      taskConfig: newType === 'dooray_task' ? { projectId: '' } : undefined,
                                      externalAppConfig: newType === 'external_app' ? { integrationId: '' } : undefined,
                                      mcpServerConfig: newType === 'mcp_server' ? { integrationId: '' } : undefined,
                                    } : a
                                  ),
                                })
                              }}
                            >
                              <option value="dooray_messenger">Dooray! 메신저에서 답변</option>
                              <option value="dooray_task">Dooray! 업무로 생성</option>
                              <option value="external_app">외부 APP에서 처리</option>
                              <option value="mcp_server">MCP 서버 연동 처리</option>
                            </select>
                          </div>

                          {action.type === 'dooray_messenger' && (
                            <div className="form-group">
                              <label>답변 방식 *</label>
                              <select
                                value={action.messengerConfig?.replyMode || 'auto'}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    actions: (formData.actions || []).map(a =>
                                      a.id === action.id ? {
                                        ...a,
                                        messengerConfig: {
                                          replyMode: e.target.value as 'auto' | 'approval',
                                          approvalTarget: e.target.value === 'approval' ? 'trigger_user' : undefined,
                                        },
                                      } : a
                                    ),
                                  })
                                }}
                              >
                                <option value="auto">자동 답변</option>
                                <option value="approval">승인 후 답변</option>
                              </select>
                              {action.messengerConfig?.replyMode === 'approval' && (
                                <div className="form-group" style={{ marginTop: '12px' }}>
                                  <label>승인 대상</label>
                                  <select
                                    value={action.messengerConfig?.approvalTarget || 'trigger_user'}
                                    onChange={(e) => {
                                      setFormData({
                                        ...formData,
                                        actions: (formData.actions || []).map(a =>
                                          a.id === action.id ? {
                                            ...a,
                                            messengerConfig: {
                                              ...a.messengerConfig!,
                                              approvalTarget: e.target.value as 'trigger_user' | 'caller',
                                            },
                                          } : a
                                        ),
                                      })
                                    }}
                                  >
                                    <option value="trigger_user">트리거를 발생시킨 이용자</option>
                                    <option value="caller">호출한 이용자</option>
                                  </select>
                                </div>
                              )}
                            </div>
                          )}

                          {action.type === 'dooray_task' && (
                            <div className="form-group">
                              <label>대상 프로젝트 *</label>
                              <select
                                value={action.taskConfig?.projectId || ''}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    actions: (formData.actions || []).map(a =>
                                      a.id === action.id ? {
                                        ...a,
                                        taskConfig: {
                                          projectId: e.target.value,
                                          projectName: e.target.options[e.target.selectedIndex].text,
                                        },
                                      } : a
                                    ),
                                  })
                                }}
                              >
                                <option value="">프로젝트를 선택하세요</option>
                                <option value="proj1">인사팀 프로젝트</option>
                                <option value="proj2">개발팀 프로젝트</option>
                                <option value="proj3">디자인팀 프로젝트</option>
                              </select>
                            </div>
                          )}

                          {action.type === 'external_app' && (
                            <div className="form-group">
                              <label>연동할 외부 APP *</label>
                              <select
                                value={action.externalAppConfig?.integrationId || ''}
                                onChange={(e) => {
                                  const selectedIntegration = formData.externalIntegrations!.find(i => i.id === e.target.value && i.type === 'app')
                                  setFormData({
                                    ...formData,
                                    actions: (formData.actions || []).map(a =>
                                      a.id === action.id ? {
                                        ...a,
                                        externalAppConfig: {
                                          integrationId: e.target.value,
                                          integrationName: selectedIntegration?.name,
                                        },
                                      } : a
                                    ),
                                  })
                                }}
                              >
                                <option value="">외부 APP을 선택하세요</option>
                                {formData.externalIntegrations!.filter(i => i.type === 'app').map(integration => (
                                  <option key={integration.id} value={integration.id}>{integration.name}</option>
                                ))}
                              </select>
                              {formData.externalIntegrations!.filter(i => i.type === 'app').length === 0 && (
                                <p className="help-text">먼저 기본 정보 탭에서 APP 연동을 추가하세요.</p>
                              )}
                            </div>
                          )}

                          {action.type === 'mcp_server' && (
                            <div className="form-group">
                              <label>연동할 MCP 서버 *</label>
                              <select
                                value={action.mcpServerConfig?.integrationId || ''}
                                onChange={(e) => {
                                  const selectedIntegration = formData.externalIntegrations!.find(i => i.id === e.target.value && i.type === 'mcp')
                                  setFormData({
                                    ...formData,
                                    actions: (formData.actions || []).map(a =>
                                      a.id === action.id ? {
                                        ...a,
                                        mcpServerConfig: {
                                          integrationId: e.target.value,
                                          integrationName: selectedIntegration?.name,
                                        },
                                      } : a
                                    ),
                                  })
                                }}
                              >
                                <option value="">MCP 서버를 선택하세요</option>
                                {formData.externalIntegrations!.filter(i => i.type === 'mcp').map(integration => (
                                  <option key={integration.id} value={integration.id}>{integration.name}</option>
                                ))}
                              </select>
                              {formData.externalIntegrations!.filter(i => i.type === 'mcp').length === 0 && (
                                <p className="help-text">먼저 기본 정보 탭에서 MCP 서버 연동을 추가하세요.</p>
                              )}
                            </div>
                          )}

                          <div className="form-group">
                            <label className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={action.enabled}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    actions: (formData.actions || []).map(a =>
                                      a.id === action.id ? { ...a, enabled: e.target.checked } : a
                                    ),
                                  })
                                }}
                              />
                              활성화
                            </label>
                          </div>
                        </div>
                      ))}
                      {triggerActions.length === 0 && (
                        <div className="empty-reference-data">
                          이 트리거에 대한 액션이 없습니다. 액션 추가 버튼을 클릭하여 추가하세요.
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newAction: Action = {
                          id: `a${Date.now()}`,
                          triggerId: trigger.id,
                          type: 'dooray_messenger',
                          priority: (triggerActions.length + 1),
                          enabled: true,
                          messengerConfig: {
                            replyMode: 'auto',
                          },
                        }
                        setFormData({
                          ...formData,
                          actions: [...(formData.actions || []), newAction],
                        })
                      }}
                      className="add-button"
                    >
                      <Plus size={16} />
                      액션 추가
                    </button>
                  </div>
                )
              })
            )}
          </div>
        )}

        {activeTab === 'permission' && (
          <div className="form-section">
            <h3>권한 설정</h3>
            <div className="form-group">
              <label>에이전트 관리자</label>
              <input
                type="text"
                placeholder="관리자 이메일을 입력하세요 (쉼표로 구분)"
                value={formData.permissions.managers.join(', ')}
                onChange={(e) => setFormData({
                  ...formData,
                  permissions: {
                    ...formData.permissions,
                    managers: e.target.value.split(',').map(m => m.trim()).filter(m => m),
                  },
                })}
              />
            </div>
            <div className="form-group">
              <label>이용 권한</label>
              <select
                value={formData.permissions.accessLevel}
                onChange={(e) => setFormData({
                  ...formData,
                  permissions: {
                    ...formData.permissions,
                    accessLevel: e.target.value as 'managers_only' | 'all',
                  },
                })}
              >
                <option value="managers_only">에이전트 관리자만</option>
                <option value="all">전체</option>
              </select>
            </div>
            <div className="form-group">
              <label>메신저 대화방 이용 권한</label>
              <select
                value={formData.permissions.messengerAccess}
                onChange={(e) => setFormData({
                  ...formData,
                  permissions: {
                    ...formData.permissions,
                    messengerAccess: e.target.value as 'all',
                  },
                })}
              >
                <option value="all">전체</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 참조 데이터 선택 다이얼로그 */}
      {showReferenceDialog && referenceDialogType && (
        <div className="dialog-overlay" onClick={() => setShowReferenceDialog(false)}>
          <div className="reference-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h3>
                {referenceDialogType === 'tasks' ? '업무' : referenceDialogType === 'wiki' ? '위키' : '드라이브'} 선택
              </h3>
              <button
                type="button"
                onClick={() => setShowReferenceDialog(false)}
                className="dialog-close-button"
              >
                <X size={20} />
              </button>
            </div>
            <div className="dialog-content">
              <div className="reference-dialog-list">
                {/* 임시 목록 데이터 - 실제로는 API에서 가져와야 함 */}
                {[
                  { id: '1', name: `${referenceDialogType === 'tasks' ? '업무' : referenceDialogType === 'wiki' ? '위키' : '드라이브'} 항목 1`, description: '설명 1' },
                  { id: '2', name: `${referenceDialogType === 'tasks' ? '업무' : referenceDialogType === 'wiki' ? '위키' : '드라이브'} 항목 2`, description: '설명 2' },
                  { id: '3', name: `${referenceDialogType === 'tasks' ? '업무' : referenceDialogType === 'wiki' ? '위키' : '드라이브'} 항목 3`, description: '설명 3' },
                  { id: '4', name: `${referenceDialogType === 'tasks' ? '업무' : referenceDialogType === 'wiki' ? '위키' : '드라이브'} 항목 4`, description: '설명 4' },
                ].map((item) => (
                  <label key={item.id} className="reference-dialog-item">
                    <input
                      type="checkbox"
                      checked={selectedReferences.includes(item.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedReferences([...selectedReferences, item.id])
                        } else {
                          setSelectedReferences(selectedReferences.filter(id => id !== item.id))
                        }
                      }}
                    />
                    <div className="reference-dialog-item-info">
                      <span className="reference-dialog-item-name">{item.name}</span>
                      <span className="reference-dialog-item-desc">{item.description}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="dialog-actions">
              <button
                type="button"
                onClick={() => setShowReferenceDialog(false)}
                className="dialog-cancel-button"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => {
                  // 선택된 항목들을 참조 데이터에 추가
                  const newItems: ReferenceDataItem[] = selectedReferences.map((id, index) => {
                    const item = [
                      { id: '1', name: `${referenceDialogType === 'tasks' ? '업무' : referenceDialogType === 'wiki' ? '위키' : '드라이브'} 항목 1`, description: '설명 1' },
                      { id: '2', name: `${referenceDialogType === 'tasks' ? '업무' : referenceDialogType === 'wiki' ? '위키' : '드라이브'} 항목 2`, description: '설명 2' },
                      { id: '3', name: `${referenceDialogType === 'tasks' ? '업무' : referenceDialogType === 'wiki' ? '위키' : '드라이브'} 항목 3`, description: '설명 3' },
                      { id: '4', name: `${referenceDialogType === 'tasks' ? '업무' : referenceDialogType === 'wiki' ? '위키' : '드라이브'} 항목 4`, description: '설명 4' },
                    ].find(i => i.id === id)
                    return {
                      id: `ref${Date.now()}-${index}`,
                      type: referenceDialogType!,
                      name: item?.name || `${referenceDialogType} 항목`,
                      enabled: true,
                    }
                  })
                  
                  setFormData({
                    ...formData,
                    referenceData: {
                      ...formData.referenceData,
                      items: [...formData.referenceData.items, ...newItems],
                    },
                  })
                  setShowReferenceDialog(false)
                  setSelectedReferences([])
                  setReferenceDialogType(null)
                }}
                className="dialog-confirm-button"
                disabled={selectedReferences.length === 0}
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="form-actions">
        <button type="submit" className="save-button" disabled={isSaving}>
          <Save size={16} />
          {isSaving ? '저장 중...' : '저장'}
        </button>
      </div>
    </form>
  )
}


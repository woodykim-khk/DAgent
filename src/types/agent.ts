export interface Agent {
  id: string
  name: string
  profileImage?: string
  description: string
  organizationId: string
  organizationName: string
  status: 'active' | 'paused'
  createdAt: string
  createdBy: string
  languageModel: string
  useSearchGrounding: boolean
  referenceData: ReferenceData
  appIntegration?: AppIntegration // 하위 호환성을 위해 유지
  externalIntegrations?: ExternalIntegration[]
  triggers: Trigger[]
  behaviors: Behavior[]
  skills?: Skill
  mcpServers?: MCPServer[] // 하위 호환성을 위해 유지
  permissions: Permissions
  answerCount: number
  recommendationCount: number
}

export interface ReferenceData {
  items: ReferenceDataItem[]
  customGuidelines: string
}

export interface ReferenceDataItem {
  id: string
  type: 'tasks' | 'wiki' | 'drive' | 'custom'
  name: string
  enabled: boolean
}

export interface AppIntegration {
  token: string
  serverUrl: string
  appId: string
  tokenScope: string[]
}

export interface ExternalIntegration {
  id: string
  type: 'app' | 'mcp'
  name: string
  serverUrl: string
  enabled: boolean
  status?: 'connected' | 'disconnected' | 'error'
  // APP 연동 필드
  token?: string
  appId?: string
  tokenScope?: string[]
  // MCP 서버 필드
  apiKey?: string
  tools?: MCPTool[]
  resources?: MCPResource[]
}

export interface Trigger {
  id: string
  type: 'natural' | 'keyword' | 'command'
  content: string
  keywords?: string[]
  commandKeyword?: string // 명령어 트리거의 경우
}

export interface Behavior {
  id: string
  triggerId?: string // 연결된 트리거 ID
  action: 'message' | 'notification' | 'both'
  autoReply: boolean
  approvalRequired: boolean
  approvalTarget: 'trigger_user' | 'inviter' | 'caller'
  notificationConfig?: NotificationConfig
}

export interface NotificationConfig {
  webhookUrl: string
  messageTemplate: string
  includeContext: boolean
}

export interface Skill {
  responseMode: 'command' | 'mixed'
  helpMessage: string
  commands: Command[]
  webhook?: WebhookConfig
  messageTemplates?: MessageTemplate[]
}

export interface Command {
  id: string
  keyword: string
  description: string
  responseType: 'text' | 'dialog'
  dialogConfig?: DialogConfig
}

export interface DialogConfig {
  title: string
  description: string
  fields: DialogField[]
}

export interface DialogField {
  id: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'date' | 'number'
  required: boolean
  options?: string[]
  placeholder?: string
}

export interface WebhookConfig {
  url: string
  secret: string
  events: WebhookEvent[]
  filter: 'related' | 'created' | 'assigned' | 'all'
}

export interface WebhookEvent {
  id: string
  type: 'issue_created' | 'issue_updated' | 'issue_deleted' | 'comment_added' | 'comment_deleted' | 'assignee_changed' | 'status_changed' | 'mention'
  enabled: boolean
}

export interface MessageTemplate {
  eventType: string
  template: string
  showContent: boolean
  showLink: boolean
}

export interface MCPServer {
  id: string
  name: string
  serverUrl: string
  apiKey?: string
  enabled: boolean
  tools?: MCPTool[]
  resources?: MCPResource[]
  status?: 'connected' | 'disconnected' | 'error'
}

export interface MCPTool {
  id: string
  name: string
  description: string
  parameters?: any
}

export interface MCPResource {
  id: string
  name: string
  description: string
  uri: string
}

export interface Permissions {
  managers: string[]
  accessLevel: 'managers_only' | 'all'
  messengerAccess: 'all'
}

export interface AgentActivity {
  id: string
  agentId: string
  type: 'reply' | 'trigger'
  content: string
  timestamp: string
  channelId?: string
  channelName?: string
  triggerKeyword?: string
}

export interface LicenseInfo {
  standard: number
  premium: number
  maxAgents: number
  currentAgents: number
}


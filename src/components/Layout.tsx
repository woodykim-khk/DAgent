import { ReactNode, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Bot,
  User,
  HelpCircle,
  Settings,
  Bell,
  Star,
  Plus,
} from 'lucide-react'
import './Layout.css'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [agents] = useState([
    { id: '2', name: 'AI 에이전트', active: true },
  ])

  return (
    <div className="layout">
      <header className="top-header">
        <div className="header-left">
          <h1 className="logo">Dooray! Agent Space</h1>
        </div>
        <div className="header-right">
          <HelpCircle size={20} className="header-icon" />
          <Settings size={20} className="header-icon" />
          <div className="user-avatar">
            <User size={20} />
          </div>
          <Bell size={20} className="header-icon" />
          <Star size={20} className="header-icon" />
        </div>
      </header>

      <div className="layout-body">
        <aside className="sidebar">
          <button
            className="create-agent-button"
            onClick={() => navigate('/agents/create')}
          >
            <Plus size={18} />
            새 에이전트 생성
          </button>

          <div className="agent-list-section">
            {agents.map((agent) => (
              <Link
                key={agent.id}
                to="/"
                className={`agent-item ${agent.active ? 'active' : ''}`}
              >
                <Bot size={18} />
                <span>{agent.name}</span>
                {agent.unread && (
                  <span className="badge">{agent.unread}+</span>
                )}
              </Link>
            ))}
          </div>
        </aside>

        <main className="main-content">{children}</main>
      </div>
    </div>
  )
}


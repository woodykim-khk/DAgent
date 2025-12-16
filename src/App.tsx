import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import AgentList from './pages/AgentList'
import AgentCreate from './pages/AgentCreate'
import AgentEdit from './pages/AgentEdit'
import AgentActivity from './pages/AgentActivity'

function App() {
  return (
    <BrowserRouter basename="/DAgent">
      <Layout>
        <Routes>
          <Route path="/" element={<AgentList />} />
          <Route path="/agents/create" element={<AgentCreate />} />
          <Route path="/agents/:id/edit" element={<AgentEdit />} />
          <Route path="/agents/:id/activity" element={<AgentActivity />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App


import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MailGenerator from './pages/MailGenerator'
import UpdatePage from './pages/UpdatePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MailGenerator />} />
        <Route path="/update" element={<UpdatePage />} />
      </Routes>
    </BrowserRouter>
  )
}

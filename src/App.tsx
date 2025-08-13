import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Layout from './layout/layout';
import TemplateGrid from './Prompts/promptsManager/TemplateGrid';
import IdeaMinds from './ideaminds/screen/IdeaMinds';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<TemplateGrid />} />
          <Route path="/ideaminds" element={<IdeaMinds />} />
        </Routes>
      </Layout>
    </Router>
  );
}
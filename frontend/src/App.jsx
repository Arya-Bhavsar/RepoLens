import { useEffect } from 'react'
import './App.css'
import api from './axios';

function App() {
  // Example useEffect to test API call
  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const response = await api.get("/api");
        console.log(response.data.status);
      } catch (error) {
        console.error('Error fetching API:', error);
      }
    };
    
    fetchAPI();
  }, []);

  return (
    <div>
      RepoLens
    </div>
  )
}

export default App

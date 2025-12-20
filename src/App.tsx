import { useState, useEffect } from 'react';
import { HomePage } from './pages/HomePage';
import { TechMaintenance } from './pages/TechMaintenance';
import { getTechStatus } from './services/techStatus';

function App() {
  const [isMaintenance, setIsMaintenance] = useState(false);

  useEffect(() => {
    const checkTechStatus = async () => {
      const status = await getTechStatus();
      setIsMaintenance(status);
    };

    checkTechStatus();

    const interval = setInterval(checkTechStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  if (isMaintenance) {
    return <TechMaintenance />;
  }

  return <HomePage />;
}

export default App;

import { FC } from 'react';
import { useRoutes } from 'react-router';
import { Router } from './routes';
import './app.scss';

const App: FC = () => {
  const router = useRoutes(Router);
  return router;
}

export default App;

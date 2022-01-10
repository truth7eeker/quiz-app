import { useState } from 'react';
import './App.css';
import StartPage from './components/StartPage';
import Content from './components/Content';
// import { queryAllByTestId } from '@testing-library/react';

function App() {
 
  const [startGame, setStartGame] = useState(false)



  return (
        <div className="app">
      {
        !startGame ?
        <StartPage handleClick = {() => setStartGame(true)} />
        : <Content />

      }
        </div>
  );
}

export default App;

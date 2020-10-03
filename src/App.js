import React from 'react';
import './App.css';
import Container from '@material-ui/core/Container';
import GameCanvas from './GameCanvas';

function App() {
  return (
    <div className="App">
      <Container fixed style={{ height: '70vh' }}>
        <GameCanvas />
      </Container>
    </div>
  );
}

export default App;

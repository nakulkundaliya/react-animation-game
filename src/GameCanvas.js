import React, { useState, useRef, useEffect } from 'react';
const gameWidth = 500;
const gameHeight = 300;
let isGameOver = false,
  pressedKeys = [];

const GameCanvas = () => {
  const canvas = useRef(null);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [winner, setWinner] = useState('');
  let ballY = gameHeight / 2,
    ballX = gameWidth / 2,
    ballRadius = 7,
    ballSpeedY = 0,
    ballSpeedX = gameHeight / 75;
  let paddle1Y = gameHeight / 2 - 30,
    paddle2Y = gameHeight / 2 - 30,
    paddleSpeed = 6;
  const fps = 60,
    paddleWidth = 60;

  useEffect(() => {
    update();
  }, []);

  useEffect(() => {
    if (player1Score === 2) {
      setWinner('PLAYER1');
      gameOver();
    }
    if (player2Score === 2) {
      setWinner('PLAYER2');
      gameOver();
    }
  }, [player1Score, player2Score]);

  const update = () => {
    // ============= TODO : Note ============= //
    // We can use useEffect instend of funciton
    function KeyListener() {
      pressedKeys = [];
      const keydown = (e) => {
        pressedKeys[e.keyCode] = true;
      };
      const keyup = (e) => {
        pressedKeys[e.keyCode] = false;
      };
      window.addEventListener('keydown', keydown);
      window.addEventListener('keyup', keyup);
    }
    KeyListener.prototype.isPressed = function (key) {
      return pressedKeys[key] ? true : false;
    };
    KeyListener.prototype.addKeyPressListener = function (keyCode, callback) {
      window.addEventListener('keypress', function (e) {
        if (e.keyCode == keyCode) callback(e);
      });
    };
    let keys = new KeyListener();

    const moveAll = () => {
      // ball movement
      ballX += ballSpeedX;
      ballY += ballSpeedY;

      // horizontal
      if (ballX > gameWidth - 40 || ballX < 40) {
        // right side collision
        if (
          ballX > gameWidth / 2 &&
          ballY >= paddle2Y &&
          ballY <= paddle2Y + paddleWidth
        ) {
          ballSpeedX = -ballSpeedX;
          let deltaY = ballY - (paddle2Y + paddleWidth / 2);
          ballSpeedY = deltaY * 0.35;
        } else if (
          ballX < gameWidth / 2 &&
          ballY >= paddle1Y &&
          ballY <= paddle1Y + paddleWidth
        ) {
          ballSpeedX = -ballSpeedX;
          let deltaY = ballY - (paddle1Y + paddleWidth / 2);
          ballSpeedY = deltaY * 0.35;
        } else {
          if (ballX < gameWidth / 2) {
            setPlayer2Score((player2Score) => player2Score + 1);
          } else {
            setPlayer1Score((player1Score) => player1Score + 1);
          }
          reset();
        }
      } // vertical
      if (ballY > gameHeight || ballY < 0) {
        ballSpeedY = -ballSpeedY;
      }
      // ai

      if (
        ballY > paddle2Y + paddleWidth / 3 &&
        paddle2Y + paddleWidth < gameHeight
      ) {
        paddle2Y += paddleSpeed;
      } else if (ballY < paddle2Y + paddleWidth / 3 && paddle2Y > 0) {
        paddle2Y -= paddleSpeed;
      }

      if (keys.isPressed(40) && paddle1Y + paddleWidth < gameHeight) {
        // DOWN
        paddle1Y += paddleSpeed;
      } else if (keys.isPressed(38) && paddle1Y > 0) {
        // UP
        paddle1Y -= paddleSpeed;
      }
    };

    setInterval(function () {
      if (isGameOver === false) {
        moveAll();
        drawAll();
      } else {
        gameOver();
      }
    }, 1000 / fps);
  };

  // reset all element
  const reset = () => {
    ballY = gameHeight / 2;
    ballX = gameWidth / 2;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = 0;
  };

  // draw everything on screen
  const drawAll = () => {
    const ctx = canvas.current.getContext('2d');
    ctx.fillStyle = '#EEEEEE';
    ctx.fillRect(0, 0, gameWidth, gameHeight);

    // 2 rects
    ctx.fillStyle = '#00CCFF';
    ctx.strokeStyle = '#00CCFF';
    roundRect(20, paddle1Y, 10, paddleWidth, 5);

    ctx.fillStyle = 'gray';
    ctx.strokeStyle = 'gray';
    roundRect(gameWidth - 30, paddle2Y, 10, paddleWidth, 5);

    // ball
    ctx.beginPath();
    ctx.fillStyle = '#00CCFF';
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fill();
  };

  const roundRect = (x, y, w, h, radius) => {
    const ctx = canvas.current.getContext('2d');
    let r = x + w;
    let b = y + h;
    ctx.beginPath();

    ctx.lineWidth = '1';
    ctx.moveTo(x + radius, y);
    ctx.lineTo(r - radius, y);
    ctx.quadraticCurveTo(r, y, r, y + radius);
    ctx.lineTo(r, y + h - radius);
    ctx.quadraticCurveTo(r, b, r - radius, b);
    ctx.lineTo(x + radius, b);
    ctx.quadraticCurveTo(x, b, x, b - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.stroke();
    ctx.fill();
  };

  const gameOver = () => {
    ballSpeedY = 0;
    paddle1Y = gameHeight / 2 - 30;
    paddle2Y = gameHeight / 2 - 30;
    setPlayer1Score(0);
    setPlayer2Score(0);
    let ctx = canvas.current.getContext('2d');
    ctx.textAlign = 'center';
    if (winner !== '') {
      ctx.fillStyle = '#888';
      ctx.font = '36px Orbitron';
      ctx.fillText(winner + ' WON!', gameWidth / 2, 150);
    } else {
      ballY = gameHeight / 2;
      ballX = gameWidth / 2;
      isGameOver = true;
    }
    ctx.font = '14px Roboto Mono';
    ctx.fillStyle = 'black';
    ctx.fillText('Click anywhere to start a new game.', gameWidth / 2, 200);
    document.addEventListener('mousedown', function () {
      isGameOver = false;
      setWinner('');
    });
  };

  return (
    <div>
      <canvas
        ref={canvas}
        width={gameWidth}
        height={gameHeight}
        id="gameCanvas"
        className="canvas"
        style={{
          border: '3px solid #00CCFF',
          borderRadius: '20px',
          backgroundColor: '#EEEEEE',
        }}
      ></canvas>
      {winner && <p>{winner} won the game!!!</p>}
      {!winner && (
        <>
          <p>Player 1 : {player1Score}</p>
          <p>Player 2 : {player2Score}</p>
        </>
      )}
    </div>
  );
};

export default GameCanvas;

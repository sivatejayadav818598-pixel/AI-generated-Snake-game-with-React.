import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GlitchText } from './GlitchText';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 120;

export function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const gameBoardRef = useRef<HTMLDivElement>(null);

  const generateFood = useCallback((currentSnake: {x: number, y: number}[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
    setHasStarted(true);
    setIsPaused(false);
    setTimeout(() => {
      gameBoardRef.current?.focus();
    }, 10);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasStarted || isPaused || gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          e.preventDefault();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          e.preventDefault();
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          e.preventDefault();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          e.preventDefault();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, hasStarted, isPaused, gameOver]);

  useEffect(() => {
    if (!hasStarted || isPaused || gameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { x: head.x + direction.x, y: head.y + direction.y };

        // Check collision with walls
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check collision with self
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, SPEED);
    return () => clearInterval(intervalId);
  }, [direction, food, hasStarted, isPaused, gameOver, generateFood]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl relative z-10">
      <div className="flex justify-between w-full px-4 text-xl neon-text">
        <span>BIOMASS: {score}</span>
        <span>STATUS: {gameOver ? 'TERMINATED' : isPaused ? 'SUSPENDED' : hasStarted ? 'ACTIVE' : 'AWAITING_INPUT'}</span>
      </div>

      <div
        ref={gameBoardRef}
        tabIndex={0}
        className="neon-border relative bg-black/90 outline-none focus:ring-2 focus:ring-magenta cursor-crosshair"
        style={{
          width: '100%',
          aspectRatio: '1/1',
          maxWidth: '500px',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          gap: '1px'
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnake = snake.some(segment => segment.x === x && segment.y === y);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={i}
              className={`
                ${isHead ? 'bg-magenta shadow-[0_0_10px_#FF00FF]' : ''}
                ${isSnake && !isHead ? 'bg-cyan shadow-[0_0_5px_#00FFFF]' : ''}
                ${isFood ? 'bg-red-500 shadow-[0_0_10px_#FF0000] animate-pulse' : ''}
                ${!isSnake && !isFood ? 'bg-gray-900/20' : ''}
              `}
            />
          );
        })}

        {(!hasStarted || gameOver) && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm z-10">
            {gameOver ? (
              <>
                <GlitchText text="SYSTEM_FAILURE" className="text-4xl text-red-500 mb-4" />
                <p className="text-cyan mb-6 text-xl">FINAL_BIOMASS: {score}</p>
                <button
                  onClick={resetGame}
                  className="neon-border px-6 py-2 text-magenta hover:bg-magenta hover:text-black transition-all uppercase tracking-widest cursor-pointer"
                >
                  REBOOT_SEQUENCE
                </button>
              </>
            ) : (
              <>
                <GlitchText text="NEON_SERPENT" className="text-6xl md:text-7xl text-cyan mb-8 tracking-widest neon-text" />
                <button
                  onClick={resetGame}
                  className="neon-border px-6 py-2 text-cyan hover:bg-cyan hover:text-black transition-all uppercase tracking-widest cursor-pointer"
                >
                  INITIALIZE_UPLINK
                </button>
                <p className="mt-6 text-xs text-gray-500">USE [W,A,S,D] OR [ARROWS] TO NAVIGATE</p>
                <p className="mt-2 text-xs text-gray-500">CLICK TO FOCUS TERMINAL</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import './App.css';
import { ENEMY_SHRINK_SIZE, PLAYER_RADIUS, PROJECTILE_RADIUS } from './config';
import {
  Bullet,
  Enemy,
  getContext,
  Projectile,
  xCenter,
  yCenter,
} from './helper';

function App() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const animationId = useRef<number | null>(null);
  useEffect(() => {
    if (!canvas.current) return;
    canvas.current.width = innerWidth;
    canvas.current.height = innerHeight;
    const player = new Bullet({
      x: xCenter,
      y: yCenter,
      radius: PLAYER_RADIUS,
      color: 'red',
    });
    player.draw();
    (function animate() {
      animationId.current = requestAnimationFrame(animate);
      const c = canvas.current?.getContext('2d');
      if (!c) {
        throw new Error();
      }
      c.fillStyle = 'rgba(0, 0, 0, .2';
      c.fillRect(0, 0, innerWidth, innerHeight);
      const { projectiles } = Projectile;
      for (let pIndex in projectiles) {
        const projectile = projectiles[pIndex];
        projectile.update();
        if (
          projectile.x - projectile.radius < 1 ||
          projectile.x - projectile.radius > innerWidth ||
          projectile.y - projectile.radius < 0 ||
          projectile.y - projectile.radius > innerHeight
        ) {
          //projectile out of screen
          projectiles.splice(+pIndex, 1);
        }
      }
      const { enemies } = Enemy;
      for (let enemyIndex in enemies) {
        const enemy = enemies[enemyIndex];
        enemy.update();
        const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if (distance - PLAYER_RADIUS - enemy.radius < 1) {
          //gameover
          cancelAnimationFrame(animationId.current);
          alert('game over');
        }
        for (let pIndex in projectiles) {
          const distance = Math.hypot(
            projectiles[pIndex].y - enemies[enemyIndex].y,
            projectiles[pIndex].x - enemies[enemyIndex].x
          );
          if (distance - enemies[enemyIndex].radius - PROJECTILE_RADIUS < 1) {
            // hit projectile with enemy
            setTimeout(() => {
              projectiles.splice(+pIndex, 1);
            });
            if (enemy.radius >= ENEMY_SHRINK_SIZE) {
              enemy.radius -= ENEMY_SHRINK_SIZE;
            } else {
              setTimeout(() => {
                enemies.splice(+enemyIndex, 1);
              });
            }
          }
        }
      }
      player.draw();
    })();
  }, []);

  useEffect(() => {
    addEventListener('click', e => {
      new Projectile(e.clientX, e.clientY);
    });
    setInterval(() => {
      new Enemy();
    }, 1000)
  }, []);

  return <canvas width={'100%'} height="100%" id="GAME" ref={canvas}></canvas>;
}

export default App;

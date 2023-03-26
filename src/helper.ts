import {
  MAX_ENEMY_RADIUS,
  MIN_ENEMY_RADIUS,
  PROJECTILE_RADIUS,
} from './config';
import { BulletInfo, MovingBulletInfo } from './types';

export const xCenter = innerWidth / 2;
export const yCenter = innerHeight / 2;

export const getContext = () =>
  document.querySelector<HTMLCanvasElement>('#GAME')?.getContext('2d');

export class Bullet {
  public x;
  public y;
  public radius;
  public color;
  constructor(info: BulletInfo) {
    this.x = info.x;
    this.y = info.y;
    this.color = info.color || '#000';
    this.radius = info.radius;
  }
  draw() {
    const c = getContext();
    if (!c) {
      throw new Error('context not found');
    }
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
}

export class MovingBullet extends Bullet {
  public velocity;
  constructor(info: MovingBulletInfo) {
    const { velocity, ...others } = info;
    super(others);
    this.velocity = velocity;
  }
  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.draw();
  }
}

export class Enemy extends MovingBullet {
  static enemies: Enemy[] = [];
  constructor() {
    const radius =
      Math.floor(Math.random() * (MAX_ENEMY_RADIUS - MIN_ENEMY_RADIUS)) +
      MIN_ENEMY_RADIUS;
    const { x, y } = getRandomSpot(radius);
    const angle = Math.atan2(yCenter - y, xCenter - x);
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
    const color = `hsl(${Math.floor(Math.random() * 360)}, 50%, 50%)`;
    const info = { x, y, radius, color, velocity };
    super(info);
    Enemy.enemies.push(this);
  }
}

export class Projectile extends MovingBullet {
  static projectiles: Projectile[] = [];
  constructor(clientX: number, clientY: number) {
    const angle = Math.atan2(clientY - yCenter, clientX - xCenter);
    const velocity = {
      y: Math.sin(angle) * 6,
      x: Math.cos(angle) * 6,
    };
    const info = {
      x: xCenter,
      y: yCenter,
      color: 'red',
      radius: PROJECTILE_RADIUS,
      velocity,
    };
    super(info);
    Projectile.projectiles.push(this);
  }
}
const getRandomSpot = (radius: number): { x: number; y: number } => {
  let x, y;
  const xyDetection = Math.random();
  const canvas = document.querySelector<HTMLCanvasElement>('#GAME');
  if (!canvas) {
    throw new Error('The canvas is not mounted yet!');
  }
  switch (true) {
    case xyDetection < 0.25:
      // from top
      y = 0 - radius;
      x = Math.random() * canvas.width;
      break;

    case xyDetection < 0.5:
      // from right
      y = Math.random() * canvas.height;
      x = canvas.width + radius;
      break;

    case xyDetection < 0.75:
      // from bottom
      y = canvas.height + radius;
      x = Math.random() * canvas.width;
      break;

    case xyDetection < 1:
      // from left
      y = Math.random() * canvas.height;
      x = 0 - radius;
      break;
  }
  if (!x || !y) {
    throw new Error('something bad happened');
  }
  return { x, y };
};
Object.assign(window, { Enemy, Projectile });

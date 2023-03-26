export interface BulletInfo {
  x: number;
  y: number;
  radius: number;
  color?: string;
}

export interface MovingBulletInfo extends BulletInfo {
  velocity: Velocity;
}
type Velocity = {
  x: number;
  y: number;
};

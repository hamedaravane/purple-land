import { Shot } from '../entities/Shot';

/**
 * Emitted when a shot is fired by the player.
 */
export class ShotFiredEvent {
  constructor(public readonly shot: Shot) {}
}

/**
 * Emitted when a shot has finished its trajectory
 * or got deactivated for any reason (e.g., collision or out-of-bounds).
 */
export class ShotFinishedEvent {
  constructor(public readonly shot: Shot) {}
}

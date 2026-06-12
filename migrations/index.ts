import * as migration_20260612_081632_initial from './20260612_081632_initial';

export const migrations = [
  {
    up: migration_20260612_081632_initial.up,
    down: migration_20260612_081632_initial.down,
    name: '20260612_081632_initial'
  },
];

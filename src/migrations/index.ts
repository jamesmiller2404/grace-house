import * as migration_20261009_022806 from './20261009_022806';
import * as migration_20261010_060830_initial from './20261010_060830_initial';
import * as migration_20261010_172832_add_media_objectkey from './20261010_172832_add_media_objectkey';

export const migrations = [
  {
    up: migration_20261009_022806.up,
    down: migration_20261009_022806.down,
    name: '20261009_022806',
  },
  {
    up: migration_20261010_060830_initial.up,
    down: migration_20261010_060830_initial.down,
    name: '20261010_060830_initial',
  },
  {
    up: migration_20261010_172832_add_media_objectkey.up,
    down: migration_20261010_172832_add_media_objectkey.down,
    name: '20261010_172832_add_media_objectkey'
  },
];

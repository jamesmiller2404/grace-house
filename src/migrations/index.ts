import * as migration_20261009_022806 from './20261009_022806';
import * as migration_20261010_060830_initial from './20261010_060830_initial';
import * as migration_20261010_172832_add_media_objectkey from './20261010_172832_add_media_objectkey';
import * as migration_20261011_022929_add_event_image_position from './20261011_022929_add_event_image_position';
import * as migration_20261011_034500_make_event_image_optional from './20261011_034500_make_event_image_optional';
import * as migration_20261012_051759_make_event_description_and_start_time_optional from './20261012_051759_make_event_description_and_start_time_optional';
import * as migration_20261012_084452_hero from './20261012_084452_hero';
import * as migration_20261012_172205_intro from './20261012_172205_intro';
import * as migration_20261012_215035_home_layout from './20261012_215035_home_layout';
import * as migration_20261013_061623_stories from './20261013_061623_stories';

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
    name: '20261010_172832_add_media_objectkey',
  },
  {
    up: migration_20261011_022929_add_event_image_position.up,
    down: migration_20261011_022929_add_event_image_position.down,
    name: '20261011_022929_add_event_image_position',
  },
  {
    up: migration_20261011_034500_make_event_image_optional.up,
    down: migration_20261011_034500_make_event_image_optional.down,
    name: '20261011_034500_make_event_image_optional',
  },
  {
    up: migration_20261012_051759_make_event_description_and_start_time_optional.up,
    down: migration_20261012_051759_make_event_description_and_start_time_optional.down,
    name: '20261012_051759_make_event_description_and_start_time_optional',
  },
  {
    up: migration_20261012_084452_hero.up,
    down: migration_20261012_084452_hero.down,
    name: '20261012_084452_hero',
  },
  {
    up: migration_20261012_172205_intro.up,
    down: migration_20261012_172205_intro.down,
    name: '20261012_172205_intro',
  },
  {
    up: migration_20261012_215035_home_layout.up,
    down: migration_20261012_215035_home_layout.down,
    name: '20261012_215035_home_layout',
  },
  {
    up: migration_20261013_061623_stories.up,
    down: migration_20261013_061623_stories.down,
    name: '20261013_061623_stories'
  },
];

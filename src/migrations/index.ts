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
import * as migration_20261014_055905_donate_page from './20261014_055905_donate_page';
import * as migration_20261014_061904_donate_generic_sections from './20261014_061904_donate_generic_sections';
import * as migration_20261014_065411_donate_text_blocks from './20261014_065411_donate_text_blocks';
import * as migration_20261014_074937_custom_pages from './20261014_074937_custom_pages';
import * as migration_20261015_001720_get_help_now from './20261015_001720_get_help_now';

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
    name: '20261013_061623_stories',
  },
  {
    up: migration_20261014_055905_donate_page.up,
    down: migration_20261014_055905_donate_page.down,
    name: '20261014_055905_donate_page',
  },
  {
    up: migration_20261014_061904_donate_generic_sections.up,
    down: migration_20261014_061904_donate_generic_sections.down,
    name: '20261014_061904_donate_generic_sections',
  },
  {
    up: migration_20261014_065411_donate_text_blocks.up,
    down: migration_20261014_065411_donate_text_blocks.down,
    name: '20261014_065411_donate_text_blocks',
  },
  {
    up: migration_20261014_074937_custom_pages.up,
    down: migration_20261014_074937_custom_pages.down,
    name: '20261014_074937_custom_pages',
  },
  {
    up: migration_20261015_001720_get_help_now.up,
    down: migration_20261015_001720_get_help_now.down,
    name: '20261015_001720_get_help_now'
  },
];

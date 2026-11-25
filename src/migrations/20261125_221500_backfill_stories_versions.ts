import { MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Backfill initial published version rows in `_stories_v` (and its child array
 * tables) for all stories that existed before `versions: { drafts: true }` was
 * enabled on `stories`. Payload's admin list view queries `_stories_v` where
 * `latest = true`, so without this backfill pre-existing stories don't appear
 * in the list.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    WITH inserted AS (
      INSERT INTO "_stories_v" (
        "parent_id",
        "version_name",
        "version_role",
        "version_role_label",
        "version_gender",
        "version_date",
        "version_image_id",
        "version_image_position_x",
        "version_image_position_y",
        "version_show_pull_quote",
        "version_pull_quote",
        "version_show_banner_quote",
        "version_banner_quote_quote",
        "version_banner_quote_attribution",
        "version_read_label",
        "version_closing_heading",
        "version_pronouns_subject",
        "version_pronouns_possessive",
        "version_show_memories",
        "version_show_pillar",
        "version_pillar",
        "version_updated_at",
        "version_created_at",
        "version__status",
        "created_at",
        "updated_at",
        "latest"
      )
      SELECT
        s."id",
        s."name",
        s."role"::text::"enum__stories_v_version_role",
        s."role_label",
        s."gender"::text::"enum__stories_v_version_gender",
        s."date",
        s."image_id",
        s."image_position_x",
        s."image_position_y",
        s."show_pull_quote",
        s."pull_quote",
        s."show_banner_quote",
        s."banner_quote_quote",
        s."banner_quote_attribution",
        s."read_label",
        s."closing_heading",
        s."pronouns_subject",
        s."pronouns_possessive",
        s."show_memories",
        s."show_pillar",
        s."pillar"::text::"enum__stories_v_version_pillar",
        s."updated_at",
        s."created_at",
        COALESCE(s."_status"::text, 'published')::"enum__stories_v_version_status",
        COALESCE(s."created_at", now()),
        COALESCE(s."updated_at", now()),
        true
      FROM "stories" s
      WHERE NOT EXISTS (
        SELECT 1 FROM "_stories_v" v WHERE v."parent_id" = s."id"
      )
      RETURNING "id" AS version_id, "parent_id" AS story_id
    ),
    ins_body AS (
      INSERT INTO "_stories_v_version_body" (
        "_order",
        "_parent_id",
        "type",
        "text",
        "content",
        "image_id",
        "video_url",
        "caption",
        "_uuid"
      )
      SELECT
        b."_order",
        i.version_id,
        b."type"::text::"enum__stories_v_version_body_type",
        b."text",
        b."content",
        b."image_id",
        b."video_url",
        b."caption",
        b."id"
      FROM "stories_body" b
      JOIN inserted i ON i.story_id = b."_parent_id"
    ),
    ins_closing AS (
      INSERT INTO "_stories_v_version_closing_paragraphs" (
        "_order",
        "_parent_id",
        "text",
        "_uuid"
      )
      SELECT
        c."_order",
        i.version_id,
        c."text",
        c."id"
      FROM "stories_closing_paragraphs" c
      JOIN inserted i ON i.story_id = c."_parent_id"
    )
    INSERT INTO "_stories_v_version_memories" (
      "_order",
      "_parent_id",
      "image_id",
      "alt",
      "caption",
      "_uuid"
    )
    SELECT
      m."_order",
      i.version_id,
      m."image_id",
      m."alt",
      m."caption",
      m."id"
    FROM "stories_memories" m
    JOIN inserted i ON i.story_id = m."_parent_id";
  `)
}

export async function down(): Promise<void> {
  // No-op: version rows are dropped by 20261125_220036_stories_drafts down()
}

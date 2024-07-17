
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "pg_catalog";

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "http" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."post_visibility" AS ENUM (
    'all',
    'only',
    'friends'
);

ALTER TYPE "public"."post_visibility" OWNER TO "postgres";

CREATE TYPE "public"."profile_visibility" AS ENUM (
    'all',
    'friends'
);

ALTER TYPE "public"."profile_visibility" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."check_and_insert_user"("nick" "text", "pass" "text") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    stored_password text;
    user_uuid text;
BEGIN
    SELECT "HASH", "UUID" INTO stored_password, user_uuid 
    FROM "AUTH" 
    WHERE "NICKNAME" = nick;

    IF stored_password IS NOT NULL AND stored_password = crypt(pass, stored_password) THEN
        INSERT INTO users (nickname, uuid) 
        VALUES (nick, user_uuid);
    ELSE
        RAISE EXCEPTION 'Invalid name or password';
    END IF;
END;
$$;

ALTER FUNCTION "public"."check_and_insert_user"("nick" "text", "pass" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."edge_wrapper"("database" "text", "table_name" "text", "nickname" "text", "uuid" "text") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'extensions', 'vault'
    AS $$DECLARE
  api_key TEXT;
  response JSONB;
  edge_function_url TEXT := 'http://host.docker.internal:54321/functions/v1/mysql_wrapper';
  post_data TEXT;
BEGIN
  SELECT decrypted_secret
  INTO api_key
  FROM vault.decrypted_secrets
  WHERE name = 'service_role';

  post_data := json_build_object(
    'database', database,
    'table_name', table_name,
    'nickname', nickname,
    'uuid', uuid
  )::TEXT;

  BEGIN
  SELECT _content::JSON
  INTO response
    FROM http_post_with_auth(edge_function_url, post_data, api_key);
  EXCEPTION
    WHEN others THEN
      RAISE EXCEPTION 'Error: %', SQLERRM;
  END;

  RETURN response;
END;$$;

ALTER FUNCTION "public"."edge_wrapper"("database" "text", "table_name" "text", "nickname" "text", "uuid" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."http_post_with_auth"("url_address" "text", "post_data" "text", "bearer" "text") RETURNS TABLE("_status" "text", "_content" "jsonb")
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'extensions'
    AS $$DECLARE
  full_bearer TEXT := 'Bearer ' || bearer;
  response RECORD;
BEGIN
  SELECT status::text, content::jsonb
  INTO response
  FROM http((
          'POST',
           url_address,
           ARRAY[http_header('Authorization', full_bearer), http_header('Content-Type', 'application/json')],
           'application/json',
           coalesce(post_data, '') -- Set content to an empty string if post_data is NULL
        )::http_request);

  IF response.content IS NULL THEN
    RAISE EXCEPTION 'Error: Edge Function returned NULL content. Status: %', response.status;
  END IF;

  RETURN QUERY SELECT response.status, response.content;
END;$$;

ALTER FUNCTION "public"."http_post_with_auth"("url_address" "text", "post_data" "text", "bearer" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."schedule_update_value"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Планируем выполнение функции update_value_with_delay через 5 минут
    PERFORM cron.schedule(
        'set_false_for_' || NEW.user_id,  -- название задачи
        '*/5 * * * *',  -- интервал выполнения задачи (каждые 5 минут)
        'SELECT update_value_with_delay(''' || NEW.user_id || ''')'
    );

    RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."schedule_update_value"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."set_status"("p_user_id" "text", "p_value" boolean) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Пытаемся обновить запись с указанным user_id
    UPDATE status SET value = p_value WHERE user_id = p_user_id;

    -- Если записи с указанным user_id нет, добавляем новую запись
    IF NOT FOUND THEN
        INSERT INTO status (user_id, value) VALUES (p_user_id, p_value);
    END IF;
END;
$$;

ALTER FUNCTION "public"."set_status"("p_user_id" "text", "p_value" boolean) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."update_value_with_delay"("p_user_id" "text") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$BEGIN
    PERFORM pg_sleep(10);

    UPDATE status SET value = FALSE WHERE user_id = p_user_id;
END;$$;

ALTER FUNCTION "public"."update_value_with_delay"("p_user_id" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."AUTH" (
    "NICKNAME" character varying(255) NOT NULL,
    "LOWERCASENICKNAME" character varying(255) NOT NULL,
    "HASH" character varying(255) NOT NULL,
    "IP" character varying(255),
    "TOTPTOKEN" character varying(255),
    "REGDATE" bigint,
    "UUID" character varying(255),
    "PREMIUMUUID" character varying(255),
    "LOGINIP" character varying(255),
    "LOGINDATE" bigint,
    "ISSUEDTIME" bigint
);

ALTER TABLE "public"."AUTH" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."SOCIAL" (
    "LOWERCASENICKNAME" character varying(255) NOT NULL,
    "VK_ID" bigint,
    "TELEGRAM_ID" bigint,
    "DISCORD_ID" bigint,
    "BLOCKED" boolean,
    "TOTP_ENABLED" boolean,
    "NOTIFY_ENABLED" boolean
);

ALTER TABLE "public"."SOCIAL" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."category" (
    "description" "text",
    "id" bigint NOT NULL,
    "title" "text" NOT NULL
);

ALTER TABLE "public"."category" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."category_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."category_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."category_id_seq" OWNED BY "public"."category"."id";

ALTER TABLE "public"."category" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."category_id_seq1"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."category_threads" (
    "category_id" integer NOT NULL,
    "thread_id" "uuid" NOT NULL
);

ALTER TABLE "public"."category_threads" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."config_advertisement" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "link" "text",
    "owner" "text" NOT NULL
);

ALTER TABLE "public"."config_advertisement" OWNER TO "postgres";

ALTER TABLE "public"."config_advertisement" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."config_advertisement_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."config_alerts" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text" NOT NULL,
    "link" "text"
);

ALTER TABLE "public"."config_alerts" OWNER TO "postgres";

ALTER TABLE "public"."config_alerts" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."config_alerts_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."config_minecraft_facts" (
    "id" bigint NOT NULL,
    "fact" "text"
);

ALTER TABLE "public"."config_minecraft_facts" OWNER TO "postgres";

ALTER TABLE "public"."config_minecraft_facts" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."config_minecraft_facts_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."friends_requests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "recipient" "text" NOT NULL,
    "initiator" "text" NOT NULL,
    CONSTRAINT "check_recipient_not_initiator" CHECK (("recipient" <> "initiator"))
);

ALTER TABLE "public"."friends_requests" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."info_findout" (
    "user_nickname" "text" NOT NULL,
    "findout" "text",
    "id" bigint NOT NULL
);

ALTER TABLE "public"."info_findout" OWNER TO "postgres";

ALTER TABLE "public"."info_findout" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."info_findout_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."p_comments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "content" "text" NOT NULL,
    "user_nickname" "text" NOT NULL
);

ALTER TABLE "public"."p_comments" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."posts" (
    "content" "text",
    "post_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visibility" "public"."post_visibility" DEFAULT 'all'::"public"."post_visibility" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "comments" boolean DEFAULT true NOT NULL
);

ALTER TABLE "public"."posts" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."posts_comments" (
    "post_id" "uuid" NOT NULL,
    "comment_id" "uuid" NOT NULL
);

ALTER TABLE "public"."posts_comments" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."posts_users" (
    "post_id" "uuid" NOT NULL,
    "user_nickname" "text" NOT NULL
);

ALTER TABLE "public"."posts_users" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."status" (
    "user_id" "text" DEFAULT ''::"text" NOT NULL,
    "value" boolean DEFAULT false NOT NULL
);

ALTER TABLE "public"."status" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."t_comments" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "content" "text" NOT NULL,
    "user_nickname" "text" NOT NULL
);

ALTER TABLE "public"."t_comments" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."threads" (
    "content" "text" NOT NULL,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "description" "text",
    "title" "text" NOT NULL,
    "comments" boolean DEFAULT true NOT NULL,
    "permission" boolean DEFAULT false NOT NULL,
    "auto_remove" boolean DEFAULT false NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);

ALTER TABLE "public"."threads" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."threads_comments" (
    "thread_id" "uuid" NOT NULL,
    "comment_id" "uuid" NOT NULL
);

ALTER TABLE "public"."threads_comments" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."threads_pinned" (
    "threads_id" "uuid" NOT NULL,
    "id" bigint NOT NULL
);

ALTER TABLE "public"."threads_pinned" OWNER TO "postgres";

ALTER TABLE "public"."threads_pinned" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."threads_pinned_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."threads_stars" (
    "id" bigint NOT NULL,
    "user_id" "text" NOT NULL,
    "thread_id" "uuid" NOT NULL
);

ALTER TABLE "public"."threads_stars" OWNER TO "postgres";

ALTER TABLE "public"."threads_stars" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."threads_stars_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."threads_users" (
    "thread_id" "uuid" NOT NULL,
    "user_nickname" "text" NOT NULL
);

ALTER TABLE "public"."threads_users" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."users" (
    "acceptrules" boolean DEFAULT true,
    "birthday" "date",
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "description" "text",
    "id" "text" DEFAULT "gen_random_uuid"() NOT NULL,
    "nickname" "text" NOT NULL,
    "status" "text",
    "uuid" "text" NOT NULL,
    "cover_image" "text",
    "name_color" "text" DEFAULT '#FFFFFF'::"text" NOT NULL,
    "donate_weight" integer DEFAULT 0 NOT NULL,
    "visibility" "public"."profile_visibility" DEFAULT 'all'::"public"."profile_visibility" NOT NULL,
    "real_name" "text"
);

ALTER TABLE "public"."users" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."users_blocked" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_1" "text",
    "user_2" "text"
);

ALTER TABLE "public"."users_blocked" OWNER TO "postgres";

ALTER TABLE "public"."users_blocked" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."users_blocked_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."users_friends" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_1" "text" NOT NULL,
    "user_2" "text" NOT NULL
);

ALTER TABLE "public"."users_friends" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."users_security" (
    "user_nickname" "text" NOT NULL,
    "email" "text" NOT NULL,
    "token" "text"
);

ALTER TABLE "public"."users_security" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."users_session" (
    "expires_at" timestamp without time zone NOT NULL,
    "id" "text" NOT NULL,
    "user_id" "text" NOT NULL,
    "ua" "text",
    "browser" "text",
    "os" "text",
    "cpu" "text",
    "isBot" boolean,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "ip" "text"
);

ALTER TABLE "public"."users_session" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."users_settings" (
    "user_id" "text" NOT NULL
);

ALTER TABLE "public"."users_settings" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."users_status" (
    "id" bigint NOT NULL,
    "status" boolean,
    "user" "text"
);

ALTER TABLE "public"."users_status" OWNER TO "postgres";

ALTER TABLE "public"."users_status" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."users_status_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY "public"."AUTH"
    ADD CONSTRAINT "AUTH_pkey" PRIMARY KEY ("LOWERCASENICKNAME");

ALTER TABLE ONLY "public"."SOCIAL"
    ADD CONSTRAINT "SOCIAL_pkey" PRIMARY KEY ("LOWERCASENICKNAME");

ALTER TABLE ONLY "public"."category"
    ADD CONSTRAINT "category_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."category_threads"
    ADD CONSTRAINT "category_threads_pkey" PRIMARY KEY ("thread_id");

ALTER TABLE ONLY "public"."category_threads"
    ADD CONSTRAINT "category_threads_thread_id_key" UNIQUE ("thread_id");

ALTER TABLE ONLY "public"."p_comments"
    ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."config_advertisement"
    ADD CONSTRAINT "config_advertisement_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."config_alerts"
    ADD CONSTRAINT "config_alerts_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."config_minecraft_facts"
    ADD CONSTRAINT "config_minecraft_facts_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."friends_requests"
    ADD CONSTRAINT "friends_requests_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."info_findout"
    ADD CONSTRAINT "info_findout_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."posts_comments"
    ADD CONSTRAINT "posts_comments_pkey" PRIMARY KEY ("post_id");

ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_pkey" PRIMARY KEY ("post_id");

ALTER TABLE ONLY "public"."posts_users"
    ADD CONSTRAINT "posts_users_pkey" PRIMARY KEY ("post_id");

ALTER TABLE ONLY "public"."status"
    ADD CONSTRAINT "status_pkey" PRIMARY KEY ("value");

ALTER TABLE ONLY "public"."t_comments"
    ADD CONSTRAINT "t_comments_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."threads_comments"
    ADD CONSTRAINT "threads_comments_pkey" PRIMARY KEY ("thread_id");

ALTER TABLE ONLY "public"."threads_pinned"
    ADD CONSTRAINT "threads_pinned_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."threads"
    ADD CONSTRAINT "threads_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."threads_stars"
    ADD CONSTRAINT "threads_stars_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."threads_users"
    ADD CONSTRAINT "threads_users_pkey" PRIMARY KEY ("thread_id");

ALTER TABLE ONLY "public"."users_session"
    ADD CONSTRAINT "user_session_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."users_blocked"
    ADD CONSTRAINT "users_blocked_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."users_security"
    ADD CONSTRAINT "users_email_pkey" PRIMARY KEY ("user_nickname");

ALTER TABLE ONLY "public"."users_friends"
    ADD CONSTRAINT "users_friends_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_nickname_key" UNIQUE ("nickname");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."users_settings"
    ADD CONSTRAINT "users_settings_pkey" PRIMARY KEY ("user_id");

ALTER TABLE ONLY "public"."users_status"
    ADD CONSTRAINT "users_status_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_uuid_key" UNIQUE ("uuid");

CREATE UNIQUE INDEX "unique_recipient_initiator_pair" ON "public"."friends_requests" USING "btree" (LEAST("recipient", "initiator"), GREATEST("recipient", "initiator"));

CREATE OR REPLACE TRIGGER "status_change_trigger" AFTER INSERT OR UPDATE OF "value" ON "public"."status" FOR EACH ROW WHEN (("new"."value" = true)) EXECUTE FUNCTION "public"."schedule_update_value"();

ALTER TABLE ONLY "public"."category_threads"
    ADD CONSTRAINT "category_threads_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."category_threads"
    ADD CONSTRAINT "public_category_threads_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."p_comments"
    ADD CONSTRAINT "public_comments_user_nickname_fkey" FOREIGN KEY ("user_nickname") REFERENCES "public"."users"("nickname") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."friends_requests"
    ADD CONSTRAINT "public_friends_requests_initiator_fkey" FOREIGN KEY ("initiator") REFERENCES "public"."users"("nickname") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."friends_requests"
    ADD CONSTRAINT "public_friends_requests_recipient_fkey" FOREIGN KEY ("recipient") REFERENCES "public"."users"("nickname") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."posts_comments"
    ADD CONSTRAINT "public_posts_comments_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."p_comments"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."posts_comments"
    ADD CONSTRAINT "public_posts_comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("post_id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."posts_users"
    ADD CONSTRAINT "public_posts_users_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("post_id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."posts_users"
    ADD CONSTRAINT "public_posts_users_user_nickname_fkey" FOREIGN KEY ("user_nickname") REFERENCES "public"."users"("nickname") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."status"
    ADD CONSTRAINT "public_status_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."t_comments"
    ADD CONSTRAINT "public_t_comments_user_nickname_fkey" FOREIGN KEY ("user_nickname") REFERENCES "public"."users"("nickname") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."threads_comments"
    ADD CONSTRAINT "public_threads_comments_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."t_comments"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."threads_comments"
    ADD CONSTRAINT "public_threads_comments_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."threads_pinned"
    ADD CONSTRAINT "public_threads_pinned_threads_id_fkey" FOREIGN KEY ("threads_id") REFERENCES "public"."threads"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."threads_stars"
    ADD CONSTRAINT "public_threads_stars_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."threads_stars"
    ADD CONSTRAINT "public_threads_stars_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."threads_users"
    ADD CONSTRAINT "public_threads_users_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."threads_users"
    ADD CONSTRAINT "public_threads_users_user_nickname_fkey" FOREIGN KEY ("user_nickname") REFERENCES "public"."users"("nickname") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."users_blocked"
    ADD CONSTRAINT "public_users_blocked_user_1_fkey" FOREIGN KEY ("user_1") REFERENCES "public"."users"("nickname") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."users_blocked"
    ADD CONSTRAINT "public_users_blocked_user_2_fkey" FOREIGN KEY ("user_2") REFERENCES "public"."users"("nickname") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."users_friends"
    ADD CONSTRAINT "public_users_friends_user_1_fkey" FOREIGN KEY ("user_1") REFERENCES "public"."users"("nickname") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."users_friends"
    ADD CONSTRAINT "public_users_friends_user_2_fkey" FOREIGN KEY ("user_2") REFERENCES "public"."users"("nickname") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."users_status"
    ADD CONSTRAINT "public_users_status_user_fkey" FOREIGN KEY ("user") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."users_session"
    ADD CONSTRAINT "user_session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."users_settings"
    ADD CONSTRAINT "users_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;

CREATE PUBLICATION "logflare_pub" WITH (publish = 'insert, update, delete, truncate');

ALTER PUBLICATION "logflare_pub" OWNER TO "supabase_admin";

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."friends_requests";

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."users_friends";

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."users_status";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."check_and_insert_user"("nick" "text", "pass" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."check_and_insert_user"("nick" "text", "pass" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_and_insert_user"("nick" "text", "pass" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."edge_wrapper"("database" "text", "table_name" "text", "nickname" "text", "uuid" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."edge_wrapper"("database" "text", "table_name" "text", "nickname" "text", "uuid" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."edge_wrapper"("database" "text", "table_name" "text", "nickname" "text", "uuid" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."http_post_with_auth"("url_address" "text", "post_data" "text", "bearer" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."http_post_with_auth"("url_address" "text", "post_data" "text", "bearer" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_post_with_auth"("url_address" "text", "post_data" "text", "bearer" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."schedule_update_value"() TO "anon";
GRANT ALL ON FUNCTION "public"."schedule_update_value"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."schedule_update_value"() TO "service_role";

GRANT ALL ON FUNCTION "public"."set_status"("p_user_id" "text", "p_value" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."set_status"("p_user_id" "text", "p_value" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_status"("p_user_id" "text", "p_value" boolean) TO "service_role";

GRANT ALL ON FUNCTION "public"."update_value_with_delay"("p_user_id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."update_value_with_delay"("p_user_id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_value_with_delay"("p_user_id" "text") TO "service_role";

GRANT ALL ON TABLE "public"."AUTH" TO "anon";
GRANT ALL ON TABLE "public"."AUTH" TO "authenticated";
GRANT ALL ON TABLE "public"."AUTH" TO "service_role";

GRANT ALL ON TABLE "public"."SOCIAL" TO "anon";
GRANT ALL ON TABLE "public"."SOCIAL" TO "authenticated";
GRANT ALL ON TABLE "public"."SOCIAL" TO "service_role";

GRANT ALL ON TABLE "public"."category" TO "anon";
GRANT ALL ON TABLE "public"."category" TO "authenticated";
GRANT ALL ON TABLE "public"."category" TO "service_role";

GRANT ALL ON SEQUENCE "public"."category_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."category_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."category_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."category_id_seq1" TO "anon";
GRANT ALL ON SEQUENCE "public"."category_id_seq1" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."category_id_seq1" TO "service_role";

GRANT ALL ON TABLE "public"."category_threads" TO "anon";
GRANT ALL ON TABLE "public"."category_threads" TO "authenticated";
GRANT ALL ON TABLE "public"."category_threads" TO "service_role";

GRANT ALL ON TABLE "public"."config_advertisement" TO "anon";
GRANT ALL ON TABLE "public"."config_advertisement" TO "authenticated";
GRANT ALL ON TABLE "public"."config_advertisement" TO "service_role";

GRANT ALL ON SEQUENCE "public"."config_advertisement_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."config_advertisement_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."config_advertisement_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."config_alerts" TO "anon";
GRANT ALL ON TABLE "public"."config_alerts" TO "authenticated";
GRANT ALL ON TABLE "public"."config_alerts" TO "service_role";

GRANT ALL ON SEQUENCE "public"."config_alerts_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."config_alerts_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."config_alerts_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."config_minecraft_facts" TO "anon";
GRANT ALL ON TABLE "public"."config_minecraft_facts" TO "authenticated";
GRANT ALL ON TABLE "public"."config_minecraft_facts" TO "service_role";

GRANT ALL ON SEQUENCE "public"."config_minecraft_facts_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."config_minecraft_facts_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."config_minecraft_facts_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."friends_requests" TO "anon";
GRANT ALL ON TABLE "public"."friends_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."friends_requests" TO "service_role";

GRANT ALL ON TABLE "public"."info_findout" TO "anon";
GRANT ALL ON TABLE "public"."info_findout" TO "authenticated";
GRANT ALL ON TABLE "public"."info_findout" TO "service_role";

GRANT ALL ON SEQUENCE "public"."info_findout_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."info_findout_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."info_findout_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."p_comments" TO "anon";
GRANT ALL ON TABLE "public"."p_comments" TO "authenticated";
GRANT ALL ON TABLE "public"."p_comments" TO "service_role";

GRANT ALL ON TABLE "public"."posts" TO "anon";
GRANT ALL ON TABLE "public"."posts" TO "authenticated";
GRANT ALL ON TABLE "public"."posts" TO "service_role";

GRANT ALL ON TABLE "public"."posts_comments" TO "anon";
GRANT ALL ON TABLE "public"."posts_comments" TO "authenticated";
GRANT ALL ON TABLE "public"."posts_comments" TO "service_role";

GRANT ALL ON TABLE "public"."posts_users" TO "anon";
GRANT ALL ON TABLE "public"."posts_users" TO "authenticated";
GRANT ALL ON TABLE "public"."posts_users" TO "service_role";

GRANT ALL ON TABLE "public"."status" TO "anon";
GRANT ALL ON TABLE "public"."status" TO "authenticated";
GRANT ALL ON TABLE "public"."status" TO "service_role";

GRANT ALL ON TABLE "public"."t_comments" TO "anon";
GRANT ALL ON TABLE "public"."t_comments" TO "authenticated";
GRANT ALL ON TABLE "public"."t_comments" TO "service_role";

GRANT ALL ON TABLE "public"."threads" TO "anon";
GRANT ALL ON TABLE "public"."threads" TO "authenticated";
GRANT ALL ON TABLE "public"."threads" TO "service_role";

GRANT ALL ON TABLE "public"."threads_comments" TO "anon";
GRANT ALL ON TABLE "public"."threads_comments" TO "authenticated";
GRANT ALL ON TABLE "public"."threads_comments" TO "service_role";

GRANT ALL ON TABLE "public"."threads_pinned" TO "anon";
GRANT ALL ON TABLE "public"."threads_pinned" TO "authenticated";
GRANT ALL ON TABLE "public"."threads_pinned" TO "service_role";

GRANT ALL ON SEQUENCE "public"."threads_pinned_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."threads_pinned_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."threads_pinned_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."threads_stars" TO "anon";
GRANT ALL ON TABLE "public"."threads_stars" TO "authenticated";
GRANT ALL ON TABLE "public"."threads_stars" TO "service_role";

GRANT ALL ON SEQUENCE "public"."threads_stars_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."threads_stars_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."threads_stars_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."threads_users" TO "anon";
GRANT ALL ON TABLE "public"."threads_users" TO "authenticated";
GRANT ALL ON TABLE "public"."threads_users" TO "service_role";

GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";

GRANT ALL ON TABLE "public"."users_blocked" TO "anon";
GRANT ALL ON TABLE "public"."users_blocked" TO "authenticated";
GRANT ALL ON TABLE "public"."users_blocked" TO "service_role";

GRANT ALL ON SEQUENCE "public"."users_blocked_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."users_blocked_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."users_blocked_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."users_friends" TO "anon";
GRANT ALL ON TABLE "public"."users_friends" TO "authenticated";
GRANT ALL ON TABLE "public"."users_friends" TO "service_role";

GRANT ALL ON TABLE "public"."users_security" TO "anon";
GRANT ALL ON TABLE "public"."users_security" TO "authenticated";
GRANT ALL ON TABLE "public"."users_security" TO "service_role";

GRANT ALL ON TABLE "public"."users_session" TO "anon";
GRANT ALL ON TABLE "public"."users_session" TO "authenticated";
GRANT ALL ON TABLE "public"."users_session" TO "service_role";

GRANT ALL ON TABLE "public"."users_settings" TO "anon";
GRANT ALL ON TABLE "public"."users_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."users_settings" TO "service_role";

GRANT ALL ON TABLE "public"."users_status" TO "anon";
GRANT ALL ON TABLE "public"."users_status" TO "authenticated";
GRANT ALL ON TABLE "public"."users_status" TO "service_role";

GRANT ALL ON SEQUENCE "public"."users_status_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."users_status_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."users_status_id_seq" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;

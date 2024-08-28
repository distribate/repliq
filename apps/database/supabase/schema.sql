

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






CREATE TYPE "public"."donate_variants" AS ENUM (
    'default',
    'authentic',
    'helper',
    'loyal',
    'arkhont',
    'dev',
    'moder'
);


ALTER TYPE "public"."donate_variants" OWNER TO "postgres";


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


CREATE TYPE "public"."report_reason" AS ENUM (
    'spam',
    'offensive'
);


ALTER TYPE "public"."report_reason" OWNER TO "postgres";


CREATE TYPE "public"."report_type" AS ENUM (
    'comment',
    'post',
    'thread',
    'account'
);


ALTER TYPE "public"."report_type" OWNER TO "postgres";


CREATE TYPE "public"."request_timeout_type" AS ENUM (
    'description',
    'favorite_item',
    'real_name',
    'name_color'
);


ALTER TYPE "public"."request_timeout_type" OWNER TO "postgres";


CREATE TYPE "public"."thread_rating_type" AS ENUM (
    'decrement',
    'increment'
);


ALTER TYPE "public"."thread_rating_type" OWNER TO "postgres";


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


CREATE OR REPLACE FUNCTION "public"."prevent_duplicate_friends"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM public.friends_requests
        WHERE (initiator = LEAST(NEW.user_1, NEW.user_2) AND recipient = GREATEST(NEW.user_1, NEW.user_2))
    ) THEN
        RAISE EXCEPTION 'Cannot create friendship: a friend request already exists between these users.';
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."prevent_duplicate_friends"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."prevent_duplicate_requests"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Проверка на дублирование запросов
    IF EXISTS (
        SELECT 1
        FROM friends_requests
        WHERE 
            (initiator = NEW.initiator AND recipient = NEW.recipient)
            OR (initiator = NEW.recipient AND recipient = NEW.initiator)
    ) THEN
        RAISE EXCEPTION 'Duplicate friend request detected.';
    END IF;

    -- Проверка на одинаковые initiator и recipient
    IF NEW.initiator = NEW.recipient THEN
        RAISE EXCEPTION 'Initiator and recipient cannot be the same.';
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."prevent_duplicate_requests"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."prevent_duplicate_requests_notes"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM friends_notes
        WHERE 
            (initiator = NEW.initiator AND recipient = NEW.recipient)
            OR (initiator = NEW.recipient AND recipient = NEW.initiator)
    ) THEN
        RAISE EXCEPTION 'Duplicate friend request notes detected.';
    END IF;

    IF NEW.initiator = NEW.recipient THEN
        RAISE EXCEPTION 'Initiator and recipient cannot be the same.';
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."prevent_duplicate_requests_notes"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."prevent_duplicate_requests_pinned"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM friends_pinned
        WHERE 
            (initiator = NEW.initiator AND recipient = NEW.recipient)
            OR (initiator = NEW.recipient AND recipient = NEW.initiator)
    ) THEN
        RAISE EXCEPTION 'Duplicate friend request pinned detected.';
    END IF;

    IF NEW.initiator = NEW.recipient THEN
        RAISE EXCEPTION 'Initiator and recipient cannot be the same.';
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."prevent_duplicate_requests_pinned"() OWNER TO "postgres";


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


CREATE TABLE IF NOT EXISTS "public"."admins" (
    "admin_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "id" bigint NOT NULL
);


ALTER TABLE "public"."admins" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."admins_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."admins_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."admins_id_seq" OWNED BY "public"."admins"."id";



CREATE TABLE IF NOT EXISTS "public"."category" (
    "available" boolean DEFAULT true NOT NULL,
    "description" "text",
    "id" bigint NOT NULL,
    "title" "text" NOT NULL
);


ALTER TABLE "public"."category" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."category_id_seq"
    AS integer
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
    "category_id" bigint NOT NULL,
    "thread_id" "uuid" NOT NULL
);


ALTER TABLE "public"."category_threads" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."config_advertisement" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "description" "text" NOT NULL,
    "id" bigint NOT NULL,
    "link" "text",
    "owner" "text" NOT NULL,
    "title" "text" NOT NULL
);


ALTER TABLE "public"."config_advertisement" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."config_advertisement_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."config_advertisement_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."config_advertisement_id_seq" OWNED BY "public"."config_advertisement"."id";



CREATE TABLE IF NOT EXISTS "public"."config_alerts" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "id" bigint NOT NULL,
    "link" "text",
    "title" "text" NOT NULL
);


ALTER TABLE "public"."config_alerts" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."config_alerts_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."config_alerts_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."config_alerts_id_seq" OWNED BY "public"."config_alerts"."id";



CREATE TABLE IF NOT EXISTS "public"."config_minecraft_facts" (
    "fact" "text",
    "id" bigint NOT NULL
);


ALTER TABLE "public"."config_minecraft_facts" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."config_minecraft_facts_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."config_minecraft_facts_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."config_minecraft_facts_id_seq" OWNED BY "public"."config_minecraft_facts"."id";



CREATE TABLE IF NOT EXISTS "public"."config_minecraft_items" (
    "id" bigint NOT NULL,
    "image" "text" NOT NULL,
    "title" "text" NOT NULL
);


ALTER TABLE "public"."config_minecraft_items" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."config_minecraft_items_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."config_minecraft_items_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."config_minecraft_items_id_seq" OWNED BY "public"."config_minecraft_items"."id";



ALTER TABLE "public"."config_minecraft_items" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."config_minecraft_items_id_seq1"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."friends_notes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "initiator" "text" NOT NULL,
    "recipient" "text" NOT NULL,
    "note" "text" NOT NULL,
    "friend_id" "uuid" NOT NULL,
    CONSTRAINT "friends_notes_note_check" CHECK (("length"("note") < 32))
);


ALTER TABLE "public"."friends_notes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."friends_pinned" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "initiator" "text" NOT NULL,
    "recipient" "text" NOT NULL,
    "friend_id" "uuid" NOT NULL
);


ALTER TABLE "public"."friends_pinned" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."friends_requests" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "initiator" "text" NOT NULL,
    "recipient" "text" NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."friends_requests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."info_findout" (
    "id" integer NOT NULL,
    "findout" "text",
    "user_nickname" character varying(255) NOT NULL
);


ALTER TABLE "public"."info_findout" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."info_findout_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."info_findout_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."info_findout_id_seq" OWNED BY "public"."info_findout"."id";



CREATE TABLE IF NOT EXISTS "public"."luckperms_actions" (
    "id" integer NOT NULL,
    "time" bigint NOT NULL,
    "actor_uuid" character varying(36) NOT NULL,
    "actor_name" character varying(100) NOT NULL,
    "type" character(1) NOT NULL,
    "acted_uuid" character varying(36) NOT NULL,
    "acted_name" character varying(36) NOT NULL,
    "action" character varying(300) NOT NULL
);


ALTER TABLE "public"."luckperms_actions" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."luckperms_actions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."luckperms_actions_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."luckperms_actions_id_seq" OWNED BY "public"."luckperms_actions"."id";



CREATE TABLE IF NOT EXISTS "public"."luckperms_group_permissions" (
    "id" integer NOT NULL,
    "name" character varying(36) NOT NULL,
    "permission" character varying(200) NOT NULL,
    "value" boolean NOT NULL,
    "server" character varying(36) NOT NULL,
    "world" character varying(64) NOT NULL,
    "expiry" bigint NOT NULL,
    "contexts" character varying(200) NOT NULL
);


ALTER TABLE "public"."luckperms_group_permissions" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."luckperms_group_permissions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."luckperms_group_permissions_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."luckperms_group_permissions_id_seq" OWNED BY "public"."luckperms_group_permissions"."id";



CREATE TABLE IF NOT EXISTS "public"."luckperms_groups" (
    "name" character varying(36) NOT NULL
);


ALTER TABLE "public"."luckperms_groups" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."luckperms_players" (
    "uuid" character varying(36) NOT NULL,
    "username" character varying(16) NOT NULL,
    "primary_group" character varying(36) NOT NULL
);


ALTER TABLE "public"."luckperms_players" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."luckperms_tracks" (
    "name" character varying(36) NOT NULL,
    "groups" "text" NOT NULL
);


ALTER TABLE "public"."luckperms_tracks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."luckperms_user_permissions" (
    "id" integer NOT NULL,
    "uuid" character varying(36) NOT NULL,
    "permission" character varying(200) NOT NULL,
    "value" boolean NOT NULL,
    "server" character varying(36) NOT NULL,
    "world" character varying(64) NOT NULL,
    "expiry" bigint NOT NULL,
    "contexts" character varying(200) NOT NULL
);


ALTER TABLE "public"."luckperms_user_permissions" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."luckperms_user_permissions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."luckperms_user_permissions_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."luckperms_user_permissions_id_seq" OWNED BY "public"."luckperms_user_permissions"."id";



CREATE TABLE IF NOT EXISTS "public"."p_comments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "content" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_nickname" "text" NOT NULL
);


ALTER TABLE "public"."p_comments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."posts" (
    "comments" boolean DEFAULT true NOT NULL,
    "content" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "post_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visibility" "public"."post_visibility" DEFAULT 'all'::"public"."post_visibility" NOT NULL
);


ALTER TABLE "public"."posts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."posts_comments" (
    "comment_id" "uuid" NOT NULL,
    "id" bigint NOT NULL,
    "post_id" "uuid" NOT NULL
);


ALTER TABLE "public"."posts_comments" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."posts_comments_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."posts_comments_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."posts_comments_id_seq" OWNED BY "public"."posts_comments"."id";



ALTER TABLE "public"."posts_comments" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."posts_comments_id_seq1"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."posts_users" (
    "post_id" "uuid" NOT NULL,
    "user_nickname" "text" NOT NULL
);


ALTER TABLE "public"."posts_users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reports" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "id" bigint NOT NULL,
    "reason" "text",
    "report_type" "text",
    "reported_item" "json",
    "target_user_nickname" "text",
    "user_nickname" "text"
);


ALTER TABLE "public"."reports" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."reports_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."reports_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."reports_id_seq" OWNED BY "public"."reports"."id";



CREATE TABLE IF NOT EXISTS "public"."status" (
    "user_id" "text" NOT NULL,
    "value" boolean DEFAULT true NOT NULL
);


ALTER TABLE "public"."status" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."t_comments" (
    "content" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_nickname" "text" NOT NULL,
    "id" bigint NOT NULL
);


ALTER TABLE "public"."t_comments" OWNER TO "postgres";


ALTER TABLE "public"."t_comments" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."t_comments_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."t_comments_replies" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "id" bigint NOT NULL,
    "initiator_comment_id" bigint NOT NULL,
    "recipient_comment_id" bigint NOT NULL
);


ALTER TABLE "public"."t_comments_replies" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."t_comments_replies_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."t_comments_replies_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."t_comments_replies_id_seq" OWNED BY "public"."t_comments_replies"."id";



ALTER TABLE "public"."t_comments_replies" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."t_comments_replies_id_seq1"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."threads" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone,
    "visibility" "public"."post_visibility" DEFAULT 'all'::"public"."post_visibility",
    "description" "text",
    "comments" boolean DEFAULT true NOT NULL,
    "auto_remove" boolean DEFAULT false NOT NULL,
    "content" "jsonb" NOT NULL,
    "permission" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."threads" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."threads_comments" (
    "id" bigint NOT NULL,
    "thread_id" "uuid" NOT NULL,
    "comment_id" bigint NOT NULL
);


ALTER TABLE "public"."threads_comments" OWNER TO "postgres";


ALTER TABLE "public"."threads_comments" ALTER COLUMN "comment_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."threads_comments_comment_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE SEQUENCE IF NOT EXISTS "public"."threads_comments_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."threads_comments_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."threads_comments_id_seq" OWNED BY "public"."threads_comments"."id";



ALTER TABLE "public"."threads_comments" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."threads_comments_id_seq1"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."threads_images" (
    "id" bigint NOT NULL,
    "images" "text"[] NOT NULL,
    "thread_id" "uuid" NOT NULL
);


ALTER TABLE "public"."threads_images" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."threads_images_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."threads_images_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."threads_images_id_seq" OWNED BY "public"."threads_images"."id";



ALTER TABLE "public"."threads_images" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."threads_images_id_seq1"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."threads_pinned" (
    "id" bigint NOT NULL,
    "thread_id" "uuid" NOT NULL
);


ALTER TABLE "public"."threads_pinned" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."threads_pinned_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."threads_pinned_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."threads_pinned_id_seq" OWNED BY "public"."threads_pinned"."id";



CREATE TABLE IF NOT EXISTS "public"."threads_rating" (
    "id" bigint NOT NULL,
    "type" "public"."thread_rating_type" NOT NULL,
    "thread_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL
);


ALTER TABLE "public"."threads_rating" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."threads_rating_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."threads_rating_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."threads_rating_id_seq" OWNED BY "public"."threads_rating"."id";



ALTER TABLE "public"."threads_rating" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."threads_rating_id_seq1"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."threads_stars" (
    "id" bigint NOT NULL,
    "user_id" "uuid" NOT NULL,
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



CREATE TABLE IF NOT EXISTS "public"."threads_tags" (
    "id" bigint NOT NULL,
    "tags" "jsonb"[] NOT NULL,
    "thread_id" "uuid" NOT NULL
);


ALTER TABLE "public"."threads_tags" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."threads_tags_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."threads_tags_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."threads_tags_id_seq" OWNED BY "public"."threads_tags"."id";



ALTER TABLE "public"."threads_tags" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."threads_tags_id_seq1"
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
    "cover_image" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "description" "text",
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name_color" "text" DEFAULT '#ffffff'::"text" NOT NULL,
    "nickname" "text" NOT NULL,
    "preferences" "jsonb" DEFAULT '{"coverOutline": "false", "friendRequest": "true", "realNameVisibility": "true", "gameStatsVisibility": "true"}'::"jsonb",
    "real_name" "text",
    "status" "text",
    "uuid" "text" NOT NULL,
    "visibility" "public"."profile_visibility" DEFAULT 'all'::"public"."profile_visibility" NOT NULL,
    "favorite_item" bigint,
    CONSTRAINT "users_description_check" CHECK (("length"("description") < 64))
);


ALTER TABLE "public"."users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users_banned" (
    "id" bigint NOT NULL,
    "nickname" "text" NOT NULL,
    "reason" "text",
    "time" timestamp with time zone NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."users_banned" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."users_banned_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."users_banned_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."users_banned_id_seq" OWNED BY "public"."users_banned"."id";



CREATE TABLE IF NOT EXISTS "public"."users_blocked" (
    "id" bigint NOT NULL,
    "user_1" "text" NOT NULL,
    "user_2" "text" NOT NULL,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."users_blocked" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."users_blocked_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."users_blocked_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."users_blocked_id_seq" OWNED BY "public"."users_blocked"."id";



CREATE TABLE IF NOT EXISTS "public"."users_friends" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_1" "text" NOT NULL,
    "user_2" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."users_friends" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users_requests_timeout" (
    "id" integer NOT NULL,
    "issued_at" timestamp without time zone,
    "type" "public"."request_timeout_type",
    "user_nickname" character varying,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."users_requests_timeout" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."users_requests_timeout_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."users_requests_timeout_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."users_requests_timeout_id_seq" OWNED BY "public"."users_requests_timeout"."id";



CREATE TABLE IF NOT EXISTS "public"."users_security" (
    "email" character varying NOT NULL,
    "token" character varying,
    "user_nickname" "text" NOT NULL
);


ALTER TABLE "public"."users_security" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users_session" (
    "id" "text" NOT NULL,
    "expires_at" timestamp with time zone NOT NULL,
    "user_id" "uuid" NOT NULL,
    "browser" "text",
    "cpu" "text",
    "ip" "text",
    "isBot" boolean,
    "os" "text",
    "ua" "text"
);


ALTER TABLE "public"."users_session" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users_settings" (
    "user_id" "text" NOT NULL,
    "id" bigint NOT NULL
);


ALTER TABLE "public"."users_settings" OWNER TO "postgres";


ALTER TABLE ONLY "public"."info_findout" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."info_findout_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."luckperms_actions" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."luckperms_actions_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."luckperms_group_permissions" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."luckperms_group_permissions_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."luckperms_user_permissions" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."luckperms_user_permissions_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."users_requests_timeout" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."users_requests_timeout_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."AUTH"
    ADD CONSTRAINT "AUTH_pkey" PRIMARY KEY ("LOWERCASENICKNAME");



ALTER TABLE ONLY "public"."SOCIAL"
    ADD CONSTRAINT "SOCIAL_pkey" PRIMARY KEY ("LOWERCASENICKNAME");



ALTER TABLE ONLY "public"."admins"
    ADD CONSTRAINT "admins_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."category"
    ADD CONSTRAINT "category_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."category_threads"
    ADD CONSTRAINT "category_threads_pkey" PRIMARY KEY ("category_id", "thread_id");



ALTER TABLE ONLY "public"."config_advertisement"
    ADD CONSTRAINT "config_advertisement_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."config_alerts"
    ADD CONSTRAINT "config_alerts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."config_minecraft_facts"
    ADD CONSTRAINT "config_minecraft_facts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."config_minecraft_items"
    ADD CONSTRAINT "config_minecraft_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."friends_notes"
    ADD CONSTRAINT "friends_notes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."friends_pinned"
    ADD CONSTRAINT "friends_pinned_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."friends_requests"
    ADD CONSTRAINT "friends_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."info_findout"
    ADD CONSTRAINT "info_findout_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."luckperms_actions"
    ADD CONSTRAINT "luckperms_actions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."luckperms_group_permissions"
    ADD CONSTRAINT "luckperms_group_permissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."luckperms_groups"
    ADD CONSTRAINT "luckperms_groups_pkey" PRIMARY KEY ("name");



ALTER TABLE ONLY "public"."luckperms_players"
    ADD CONSTRAINT "luckperms_players_pkey" PRIMARY KEY ("uuid");



ALTER TABLE ONLY "public"."luckperms_tracks"
    ADD CONSTRAINT "luckperms_tracks_pkey" PRIMARY KEY ("name");



ALTER TABLE ONLY "public"."luckperms_user_permissions"
    ADD CONSTRAINT "luckperms_user_permissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."p_comments"
    ADD CONSTRAINT "p_comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."posts_comments"
    ADD CONSTRAINT "posts_comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_pkey" PRIMARY KEY ("post_id");



ALTER TABLE ONLY "public"."posts_users"
    ADD CONSTRAINT "posts_users_pkey" PRIMARY KEY ("post_id", "user_nickname");



ALTER TABLE ONLY "public"."reports"
    ADD CONSTRAINT "reports_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."status"
    ADD CONSTRAINT "status_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."t_comments"
    ADD CONSTRAINT "t_comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."t_comments_replies"
    ADD CONSTRAINT "t_comments_replies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."threads_comments"
    ADD CONSTRAINT "threads_comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."threads_images"
    ADD CONSTRAINT "threads_images_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."threads_pinned"
    ADD CONSTRAINT "threads_pinned_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."threads"
    ADD CONSTRAINT "threads_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."threads_rating"
    ADD CONSTRAINT "threads_rating_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."threads_stars"
    ADD CONSTRAINT "threads_stars_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."threads_tags"
    ADD CONSTRAINT "threads_tags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."threads_users"
    ADD CONSTRAINT "threads_users_pkey" PRIMARY KEY ("thread_id", "user_nickname");



ALTER TABLE ONLY "public"."users_session"
    ADD CONSTRAINT "user_session_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users_banned"
    ADD CONSTRAINT "users_banned_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users_blocked"
    ADD CONSTRAINT "users_blocked_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users_friends"
    ADD CONSTRAINT "users_friends_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_nickname_key" UNIQUE ("nickname");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users_requests_timeout"
    ADD CONSTRAINT "users_requests_timeout_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users_security"
    ADD CONSTRAINT "users_security_pkey" PRIMARY KEY ("email");



ALTER TABLE ONLY "public"."users_settings"
    ADD CONSTRAINT "users_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_uuid_key" UNIQUE ("uuid");



CREATE INDEX "luckperms_group_permissions_name" ON "public"."luckperms_group_permissions" USING "btree" ("name");



CREATE INDEX "luckperms_players_username" ON "public"."luckperms_players" USING "btree" ("username");



CREATE INDEX "luckperms_user_permissions_uuid" ON "public"."luckperms_user_permissions" USING "btree" ("uuid");



CREATE UNIQUE INDEX "unique_recipient_initiator_pair" ON "public"."friends_requests" USING "btree" (LEAST("recipient", "initiator"), GREATEST("recipient", "initiator"));



CREATE UNIQUE INDEX "unique_users_pair_idx" ON "public"."users_friends" USING "btree" (LEAST("user_1", "user_2"), GREATEST("user_1", "user_2"));



CREATE OR REPLACE TRIGGER "check_existing_friends_notes" BEFORE INSERT ON "public"."friends_notes" FOR EACH ROW EXECUTE FUNCTION "public"."prevent_duplicate_requests_notes"();



CREATE OR REPLACE TRIGGER "check_existing_friends_pinned" BEFORE INSERT ON "public"."friends_pinned" FOR EACH ROW EXECUTE FUNCTION "public"."prevent_duplicate_requests_pinned"();



CREATE OR REPLACE TRIGGER "check_existing_friendship" BEFORE INSERT ON "public"."friends_requests" FOR EACH ROW EXECUTE FUNCTION "public"."prevent_duplicate_requests"();



CREATE OR REPLACE TRIGGER "check_existing_request" BEFORE INSERT ON "public"."users_friends" FOR EACH ROW EXECUTE FUNCTION "public"."prevent_duplicate_friends"();



CREATE OR REPLACE TRIGGER "status_change_trigger" AFTER INSERT OR UPDATE OF "value" ON "public"."status" FOR EACH ROW WHEN (("new"."value" = true)) EXECUTE FUNCTION "public"."schedule_update_value"();



ALTER TABLE ONLY "public"."admins"
    ADD CONSTRAINT "admins_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."category_threads"
    ADD CONSTRAINT "category_threads_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."category_threads"
    ADD CONSTRAINT "category_threads_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."friends_notes"
    ADD CONSTRAINT "friends_notes_friend_id_fkey" FOREIGN KEY ("friend_id") REFERENCES "public"."users_friends"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."friends_notes"
    ADD CONSTRAINT "friends_notes_initiator_fkey" FOREIGN KEY ("initiator") REFERENCES "public"."users"("nickname") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."friends_notes"
    ADD CONSTRAINT "friends_notes_recipient_fkey" FOREIGN KEY ("recipient") REFERENCES "public"."users"("nickname") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."friends_pinned"
    ADD CONSTRAINT "friends_pinned_friend_id_fkey" FOREIGN KEY ("friend_id") REFERENCES "public"."users_friends"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."friends_pinned"
    ADD CONSTRAINT "friends_pinned_initiator_fkey" FOREIGN KEY ("initiator") REFERENCES "public"."users"("nickname") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."friends_pinned"
    ADD CONSTRAINT "friends_pinned_recipient_fkey" FOREIGN KEY ("recipient") REFERENCES "public"."users"("nickname") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."friends_requests"
    ADD CONSTRAINT "friends_requests_initiator_fkey" FOREIGN KEY ("initiator") REFERENCES "public"."users"("nickname") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."friends_requests"
    ADD CONSTRAINT "friends_requests_recipient_fkey" FOREIGN KEY ("recipient") REFERENCES "public"."users"("nickname") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."p_comments"
    ADD CONSTRAINT "p_comments_user_nickname_fkey" FOREIGN KEY ("user_nickname") REFERENCES "public"."users"("nickname") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."posts_comments"
    ADD CONSTRAINT "posts_comments_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."p_comments"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."posts_comments"
    ADD CONSTRAINT "posts_comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("post_id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."posts_users"
    ADD CONSTRAINT "posts_users_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("post_id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."posts_users"
    ADD CONSTRAINT "posts_users_user_nickname_fkey" FOREIGN KEY ("user_nickname") REFERENCES "public"."users"("nickname") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reports"
    ADD CONSTRAINT "reports_target_user_nickname_fkey" FOREIGN KEY ("target_user_nickname") REFERENCES "public"."users"("nickname");



ALTER TABLE ONLY "public"."reports"
    ADD CONSTRAINT "reports_user_nickname_fkey" FOREIGN KEY ("user_nickname") REFERENCES "public"."users"("nickname");



ALTER TABLE ONLY "public"."t_comments_replies"
    ADD CONSTRAINT "t_comments_replies_initiator_comment_id_fkey" FOREIGN KEY ("initiator_comment_id") REFERENCES "public"."t_comments"("id");



ALTER TABLE ONLY "public"."t_comments_replies"
    ADD CONSTRAINT "t_comments_replies_recipient_comment_id_fkey" FOREIGN KEY ("recipient_comment_id") REFERENCES "public"."t_comments"("id");



ALTER TABLE ONLY "public"."t_comments"
    ADD CONSTRAINT "t_comments_user_nickname_fkey" FOREIGN KEY ("user_nickname") REFERENCES "public"."users"("nickname") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."threads_comments"
    ADD CONSTRAINT "threads_comments_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."t_comments"("id");



ALTER TABLE ONLY "public"."threads_comments"
    ADD CONSTRAINT "threads_comments_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."threads_images"
    ADD CONSTRAINT "threads_images_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."threads_pinned"
    ADD CONSTRAINT "threads_pinned_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."threads_rating"
    ADD CONSTRAINT "threads_rating_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."threads_rating"
    ADD CONSTRAINT "threads_rating_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."threads_stars"
    ADD CONSTRAINT "threads_stars_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."threads_stars"
    ADD CONSTRAINT "threads_stars_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."threads_tags"
    ADD CONSTRAINT "threads_tags_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."threads_users"
    ADD CONSTRAINT "threads_users_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."threads_users"
    ADD CONSTRAINT "threads_users_user_nickname_fkey" FOREIGN KEY ("user_nickname") REFERENCES "public"."users"("nickname");



ALTER TABLE ONLY "public"."users_session"
    ADD CONSTRAINT "user_session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."users_banned"
    ADD CONSTRAINT "users_banned_nickname_fkey" FOREIGN KEY ("nickname") REFERENCES "public"."users"("nickname") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users_blocked"
    ADD CONSTRAINT "users_blocked_user_1_fkey" FOREIGN KEY ("user_1") REFERENCES "public"."users"("nickname") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users_blocked"
    ADD CONSTRAINT "users_blocked_user_2_fkey" FOREIGN KEY ("user_2") REFERENCES "public"."users"("nickname") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_favorite_item_fkey" FOREIGN KEY ("favorite_item") REFERENCES "public"."config_minecraft_items"("id");



ALTER TABLE ONLY "public"."users_friends"
    ADD CONSTRAINT "users_friends_user_1_fkey" FOREIGN KEY ("user_1") REFERENCES "public"."users"("nickname") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users_friends"
    ADD CONSTRAINT "users_friends_user_2_fkey" FOREIGN KEY ("user_2") REFERENCES "public"."users"("nickname") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users_requests_timeout"
    ADD CONSTRAINT "users_requests_timeout_user_nickname_fkey" FOREIGN KEY ("user_nickname") REFERENCES "public"."users"("nickname");



ALTER TABLE ONLY "public"."users_security"
    ADD CONSTRAINT "users_security_user_nickname_fkey" FOREIGN KEY ("user_nickname") REFERENCES "public"."users"("nickname") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE "public"."friends_notes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."friends_pinned" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users_banned" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users_blocked" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users_session" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."friends_requests";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."users_friends";









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



GRANT ALL ON FUNCTION "public"."prevent_duplicate_friends"() TO "anon";
GRANT ALL ON FUNCTION "public"."prevent_duplicate_friends"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."prevent_duplicate_friends"() TO "service_role";



GRANT ALL ON FUNCTION "public"."prevent_duplicate_requests"() TO "anon";
GRANT ALL ON FUNCTION "public"."prevent_duplicate_requests"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."prevent_duplicate_requests"() TO "service_role";



GRANT ALL ON FUNCTION "public"."prevent_duplicate_requests_notes"() TO "anon";
GRANT ALL ON FUNCTION "public"."prevent_duplicate_requests_notes"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."prevent_duplicate_requests_notes"() TO "service_role";



GRANT ALL ON FUNCTION "public"."prevent_duplicate_requests_pinned"() TO "anon";
GRANT ALL ON FUNCTION "public"."prevent_duplicate_requests_pinned"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."prevent_duplicate_requests_pinned"() TO "service_role";



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



GRANT ALL ON TABLE "public"."admins" TO "anon";
GRANT ALL ON TABLE "public"."admins" TO "authenticated";
GRANT ALL ON TABLE "public"."admins" TO "service_role";



GRANT ALL ON SEQUENCE "public"."admins_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."admins_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."admins_id_seq" TO "service_role";



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



GRANT ALL ON TABLE "public"."config_minecraft_items" TO "anon";
GRANT ALL ON TABLE "public"."config_minecraft_items" TO "authenticated";
GRANT ALL ON TABLE "public"."config_minecraft_items" TO "service_role";



GRANT ALL ON SEQUENCE "public"."config_minecraft_items_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."config_minecraft_items_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."config_minecraft_items_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."config_minecraft_items_id_seq1" TO "anon";
GRANT ALL ON SEQUENCE "public"."config_minecraft_items_id_seq1" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."config_minecraft_items_id_seq1" TO "service_role";



GRANT ALL ON TABLE "public"."friends_notes" TO "anon";
GRANT ALL ON TABLE "public"."friends_notes" TO "authenticated";
GRANT ALL ON TABLE "public"."friends_notes" TO "service_role";



GRANT ALL ON TABLE "public"."friends_pinned" TO "anon";
GRANT ALL ON TABLE "public"."friends_pinned" TO "authenticated";
GRANT ALL ON TABLE "public"."friends_pinned" TO "service_role";



GRANT ALL ON TABLE "public"."friends_requests" TO "anon";
GRANT ALL ON TABLE "public"."friends_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."friends_requests" TO "service_role";



GRANT ALL ON TABLE "public"."info_findout" TO "anon";
GRANT ALL ON TABLE "public"."info_findout" TO "authenticated";
GRANT ALL ON TABLE "public"."info_findout" TO "service_role";



GRANT ALL ON SEQUENCE "public"."info_findout_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."info_findout_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."info_findout_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."luckperms_actions" TO "anon";
GRANT ALL ON TABLE "public"."luckperms_actions" TO "authenticated";
GRANT ALL ON TABLE "public"."luckperms_actions" TO "service_role";



GRANT ALL ON SEQUENCE "public"."luckperms_actions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."luckperms_actions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."luckperms_actions_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."luckperms_group_permissions" TO "anon";
GRANT ALL ON TABLE "public"."luckperms_group_permissions" TO "authenticated";
GRANT ALL ON TABLE "public"."luckperms_group_permissions" TO "service_role";



GRANT ALL ON SEQUENCE "public"."luckperms_group_permissions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."luckperms_group_permissions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."luckperms_group_permissions_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."luckperms_groups" TO "anon";
GRANT ALL ON TABLE "public"."luckperms_groups" TO "authenticated";
GRANT ALL ON TABLE "public"."luckperms_groups" TO "service_role";



GRANT ALL ON TABLE "public"."luckperms_players" TO "anon";
GRANT ALL ON TABLE "public"."luckperms_players" TO "authenticated";
GRANT ALL ON TABLE "public"."luckperms_players" TO "service_role";



GRANT ALL ON TABLE "public"."luckperms_tracks" TO "anon";
GRANT ALL ON TABLE "public"."luckperms_tracks" TO "authenticated";
GRANT ALL ON TABLE "public"."luckperms_tracks" TO "service_role";



GRANT ALL ON TABLE "public"."luckperms_user_permissions" TO "anon";
GRANT ALL ON TABLE "public"."luckperms_user_permissions" TO "authenticated";
GRANT ALL ON TABLE "public"."luckperms_user_permissions" TO "service_role";



GRANT ALL ON SEQUENCE "public"."luckperms_user_permissions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."luckperms_user_permissions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."luckperms_user_permissions_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."p_comments" TO "anon";
GRANT ALL ON TABLE "public"."p_comments" TO "authenticated";
GRANT ALL ON TABLE "public"."p_comments" TO "service_role";



GRANT ALL ON TABLE "public"."posts" TO "anon";
GRANT ALL ON TABLE "public"."posts" TO "authenticated";
GRANT ALL ON TABLE "public"."posts" TO "service_role";



GRANT ALL ON TABLE "public"."posts_comments" TO "anon";
GRANT ALL ON TABLE "public"."posts_comments" TO "authenticated";
GRANT ALL ON TABLE "public"."posts_comments" TO "service_role";



GRANT ALL ON SEQUENCE "public"."posts_comments_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."posts_comments_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."posts_comments_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."posts_comments_id_seq1" TO "anon";
GRANT ALL ON SEQUENCE "public"."posts_comments_id_seq1" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."posts_comments_id_seq1" TO "service_role";



GRANT ALL ON TABLE "public"."posts_users" TO "anon";
GRANT ALL ON TABLE "public"."posts_users" TO "authenticated";
GRANT ALL ON TABLE "public"."posts_users" TO "service_role";



GRANT ALL ON TABLE "public"."reports" TO "anon";
GRANT ALL ON TABLE "public"."reports" TO "authenticated";
GRANT ALL ON TABLE "public"."reports" TO "service_role";



GRANT ALL ON SEQUENCE "public"."reports_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."reports_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."reports_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."status" TO "anon";
GRANT ALL ON TABLE "public"."status" TO "authenticated";
GRANT ALL ON TABLE "public"."status" TO "service_role";



GRANT ALL ON TABLE "public"."t_comments" TO "anon";
GRANT ALL ON TABLE "public"."t_comments" TO "authenticated";
GRANT ALL ON TABLE "public"."t_comments" TO "service_role";



GRANT ALL ON SEQUENCE "public"."t_comments_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."t_comments_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."t_comments_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."t_comments_replies" TO "anon";
GRANT ALL ON TABLE "public"."t_comments_replies" TO "authenticated";
GRANT ALL ON TABLE "public"."t_comments_replies" TO "service_role";



GRANT ALL ON SEQUENCE "public"."t_comments_replies_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."t_comments_replies_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."t_comments_replies_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."t_comments_replies_id_seq1" TO "anon";
GRANT ALL ON SEQUENCE "public"."t_comments_replies_id_seq1" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."t_comments_replies_id_seq1" TO "service_role";



GRANT ALL ON TABLE "public"."threads" TO "anon";
GRANT ALL ON TABLE "public"."threads" TO "authenticated";
GRANT ALL ON TABLE "public"."threads" TO "service_role";



GRANT ALL ON TABLE "public"."threads_comments" TO "anon";
GRANT ALL ON TABLE "public"."threads_comments" TO "authenticated";
GRANT ALL ON TABLE "public"."threads_comments" TO "service_role";



GRANT ALL ON SEQUENCE "public"."threads_comments_comment_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."threads_comments_comment_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."threads_comments_comment_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."threads_comments_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."threads_comments_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."threads_comments_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."threads_comments_id_seq1" TO "anon";
GRANT ALL ON SEQUENCE "public"."threads_comments_id_seq1" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."threads_comments_id_seq1" TO "service_role";



GRANT ALL ON TABLE "public"."threads_images" TO "anon";
GRANT ALL ON TABLE "public"."threads_images" TO "authenticated";
GRANT ALL ON TABLE "public"."threads_images" TO "service_role";



GRANT ALL ON SEQUENCE "public"."threads_images_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."threads_images_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."threads_images_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."threads_images_id_seq1" TO "anon";
GRANT ALL ON SEQUENCE "public"."threads_images_id_seq1" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."threads_images_id_seq1" TO "service_role";



GRANT ALL ON TABLE "public"."threads_pinned" TO "anon";
GRANT ALL ON TABLE "public"."threads_pinned" TO "authenticated";
GRANT ALL ON TABLE "public"."threads_pinned" TO "service_role";



GRANT ALL ON SEQUENCE "public"."threads_pinned_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."threads_pinned_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."threads_pinned_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."threads_rating" TO "anon";
GRANT ALL ON TABLE "public"."threads_rating" TO "authenticated";
GRANT ALL ON TABLE "public"."threads_rating" TO "service_role";



GRANT ALL ON SEQUENCE "public"."threads_rating_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."threads_rating_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."threads_rating_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."threads_rating_id_seq1" TO "anon";
GRANT ALL ON SEQUENCE "public"."threads_rating_id_seq1" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."threads_rating_id_seq1" TO "service_role";



GRANT ALL ON TABLE "public"."threads_stars" TO "anon";
GRANT ALL ON TABLE "public"."threads_stars" TO "authenticated";
GRANT ALL ON TABLE "public"."threads_stars" TO "service_role";



GRANT ALL ON SEQUENCE "public"."threads_stars_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."threads_stars_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."threads_stars_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."threads_tags" TO "anon";
GRANT ALL ON TABLE "public"."threads_tags" TO "authenticated";
GRANT ALL ON TABLE "public"."threads_tags" TO "service_role";



GRANT ALL ON SEQUENCE "public"."threads_tags_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."threads_tags_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."threads_tags_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."threads_tags_id_seq1" TO "anon";
GRANT ALL ON SEQUENCE "public"."threads_tags_id_seq1" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."threads_tags_id_seq1" TO "service_role";



GRANT ALL ON TABLE "public"."threads_users" TO "anon";
GRANT ALL ON TABLE "public"."threads_users" TO "authenticated";
GRANT ALL ON TABLE "public"."threads_users" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON TABLE "public"."users_banned" TO "anon";
GRANT ALL ON TABLE "public"."users_banned" TO "authenticated";
GRANT ALL ON TABLE "public"."users_banned" TO "service_role";



GRANT ALL ON SEQUENCE "public"."users_banned_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."users_banned_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."users_banned_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."users_blocked" TO "anon";
GRANT ALL ON TABLE "public"."users_blocked" TO "authenticated";
GRANT ALL ON TABLE "public"."users_blocked" TO "service_role";



GRANT ALL ON SEQUENCE "public"."users_blocked_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."users_blocked_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."users_blocked_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."users_friends" TO "anon";
GRANT ALL ON TABLE "public"."users_friends" TO "authenticated";
GRANT ALL ON TABLE "public"."users_friends" TO "service_role";



GRANT ALL ON TABLE "public"."users_requests_timeout" TO "anon";
GRANT ALL ON TABLE "public"."users_requests_timeout" TO "authenticated";
GRANT ALL ON TABLE "public"."users_requests_timeout" TO "service_role";



GRANT ALL ON SEQUENCE "public"."users_requests_timeout_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."users_requests_timeout_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."users_requests_timeout_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."users_security" TO "anon";
GRANT ALL ON TABLE "public"."users_security" TO "authenticated";
GRANT ALL ON TABLE "public"."users_security" TO "service_role";



GRANT ALL ON TABLE "public"."users_session" TO "anon";
GRANT ALL ON TABLE "public"."users_session" TO "authenticated";
GRANT ALL ON TABLE "public"."users_session" TO "service_role";



GRANT ALL ON TABLE "public"."users_settings" TO "anon";
GRANT ALL ON TABLE "public"."users_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."users_settings" TO "service_role";



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

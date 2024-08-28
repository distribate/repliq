create sequence "public"."category_id_seq";

create sequence "public"."users_friends_id_seq";

create table "public"."category" (
    "description" text,
    "id" integer not null default nextval('category_id_seq'::regclass),
    "title" text
);


create table "public"."category_threads" (
    "category_id" integer not null,
    "thread_id" text not null
);


create table "public"."posts" (
    "content" text,
    "created_at" timestamp without time zone not null default CURRENT_TIMESTAMP,
    "id" text not null,
    "visibility" text
);


create table "public"."threads" (
    "content" text,
    "created_at" timestamp without time zone not null default CURRENT_TIMESTAMP,
    "description" text,
    "id" text not null,
    "title" text
);


create table "public"."user_session" (
    "expires_at" timestamp without time zone not null,
    "id" text not null,
    "user_id" text not null
);


create table "public"."users" (
    "acceptrules" boolean,
    "birthday" date,
    "created_at" timestamp without time zone not null default CURRENT_TIMESTAMP,
    "description" text,
    "id" text not null,
    "nickname" text not null,
    "status" text,
    "uuid" text not null
);


create table "public"."users_friends" (
    "created_at" timestamp without time zone not null default CURRENT_TIMESTAMP,
    "id" integer not null default nextval('users_friends_id_seq'::regclass),
    "initiator_id" text,
    "recipient_id" text
);


create table "public"."users_settings" (
    "user_id" text not null
);


create table "public"."users_threads" (
    "created_at" timestamp without time zone not null default CURRENT_TIMESTAMP,
    "thread_id" text not null,
    "user_id" text not null
);


alter sequence "public"."category_id_seq" owned by "public"."category"."id";

alter sequence "public"."users_friends_id_seq" owned by "public"."users_friends"."id";


CREATE UNIQUE INDEX category_pkey ON public.category USING btree (id);

CREATE UNIQUE INDEX category_threads_pkey ON public.category_threads USING btree (category_id, thread_id);

CREATE UNIQUE INDEX posts_pkey ON public.posts USING btree (id);

CREATE UNIQUE INDEX threads_pkey ON public.threads USING btree (id);

CREATE UNIQUE INDEX user_session_pkey ON public.user_session USING btree (id);

CREATE UNIQUE INDEX users_friends_pkey ON public.users_friends USING btree (id);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

CREATE UNIQUE INDEX users_settings_pkey ON public.users_settings USING btree (user_id);

CREATE UNIQUE INDEX users_threads_pkey ON public.users_threads USING btree (thread_id, user_id);

CREATE UNIQUE INDEX users_uuid_key ON public.users USING btree (uuid);


alter table "public"."category" add constraint "category_pkey" PRIMARY KEY using index "category_pkey";

alter table "public"."category_threads" add constraint "category_threads_pkey" PRIMARY KEY using index "category_threads_pkey";

alter table "public"."posts" add constraint "posts_pkey" PRIMARY KEY using index "posts_pkey";

alter table "public"."threads" add constraint "threads_pkey" PRIMARY KEY using index "threads_pkey";

alter table "public"."user_session" add constraint "user_session_pkey" PRIMARY KEY using index "user_session_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."users_friends" add constraint "users_friends_pkey" PRIMARY KEY using index "users_friends_pkey";

alter table "public"."users_settings" add constraint "users_settings_pkey" PRIMARY KEY using index "users_settings_pkey";

alter table "public"."users_threads" add constraint "users_threads_pkey" PRIMARY KEY using index "users_threads_pkey";

alter table "public"."category_threads" add constraint "category_threads_category_id_fkey" FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE not valid;

alter table "public"."category_threads" validate constraint "category_threads_category_id_fkey";

alter table "public"."category_threads" add constraint "category_threads_thread_id_fkey" FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE not valid;

alter table "public"."category_threads" validate constraint "category_threads_thread_id_fkey";

alter table "public"."posts" add constraint "posts_visibility_check" CHECK ((visibility = ANY (ARRAY['all'::text, 'only'::text, 'friends'::text]))) not valid;

alter table "public"."posts" validate constraint "posts_visibility_check";

alter table "public"."user_session" add constraint "user_session_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."user_session" validate constraint "user_session_user_id_fkey";

alter table "public"."users" add constraint "users_uuid_key" UNIQUE using index "users_uuid_key";

alter table "public"."users_friends" add constraint "users_friends_initiator_id_fkey" FOREIGN KEY (initiator_id) REFERENCES users(id) ON DELETE SET NULL not valid;

alter table "public"."users_friends" validate constraint "users_friends_initiator_id_fkey";

alter table "public"."users_friends" add constraint "users_friends_recipient_id_fkey" FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE SET NULL not valid;

alter table "public"."users_friends" validate constraint "users_friends_recipient_id_fkey";

alter table "public"."users_settings" add constraint "users_settings_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."users_settings" validate constraint "users_settings_user_id_fkey";

alter table "public"."users_threads" add constraint "users_threads_thread_id_fkey" FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE SET NULL not valid;

alter table "public"."users_threads" validate constraint "users_threads_thread_id_fkey";

alter table "public"."users_threads" add constraint "users_threads_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."users_threads" validate constraint "users_threads_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_and_insert_user(nick text, pass text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.edge_wrapper(database text, table_name text, nickname text, uuid text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions', 'vault'
AS $function$
DECLARE
  api_key TEXT;
  response JSONB;
  edge_function_url TEXT := 'http://127.0.0.1:54321/functions/v1/mysql_wrapper';
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
    SELECT content
    INTO response
    FROM send_post_request(edge_function_url, api_key, post_data);
  EXCEPTION
    WHEN others THEN
      RAISE EXCEPTION 'Error: %', SQLERRM;
  END;

  RETURN response;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.http_post_with_auth(url_address text, post_data text, bearer text)
 RETURNS TABLE(_status text, _content jsonb)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
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
           coalesce(post_data, '') 
        )::http_request);

  IF response.content IS NULL THEN
    RAISE EXCEPTION 'Error: Edge Function returned NULL content. Status: %', response.status;
  END IF;

  RETURN QUERY SELECT response.status, response.content;
END;
$function$
;



grant delete on table "public"."category" to "anon";

grant insert on table "public"."category" to "anon";

grant references on table "public"."category" to "anon";

grant select on table "public"."category" to "anon";

grant trigger on table "public"."category" to "anon";

grant truncate on table "public"."category" to "anon";

grant update on table "public"."category" to "anon";

grant delete on table "public"."category" to "authenticated";

grant insert on table "public"."category" to "authenticated";

grant references on table "public"."category" to "authenticated";

grant select on table "public"."category" to "authenticated";

grant trigger on table "public"."category" to "authenticated";

grant truncate on table "public"."category" to "authenticated";

grant update on table "public"."category" to "authenticated";

grant delete on table "public"."category" to "service_role";

grant insert on table "public"."category" to "service_role";

grant references on table "public"."category" to "service_role";

grant select on table "public"."category" to "service_role";

grant trigger on table "public"."category" to "service_role";

grant truncate on table "public"."category" to "service_role";

grant update on table "public"."category" to "service_role";

grant delete on table "public"."category_threads" to "anon";

grant insert on table "public"."category_threads" to "anon";

grant references on table "public"."category_threads" to "anon";

grant select on table "public"."category_threads" to "anon";

grant trigger on table "public"."category_threads" to "anon";

grant truncate on table "public"."category_threads" to "anon";

grant update on table "public"."category_threads" to "anon";

grant delete on table "public"."category_threads" to "authenticated";

grant insert on table "public"."category_threads" to "authenticated";

grant references on table "public"."category_threads" to "authenticated";

grant select on table "public"."category_threads" to "authenticated";

grant trigger on table "public"."category_threads" to "authenticated";

grant truncate on table "public"."category_threads" to "authenticated";

grant update on table "public"."category_threads" to "authenticated";

grant delete on table "public"."category_threads" to "service_role";

grant insert on table "public"."category_threads" to "service_role";

grant references on table "public"."category_threads" to "service_role";

grant select on table "public"."category_threads" to "service_role";

grant trigger on table "public"."category_threads" to "service_role";

grant truncate on table "public"."category_threads" to "service_role";

grant update on table "public"."category_threads" to "service_role";

grant delete on table "public"."posts" to "anon";

grant insert on table "public"."posts" to "anon";

grant references on table "public"."posts" to "anon";

grant select on table "public"."posts" to "anon";

grant trigger on table "public"."posts" to "anon";

grant truncate on table "public"."posts" to "anon";

grant update on table "public"."posts" to "anon";

grant delete on table "public"."posts" to "authenticated";

grant insert on table "public"."posts" to "authenticated";

grant references on table "public"."posts" to "authenticated";

grant select on table "public"."posts" to "authenticated";

grant trigger on table "public"."posts" to "authenticated";

grant truncate on table "public"."posts" to "authenticated";

grant update on table "public"."posts" to "authenticated";

grant delete on table "public"."posts" to "service_role";

grant insert on table "public"."posts" to "service_role";

grant references on table "public"."posts" to "service_role";

grant select on table "public"."posts" to "service_role";

grant trigger on table "public"."posts" to "service_role";

grant truncate on table "public"."posts" to "service_role";

grant update on table "public"."posts" to "service_role";

grant delete on table "public"."threads" to "anon";

grant insert on table "public"."threads" to "anon";

grant references on table "public"."threads" to "anon";

grant select on table "public"."threads" to "anon";

grant trigger on table "public"."threads" to "anon";

grant truncate on table "public"."threads" to "anon";

grant update on table "public"."threads" to "anon";

grant delete on table "public"."threads" to "authenticated";

grant insert on table "public"."threads" to "authenticated";

grant references on table "public"."threads" to "authenticated";

grant select on table "public"."threads" to "authenticated";

grant trigger on table "public"."threads" to "authenticated";

grant truncate on table "public"."threads" to "authenticated";

grant update on table "public"."threads" to "authenticated";

grant delete on table "public"."threads" to "service_role";

grant insert on table "public"."threads" to "service_role";

grant references on table "public"."threads" to "service_role";

grant select on table "public"."threads" to "service_role";

grant trigger on table "public"."threads" to "service_role";

grant truncate on table "public"."threads" to "service_role";

grant update on table "public"."threads" to "service_role";

grant delete on table "public"."user_session" to "anon";

grant insert on table "public"."user_session" to "anon";

grant references on table "public"."user_session" to "anon";

grant select on table "public"."user_session" to "anon";

grant trigger on table "public"."user_session" to "anon";

grant truncate on table "public"."user_session" to "anon";

grant update on table "public"."user_session" to "anon";

grant delete on table "public"."user_session" to "authenticated";

grant insert on table "public"."user_session" to "authenticated";

grant references on table "public"."user_session" to "authenticated";

grant select on table "public"."user_session" to "authenticated";

grant trigger on table "public"."user_session" to "authenticated";

grant truncate on table "public"."user_session" to "authenticated";

grant update on table "public"."user_session" to "authenticated";

grant delete on table "public"."user_session" to "service_role";

grant insert on table "public"."user_session" to "service_role";

grant references on table "public"."user_session" to "service_role";

grant select on table "public"."user_session" to "service_role";

grant trigger on table "public"."user_session" to "service_role";

grant truncate on table "public"."user_session" to "service_role";

grant update on table "public"."user_session" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";

grant delete on table "public"."users_friends" to "anon";

grant insert on table "public"."users_friends" to "anon";

grant references on table "public"."users_friends" to "anon";

grant select on table "public"."users_friends" to "anon";

grant trigger on table "public"."users_friends" to "anon";

grant truncate on table "public"."users_friends" to "anon";

grant update on table "public"."users_friends" to "anon";

grant delete on table "public"."users_friends" to "authenticated";

grant insert on table "public"."users_friends" to "authenticated";

grant references on table "public"."users_friends" to "authenticated";

grant select on table "public"."users_friends" to "authenticated";

grant trigger on table "public"."users_friends" to "authenticated";

grant truncate on table "public"."users_friends" to "authenticated";

grant update on table "public"."users_friends" to "authenticated";

grant delete on table "public"."users_friends" to "service_role";

grant insert on table "public"."users_friends" to "service_role";

grant references on table "public"."users_friends" to "service_role";

grant select on table "public"."users_friends" to "service_role";

grant trigger on table "public"."users_friends" to "service_role";

grant truncate on table "public"."users_friends" to "service_role";

grant update on table "public"."users_friends" to "service_role";

grant delete on table "public"."users_settings" to "anon";

grant insert on table "public"."users_settings" to "anon";

grant references on table "public"."users_settings" to "anon";

grant select on table "public"."users_settings" to "anon";

grant trigger on table "public"."users_settings" to "anon";

grant truncate on table "public"."users_settings" to "anon";

grant update on table "public"."users_settings" to "anon";

grant delete on table "public"."users_settings" to "authenticated";

grant insert on table "public"."users_settings" to "authenticated";

grant references on table "public"."users_settings" to "authenticated";

grant select on table "public"."users_settings" to "authenticated";

grant trigger on table "public"."users_settings" to "authenticated";

grant truncate on table "public"."users_settings" to "authenticated";

grant update on table "public"."users_settings" to "authenticated";

grant delete on table "public"."users_settings" to "service_role";

grant insert on table "public"."users_settings" to "service_role";

grant references on table "public"."users_settings" to "service_role";

grant select on table "public"."users_settings" to "service_role";

grant trigger on table "public"."users_settings" to "service_role";

grant truncate on table "public"."users_settings" to "service_role";

grant update on table "public"."users_settings" to "service_role";

grant delete on table "public"."users_threads" to "anon";

grant insert on table "public"."users_threads" to "anon";

grant references on table "public"."users_threads" to "anon";

grant select on table "public"."users_threads" to "anon";

grant trigger on table "public"."users_threads" to "anon";

grant truncate on table "public"."users_threads" to "anon";

grant update on table "public"."users_threads" to "anon";

grant delete on table "public"."users_threads" to "authenticated";

grant insert on table "public"."users_threads" to "authenticated";

grant references on table "public"."users_threads" to "authenticated";

grant select on table "public"."users_threads" to "authenticated";

grant trigger on table "public"."users_threads" to "authenticated";

grant truncate on table "public"."users_threads" to "authenticated";

grant update on table "public"."users_threads" to "authenticated";

grant delete on table "public"."users_threads" to "service_role";

grant insert on table "public"."users_threads" to "service_role";

grant references on table "public"."users_threads" to "service_role";

grant select on table "public"."users_threads" to "service_role";

grant trigger on table "public"."users_threads" to "service_role";

grant truncate on table "public"."users_threads" to "service_role";

grant update on table "public"."users_threads" to "service_role";



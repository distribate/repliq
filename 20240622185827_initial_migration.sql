create extension if not exists "http" with schema "extensions";


create table "public"."AUTH" (
    "NICKNAME" character varying(255) not null,
    "LOWERCASENICKNAME" character varying(255) not null,
    "HASH" character varying(255) not null,
    "IP" character varying(255),
    "TOTPTOKEN" character varying(255),
    "REGDATE" bigint,
    "UUID" character varying(255),
    "PREMIUMUUID" character varying(255),
    "LOGINIP" character varying(255),
    "LOGINDATE" bigint,
    "ISSUEDTIME" bigint
);


create table "public"."SOCIAL" (
    "LOWERCASENICKNAME" character varying(255) not null,
    "VK_ID" bigint,
    "TELEGRAM_ID" bigint,
    "DISCORD_ID" bigint,
    "BLOCKED" boolean,
    "TOTP_ENABLED" boolean,
    "NOTIFY_ENABLED" boolean
);


alter table "public"."users" alter column "id" set default gen_random_uuid();

CREATE UNIQUE INDEX "AUTH_pkey" ON public."AUTH" USING btree ("LOWERCASENICKNAME");

CREATE UNIQUE INDEX "SOCIAL_pkey" ON public."SOCIAL" USING btree ("LOWERCASENICKNAME");

alter table "public"."AUTH" add constraint "AUTH_pkey" PRIMARY KEY using index "AUTH_pkey";

alter table "public"."SOCIAL" add constraint "SOCIAL_pkey" PRIMARY KEY using index "SOCIAL_pkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.edge_wrapper(database text, table_name text, nickname text, uuid text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions', 'vault'
AS $function$DECLARE
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
END;$function$
;

CREATE OR REPLACE FUNCTION public.http_post_with_auth(url_address text, post_data text, bearer text)
 RETURNS TABLE(_status text, _content jsonb)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$DECLARE
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
END;$function$
;

grant delete on table "public"."AUTH" to "anon";

grant insert on table "public"."AUTH" to "anon";

grant references on table "public"."AUTH" to "anon";

grant select on table "public"."AUTH" to "anon";

grant trigger on table "public"."AUTH" to "anon";

grant truncate on table "public"."AUTH" to "anon";

grant update on table "public"."AUTH" to "anon";

grant delete on table "public"."AUTH" to "authenticated";

grant insert on table "public"."AUTH" to "authenticated";

grant references on table "public"."AUTH" to "authenticated";

grant select on table "public"."AUTH" to "authenticated";

grant trigger on table "public"."AUTH" to "authenticated";

grant truncate on table "public"."AUTH" to "authenticated";

grant update on table "public"."AUTH" to "authenticated";

grant delete on table "public"."AUTH" to "service_role";

grant insert on table "public"."AUTH" to "service_role";

grant references on table "public"."AUTH" to "service_role";

grant select on table "public"."AUTH" to "service_role";

grant trigger on table "public"."AUTH" to "service_role";

grant truncate on table "public"."AUTH" to "service_role";

grant update on table "public"."AUTH" to "service_role";

grant delete on table "public"."SOCIAL" to "anon";

grant insert on table "public"."SOCIAL" to "anon";

grant references on table "public"."SOCIAL" to "anon";

grant select on table "public"."SOCIAL" to "anon";

grant trigger on table "public"."SOCIAL" to "anon";

grant truncate on table "public"."SOCIAL" to "anon";

grant update on table "public"."SOCIAL" to "anon";

grant delete on table "public"."SOCIAL" to "authenticated";

grant insert on table "public"."SOCIAL" to "authenticated";

grant references on table "public"."SOCIAL" to "authenticated";

grant select on table "public"."SOCIAL" to "authenticated";

grant trigger on table "public"."SOCIAL" to "authenticated";

grant truncate on table "public"."SOCIAL" to "authenticated";

grant update on table "public"."SOCIAL" to "authenticated";

grant delete on table "public"."SOCIAL" to "service_role";

grant insert on table "public"."SOCIAL" to "service_role";

grant references on table "public"."SOCIAL" to "service_role";

grant select on table "public"."SOCIAL" to "service_role";

grant trigger on table "public"."SOCIAL" to "service_role";

grant truncate on table "public"."SOCIAL" to "service_role";

grant update on table "public"."SOCIAL" to "service_role";



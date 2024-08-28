create type "public"."post_visibility" as enum ('all', 'only', 'friends');

alter table "public"."posts" drop constraint "posts_visibility_check";

create table "public"."posts_users" (
    "post_id" uuid not null default gen_random_uuid(),
    "user_nickname" text not null
);


alter table "public"."posts" alter column "id" set default gen_random_uuid();

alter table "public"."posts" alter column "id" set data type uuid using "id"::uuid;

alter table "public"."posts" alter column "visibility" set default 'all'::post_visibility;

alter table "public"."posts" alter column "visibility" set not null;

alter table "public"."posts" alter column "visibility" set data type post_visibility using "visibility"::post_visibility;

alter table "public"."users" add column "cover_image" text;

alter table "public"."users" alter column "acceptrules" set default true;

CREATE UNIQUE INDEX posts_users_pkey ON public.posts_users USING btree (post_id);

CREATE UNIQUE INDEX users_nickname_key ON public.users USING btree (nickname);

alter table "public"."posts_users" add constraint "posts_users_pkey" PRIMARY KEY using index "posts_users_pkey";

alter table "public"."posts_users" add constraint "public_posts_users_post_id_fkey" FOREIGN KEY (post_id) REFERENCES posts(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."posts_users" validate constraint "public_posts_users_post_id_fkey";

alter table "public"."posts_users" add constraint "public_posts_users_user_nickname_fkey" FOREIGN KEY (user_nickname) REFERENCES users(nickname) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."posts_users" validate constraint "public_posts_users_user_nickname_fkey";

alter table "public"."users" add constraint "users_nickname_key" UNIQUE using index "users_nickname_key";

grant delete on table "public"."posts_users" to "anon";

grant insert on table "public"."posts_users" to "anon";

grant references on table "public"."posts_users" to "anon";

grant select on table "public"."posts_users" to "anon";

grant trigger on table "public"."posts_users" to "anon";

grant truncate on table "public"."posts_users" to "anon";

grant update on table "public"."posts_users" to "anon";

grant delete on table "public"."posts_users" to "authenticated";

grant insert on table "public"."posts_users" to "authenticated";

grant references on table "public"."posts_users" to "authenticated";

grant select on table "public"."posts_users" to "authenticated";

grant trigger on table "public"."posts_users" to "authenticated";

grant truncate on table "public"."posts_users" to "authenticated";

grant update on table "public"."posts_users" to "authenticated";

grant delete on table "public"."posts_users" to "service_role";

grant insert on table "public"."posts_users" to "service_role";

grant references on table "public"."posts_users" to "service_role";

grant select on table "public"."posts_users" to "service_role";

grant trigger on table "public"."posts_users" to "service_role";

grant truncate on table "public"."posts_users" to "service_role";

grant update on table "public"."posts_users" to "service_role";



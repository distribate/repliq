SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Ubuntu 15.1-1.pgdg20.04+1)
-- Dumped by pg_dump version 15.7 (Ubuntu 15.7-1.pgdg20.04+1)

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

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--

INSERT INTO "pgsodium"."key" ("id", "status", "created", "expires", "key_type", "key_id", "key_context", "name", "associated_data", "raw_key", "raw_key_nonce", "parent_key", "comment", "user_data") VALUES
	('7d6e5d09-426c-4aed-a6e8-03b0ba43b0e1', 'valid', '2024-06-20 22:49:44.80295+00', NULL, 'aead-det', 1, '\x7067736f6469756d', NULL, '', NULL, NULL, NULL, NULL, NULL),
	('c3729e72-a786-4eff-9cc7-e380f57fcf97', 'valid', '2024-06-21 22:16:52.565283+00', NULL, 'aead-det', 2, '\x7067736f6469756d', NULL, '', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: AUTH; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."AUTH" ("NICKNAME", "LOWERCASENICKNAME", "HASH", "IP", "TOTPTOKEN", "REGDATE", "UUID", "PREMIUMUUID", "LOGINIP", "LOGINDATE", "ISSUEDTIME") VALUES
	('pureawake', 'pureawake', '$2a$10$w9TxhJ2oNDrYGEsHoHLyOuFSt7c5v2HnvB6jlWGQbxByMNUEfqsCS', '', '', 1718971371558, 'a6570be9-f25f-3767-bd09-6588cac34cdb', '', '127.0.0.1', 1719011751146, 1718971371658),
	('discludness', 'discludness', '$2a$10$UZvSj3o43iIom/pD3Za.5uJ22tJQ53Yp/jWj6Mh1P9Hlsb2Kix.YW', '', '', 1719011985850, '5744cd36-94bd-3e2f-9c97-aa564b146417', '', '127.0.0.1', 1719011985963, 1719011985950),
	('george_wastaken', 'george_wastaken', '$2a$10$kLoqV7OroOPD40IXYWr0V.XiY4goBk/w4zvk1Eork3.KGRSE2LGNa', '', '', 1719656230968, '71fe71d1-0161-32cd-8b57-a76486d69aee', '', '127.0.0.1', 1719656231085, 1719656231070),
	('Ded____Inside', 'ded____inside', '$2a$10$yDHRmU8Ro2hv5yGmeXEBH.r7JMP23KAvvl01kmdKc9DkvLC.tRONu', '', '', 1720034051747, 'e9a7380d-c788-3da9-99ef-f896405d4135', '', '127.0.0.1', 1720034051848, 1720034051835),
	('kendrick', 'kendrick', '$2a$10$NmsKxbUOI2dk2KgU4mIbqOn7SBCXk31BdVZseuYpXjXUTIp9F30rS', '', '', 1724859627495, 'a0799d91-0bb2-33d1-8115-792747b934c8', '', '127.0.0.1', 1724859627631, 1724859627592),
	('borbuse', 'borbuse', '$2a$10$vxApHUdFZ9aAk33YpeEpieVDwn/5a2sTxSFICnkD0AE0pIuGBjuKi', '', '', 1724859772261, '45d682c0-526e-3a95-8fb2-ec2e9c16ab90', '', '127.0.0.1', 1724859772381, 1724859772337),
	('ferngazer', 'ferngazer', '$2a$10$.b7LoMk0R.W1UWHNVDMyku5KmONDiAHn5SYR2kw.0q0rDtla2rl5S', '', '', 1724859835068, '40a5257a-9ed8-31b8-9239-5f316881aafa', '', '127.0.0.1', 1724859835176, 1724859835136),
	('distribate', 'distribate', '$2a$10$ODh1Xd35xIypPiss/URPxOfnaC2wkRN3gB9yp5uwx0vy89bKwBqdG', '127.0.0.1', '', 1729013782548, 'c1686a0f-5f76-3694-84d7-c40ba8bf8174', '', '127.0.0.1', 1729013782702, 1729013782648);


--
-- Data for Name: SOCIAL; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: config_minecraft_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."config_minecraft_items" ("id", "image", "title", "description") VALUES
	(1, 'items/allay_spawn_egg.webp', 'Эллей', NULL),
	(13, 'items/missing_texture.webp', 'Ошибка', NULL),
	(11, 'items/iron_helmet.webp', 'Железный шлем', NULL),
	(10, 'items/firework.webp', 'Фейерверк', NULL),
	(9, 'items/fancy_feather.webp', 'Перо', NULL),
	(8, 'items/elytra.webp', 'Элитры', NULL),
	(7, 'items/dirt.webp', 'Земля', NULL),
	(6, 'items/diamond_pickaxe.webp', 'Алмазная кирка', NULL),
	(5, 'items/bust_painting.webp', 'Картина', NULL),
	(4, 'items/belkoin_wallet.png', 'Белкоин', NULL),
	(3, 'items/barrier.webp', 'Барьер', NULL),
	(2, 'items/arrow_of_swiftness.webp', 'Стрела', NULL),
	(12, 'items/minecart_chest.webp', 'Сундук', 'Сундучок'),
	(19, 'items/minecraft-item-iyO', 'Око', '');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users" ("acceptrules", "birthday", "cover_image", "created_at", "description", "id", "name_color", "nickname", "preferences", "real_name", "status", "uuid", "visibility", "favorite_item") VALUES
	(true, NULL, NULL, '2024-08-28 15:46:21.066781+00', NULL, '45d2de08-a28a-482f-9c0a-3d0ef166aa8f', '#ffffff', 'ferngazer', '{"coverOutline": "false", "friendRequest": "true", "realNameVisibility": "true", "gameStatsVisibility": "true"}', NULL, NULL, '40a5257a-9ed8-31b8-9239-5f316881aafa', 'all', NULL),
	(true, NULL, 'default/render-warden-hide.jpg', '2024-08-28 15:47:23.653119+00', 'шмебьюлок', 'e0e2fb96-9de7-430b-80df-59398a20b95d', '#ffffff', 'kendrick', '{"coverOutline": "false", "friendRequest": "true", "realNameVisibility": "true", "gameStatsVisibility": "true"}', NULL, NULL, 'a0799d91-0bb2-33d1-8115-792747b934c8', 'all', NULL),
	(true, NULL, 'default/sand-camel.jpg', '2024-08-28 15:44:43.14115+00', NULL, '73c4acab-b1ab-430b-bc42-d6da78ab1092', '#ffffff', 'borbuse', '{"coverOutline": "false", "friendRequest": "true", "realNameVisibility": "true", "gameStatsVisibility": "true"}', NULL, NULL, '45d682c0-526e-3a95-8fb2-ec2e9c16ab90', 'all', NULL),
	(true, NULL, 'default/adventure-in-end.jpg', '2024-06-22 21:07:32.429882+00', 'My Flaws Burn Through My Skin Like Demonic Flames from Hell', 'd905f002-1370-44c6-bef3-885063b5332f', '#F2DEF2', 'pureawake', '{"coverOutline": "false", "friendRequest": "true", "realNameVisibility": "true", "gameStatsVisibility": "true"}', 'Руся', NULL, 'a6570be9-f25f-3767-bd09-6588cac34cdb', 'friends', 8),
	(true, NULL, 'default/adventure-in-blossom.jpg', '2024-06-22 18:29:11.063752+00', 'Я полежу и встану Для начала, хотя бы на колени', 'c2e8de6f-a450-4ca0-ba50-828bedb053ba', '#ffffff', 'discludness', '{"coverOutline": "false", "friendRequest": "true", "realNameVisibility": "true", "gameStatsVisibility": "true"}', 'Мария', NULL, '5744cd36-94bd-3e2f-9c97-aa564b146417', 'friends', NULL),
	(true, NULL, NULL, '2024-08-25 23:10:56.949548+00', 'Привет', 'c2508ed9-c992-4eb3-98a6-e149d01c4b2a', '#ffffff', 'george_wastaken', '{"coverOutline": "false", "friendRequest": "true", "realNameVisibility": "true", "gameStatsVisibility": "true"}', 'Владислав', NULL, '71fe71d1-0161-32cd-8b57-a76486d69aee', 'friends', NULL),
	(true, NULL, 'cover/ffbc7e08-1838-4d80-8931-713168de7c20Y0T', '2024-10-15 17:37:04.629915+00', NULL, 'ffbc7e08-1838-4d80-8931-713168de7c20', '#0CE4A3', 'distribate', '{"coverOutline": "true", "friendRequest": "true", "realNameVisibility": "false", "gameStatsVisibility": "false"}', 'Руся', NULL, 'c1686a0f-5f76-3694-84d7-c40ba8bf8174', 'all', 1);


--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."admins" ("user_id", "created_at", "id") VALUES
	('ffbc7e08-1838-4d80-8931-713168de7c20', '2024-10-22 14:10:40.535018+00', 1);


--
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."category" ("available", "description", "id", "title") VALUES
	(true, '', 1, 'Идеи и предложения'),
	(true, NULL, 2, 'Сообщество'),
	(true, NULL, 3, 'Жалобы'),
	(true, NULL, 4, 'Помощь'),
	(true, NULL, 5, 'Гайды');


--
-- Data for Name: threads; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."threads" ("id", "title", "created_at", "updated_at", "visibility", "description", "comments", "auto_remove", "content", "permission") VALUES
	('dbf53dcf-add8-425d-883a-d71ece170515', 'Монахов заворкал', '2024-11-02 22:34:50.57391+00', NULL, 'all', NULL, true, false, '[{"type": "paragraph", "children": [{"text": "Егор Монахов, амбициозный молодой веб-разработчик, начинал свой путь с простых веб-страниц и заголовков, созданных в блокноте. Его мечта была стать мастером адаптивной и стильной вёрстки. Однажды он услышал о Русе Белкине — мастере своего дела, который творил чудеса с помощью HTML и TailwindCSS. Русь был известен в небольших кругах как тот, кто мог преобразить обычный макет в шедевр минимализма и функциональности."}]}, {"type": "paragraph", "children": [{"text": ""}]}, {"type": "paragraph", "children": [{"text": "Егор записался на курс к Руси, где обучение было не только информативным, но и практичным. Белкин заставлял своих учеников каждый день кодить до тех пор, пока их пальцы не начнут бегать по клавиатуре так же естественно, как у музыканта по клавишам пианино. Русь показывал, как можно использовать утилитарные классы TailwindCSS для создания анимаций, адаптивных сеток и сложных компонентов без лишних стилей и путаницы в CSS."}]}, {"type": "paragraph", "children": [{"text": ""}]}, {"type": "paragraph", "children": [{"text": "Дни и ночи проходили за практикой. Егор научился создавать сложные макеты и понимать, что за каждым классом в TailwindCSS кроется целый мир возможностей. Его работы становились всё лучше, и в один день пришёл момент истины."}]}, {"type": "paragraph", "children": [{"text": ""}]}, {"type": "paragraph", "children": [{"text": "Однажды утром Егор получил сообщение в Telegram: \"Нужна срочная вёрстка лендинга для крупного стартапа. Сроки — вчера. Подробности — вечером\". Сердце Егора заколотилось быстрее. Это был его первый серьёзный заказ! Он понимал, что вся его работа под руководством Руси Белкина вела к этому моменту."}]}, {"type": "paragraph", "children": [{"text": ""}]}, {"type": "paragraph", "children": [{"text": "Егор открыл макет. Страницы пестрели сложными блоками, анимациями и адаптивностью, которая должна была работать на любом устройстве. Однако его не испугали детали. С уверенной улыбкой он приступил к работе, используя свои навыки, отточенные месяцами практики."}]}, {"type": "paragraph", "children": [{"text": ""}]}, {"type": "paragraph", "children": [{"text": "Каждый элемент был вёрстан с учётом производительности, каждая анимация была плавной благодаря возможностям TailwindCSS. Егор применил подходы, которые он перенял у Руси, включая семантику HTML и понимание UX."}]}, {"type": "paragraph", "children": [{"text": ""}]}, {"type": "paragraph", "children": [{"text": "Через несколько дней работы без сна, с бесконечными кружками кофе и напоминаниями от Руси Белкина, что качество превыше всего, лендинг был готов. Когда Егор отправил проект заказчику, ответ пришёл немедленно: \"Это именно то, что мы искали! Спасибо за такую качественную и быструю работу\"."}]}, {"type": "paragraph", "children": [{"text": ""}]}, {"type": "paragraph", "children": [{"text": "Этот проект стал для Егора первым большим шагом в профессиональной карьере. Он понял, что время, проведённое за обучением и практика под руководством Руси Белкина, было бесценным и дало ему уверенность и мастерство, о котором он мечтал."}]}]', false),
	('764d84f2-4610-4208-b12f-cc98b510802b', 'ТРЕД СВЕТЛОЛИКАГО', '2024-10-28 21:12:58.904832+00', NULL, 'all', 'dasdasdasdasdasdasd', true, false, '[{"type": "paragraph", "children": [{"text": "asdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasd"}]}]', false),
	('db2f82ca-e82f-4861-a750-c303b007ed65', 'ТРЕД ДЕЛОРИАНА', '2024-10-28 21:20:30.753753+00', NULL, 'all', '', false, false, '[{"type": "paragraph", "children": [{"text": "ДЕЛОРИАН ДЕЛОРИАН ТЕЛЕГРАММ АККАУУНТ КРУМАН"}]}]', false),
	('a006faae-0dde-483a-af8e-d66fef569467', 'МОНАХОВ ДАУН ЗНАЛИ??', '2024-10-31 06:18:13.78922+00', NULL, 'all', 'Описание первого тестовго треда', true, false, '[{"type": "paragraph", "children": [{"text": "Монахов, ти где? Я тут фывфывфывфывфывфыв"}]}]', false),
	('75a961d6-4166-45e5-9a43-642e4dcb54f1', 'тест тред форматинг', '2024-10-30 19:17:34.721328+00', NULL, 'all', 'Описание треда крутое очень да да да ', true, false, '[{"type": "paragraph", "children": [{"bold": true, "text": "Привет, я абоба"}]}, {"type": "paragraph", "children": [{"bold": true, "text": ""}]}, {"type": "code", "children": [{"text": "также абоба"}]}, {"type": "paragraph", "children": [{"text": ""}]}, {"type": "paragraph", "children": [{"text": "ахахфыхахфыах"}]}, {"type": "paragraph", "children": [{"text": ""}]}, {"type": "paragraph", "children": [{"text": "подчеркнуто", "underline": true}]}, {"type": "paragraph", "children": [{"text": "", "underline": true}]}, {"type": "paragraph", "children": [{"text": "италик", "italic": true}]}]', false),
	('a867a362-8b75-4c36-9e57-1a32efcf49ba', 'Вид на город', '2024-10-29 00:46:08.063786+00', NULL, 'all', '', true, false, '[{"type": "paragraph", "children": [{"text": "Вид на какой-то город. "}, {"bold": true, "text": "Очень атмосферно!"}]}]', false),
	('7e7586b2-ebc3-44ba-8721-022029a9a9bb', 'чипсики и депозит', '2024-10-31 21:12:25.329562+00', NULL, 'all', NULL, true, false, '[{"type": "paragraph", "children": [{"text": "закупился на хаях чипсики купил хихихихи"}]}]', false);


--
-- Data for Name: category_threads; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."category_threads" ("category_id", "thread_id") VALUES
	(3, '764d84f2-4610-4208-b12f-cc98b510802b'),
	(3, 'db2f82ca-e82f-4861-a750-c303b007ed65'),
	(2, 'a867a362-8b75-4c36-9e57-1a32efcf49ba'),
	(2, '75a961d6-4166-45e5-9a43-642e4dcb54f1'),
	(3, 'a006faae-0dde-483a-af8e-d66fef569467'),
	(2, '7e7586b2-ebc3-44ba-8721-022029a9a9bb'),
	(2, 'dbf53dcf-add8-425d-883a-d71ece170515');


--
-- Data for Name: config_advertisement; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: config_alerts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."config_alerts" ("created_at", "id", "link", "title", "creator", "description") VALUES
	('2024-10-25 00:51:38.564951+00', 14, 'https://t.me/fasberry', 'Вступайте в телеграмм-канал!', 'distribate', 'В телеграмм-канале много чего интересного');


--
-- Data for Name: config_minecraft_facts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."config_minecraft_facts" ("fact", "id") VALUES
	('Изначально Крипер не был мобом — он появился в результате ошибки при создании свиньи. Позже ему изменили текстуру и добавили способность взрываться.', 1),
	('У снежного голема есть лицо за маской из тыквы.', 2),
	('С шансом в 0.01% в главном меню вместо большой надписи "Minecraft" появится название с ошибкой "Minceraft".', 3),
	('Язык Странников Края (Эндермэнов) — английский задом наперед.', 4),
	('Верстак в мире Minecraft можно использовать как компас — на северной его части всегда будет текстура с пилой и молотком, независимо от положения игрока в момент установки блока.', 5),
	('Все коровы в Minecraft — женского пола, так как все дают молоко.', 6),
	('Свинью можно превратить в свинозомби, если по ней ударит молния.', 7),
	('А если ударить молнией в Крипера, то он станет заряженным. Сила и радиус взрыва будут увеличены.', 8),
	('В Странника Края невозможно попасть стрелой из лука, снежком или яйцом. На него также нельзя уронить наковальню.', 9),
	('Однако если выстрелить в него стрелой с эффектом, то, хоть стрела не попадёт в моба, он всё равно получит её эффект.', 10),
	('Сундук невозможно поджечь или сдвинуть поршнем.', 11),
	('Попавший в паутину Ифрит не может стрелять. Также ему можно нанести урон снежками.', 12),
	('Спавн Слизней зависит от фазы луны — больше всего их будет в полнолуние, а в новолуние спавн Слизней приостановлен.', 13),
	('Иероглифы в столе зачарования — не спонтанно нарисованные буквы, а настоящий шифр, имеющий смысл.', 14),
	('Криперы хоть и не имеют рук, но всё равно способны подниматься по лестницам.', 15),
	('Есть заблуждение, что обсидиан невозможно сломать рукой. Это не правда — на его уничтожение в таком случае уйдёт 4 минуты и 10 секунд. Однако сломав его, он не выпадет, так как добывать его, соответственно, можно только алмазной киркой.', 16),
	('Никогда не спите в Нижнем Мире. При взаимодействии с кроватью, она взорвётся и вы получите урон.', 17),
	('В самых ранних версиях игры со скелетов с небольшим шансом мог выпасть колчан. Он позволял стрелять из лука, не тратя стрелы. Данный предмет вскоре удалили, и добавили зачарование "Бесконечность" с тем же эффектом.', 18),
	('Кактус в доме можно использовать вместо мусорного ведра — когда выпавший предмет касается его, он пропадает.', 19),
	('Переименовав моба с помощью бирки, используя имена "Grumm" или "Dinnerbone", вы перевернёте игровую модель данного моба.', 20),
	('Если вы переименуете большого или среднего слизня, то, убив его, более мелкие слизни также сохранят имя, данное "предку".', 21),
	('Самое интересное про бирки: если переименуете овцу в "jeb_", то она станет переливаться радужным цветом. Jeb_ — ник одного из разработчиков игры.', 22),
	('Немного о разработчиках: Notch и Jeb_ (Маркус Перссон и Йенс Бергенстен, соответственно) были включены в 100 самых влиятельных людей планеты 2013 года по версии журнала "Time".', 23),
	('Концептом для чёрно-белой кошки в Minecraft служила настоящая кошка Йенса — Ньютон.', 24),
	('Самые маленькие мобы в игре — детёныш черепахи, чешуйница Края и летучая мышь.', 25),
	('Если умереть в битве с Гастом, или быть в его поле зрения во время смерти, то он всё равно будет в вас стрелять, пока вы не возродитесь.', 26),
	('Надев на голову тыкву, вы спокойно можете смотреть на Странников Края — они не будут вас атаковать.', 27),
	('Обычно с скелетов лук в правой руке, однако с шансом в 5% он может появится в левой.', 28),
	('На Хэллоуин (31 октября) зомби и скелеты могут появится с тыквой или светильником Джека на голове.', 29),
	('А на 24-25 декабря сундуки приобретают праздничный рождественский вид.', 30),
	('Если курица/свинья/корова/овца будут убиты, будучи подожжёными, то мясо, выпавшее с них, будет сразу пожареным.', 31),
	('Скелет-наездник заспавнится на пауке с шансом 1%.', 32),
	('Любые пауки неуязвимы к зелью отравления.', 33),
	('Пещерные пауки появляются только рядом со спавнером.', 34),
	('Ведьма не может сгореть в лаве или утонуть в воде.', 35),
	('Странник Края получают урон от воды. Более того, им можно нанести урон с помощью пузырька с водой.', 36),
	('Изначально зелья должны были вариться в котлах, по позже способ их создания заменили на варочную стойку.', 37),
	('Железный голем может подарить жителям или детям цветок. Это отслыка к аниме "Небесный Замок Лапута".', 38),
	('Железный голем, наряду с Разорителем, — третий моб в игре по количеству здоровья (100 HP). На первом месте Иссушитель (300 HP), а на втором Дракон Края (200 HP).', 39),
	('Снежками можно отталкивать огненные шары Гастов.', 40),
	('Зомби-жителя можно вылечить, если кинуть в него зелье слабости и нажать ПКМ золотым яблоком.', 41),
	('Если поставить ковёр сверху забора, то вы сможете перепрыгнуть такую конструкцию, а вот мобы — нет.', 42),
	('Есть возможность изменить цвет луча маяка. Достаточно поставить блок стекла того цвета, которым вы хотите окрасить луч.', 43),
	('Когда вы находите Портал в Край, то некоторые Очи Края уже буду установлены в рамку. Суть: есть шанс один к триллиону, что все рамки будут заполнены и Портал будет сразу же активированным.', 44),
	('Держа в руках краситель и нажав ПКМ по табличке, вы сможете изменить цвет надписи.', 45),
	('Если песок, гравий или яйцо Дракона упадут на факел, то они выпадут как предмет и их можно будет подобрать.', 46),
	('Лук при максимальном натяжении может сломать лодку и вагонетку', 47),
	('Молоко убирает эффекты яда и зелий', 48),
	('Если песок душ разместить поверх льда, он будет замедлять еще сильнее', 49),
	('Если стрелять через лаву, то стрелы будут наносить еще и повреждения от огня', 50),
	('Тыква на голове отпугивает эндерменов (они не нападают, даже если смотреть прямо на них)', 51),
	('Яйцо дракона можно получить, сдвинув его поршнем', 52),
	('Слизни всегда прыгают только по прямой линии и не могут плавать', 53),
	('Взрыв ТНТ убирает лаву', 54),
	('Если нажать на грибную корову правой кнопкой с зажатой в руке миской, то вы получите тушеные грибы', 55),
	('Если под падающим блоком гравия или песка находится факел, то блоки гравия или песка разрушатся при падении', 56),
	('В дождь рыба ловится лучше', 57),
	('Если предмет бросить в текущую по льду воду, то он поплывет невероятно быстро', 58),
	('Нажимные плиты преграждают распространение воды и лавы', 59),
	('Через сундуки и таблички нельзя увидеть имя игрока', 60),
	('Если эндермена убивает железный голем, то всегда выпадает жемчужина', 61),
	('Рыбу можно ловить и под водой', 62),
	('Адский забор и обычный не соединяются', 63),
	('Обсидиан и админиум нельзя сдвинуть поршнями', 64),
	('Здоровье не восстанавливается, если шкала еды меньше 79%', 65),
	('С помощью кактуса можно уничтожить предмет', 68),
	('Дождь с небольшим шансом заполняет котел', 69),
	('Если около крипера паутина, то отсчет времени до взрыва длится дольше', 70),
	('Во время роста саженцы уничтожают стекло на своем пути', 71),
	('Днем и в полностью освещенной комнате пауки дружелюбны, если на них не напасть', 72),
	('Если поджечь корову или свинью, с них выпадет жареное мясо', 73),
	('Лавовый куб не получает повреждений от падений', 74),
	('Некоторое время назад спрута можно было подоить', 75),
	('Взрыв ТНТ уничтожает 70% предметов вокруг', 76),
	('У яйца есть шанс равный 1/256 одновременно наспавнить четырех куриц', 77),
	('Вагонеткой можно управлять, как машиной, если в вагонетке сидит оседланная свинья, а вы на ней', 78),
	('Таблички, заборы, лестницы, ворота и люки преграждают путь воде по горизонтали и вертикали', 79),
	('Вода и лава текут к ближайшему углублению', 80),
	('На свинозомби не действует лава и огонь', 81),
	('Если кинуть яйцо в спокойного паука, то он все равно останется нейтральным', 82),
	('Во время грозы можно спать, даже если на дворе день', 83),
	('Волки не нападают на криперов', 84),
	('Если криперы и скелеты не в состоянии нападения, они не видят игрока через стекло', 66),
	('В Эндермена невозможно попасть стрелой, яйцом или снежком', 85),
	('Изначально губка обладала способностью впитывать всю жидкость в радиусе 2 блоков. Теперь это просто декорация', 86),
	('Если днем паук упадет и получит повреждение от падения или уколется об кактус, то он снова станет нейтральным', 87),
	('Полублоки не обрывают цепь рэдстоуна', 88),
	('Для того, чтобы разбить обсидиан рукой, нужно 4 минуты и 10 секунд', 89),
	('Если зомби и скелеты стоят на песке душ, то утром они не сгорят', 90),
	('Если под деревянной нажимной плитой находится огонь, то ее можно активировать стрелой', 91),
	('Огненному шару можно нанести критический удар', 92),
	('Съев паучий глаз, вы отравитесь', 93),
	('В отличие от маленьких слизней, маленькие лавовые кубы наносят повреждения игроку', 94),
	('Если огромный слизень сидит в вагонетке, то вагонетку не видно, и толкнуть ее можно только другой вагонеткой', 95),
	('Звуки, которые издает гаст, принадлежат кошке C418', 96),
	('Сундук можно открыть, если над ним расположен другой сундук или не цельный блок (ступени, полублоки, стекло, заборы и т.д.)', 97);


--
-- Data for Name: users_friends; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users_friends" ("id", "user_1", "user_2", "created_at") VALUES
	('b94dbf6b-1347-43eb-9543-95912bbb5643', 'discludness', 'pureawake', '2024-08-28 14:36:38.228442+00'),
	('21c69ada-24f9-4245-9ccd-b7430db18f5a', 'kendrick', 'pureawake', '2024-08-28 17:17:25.618714+00'),
	('498c6997-6165-48bd-b1d0-94bd55d3509b', 'kendrick', 'borbuse', '2024-08-28 17:20:42.654173+00'),
	('3f65586c-e15a-4577-acb2-e26ee7af7f97', 'kendrick', 'discludness', '2024-09-04 21:20:55.97048+00');


--
-- Data for Name: friends_notes; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: friends_pinned; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."friends_pinned" ("id", "created_at", "initiator", "recipient", "friend_id") VALUES
	('b499b798-ca64-426e-8ccd-f051dd2638ab', '2024-09-10 22:18:36.384216+00', 'discludness', 'pureawake', 'b94dbf6b-1347-43eb-9543-95912bbb5643');


--
-- Data for Name: friends_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."friends_requests" ("created_at", "initiator", "recipient", "id") VALUES
	('2024-08-28 17:16:59.76032+00', 'kendrick', 'ferngazer', '04994e24-6ed0-47e7-b588-2184167bdcde');


--
-- Data for Name: info_findout; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."info_findout" ("id", "findout", "user_nickname") VALUES
	(2, 'телеграм', 'george_wastaken'),
	(7, 'от абобы', 'borbuse'),
	(8, 'от абобы', 'ferngazer'),
	(9, 'от абобы', 'kendrick'),
	(10, 'я владелец', 'distribate');


--
-- Data for Name: luckperms_actions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: luckperms_group_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."luckperms_group_permissions" ("id", "name", "permission", "value", "server", "world", "expiry", "contexts") VALUES
	(1, 'default', 'ia.user.craft.*', true, 'global', 'global', 0, '{}'),
	(2, 'default', 'chatcontrol.channel.join.global.read', true, 'global', 'global', 0, '{}'),
	(3, 'default', 'lands.role.setting.block_ignite', false, 'global', 'global', 0, '{}'),
	(4, 'default', 'lands.role.setting.interact_trapdoor', true, 'global', 'global', 0, '{}'),
	(5, 'default', 'cmi.command.afk', true, 'global', 'global', 0, '{}'),
	(6, 'default', 'cmi.command.tpdeny', true, 'global', 'global', 0, '{}'),
	(7, 'default', 'zauctionhouse.history', true, 'global', 'global', 0, '{}'),
	(8, 'default', 'jobs.world.bisquiteworld', true, 'global', 'global', 0, '{}'),
	(9, 'default', 'lands.allies.*', false, 'global', 'global', 0, '{}'),
	(10, 'default', 'cmi.command.homes', true, 'global', 'global', 0, '{}'),
	(11, 'default', 'playerparticles.fixed.max.3', true, 'global', 'global', 0, '{}'),
	(12, 'default', 'weight.1', true, 'global', 'global', 0, '{}'),
	(13, 'default', 'cmi.command.top', true, 'global', 'global', 0, '{}'),
	(14, 'default', 'zauctionhouse.max.10', true, 'global', 'global', 0, '{}'),
	(15, 'default', 'lands.role.setting.setting_edit_taxes', true, 'global', 'global', 0, '{}'),
	(16, 'default', 'bukkit.command.paper.dumpplugins', false, 'global', 'global', 0, '{}'),
	(17, 'default', 'ia.user.craft.recipe.astral', true, 'global', 'global', 0, '{}'),
	(18, 'default', 'chatcontrol.channel.join.chat', true, 'global', 'global', 0, '{}'),
	(19, 'default', 'cmi.command.options', true, 'global', 'global', 0, '{}'),
	(20, 'default', 'ia.user.image.sign', true, 'global', 'global', 0, '{}'),
	(21, 'default', 'cmi.command.options.totembossbar', true, 'global', 'global', 0, '{}'),
	(22, 'default', 'cmi.command.rt', true, 'global', 'global', 0, '{}'),
	(23, 'default', 'lands.roles.18', true, 'global', 'global', 0, '{}'),
	(24, 'default', 'ia.user.recipe.recipe', true, 'global', 'global', 0, '{}'),
	(25, 'default', 'lands.role.setting.attack_player', true, 'global', 'global', 0, '{}'),
	(26, 'default', 'lands.areas.16', true, 'global', 'global', 0, '{}'),
	(27, 'default', 'recipe.adamantite.pickaxe', true, 'global', 'global', 0, '{}'),
	(28, 'default', 'cmi.command.afk.auto', true, 'global', 'global', 0, '{}'),
	(29, 'default', 'cmi.command.flyc', true, 'global', 'global', 0, '{}'),
	(30, 'default', 'ia.user.iaemote', true, 'global', 'global', 0, '{}'),
	(31, 'default', 'prefix.1.:player: ', true, 'global', 'global', 0, '{}'),
	(32, 'default', 'lands.role.setting.attack_monster', true, 'global', 'global', 0, '{}'),
	(33, 'default', 'lands.enemies', false, 'global', 'global', 0, '{}'),
	(34, 'default', 'cmi.command.tpa', true, 'global', 'global', 0, '{}'),
	(35, 'default', 'chatcontrol.command.spy', true, 'global', 'global', 0, '{}'),
	(36, 'default', 'ecopets.command.activate', true, 'global', 'global', 0, '{}'),
	(37, 'default', 'chatcontrol.command.toggle', true, 'global', 'global', 0, '{}'),
	(38, 'default', 'lands.allies', false, 'global', 'global', 0, '{}'),
	(39, 'default', 'zauctionhouse_max_5', true, 'global', 'global', 0, '{}'),
	(40, 'default', 'ia.user.iarecipe', true, 'global', 'global', 0, '{}'),
	(41, 'default', 'reputation.max.default', true, 'global', 'global', 0, '{}'),
	(42, 'default', 'lands.setting.snow_melt', true, 'global', 'global', 0, '{}'),
	(43, 'default', 'adapt.opengui', false, 'global', 'global', 0, '{}'),
	(44, 'default', 'ia.user.block', true, 'global', 'global', 0, '{}'),
	(45, 'default', 'lands.setting.monster_spawn', false, 'global', 'global', 0, '{}'),
	(46, 'default', 'lands.role.setting.setting_edit_various', true, 'global', 'global', 0, '{}'),
	(47, 'default', 'recipe.platinum.pickaxe', true, 'global', 'global', 0, '{}'),
	(48, 'default', 'lands.command.*', true, 'global', 'global', 0, '{}'),
	(49, 'default', 'bukkit.command.plugins', false, 'global', 'global', 0, '{}'),
	(50, 'default', 'chatcontrol.channel.join.global.write', true, 'global', 'global', 0, '{}'),
	(51, 'default', 'cmi.command.removehome', true, 'global', 'global', 0, '{}'),
	(52, 'default', 'mcpets.use', true, 'global', 'global', 0, '{}'),
	(53, 'default', 'cmi.command.sethome', true, 'global', 'global', 0, '{}'),
	(54, 'default', 'chatcontrol.command.tell', true, 'global', 'global', 0, '{}'),
	(55, 'default', 'chatcontrol.receive', true, 'global', 'global', 0, '{}'),
	(56, 'default', 'lands.role.setting.area_assign', true, 'global', 'global', 0, '{}'),
	(57, 'default', 'cmi.command.prewards', true, 'global', 'global', 0, '{}'),
	(58, 'default', 'cmi.command.rankup', false, 'global', 'global', 0, '{}'),
	(59, 'default', 'displayname.player', true, 'global', 'global', 0, '{}'),
	(60, 'default', 'mv.bypass.gamemode.BisquiteWorld', true, 'global', 'global', 0, '{}'),
	(61, 'default', 'ia.user.craft.recipe.adamantite.pickaxe', true, 'global', 'global', 0, '{}'),
	(62, 'default', 'cmi.command.enchant', true, 'global', 'global', 0, '{}'),
	(63, 'default', 'jobs.max.1', true, 'global', 'global', 0, '{}'),
	(64, 'default', 'cmi.command.money', true, 'global', 'global', 0, '{}'),
	(65, 'default', 'pet.rename', true, 'global', 'global', 0, '{}'),
	(66, 'default', 'playerparticles.fixed.clear', true, 'global', 'global', 0, '{}'),
	(67, 'default', 'lands.role.setting.block_place', true, 'global', 'global', 0, '{}'),
	(68, 'default', 'lands.role.setting.harvest', true, 'global', 'global', 0, '{}'),
	(69, 'default', 'lands.role.setting.interact_mechanism', true, 'global', 'global', 0, '{}'),
	(70, 'default', 'cmi.command.dback', true, 'global', 'global', 0, '{}'),
	(71, 'default', 'cmi.command.sethome.1', true, 'global', 'global', 0, '{}'),
	(72, 'default', 'cmi.command.msg', true, 'global', 'global', 0, '{}'),
	(73, 'default', 'lands.enemies.10', false, 'global', 'global', 0, '{}'),
	(74, 'default', 'cmi.kit.start', true, 'global', 'global', 0, '{}'),
	(75, 'default', 'scoreboard.default', true, 'global', 'global', 0, '{}'),
	(76, 'default', 'lands.role.setting.player_untrust', true, 'global', 'global', 0, '{}'),
	(77, 'default', 'lands.role.setting.block_break', true, 'global', 'global', 0, '{}'),
	(78, 'default', 'lands.chunks.250', true, 'global', 'global', 0, '{}'),
	(79, 'default', 'command.alert.info.inform', true, 'global', 'global', 0, '{}'),
	(80, 'default', 'lands.role.setting.plant', true, 'global', 'global', 0, '{}'),
	(81, 'default', 'playerparticles.gui', false, 'global', 'global', 0, '{}'),
	(82, 'default', 'lands.role.setting.land_claim', true, 'global', 'global', 0, '{}'),
	(83, 'default', 'cmi.command.afk.kickOutIn.1200', true, 'global', 'global', 0, '{}'),
	(84, 'default', 'cmi.command.options.acceptingpm', true, 'global', 'global', 0, '{}'),
	(85, 'default', 'zauctionhouse.sell', true, 'global', 'global', 0, '{}'),
	(86, 'default', 'chatcontrol.command.toggle.on', true, 'global', 'global', 0, '{}'),
	(87, 'default', 'pet.rename.color', true, 'global', 'global', 0, '{}'),
	(88, 'default', 'imageframe.rename', true, 'global', 'global', 0, '{}'),
	(89, 'default', 'cmi.command.options.pvedamagenumbers', true, 'global', 'global', 0, '{}'),
	(90, 'default', 'mv.bypass.gamemode.BisquiteWorld_nether', true, 'global', 'global', 0, '{}'),
	(91, 'default', 'lands.player.setting.receive_invites', true, 'global', 'global', 0, '{}'),
	(92, 'default', 'lands.role.setting.spawn_set', true, 'global', 'global', 0, '{}'),
	(93, 'default', 'cmi.command.tps', false, 'global', 'global', 0, '{}'),
	(94, 'default', 'lumberjack.use', true, 'global', 'global', 0, '{}'),
	(95, 'default', 'lands.role.setting.spawn_teleport', true, 'global', 'global', 0, '{}'),
	(96, 'default', 'ia.user.image.gui', true, 'global', 'global', 0, '{}'),
	(97, 'default', 'lands.role.setting.player_ban', true, 'global', 'global', 0, '{}'),
	(98, 'default', 'ia.user.recipe.recipe.adamantite.pickaxe', true, 'global', 'global', 0, '{}'),
	(99, 'default', 'lands.role.setting.land_claim_border', true, 'global', 'global', 0, '{}'),
	(100, 'default', 'lands.role.setting.player_setrole', true, 'global', 'global', 0, '{}'),
	(101, 'default', 'lands.allies.<number>', false, 'global', 'global', 0, '{}'),
	(102, 'default', 'cmi.command.options.chatbubble', true, 'global', 'global', 0, '{}'),
	(103, 'default', 'lands.role.setting.interact_villager', true, 'global', 'global', 0, '{}'),
	(104, 'default', 'ia.user.image.use.*', false, 'global', 'global', 0, '{}'),
	(105, 'default', 'cmi.command.tpaccept', true, 'global', 'global', 0, '{}'),
	(106, 'default', 'chatcontrol.channel.join.standard.write', true, 'global', 'global', 0, '{}'),
	(107, 'default', 'cmi.command.suicide', true, 'global', 'global', 0, '{}'),
	(108, 'default', 'chatcontrol.channel.autojoin.standard.read', true, 'global', 'global', 0, '{}'),
	(109, 'default', 'lands.command.relations', false, 'global', 'global', 0, '{}'),
	(110, 'default', 'lands.role.setting.land_enter', false, 'global', 'global', 0, '{}'),
	(111, 'default', 'lands.player.setting.enter_messages', true, 'global', 'global', 0, '{}'),
	(112, 'default', 'cmi.command.flightcharge', true, 'global', 'global', 0, '{}'),
	(113, 'default', 'lands.role.setting.setting_edit_role', true, 'global', 'global', 0, '{}'),
	(114, 'default', 'lands.role.setting.shear', true, 'global', 'global', 0, '{}'),
	(115, 'default', 'cmi.command.pay', true, 'global', 'global', 0, '{}'),
	(116, 'default', 'lands.role.setting.vehicle_use', true, 'global', 'global', 0, '{}'),
	(117, 'default', 'imageframe.create', true, 'global', 'global', 0, '{}'),
	(118, 'default', 'zauctionhouse.use', true, 'global', 'global', 0, '{}'),
	(119, 'default', 'jobs.world.bisquiteworld_nether', true, 'global', 'global', 0, '{}'),
	(120, 'default', 'cmi.command.spawn', true, 'global', 'global', 0, '{}'),
	(121, 'default', 'ia.user.block.break', true, 'global', 'global', 0, '{}'),
	(122, 'default', 'lands.player.setting.show_inbox', true, 'global', 'global', 0, '{}'),
	(123, 'default', 'ia.user.block.break.null', true, 'global', 'global', 0, '{}'),
	(124, 'default', 'cmi.command.ping', false, 'global', 'global', 0, '{}'),
	(125, 'default', 'lands.setting.entity_griefing', true, 'global', 'global', 0, '{}'),
	(126, 'default', 'lands.role.setting.item_pickup', true, 'global', 'global', 0, '{}'),
	(127, 'default', 'colorbundles.craft', true, 'global', 'global', 0, '{}'),
	(128, 'default', 'ia.user.image.anvil', true, 'global', 'global', 0, '{}'),
	(129, 'default', 'cmi.command.sit', true, 'global', 'global', 0, '{}'),
	(130, 'default', 'lands.setting.animal_spawn', true, 'global', 'global', 0, '{}'),
	(131, 'default', 'recipe.cobalt.pickaxe', true, 'global', 'global', 0, '{}'),
	(132, 'default', 'zauctionhouse.tansaction', true, 'global', 'global', 0, '{}'),
	(133, 'default', 'lands.role.setting.balance_withdraw', true, 'global', 'global', 0, '{}'),
	(134, 'default', 'lands.role.setting.trample_farmland', true, 'global', 'global', 0, '{}'),
	(135, 'default', 'lands.setting.phantom_spawn', false, 'global', 'global', 0, '{}'),
	(136, 'default', 'cmi.command.home', true, 'global', 'global', 0, '{}'),
	(137, 'default', 'lands.members.10', true, 'global', 'global', 0, '{}'),
	(138, 'default', 'ia.user.craft.recipe.astral.pickaxe', true, 'global', 'global', 0, '{}'),
	(139, 'default', 'ia.user.image.hints', true, 'global', 'global', 0, '{}'),
	(140, 'default', 'zauctionhouse.search', true, 'global', 'global', 0, '{}'),
	(141, 'default', 'lands.role.setting.interact_door', true, 'global', 'global', 0, '{}'),
	(142, 'default', 'chatcontrol.channel.autojoin.chat', true, 'global', 'global', 0, '{}'),
	(143, 'default', 'chatcontrol.command.reply', true, 'global', 'global', 0, '{}'),
	(144, 'default', 'playerreport.report', true, 'global', 'global', 0, '{}'),
	(145, 'default', 'playerparticles.particles.max.6', true, 'global', 'global', 0, '{}'),
	(146, 'default', 'lands.role.setting.attack_animal', true, 'global', 'global', 0, '{}'),
	(147, 'default', 'chatcontrol.command.ignore', true, 'global', 'global', 0, '{}'),
	(148, 'default', 'lands.areas.24', true, 'global', 'global', 0, '{}'),
	(149, 'default', 'cmi.command.helpop', false, 'global', 'global', 0, '{}'),
	(150, 'default', 'cmi.permisiononerror', false, 'global', 'global', 0, '{}'),
	(151, 'default', 'tab.scoreboard.toggle', true, 'global', 'global', 0, '{}'),
	(152, 'default', 'lands.role.setting.interact_container', true, 'global', 'global', 0, '{}'),
	(153, 'default', 'lands.setting.piston_griefing', true, 'global', 'global', 0, '{}'),
	(154, 'default', 'cmi.command.t', false, 'global', 'global', 0, '{}'),
	(155, 'default', 'lands.role.setting.land_rename', true, 'global', 'global', 0, '{}'),
	(156, 'default', 'lands.role.setting.player_trust', true, 'global', 'global', 0, '{}'),
	(157, 'default', 'imageframe.create.animated', true, 'global', 'global', 0, '{}'),
	(158, 'default', 'lands.role.setting.setting_edit_land', true, 'global', 'global', 0, '{}'),
	(159, 'default', 'lands.setting.plant_growth', true, 'global', 'global', 0, '{}'),
	(160, 'default', 'mv.bypass.gamemode.BisquiteWorld_the_end', true, 'global', 'global', 0, '{}'),
	(161, 'default', 'lands.setting.fire_spread', true, 'global', 'global', 0, '{}'),
	(162, 'default', 'lands.ownlands.2', true, 'global', 'global', 0, '{}'),
	(163, 'default', 'pet.particle', true, 'global', 'global', 0, '{}'),
	(164, 'default', 'mv.bypass.gamemode.Offenburg', true, 'global', 'global', 0, '{}'),
	(165, 'default', 'playerparticles.particles.max.3', true, 'global', 'global', 0, '{}'),
	(166, 'default', 'ia.user.block.place.*', true, 'global', 'global', 0, '{}'),
	(167, 'default', 'ecopets.command.deactivate', true, 'global', 'global', 0, '{}'),
	(168, 'default', 'ia.user.image.book', true, 'global', 'global', 0, '{}'),
	(169, 'default', 'playerparticles.fixed', true, 'global', 'global', 0, '{}'),
	(170, 'default', 'cmi.command.me', false, 'global', 'global', 0, '{}'),
	(171, 'default', 'ticketmanager.command.create', true, 'global', 'global', 0, '{}'),
	(172, 'default', 'lands.role.setting.fly', true, 'global', 'global', 0, '{}'),
	(173, 'default', 'cmi.command.baltop', false, 'global', 'global', 0, '{}'),
	(174, 'default', 'lands.setting.leaf_decay', true, 'global', 'global', 0, '{}'),
	(175, 'default', 'zauctionhouse.open', true, 'global', 'global', 0, '{}'),
	(176, 'default', 'lands.role.setting.interact_general', true, 'global', 'global', 0, '{}'),
	(177, 'default', 'pet.remove', true, 'global', 'global', 0, '{}'),
	(178, 'default', 'pet.command', false, 'global', 'global', 0, '{}'),
	(179, 'default', 'chatcontrol.channel.autojoin.global.read', true, 'global', 'global', 0, '{}'),
	(180, 'default', 'lands.role.setting.elytra', false, 'global', 'global', 0, '{}'),
	(181, 'default', 'imageframe.info', true, 'global', 'global', 0, '{}'),
	(182, 'default', 'chatcontrol.command.toggle.off', true, 'global', 'global', 0, '{}'),
	(183, 'default', 'pet.trail', true, 'global', 'global', 0, '{}'),
	(184, 'default', 'ia.user.image.chat', true, 'global', 'global', 0, '{}'),
	(185, 'default', 'imageframe.createlimit.default', true, 'global', 'global', 0, '{}'),
	(186, 'default', 'chatcontrol.channel.send.global', true, 'global', 'global', 0, '{}'),
	(187, 'default', 'lands.free.chunks.4', true, 'global', 'global', 0, '{}'),
	(188, 'default', 'ia.user.image', false, 'global', 'global', 0, '{}'),
	(189, 'default', 'lands.role.setting.ender_pearl', false, 'global', 'global', 0, '{}'),
	(190, 'default', 'reputation.give', true, 'global', 'global', 0, '{}'),
	(191, 'default', 'ia.user.recipe.recipe.astral.pickaxe', true, 'global', 'global', 0, '{}'),
	(192, 'default', 'cmi.command.options.visibleholograms', true, 'global', 'global', 0, '{}'),
	(193, 'default', 'lands.enemies.<number>', false, 'global', 'global', 0, '{}'),
	(194, 'default', 'chatcontrol.channel.join.standard.read', true, 'global', 'global', 0, '{}'),
	(195, 'default', 'recipe.astral.pickaxe', true, 'global', 'global', 0, '{}'),
	(196, 'default', 'chatcontrol.channel.send', true, 'global', 'global', 0, '{}'),
	(197, 'default', 'cmi.command.ranklist', false, 'global', 'global', 0, '{}'),
	(198, 'default', 'jobs.world.bisquiteworld_the_end', true, 'global', 'global', 0, '{}'),
	(199, 'default', 'jobs.world.offenburg', false, 'global', 'global', 0, '{}'),
	(200, 'default', 'lands.chunks.support.5', true, 'global', 'global', 0, '{}'),
	(201, 'default', 'ia.user.recipe.recipe.astral', true, 'global', 'global', 0, '{}'),
	(202, 'default', 'cmi.command.rankinfo', false, 'global', 'global', 0, '{}'),
	(203, 'default', 'pet.use', true, 'global', 'global', 0, '{}'),
	(204, 'default', 'chatcontrol.receive.announcer', true, 'global', 'global', 0, '{}'),
	(205, 'default', 'ia.user.recipe.recipe.adamantite', true, 'global', 'global', 0, '{}'),
	(206, 'default', 'ecopets.command.pets', true, 'global', 'global', 0, '{}'),
	(207, 'default', 'lands.command.chat', false, 'global', 'global', 0, '{}'),
	(208, 'default', 'ecopets.command.ecopets', true, 'global', 'global', 0, '{}'),
	(209, 'default', 'ia.user.block.break.*', true, 'global', 'global', 0, '{}'),
	(210, 'default', 'ia.user.craft.recipe.adamantite', true, 'global', 'global', 0, '{}'),
	(211, 'default', 'lands.lands.4', true, 'global', 'global', 0, '{}'),
	(212, 'default', 'chatcontrol.channel.autojoin.standard.write', true, 'global', 'global', 0, '{}'),
	(213, 'default', 'zauctionhouse.sell.inventory', true, 'global', 'global', 0, '{}'),
	(214, 'default', 'pet.see.*', true, 'global', 'global', 0, '{}'),
	(215, 'dev', 'weight.99', true, 'global', 'global', 0, '{}'),
	(216, 'dev', 'group.default', true, 'global', 'global', 0, '{}'),
	(217, 'moder', 'weight.99', true, 'global', 'global', 0, '{}'),
	(218, 'moder', 'group.default', true, 'global', 'global', 0, '{}'),
	(219, 'moder', 'prefix.99.:moderator: ', true, 'global', 'global', 0, '{}'),
	(220, 'moder', 'group.helper', true, 'global', 'global', 0, '{}'),
	(221, 'loyal', 'cmi.command.itemlore', true, 'global', 'global', 0, '{}'),
	(222, 'loyal', 'group.default', true, 'global', 'global', 0, '{}'),
	(223, 'loyal', 'loyal_reward', true, 'global', 'global', 0, '{}'),
	(224, 'loyal', 'cmi.command.down', true, 'global', 'global', 0, '{}'),
	(225, 'loyal', 'lands.roles.44', true, 'global', 'global', 0, '{}'),
	(226, 'loyal', 'imageframe.createlimit.loyal', true, 'global', 'global', 0, '{}'),
	(227, 'loyal', 'weight.8', true, 'global', 'global', 0, '{}'),
	(228, 'loyal', 'lands.lands.8', true, 'global', 'global', 0, '{}'),
	(229, 'loyal', 'cmi.kit.loyal', true, 'global', 'global', 0, '{}'),
	(230, 'loyal', 'lands.areas.24', true, 'global', 'global', 0, '{}'),
	(231, 'loyal', 'cmi.command.distance', true, 'global', 'global', 0, '{}'),
	(232, 'loyal', 'cmi.command.inv.preventmodify', true, 'global', 'global', 0, '{}'),
	(233, 'loyal', 'group.authentic', true, 'global', 'global', 0, '{}'),
	(234, 'loyal', 'cmi.command.jump', true, 'global', 'global', 0, '{}'),
	(235, 'loyal', 'jobs.boost.all.money.1.25', true, 'global', 'global', 0, '{}'),
	(236, 'loyal', 'lands.ownlands.6', true, 'global', 'global', 0, '{}'),
	(237, 'loyal', 'cmi.command.heal', true, 'global', 'global', 0, '{}'),
	(238, 'loyal', 'adapt.boost', true, 'global', 'global', 0, '{}'),
	(239, 'loyal', 'lands.chunks.420', true, 'global', 'global', 0, '{}'),
	(240, 'loyal', 'jobs.max.3', true, 'global', 'global', 0, '{}'),
	(241, 'loyal', 'prefix.8.:loyal: ', true, 'global', 'global', 0, '{}'),
	(242, 'loyal', 'cmi.command.inv', true, 'global', 'global', 0, '{}'),
	(243, 'loyal', 'cmi.command.jump.6', true, 'global', 'global', 0, '{}'),
	(244, 'loyal', 'cmi.command.sethome.3', true, 'global', 'global', 0, '{}'),
	(245, 'loyal', 'zauctionhouse_max_15', true, 'global', 'global', 0, '{}'),
	(246, 'loyal', 'cmi.command.itemname', true, 'global', 'global', 0, '{}'),
	(247, 'loyal', 'lands.members.18', true, 'global', 'global', 0, '{}'),
	(248, 'authentic', 'lands.role.setting.ender_pearl', true, 'global', 'global', 0, '{}'),
	(249, 'authentic', 'group.default', true, 'global', 'global', 0, '{}'),
	(251, 'authentic', 'lands.role.setting.block_ignite', true, 'global', 'global', 0, '{}'),
	(250, 'arkhont', 'lands.roles.66', true, 'global', 'global', 0, '{}'),
	(252, 'authentic', 'prefix.4.:authentic: ', true, 'global', 'global', 0, '{}'),
	(253, 'authentic', 'lands.areas.20', true, 'global', 'global', 0, '{}'),
	(254, 'arkhont', 'cmi.kit.premium', true, 'global', 'global', 0, '{}'),
	(255, 'authentic', 'join.msg.chat', true, 'global', 'global', 0, '{}'),
	(256, 'arkhont', 'mcpet.pet_alchemist', true, 'global', 'global', 0, '{}'),
	(257, 'authentic', 'zauctionhouse_max_10', true, 'global', 'global', 0, '{}'),
	(258, 'arkhont', 'group.default', true, 'global', 'global', 0, '{}'),
	(259, 'authentic', 'lands.roles.34', true, 'global', 'global', 0, '{}'),
	(260, 'arkhont', 'weight.12', true, 'global', 'global', 0, '{}'),
	(261, 'authentic', 'displayname.authentic', true, 'global', 'global', 0, '{}'),
	(262, 'arkhont', 'mcpet.nocsy_baby_moth', true, 'global', 'global', 0, '{}'),
	(263, 'authentic', 'pv.addon.discs.burn.burnable_check_bypass', true, 'global', 'global', 0, '{}'),
	(264, 'authentic', 'cmi.command.ender', true, 'global', 'global', 0, '{}'),
	(265, 'arkhont', 'prefix.12.:arkhont: ', true, 'global', 'global', 0, '{}'),
	(266, 'authentic', 'authentic_reward', true, 'global', 'global', 0, '{}'),
	(267, 'arkhont', 'lands.areas.30', true, 'global', 'global', 0, '{}'),
	(268, 'authentic', 'jobs.boost.all.money.1.15', true, 'global', 'global', 0, '{}'),
	(269, 'arkhont', 'arkhont_reward', true, 'global', 'global', 0, '{}'),
	(270, 'authentic', 'pv.addon.discs.burn', true, 'global', 'global', 0, '{}'),
	(271, 'arkhont', 'lands.ownlands.10', true, 'global', 'global', 0, '{}'),
	(272, 'authentic', 'quit.msg.chat', true, 'global', 'global', 0, '{}'),
	(273, 'arkhont', 'zauctionhouse_max_20', true, 'global', 'global', 0, '{}'),
	(274, 'authentic', 'lands.setting.phantom_spawn', true, 'global', 'global', 0, '{}'),
	(275, 'arkhont', 'lands.lands.12', true, 'global', 'global', 0, '{}'),
	(276, 'authentic', 'adapt.boost', true, 'global', 'global', 0, '{}'),
	(277, 'arkhont', 'jobs.max.5', true, 'global', 'global', 0, '{}'),
	(278, 'authentic', 'lands.members.14', true, 'global', 'global', 0, '{}'),
	(279, 'arkhont', 'cmi.command.weather', true, 'global', 'global', 0, '{}'),
	(280, 'arkhont', 'jobs.boost.all.money.1.45', true, 'global', 'global', 0, '{}'),
	(281, 'authentic', 'lands.ownlands.4', true, 'global', 'global', 0, '{}'),
	(282, 'arkhont', 'mcpet.pet_beastmaster', true, 'global', 'global', 0, '{}'),
	(283, 'authentic', 'cmi.command.anvil', true, 'global', 'global', 0, '{}'),
	(284, 'arkhont', 'mcpet.pet_mage', true, 'global', 'global', 0, '{}'),
	(285, 'authentic', 'lands.role.setting.elytra', true, 'global', 'global', 0, '{}'),
	(286, 'arkhont', 'pv.addon.discs.burn.burnable_check_bypass', true, 'global', 'global', 0, '{}'),
	(287, 'authentic', 'cmi.command.grindstone', true, 'global', 'global', 0, '{}'),
	(288, 'arkhont', 'group.authentic', true, 'global', 'global', 0, '{}'),
	(289, 'authentic', 'cmi.command.workbench', true, 'global', 'global', 0, '{}'),
	(290, 'arkhont', 'mcpet.nocsy_dodo', true, 'global', 'global', 0, '{}'),
	(291, 'authentic', 'cmi.command.feed', true, 'global', 'global', 0, '{}'),
	(292, 'arkhont', 'pv.addon.discs.burn', true, 'global', 'global', 0, '{}'),
	(293, 'authentic', 'mcpet.capybara_mount', true, 'global', 'global', 0, '{}'),
	(294, 'arkhont', 'adapt.boost', true, 'global', 'global', 0, '{}'),
	(295, 'arkhont', 'imageframe.createlimit.arkont', true, 'global', 'global', 0, '{}'),
	(296, 'authentic', 'lands.setting.monster_spawn', true, 'global', 'global', 0, '{}'),
	(297, 'arkhont', 'mcpet.pet_druid', true, 'global', 'global', 0, '{}'),
	(298, 'authentic', 'jobs.max.2', true, 'global', 'global', 0, '{}'),
	(299, 'arkhont', 'displayname.arkhont', true, 'global', 'global', 0, '{}'),
	(300, 'authentic', 'mcpet.owl', true, 'global', 'global', 0, '{}'),
	(301, 'authentic', 'plhide.group.default', true, 'global', 'global', 0, '{}'),
	(302, 'arkhont', 'mcpet.pet_illusionist', true, 'global', 'global', 0, '{}'),
	(303, 'arkhont', 'jobs.max.4', true, 'global', 'global', 0, '{}'),
	(304, 'authentic', 'cmi.command.loom', true, 'global', 'global', 0, '{}'),
	(305, 'arkhont', 'lands.chunks.540', true, 'global', 'global', 0, '{}'),
	(306, 'authentic', 'imageframe.createlimit.authentic', true, 'global', 'global', 0, '{}'),
	(308, 'authentic', 'cmi.command.sethome.2', true, 'global', 'global', 0, '{}'),
	(307, 'arkhont', 'mcpet.nocsy_moth', true, 'global', 'global', 0, '{}'),
	(309, 'authentic', 'lands.role.setting.land_enter', true, 'global', 'global', 0, '{}'),
	(310, 'arkhont', 'cmi.command.sethome.3', true, 'global', 'global', 0, '{}'),
	(311, 'authentic', 'weight.4', true, 'global', 'global', 0, '{}'),
	(312, 'arkhont', 'cmi.command.sethome.4', true, 'global', 'global', 0, '{}'),
	(313, 'authentic', 'lands.lands.6', true, 'global', 'global', 0, '{}'),
	(314, 'authentic', 'cmi.command.ext', true, 'global', 'global', 0, '{}'),
	(316, 'authentic', 'lands.setting.waterflow_allow', true, 'global', 'global', 0, '{}'),
	(315, 'arkhont', 'mcpet.capybara_mount', true, 'global', 'global', 0, '{}'),
	(317, 'authentic', 'lands.chunks.360', true, 'global', 'global', 0, '{}'),
	(318, 'arkhont', 'mcpet.pet_archmage', true, 'global', 'global', 0, '{}'),
	(319, 'authentic', 'cmi.command.hat', true, 'global', 'global', 0, '{}'),
	(320, 'arkhont', 'mcpet.nocsy_baby_dodo', true, 'global', 'global', 0, '{}'),
	(321, 'arkhont', 'mcpet.owl', true, 'global', 'global', 0, '{}'),
	(322, 'arkhont', 'lands.members.26', true, 'global', 'global', 0, '{}'),
	(323, 'arkhont', 'group.loyal', true, 'global', 'global', 0, '{}'),
	(324, 'helper', 'weight.99', true, 'global', 'global', 0, '{}'),
	(325, 'helper', 'group.default', true, 'global', 'global', 0, '{}'),
	(326, 'helper', 'prefix.99.:helper: ', true, 'global', 'global', 0, '{}');


--
-- Data for Name: luckperms_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."luckperms_groups" ("name") VALUES
	('default'),
	('dev'),
	('moder'),
	('arkhont'),
	('authentic'),
	('loyal'),
	('helper');


--
-- Data for Name: luckperms_players; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."luckperms_players" ("uuid", "username", "primary_group") VALUES
	('f0217e28-01ac-39cb-b842-17ce3a29ae0f', 'onachbiu_bo3pact', 'default'),
	('01653c38-6d59-35ef-91ce-b1244d1ab19b', 'nefallme', 'default'),
	('40153959-e152-356a-988a-e8820d683416', 'cocoji', 'default'),
	('59d15194-eded-33b4-b3b7-3387e43df997', 'avant1garde', 'default'),
	('5744cd36-94bd-3e2f-9c97-aa564b146417', 'discludness', 'default'),
	('41e81a49-fa86-31ce-bb71-ea7959e7660e', 'aurastepp', 'default'),
	('a0799d91-0bb2-33d1-8115-792747b934c8', 'kendrick', 'default'),
	('a4a7d6d4-8c1b-3635-b55b-017af6c9eeb7', 'ded__inside', 'default'),
	('c8d7300b-87e2-3a5e-bd3f-6e0905e475e8', 'ruslbeats', 'default'),
	('690870aa-cd03-369c-ad98-2bccdd8fdfa3', 'mainar', 'default'),
	('40a5257a-9ed8-31b8-9239-5f316881aafa', 'ferngazer', 'default'),
	('e3ee3b2d-f744-3807-b123-722aa50b27b9', 'goosebumps', 'default'),
	('5a69f1f7-624e-3878-bcb6-895d6e7e2e16', 'gluckoz', 'default'),
	('0c143502-0556-34ad-9880-4e56203d6816', 'cynep_kotleta', 'default'),
	('1bca077d-5a2a-380a-ba51-fa1e18bd96f6', 'rokema_v2', 'default'),
	('65b3419d-efb6-36bf-9b6b-05333d8fd8ea', '0rist9sh', 'default'),
	('b29a1654-898e-3eee-8063-3fbbbdf39df8', 'ezraika', 'default'),
	('d8263562-2eb8-3d4e-8b3e-7f2198b41bae', 'kyddiekafka', 'default'),
	('a6570be9-f25f-3767-bd09-6588cac34cdb', 'pureawake', 'arkhont'),
	('71fe71d1-0161-32cd-8b57-a76486d69aee', 'george_wastaken', 'default'),
	('0e303495-341d-3999-bd9b-2245f39cc0e6', 'mongoose', 'default'),
	('45d682c0-526e-3a95-8fb2-ec2e9c16ab90', 'borbuse', 'default'),
	('c1686a0f-5f76-3694-84d7-c40ba8bf8174', 'distribate', 'authentic');


--
-- Data for Name: luckperms_tracks; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: luckperms_user_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."luckperms_user_permissions" ("id", "uuid", "permission", "value", "server", "world", "expiry", "contexts") VALUES
	(1, 'f0217e28-01ac-39cb-b842-17ce3a29ae0f', 'group.default', true, 'global', 'global', 0, '{}'),
	(7, '41e81a49-fa86-31ce-bb71-ea7959e7660e', 'group.default', true, 'global', 'global', 0, '{}'),
	(8, '40153959-e152-356a-988a-e8820d683416', 'group.default', true, 'global', 'global', 0, '{}'),
	(6, '5744cd36-94bd-3e2f-9c97-aa564b146417', 'group.default', true, 'global', 'global', 0, '{}'),
	(9, '41e81a49-fa86-31ce-bb71-ea7959e7660e', 'collection.poster.12', true, 'global', 'global', 0, '{}'),
	(10, 'f0217e28-01ac-39cb-b842-17ce3a29ae0f', 'collection.poster.1', true, 'global', 'global', 0, '{}'),
	(11, '40153959-e152-356a-988a-e8820d683416', 'collection.poster.6', true, 'global', 'global', 0, '{}'),
	(12, '5744cd36-94bd-3e2f-9c97-aa564b146417', 'collection.poster.1', true, 'global', 'global', 0, '{}'),
	(13, '41e81a49-fa86-31ce-bb71-ea7959e7660e', 'collection.poster.1', true, 'global', 'global', 0, '{}'),
	(14, '40153959-e152-356a-988a-e8820d683416', 'collection.poster.7', true, 'global', 'global', 0, '{}'),
	(15, '5744cd36-94bd-3e2f-9c97-aa564b146417', 'collection.poster.3', true, 'global', 'global', 0, '{}'),
	(16, '40153959-e152-356a-988a-e8820d683416', 'collection.poster.9', true, 'global', 'global', 0, '{}'),
	(17, '41e81a49-fa86-31ce-bb71-ea7959e7660e', 'collection.poster.14', true, 'global', 'global', 0, '{}'),
	(18, '40153959-e152-356a-988a-e8820d683416', 'collection.poster.8', true, 'global', 'global', 0, '{}'),
	(19, '5744cd36-94bd-3e2f-9c97-aa564b146417', 'collection.poster.4', true, 'global', 'global', 0, '{}'),
	(20, '41e81a49-fa86-31ce-bb71-ea7959e7660e', 'mcpet.nocsy_baby_leopard', true, 'global', 'global', 0, '{}'),
	(21, '40153959-e152-356a-988a-e8820d683416', 'group.authentic', true, 'global', 'global', 0, '{}'),
	(22, '5744cd36-94bd-3e2f-9c97-aa564b146417', 'group.authentic', true, 'global', 'global', 0, '{}'),
	(23, '41e81a49-fa86-31ce-bb71-ea7959e7660e', 'collection.poster.7', true, 'global', 'global', 0, '{}'),
	(39, '40a5257a-9ed8-31b8-9239-5f316881aafa', 'group.default', true, 'global', 'global', 0, '{}'),
	(40, '40a5257a-9ed8-31b8-9239-5f316881aafa', 'pet.use.axolotl', true, 'global', 'global', 0, '{}'),
	(41, '40a5257a-9ed8-31b8-9239-5f316881aafa', 'recipe.ice.helmet', true, 'global', 'global', 0, '{}'),
	(43, '40a5257a-9ed8-31b8-9239-5f316881aafa', 'pet.use.dog', true, 'global', 'global', 0, '{}'),
	(44, '40a5257a-9ed8-31b8-9239-5f316881aafa', 'pet.use.cat', true, 'global', 'global', 0, '{}'),
	(45, '40a5257a-9ed8-31b8-9239-5f316881aafa', 'collection.poster.4', true, 'global', 'global', 0, '{}'),
	(46, '40a5257a-9ed8-31b8-9239-5f316881aafa', 'recipe.ice.chestplate', true, 'global', 'global', 0, '{}'),
	(47, '5a69f1f7-624e-3878-bcb6-895d6e7e2e16', 'group.default', true, 'global', 'global', 0, '{}'),
	(48, '5a69f1f7-624e-3878-bcb6-895d6e7e2e16', 'collection.poster.14', true, 'global', 'global', 0, '{}'),
	(49, '5a69f1f7-624e-3878-bcb6-895d6e7e2e16', 'pet.use.dog', true, 'global', 'global', 0, '{}'),
	(50, '5a69f1f7-624e-3878-bcb6-895d6e7e2e16', 'pet.use.cat', true, 'global', 'global', 0, '{}'),
	(59, 'c8d7300b-87e2-3a5e-bd3f-6e0905e475e8', 'group.default', true, 'global', 'global', 0, '{}'),
	(60, 'c8d7300b-87e2-3a5e-bd3f-6e0905e475e8', 'group.arkhont', true, 'global', 'global', 0, '{}'),
	(61, 'c8d7300b-87e2-3a5e-bd3f-6e0905e475e8', 'collection.poster.8', true, 'global', 'global', 0, '{}'),
	(62, 'c8d7300b-87e2-3a5e-bd3f-6e0905e475e8', 'collection.poster.13', true, 'global', 'global', 0, '{}'),
	(63, 'c8d7300b-87e2-3a5e-bd3f-6e0905e475e8', 'mcpet.capybara_mount', true, 'global', 'global', 0, '{}'),
	(64, 'c8d7300b-87e2-3a5e-bd3f-6e0905e475e8', 'collection.poster.1', true, 'global', 'global', 0, '{}'),
	(65, 'c8d7300b-87e2-3a5e-bd3f-6e0905e475e8', 'collection.poster.11', true, 'global', 'global', 0, '{}'),
	(66, 'c8d7300b-87e2-3a5e-bd3f-6e0905e475e8', 'collection.poster.14', true, 'global', 'global', 0, '{}'),
	(67, 'c8d7300b-87e2-3a5e-bd3f-6e0905e475e8', 'collection.poster.6', true, 'global', 'global', 0, '{}'),
	(68, 'c8d7300b-87e2-3a5e-bd3f-6e0905e475e8', 'collection.poster.5', true, 'global', 'global', 0, '{}'),
	(69, 'c8d7300b-87e2-3a5e-bd3f-6e0905e475e8', 'collection.poster.9', true, 'global', 'global', 0, '{}'),
	(70, 'c8d7300b-87e2-3a5e-bd3f-6e0905e475e8', 'collection.poster.4', true, 'global', 'global', 0, '{}'),
	(71, 'c8d7300b-87e2-3a5e-bd3f-6e0905e475e8', 'collection.poster.10', true, 'global', 'global', 0, '{}'),
	(111, '65b3419d-efb6-36bf-9b6b-05333d8fd8ea', 'group.default', true, 'global', 'global', 0, '{}'),
	(112, '65b3419d-efb6-36bf-9b6b-05333d8fd8ea', 'collection.poster.1', true, 'global', 'global', 0, '{}'),
	(115, 'b29a1654-898e-3eee-8063-3fbbbdf39df8', 'group.default', true, 'global', 'global', 0, '{}'),
	(121, 'b29a1654-898e-3eee-8063-3fbbbdf39df8', 'pet.use.dog', true, 'global', 'global', 0, '{}'),
	(122, 'b29a1654-898e-3eee-8063-3fbbbdf39df8', 'pet.use.cat', true, 'global', 'global', 0, '{}'),
	(5, '59d15194-eded-33b4-b3b7-3387e43df997', 'group.default', true, 'global', 'global', 0, '{}'),
	(25, '59d15194-eded-33b4-b3b7-3387e43df997', 'pet.use.cat', true, 'global', 'global', 0, '{}'),
	(84, 'a6570be9-f25f-3767-bd09-6588cac34cdb', 'group.default', true, 'global', 'global', 0, '{}'),
	(85, 'a6570be9-f25f-3767-bd09-6588cac34cdb', 'pet.use.lgbt', true, 'global', 'global', 0, '{}'),
	(86, 'a6570be9-f25f-3767-bd09-6588cac34cdb', 'pv.addon.discs.erase', true, 'global', 'global', 0, '{}'),
	(87, 'a6570be9-f25f-3767-bd09-6588cac34cdb', 'pet.use.clyde', true, 'global', 'global', 0, '{}'),
	(88, 'a6570be9-f25f-3767-bd09-6588cac34cdb', 'collection.poster.12', true, 'global', 'global', 0, '{}'),
	(89, 'a6570be9-f25f-3767-bd09-6588cac34cdb', 'join.msg.chat', true, 'global', 'global', 0, '{}'),
	(90, 'a6570be9-f25f-3767-bd09-6588cac34cdb', 'collection.poster.1', true, 'global', 'global', 0, '{}'),
	(91, 'a6570be9-f25f-3767-bd09-6588cac34cdb', 'collection.poster.9', true, 'global', 'global', 0, '{}'),
	(92, 'a6570be9-f25f-3767-bd09-6588cac34cdb', 'meta.lp-editor-key.G8t4xgj/7aRJrjZ+1n8tbJ8ez6U=', true, 'global', 'global', 0, '{}'),
	(93, 'a6570be9-f25f-3767-bd09-6588cac34cdb', 'pet.use.surpisedvillager', true, 'global', 'global', 0, '{}'),
	(94, 'a6570be9-f25f-3767-bd09-6588cac34cdb', 'pet.use.pepsi', true, 'global', 'global', 0, '{}'),
	(95, 'a6570be9-f25f-3767-bd09-6588cac34cdb', 'pv.addon.discs.burn', true, 'global', 'global', 0, '{}'),
	(96, 'a6570be9-f25f-3767-bd09-6588cac34cdb', 'quit.msg.chat', true, 'global', 'global', 0, '{}'),
	(97, 'a6570be9-f25f-3767-bd09-6588cac34cdb', 'pet.use.duolingo', true, 'global', 'global', 0, '{}'),
	(98, 'a6570be9-f25f-3767-bd09-6588cac34cdb', 'pet.use.gardendworf', true, 'global', 'global', 0, '{}'),
	(99, 'a6570be9-f25f-3767-bd09-6588cac34cdb', 'collection.poster.3', true, 'global', 'global', 0, '{}'),
	(100, 'a6570be9-f25f-3767-bd09-6588cac34cdb', 'collection.poster.7', true, 'global', 'global', 0, '{}'),
	(101, 'a6570be9-f25f-3767-bd09-6588cac34cdb', 'You', true, 'because', 'attack', 0, '{"server":["can''''t","he''''s","in","player,","this","wilderness"]}'),
	(102, 'a6570be9-f25f-3767-bd09-6588cac34cdb', 'collection.poster.8', true, 'global', 'global', 0, '{}'),
	(103, 'a6570be9-f25f-3767-bd09-6588cac34cdb', 'collection.poster.2', true, 'global', 'global', 0, '{}'),
	(104, 'a6570be9-f25f-3767-bd09-6588cac34cdb', 'settings.automsg.chat', true, 'global', 'global', 0, '{}'),
	(105, 'a6570be9-f25f-3767-bd09-6588cac34cdb', 'collection.poster.13', true, 'global', 'global', 0, '{}'),
	(106, 'a6570be9-f25f-3767-bd09-6588cac34cdb', 'mcpet.capybara_mount', true, 'global', 'global', 0, '{}'),
	(107, 'a6570be9-f25f-3767-bd09-6588cac34cdb', 'collection.poster.6', true, 'global', 'global', 0, '{}'),
	(108, 'a6570be9-f25f-3767-bd09-6588cac34cdb', 'lands.player.setting.enter_messages', true, 'global', 'global', 0, '{}'),
	(109, 'a6570be9-f25f-3767-bd09-6588cac34cdb', 'collection.poster.4', true, 'global', 'global', 0, '{}'),
	(110, 'a6570be9-f25f-3767-bd09-6588cac34cdb', 'pet.use.orc', true, 'global', 'global', 0, '{}'),
	(4, '01653c38-6d59-35ef-91ce-b1244d1ab19b', 'group.default', true, 'global', 'global', 0, '{}'),
	(28, '01653c38-6d59-35ef-91ce-b1244d1ab19b', 'collection.poster.1', true, 'global', 'global', 0, '{}'),
	(74, '1bca077d-5a2a-380a-ba51-fa1e18bd96f6', 'group.default', true, 'global', 'global', 0, '{}'),
	(75, '1bca077d-5a2a-380a-ba51-fa1e18bd96f6', 'pet.use.aquarium', true, 'global', 'global', 0, '{}'),
	(76, '1bca077d-5a2a-380a-ba51-fa1e18bd96f6', 'collection.poster.13', true, 'global', 'global', 0, '{}'),
	(77, '1bca077d-5a2a-380a-ba51-fa1e18bd96f6', 'collection.poster.1', true, 'global', 'global', 0, '{}'),
	(78, '1bca077d-5a2a-380a-ba51-fa1e18bd96f6', 'collection.poster.11', true, 'global', 'global', 0, '{}'),
	(79, '1bca077d-5a2a-380a-ba51-fa1e18bd96f6', 'collection.poster.6', true, 'global', 'global', 0, '{}'),
	(80, '1bca077d-5a2a-380a-ba51-fa1e18bd96f6', 'pet.use.cat', true, 'global', 'global', 0, '{}'),
	(81, '1bca077d-5a2a-380a-ba51-fa1e18bd96f6', 'collection.poster.5', true, 'global', 'global', 0, '{}'),
	(82, '1bca077d-5a2a-380a-ba51-fa1e18bd96f6', 'collection.poster.7', true, 'global', 'global', 0, '{}'),
	(83, '1bca077d-5a2a-380a-ba51-fa1e18bd96f6', 'collection.poster.4', true, 'global', 'global', 0, '{}'),
	(3, 'a4a7d6d4-8c1b-3635-b55b-017af6c9eeb7', 'group.default', true, 'global', 'global', 0, '{}'),
	(30, 'a4a7d6d4-8c1b-3635-b55b-017af6c9eeb7', 'pet.use.dog', true, 'global', 'global', 0, '{}'),
	(32, 'a4a7d6d4-8c1b-3635-b55b-017af6c9eeb7', 'pet.use.cat', true, 'global', 'global', 0, '{}'),
	(34, 'a4a7d6d4-8c1b-3635-b55b-017af6c9eeb7', 'collection.poster.3', true, 'global', 'global', 0, '{}'),
	(35, 'a4a7d6d4-8c1b-3635-b55b-017af6c9eeb7', 'collection.poster.8', true, 'global', 'global', 0, '{}'),
	(36, 'a4a7d6d4-8c1b-3635-b55b-017af6c9eeb7', 'collection.poster.10', true, 'global', 'global', 0, '{}'),
	(37, 'a4a7d6d4-8c1b-3635-b55b-017af6c9eeb7', 'collection.poster.2', true, 'global', 'global', 0, '{}'),
	(38, '690870aa-cd03-369c-ad98-2bccdd8fdfa3', 'group.default', true, 'global', 'global', 0, '{}'),
	(42, '690870aa-cd03-369c-ad98-2bccdd8fdfa3', 'collection.poster.3', true, 'global', 'global', 0, '{}'),
	(113, 'd8263562-2eb8-3d4e-8b3e-7f2198b41bae', 'group.default', true, 'global', 'global', 0, '{}'),
	(114, 'd8263562-2eb8-3d4e-8b3e-7f2198b41bae', 'collection.poster.12', true, 'global', 'global', 0, '{}'),
	(116, 'd8263562-2eb8-3d4e-8b3e-7f2198b41bae', 'collection.poster.1', true, 'global', 'global', 0, '{}'),
	(117, 'd8263562-2eb8-3d4e-8b3e-7f2198b41bae', 'collection.poster.11', true, 'global', 'global', 0, '{}'),
	(118, 'd8263562-2eb8-3d4e-8b3e-7f2198b41bae', 'collection.poster.9', true, 'global', 'global', 0, '{}'),
	(119, 'd8263562-2eb8-3d4e-8b3e-7f2198b41bae', 'group.authentic', true, 'global', 'global', 0, '{}'),
	(120, 'd8263562-2eb8-3d4e-8b3e-7f2198b41bae', 'collection.poster.2', true, 'global', 'global', 0, '{}'),
	(51, 'e3ee3b2d-f744-3807-b123-722aa50b27b9', 'group.default', true, 'global', 'global', 0, '{}'),
	(52, 'e3ee3b2d-f744-3807-b123-722aa50b27b9', 'collection.poster.14', true, 'global', 'global', 0, '{}'),
	(53, 'e3ee3b2d-f744-3807-b123-722aa50b27b9', 'collection.poster.6', true, 'global', 'global', 0, '{}'),
	(54, 'e3ee3b2d-f744-3807-b123-722aa50b27b9', 'collection.poster.3', true, 'global', 'global', 0, '{}'),
	(55, 'e3ee3b2d-f744-3807-b123-722aa50b27b9', 'collection.poster.7', true, 'global', 'global', 0, '{}'),
	(56, 'e3ee3b2d-f744-3807-b123-722aa50b27b9', 'collection.poster.8', true, 'global', 'global', 0, '{}'),
	(57, 'e3ee3b2d-f744-3807-b123-722aa50b27b9', 'collection.poster.10', true, 'global', 'global', 0, '{}'),
	(58, 'e3ee3b2d-f744-3807-b123-722aa50b27b9', 'collection.poster.2', true, 'global', 'global', 0, '{}'),
	(2, 'a0799d91-0bb2-33d1-8115-792747b934c8', 'group.default', true, 'global', 'global', 0, '{}'),
	(24, 'a0799d91-0bb2-33d1-8115-792747b934c8', 'pet.use.dog', true, 'global', 'global', 0, '{}'),
	(26, 'a0799d91-0bb2-33d1-8115-792747b934c8', 'pet.use.cat', true, 'global', 'global', 0, '{}'),
	(27, 'a0799d91-0bb2-33d1-8115-792747b934c8', 'collection.poster.4', true, 'global', 'global', 0, '{}'),
	(29, 'a0799d91-0bb2-33d1-8115-792747b934c8', 'pet.use.suprisedvillager', true, 'global', 'global', 0, '{}'),
	(31, 'a0799d91-0bb2-33d1-8115-792747b934c8', 'collection.poster.10', true, 'global', 'global', 0, '{}'),
	(33, 'a0799d91-0bb2-33d1-8115-792747b934c8', 'collection.poster.2', true, 'global', 'global', 0, '{}'),
	(72, '0c143502-0556-34ad-9880-4e56203d6816', 'group.default', true, 'global', 'global', 0, '{}'),
	(73, '0c143502-0556-34ad-9880-4e56203d6816', 'pet.use.dog', true, 'global', 'global', 0, '{}');


--
-- Data for Name: moderators; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."posts" ("comments", "content", "created_at", "post_id", "visibility") VALUES
	(true, 'Сегодня был отличный день! Прогулялся по парку, наслаждался солнечной погодой и встретил старых друзей. Жизнь прекрасна, когда окружен хорошими людьми. 💖', '2024-06-29 10:57:50.493599+00', 'a36aa1b6-bbab-426b-8b3e-2c56ee0ecf78', 'all'),
	(true, '🎮 Всем привет! Недавно нашёл в Minecraft новое эпическое подземелье! 🌌 Это просто невероятно! Готовьтесь к приключению и собирайте ресурсы! ⚒️ Сталкивался с новыми, очень сильными мобами, но награды стоят того! 💎 Советую брать с собой больше факелов и зелий, чтобы выжить. 🏰 Кстати, кто уже исследовал это подземелье? Делитесь своими находками и стратегиями! 🚀 Давайте вместе разгадаем все тайны этого места! #Minecraft #Приключения #Подземелье', '2024-06-29 10:57:50.493599+00', 'd2a2fd1c-ca8a-4b0a-9793-d448e8bc2682', 'all'),
	(true, 'ПОЛНАЯ АБОБА 🤣🤣🤣🤣', '2024-06-28 10:57:50+00', 'a3b4a325-c6b8-46b0-9f28-ecc77471b926', 'friends'),
	(true, 'uwu 👣', '2024-07-01 11:28:04.306058+00', 'dabf5a2a-b9cf-4b7f-a4cb-30b00065497b', 'only'),
	(true, 'седня жиденько покакал', '2024-06-29 17:23:57.249775+00', 'd62d6377-d383-421d-90cb-839a2777861d', 'all'),
	(true, 'А зачем какать? Скажите парни', '2024-07-01 11:40:11.187736+00', '39bd527b-17ec-4866-8bf6-2db02177acd3', 'friends'),
	(true, '🎮 Привет, искатели приключений! 🌍 Сегодня нашёл новое подземелье в Minecraft, и это что-то с чем-то! ⚔️ Оно просто огромное и полное опасностей! Сначала пришлось сразиться с кучей скелетов и зомби, а потом ещё и пауки налетели. 😱 Но самое интересное началось, когда нашёл сокровищницу с редкими ресурсами и зачарованным оружием! 💎 Не забудьте взять с собой побольше факелов и зелий исцеления, они там очень пригодятся. 🏰 В центре подземелья есть сложная головоломка, которую мы с друзьями еле-еле разгадали. 🔍 Кто уже проходил это подземелье? Поделитесь своими советами и лайфхаками! Очень интересно, что у кого получилось найти! 🌟 В общем, настоятельно рекомендую всем исследовать это место. Удачи вам и много удачных находок! #Minecraft #Подземелье #Приключения #Исследование #Сокровища', '2024-06-29 20:57:50+00', 'c05b6ee8-a7f4-42e4-8e20-e3920a487525', 'only'),
	(true, 'ахахх', '2024-07-01 17:32:24.717443+00', '2db918c7-ba45-42bc-94ef-4bbf56c8ebbb', 'all'),
	(true, 'ПЕРВЫЙ ПОСТ!', '2024-07-03 17:05:05.169706+00', 'da69df33-b0a5-4e06-b221-1e1422ed0ed6', 'all'),
	(true, 'sddsas', '2024-07-03 18:35:04.817232+00', '1a44bd9d-06e1-422d-a761-58abcb5367aa', 'all'),
	(true, 'Ебал мать андреева', '2024-10-31 21:02:06.255348+00', '00e11035-5051-4594-b787-2077a5b7456f', 'all');


--
-- Data for Name: posts_comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."posts_comments" ("id", "content", "created_at", "user_nickname") VALUES
	('e065de94-931d-4524-b697-6bb4cc9af6d7', 'uioyuiyui', '2024-08-25 12:46:39.769671+00', 'pureawake'),
	('a3695338-adf3-4427-b5d3-c6786d4d89fb', 'шщшщзщзшзщш', '2024-08-25 12:48:08.1004+00', 'pureawake'),
	('d220c6bd-8790-437e-a43b-bb4a0da70324', 'АХАХАХЫВАПХХЫУПХЫВХПВВПЫПВЫВ', '2024-08-25 12:48:24.597517+00', 'pureawake'),
	('92151289-b174-42db-ab06-3e7b4e3305b2', 'asdasdsad', '2024-08-25 23:03:57.120235+00', 'discludness'),
	('f75fac61-d592-4353-aa25-0fe3d587a5d0', 'круто', '2024-10-29 00:43:09.333945+00', 'discludness'),
	('238e3706-48bd-42e7-bc75-a7f569a86f6d', 'hjkhjkkl', '2024-11-01 23:57:52.29381+00', 'distribate'),
	('7b5eb6e4-5894-4982-9867-7eea35c1719a', 'hjkjhkjk', '2024-11-01 23:58:53.535686+00', 'distribate'),
	('d8752911-9530-455b-9c53-02a06abd7c5b', 'круто', '2024-11-02 01:14:20.595212+00', 'george_wastaken');


--
-- Data for Name: posts_comments_ref; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."posts_comments_ref" ("comment_id", "id", "post_id") VALUES
	('a3695338-adf3-4427-b5d3-c6786d4d89fb', 2, 'd2a2fd1c-ca8a-4b0a-9793-d448e8bc2682'),
	('d220c6bd-8790-437e-a43b-bb4a0da70324', 3, '2db918c7-ba45-42bc-94ef-4bbf56c8ebbb'),
	('92151289-b174-42db-ab06-3e7b4e3305b2', 4, 'd2a2fd1c-ca8a-4b0a-9793-d448e8bc2682'),
	('f75fac61-d592-4353-aa25-0fe3d587a5d0', 5, 'a36aa1b6-bbab-426b-8b3e-2c56ee0ecf78'),
	('238e3706-48bd-42e7-bc75-a7f569a86f6d', 6, '00e11035-5051-4594-b787-2077a5b7456f'),
	('7b5eb6e4-5894-4982-9867-7eea35c1719a', 7, '00e11035-5051-4594-b787-2077a5b7456f'),
	('d8752911-9530-455b-9c53-02a06abd7c5b', 8, '00e11035-5051-4594-b787-2077a5b7456f');


--
-- Data for Name: posts_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."posts_users" ("post_id", "user_nickname") VALUES
	('d2a2fd1c-ca8a-4b0a-9793-d448e8bc2682', 'pureawake'),
	('c05b6ee8-a7f4-42e4-8e20-e3920a487525', 'pureawake'),
	('a36aa1b6-bbab-426b-8b3e-2c56ee0ecf78', 'discludness'),
	('a3b4a325-c6b8-46b0-9f28-ecc77471b926', 'pureawake'),
	('dabf5a2a-b9cf-4b7f-a4cb-30b00065497b', 'discludness'),
	('2db918c7-ba45-42bc-94ef-4bbf56c8ebbb', 'discludness'),
	('1a44bd9d-06e1-422d-a761-58abcb5367aa', 'pureawake'),
	('00e11035-5051-4594-b787-2077a5b7456f', 'distribate');


--
-- Data for Name: profile_views; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: reports; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."reports" ("created_at", "id", "reason", "report_type", "reported_item", "target_user_nickname", "user_nickname", "description") VALUES
	('2024-10-31 23:46:25.420474+00', 4, 'offensive', 'comment', '{"targetId": 8, "targetContent": "ыфваываыва", "targetNickname": "pureawake"}', 'pureawake', 'distribate', NULL),
	('2024-10-31 23:47:55.551446+00', 5, 'spam', 'comment', '{"targetId": 11, "targetContent": "ХАХФЫХАХФЫА СВЕТЛОЛИКИЙ", "targetNickname": "discludness"}', 'discludness', 'distribate', NULL),
	('2024-10-31 23:48:23.603342+00', 6, 'offensive', 'comment', '{"targetId": 9, "targetContent": "саси лох", "targetNickname": "pureawake"}', 'pureawake', 'distribate', NULL),
	('2024-10-31 23:49:17.907339+00', 7, 'offensive', 'comment', '{"targetId": 11, "targetContent": "ХАХФЫХАХФЫА СВЕТЛОЛИКИЙ", "targetNickname": "discludness"}', 'discludness', 'distribate', NULL),
	('2024-11-01 00:14:43.479811+00', 8, 'spam', 'comment', '{"targetId": 14, "targetContent": "cxadsadsdsd", "targetNickname": "distribate"}', 'distribate', 'discludness', NULL),
	('2024-11-01 00:21:58.292602+00', 9, 'dont-like', 'comment', '{"targetId": 35, "targetContent": "Да-да. Нет-нет.", "targetNickname": "distribate"}', 'distribate', 'pureawake', NULL),
	('2024-11-01 18:18:06.368207+00', 10, 'spam', 'comment', '{"targetId": 11, "targetContent": "ХАХФЫХАХФЫА СВЕТЛОЛИКИЙ", "targetNickname": "discludness"}', 'discludness', 'distribate', NULL);


--
-- Data for Name: status; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."status" ("user_id", "value") VALUES
	('d905f002-1370-44c6-bef3-885063b5332f', true);


--
-- Data for Name: threads_comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."threads_comments" ("content", "created_at", "user_nickname", "id", "thread_id", "edited") VALUES
	('ыфваываыва', '2024-10-28 21:37:39.192546+00', 'pureawake', 8, '764d84f2-4610-4208-b12f-cc98b510802b', false),
	('саси лох', '2024-10-28 21:37:44.771658+00', 'pureawake', 9, '764d84f2-4610-4208-b12f-cc98b510802b', false),
	('ХАХФЫХАХФЫА СВЕТЛОЛИКИЙ', '2024-10-29 00:41:19.766896+00', 'discludness', 11, '764d84f2-4610-4208-b12f-cc98b510802b', false),
	('asdasdasd', '2024-10-31 07:49:36.816406+00', 'distribate', 12, 'a867a362-8b75-4c36-9e57-1a32efcf49ba', false),
	('asdasdasdasdasd', '2024-10-31 08:02:49.469591+00', 'distribate', 13, 'a867a362-8b75-4c36-9e57-1a32efcf49ba', false),
	('cxadsadsdsd', '2024-10-31 08:14:56.846614+00', 'distribate', 14, 'a867a362-8b75-4c36-9e57-1a32efcf49ba', false),
	('hjhjkhj', '2024-10-31 08:52:46.283274+00', 'distribate', 15, '75a961d6-4166-45e5-9a43-642e4dcb54f1', false),
	('l;'';'';''', '2024-10-31 10:27:58.623546+00', 'distribate', 18, '75a961d6-4166-45e5-9a43-642e4dcb54f1', false),
	('не так', '2024-10-31 11:32:19.679023+00', 'distribate', 23, '75a961d6-4166-45e5-9a43-642e4dcb54f1', false),
	('хуйню городишь даун, ваще то я прав  ты нет', '2024-10-31 11:34:05.270275+00', 'distribate', 24, '75a961d6-4166-45e5-9a43-642e4dcb54f1', false),
	('хуйню городишь даун, ваще то я прав ты нет хуйню городишь даун, ваще то я прав ты нет хуйню городишь даун, ваще то я прав ты нет', '2024-10-31 11:34:11.690374+00', 'distribate', 25, '75a961d6-4166-45e5-9a43-642e4dcb54f1', false),
	('пока даун', '2024-10-31 11:34:21.878264+00', 'distribate', 26, '75a961d6-4166-45e5-9a43-642e4dcb54f1', false),
	('Да-да.', '2024-10-31 15:09:52.084179+00', 'distribate', 27, 'a006faae-0dde-483a-af8e-d66fef569467', false),
	('фывфывфывфывфывфыв', '2024-10-31 18:24:34.358645+00', 'distribate', 32, '75a961d6-4166-45e5-9a43-642e4dcb54f1', false),
	('ывывфывфывфыв', '2024-10-31 18:24:36.763464+00', 'distribate', 33, '75a961d6-4166-45e5-9a43-642e4dcb54f1', false),
	('нет ващето', '2024-10-31 18:24:51.017528+00', 'distribate', 34, '75a961d6-4166-45e5-9a43-642e4dcb54f1', false),
	('ФЫВ ФЫВ', '2024-10-31 18:24:24.980792+00', 'distribate', 29, '75a961d6-4166-45e5-9a43-642e4dcb54f1', false),
	('asd123123', '2024-10-31 11:32:15.420613+00', 'distribate', 22, '75a961d6-4166-45e5-9a43-642e4dcb54f1', false),
	(' 345345354534345', '2024-10-31 11:32:13.791326+00', 'distribate', 21, '75a961d6-4166-45e5-9a43-642e4dcb54f1', false),
	('светлоликий', '2024-10-31 18:24:31.698948+00', 'distribate', 31, '75a961d6-4166-45e5-9a43-642e4dcb54f1', true),
	('Нет-нет.', '2024-10-31 15:10:01.139798+00', 'distribate', 28, 'a006faae-0dde-483a-af8e-d66fef569467', true),
	('Да-да. Нет-нет.', '2024-10-31 20:59:27.804925+00', 'distribate', 35, '764d84f2-4610-4208-b12f-cc98b510802b', true),
	('hjhjkhj', '2024-10-31 18:24:27.963071+00', 'distribate', 30, '75a961d6-4166-45e5-9a43-642e4dcb54f1', true);


--
-- Data for Name: threads_comments_ref; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."threads_comments_ref" ("id", "thread_id", "comment_id") VALUES
	(6, '764d84f2-4610-4208-b12f-cc98b510802b', 8),
	(7, '764d84f2-4610-4208-b12f-cc98b510802b', 9),
	(9, '764d84f2-4610-4208-b12f-cc98b510802b', 11),
	(25, 'a006faae-0dde-483a-af8e-d66fef569467', 27),
	(26, 'a006faae-0dde-483a-af8e-d66fef569467', 28),
	(33, '764d84f2-4610-4208-b12f-cc98b510802b', 35);


--
-- Data for Name: threads_comments_replies; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."threads_comments_replies" ("created_at", "id", "initiator_comment_id", "recipient_comment_id") VALUES
	('2024-10-28 21:37:44.833014+00', 3, 9, 8),
	('2024-10-31 11:32:19.721179+00', 4, 23, 22),
	('2024-10-31 11:34:21.919632+00', 5, 26, 25),
	('2024-10-31 15:10:01.192862+00', 6, 28, 27),
	('2024-10-31 18:24:51.054835+00', 7, 34, 22),
	('2024-10-31 20:59:27.857594+00', 8, 35, 11);


--
-- Data for Name: threads_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."threads_images" ("id", "images", "thread_id") VALUES
	(9, '{764d84f2-4610-4208-b12f-cc98b510802b-oe,764d84f2-4610-4208-b12f-cc98b510802b-IC}', '764d84f2-4610-4208-b12f-cc98b510802b'),
	(10, '{db2f82ca-e82f-4861-a750-c303b007ed65-Mw}', 'db2f82ca-e82f-4861-a750-c303b007ed65'),
	(12, '{a867a362-8b75-4c36-9e57-1a32efcf49ba-3y}', 'a867a362-8b75-4c36-9e57-1a32efcf49ba'),
	(15, '{a006faae-0dde-483a-af8e-d66fef569467-dO}', 'a006faae-0dde-483a-af8e-d66fef569467'),
	(16, '{7e7586b2-ebc3-44ba-8721-022029a9a9bb-Lq}', '7e7586b2-ebc3-44ba-8721-022029a9a9bb'),
	(17, '{dbf53dcf-add8-425d-883a-d71ece170515-jM}', 'dbf53dcf-add8-425d-883a-d71ece170515');


--
-- Data for Name: threads_pinned; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: threads_rating; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."threads_rating" ("id", "type", "thread_id", "user_id") VALUES
	(140, 'decrement', '764d84f2-4610-4208-b12f-cc98b510802b', 'd905f002-1370-44c6-bef3-885063b5332f'),
	(144, 'increment', '764d84f2-4610-4208-b12f-cc98b510802b', 'c2e8de6f-a450-4ca0-ba50-828bedb053ba'),
	(154, 'increment', '764d84f2-4610-4208-b12f-cc98b510802b', 'ffbc7e08-1838-4d80-8931-713168de7c20'),
	(165, 'increment', '75a961d6-4166-45e5-9a43-642e4dcb54f1', 'ffbc7e08-1838-4d80-8931-713168de7c20'),
	(169, 'increment', 'a006faae-0dde-483a-af8e-d66fef569467', 'ffbc7e08-1838-4d80-8931-713168de7c20');


--
-- Data for Name: threads_stars; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: threads_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."threads_tags" ("id", "tags", "thread_id") VALUES
	(16, '{"\"aboba\"","\"aboba\"","\"aboba\""}', '764d84f2-4610-4208-b12f-cc98b510802b'),
	(18, '{"\"виды\"","\"города\"","\"немайнкрафт\""}', 'a867a362-8b75-4c36-9e57-1a32efcf49ba'),
	(20, '{"\"тест\""}', '75a961d6-4166-45e5-9a43-642e4dcb54f1'),
	(22, '{"\"монахов\"","\"даун\"","\"ти тут\""}', 'a006faae-0dde-483a-af8e-d66fef569467'),
	(23, '{"\"чипсики\"","\"монахов\"","\"хаях\"","\"криптовалюта\"","\"work\""}', '7e7586b2-ebc3-44ba-8721-022029a9a9bb'),
	(24, '{"\"монахов\"","\"история\"","\"трустори\"","\"ворк\"","\"work\"","\"tailwindcss\"","\"html\"","\"it\""}', 'dbf53dcf-add8-425d-883a-d71ece170515');


--
-- Data for Name: threads_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."threads_users" ("thread_id", "user_nickname") VALUES
	('764d84f2-4610-4208-b12f-cc98b510802b', 'pureawake'),
	('db2f82ca-e82f-4861-a750-c303b007ed65', 'pureawake'),
	('a867a362-8b75-4c36-9e57-1a32efcf49ba', 'discludness'),
	('75a961d6-4166-45e5-9a43-642e4dcb54f1', 'distribate'),
	('a006faae-0dde-483a-af8e-d66fef569467', 'distribate'),
	('7e7586b2-ebc3-44ba-8721-022029a9a9bb', 'distribate'),
	('dbf53dcf-add8-425d-883a-d71ece170515', 'distribate');


--
-- Data for Name: threads_views; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."threads_views" ("id", "created_at", "user_id", "thread_id") VALUES
	(34, '2024-11-01 00:11:14.365041+00', 'c2e8de6f-a450-4ca0-ba50-828bedb053ba', '7e7586b2-ebc3-44ba-8721-022029a9a9bb'),
	(35, '2024-11-01 00:11:14.793827+00', 'ffbc7e08-1838-4d80-8931-713168de7c20', '764d84f2-4610-4208-b12f-cc98b510802b'),
	(41, '2024-11-01 00:13:43.01326+00', 'ffbc7e08-1838-4d80-8931-713168de7c20', '7e7586b2-ebc3-44ba-8721-022029a9a9bb'),
	(43, '2024-11-01 00:13:53.369266+00', 'c2e8de6f-a450-4ca0-ba50-828bedb053ba', '764d84f2-4610-4208-b12f-cc98b510802b'),
	(44, '2024-11-01 00:13:56.676372+00', 'c2e8de6f-a450-4ca0-ba50-828bedb053ba', 'a867a362-8b75-4c36-9e57-1a32efcf49ba'),
	(46, '2024-11-01 00:21:14.184498+00', 'd905f002-1370-44c6-bef3-885063b5332f', '764d84f2-4610-4208-b12f-cc98b510802b'),
	(52, '2024-11-01 12:28:14.336219+00', 'ffbc7e08-1838-4d80-8931-713168de7c20', 'a867a362-8b75-4c36-9e57-1a32efcf49ba'),
	(53, '2024-11-01 12:28:20.749193+00', 'ffbc7e08-1838-4d80-8931-713168de7c20', '75a961d6-4166-45e5-9a43-642e4dcb54f1'),
	(54, '2024-11-01 12:28:39.895859+00', 'ffbc7e08-1838-4d80-8931-713168de7c20', 'a006faae-0dde-483a-af8e-d66fef569467'),
	(91, '2024-11-01 17:45:53.050917+00', 'ffbc7e08-1838-4d80-8931-713168de7c20', 'db2f82ca-e82f-4861-a750-c303b007ed65'),
	(124, '2024-11-02 01:14:29.251809+00', 'c2508ed9-c992-4eb3-98a6-e149d01c4b2a', 'a006faae-0dde-483a-af8e-d66fef569467'),
	(125, '2024-11-02 01:14:55.132022+00', 'c2508ed9-c992-4eb3-98a6-e149d01c4b2a', '75a961d6-4166-45e5-9a43-642e4dcb54f1'),
	(126, '2024-11-02 01:14:58.235716+00', 'c2508ed9-c992-4eb3-98a6-e149d01c4b2a', 'a867a362-8b75-4c36-9e57-1a32efcf49ba'),
	(127, '2024-11-02 01:15:03.889564+00', 'c2508ed9-c992-4eb3-98a6-e149d01c4b2a', '7e7586b2-ebc3-44ba-8721-022029a9a9bb'),
	(168, '2024-11-02 17:06:54.463105+00', 'c2508ed9-c992-4eb3-98a6-e149d01c4b2a', '764d84f2-4610-4208-b12f-cc98b510802b'),
	(169, '2024-11-02 22:34:51.517917+00', 'ffbc7e08-1838-4d80-8931-713168de7c20', 'dbf53dcf-add8-425d-883a-d71ece170515');


--
-- Data for Name: users_banned; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users_banned" ("id", "nickname", "reason", "time", "created_at") VALUES
	(2, 'kendrick', NULL, '2024-10-31 09:31:23+00', '2024-10-29 01:11:59.812888+00');


--
-- Data for Name: users_blocked; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: users_requests_timeout; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users_requests_timeout" ("id", "issued_at", "type", "user_nickname", "created_at") VALUES
	(2, '2024-08-25 12:17:34', 'real_name', 'discludness', '2024-08-25 12:12:34.748549'),
	(3, '2024-08-25 13:50:25', 'favorite_item', 'pureawake', '2024-08-25 13:45:25.868468'),
	(4, '2024-08-25 13:54:03', 'favorite_item', 'pureawake', '2024-08-25 13:49:03.087978'),
	(5, '2024-08-25 22:08:17', 'name_color', 'pureawake', '2024-08-25 22:03:17.985864'),
	(6, '2024-08-25 22:08:31', 'favorite_item', 'pureawake', '2024-08-25 22:03:31.338357'),
	(7, '2024-08-25 23:19:45', 'real_name', 'george_wastaken', '2024-08-25 23:14:45.267583'),
	(8, '2024-08-25 23:19:54', 'description', 'george_wastaken', '2024-08-25 23:14:54.763592'),
	(9, '2024-08-26 15:05:28', 'name_color', 'pureawake', '2024-08-26 15:00:28.349093'),
	(10, '2024-08-28 17:24:35', 'description', 'kendrick', '2024-08-28 17:19:35.999292'),
	(11, '2024-09-03 13:10:18', 'favorite_item', 'pureawake', '2024-09-03 13:05:18.104704'),
	(12, '2024-09-03 21:24:59', 'name_color', 'pureawake', '2024-09-03 21:19:59.068943'),
	(13, '2024-09-04 14:55:28', 'name_color', 'pureawake', '2024-09-04 14:50:28.480882'),
	(14, '2024-09-04 21:24:11', 'favorite_item', 'pureawake', '2024-09-04 21:19:11.183587'),
	(15, '2024-10-15 17:44:43', 'name_color', 'distribate', '2024-10-15 17:39:43.956134'),
	(16, '2024-10-15 17:44:50', 'favorite_item', 'distribate', '2024-10-15 17:39:50.780924'),
	(17, '2024-10-15 17:44:56', 'real_name', 'distribate', '2024-10-15 17:39:56.536793'),
	(18, '2024-10-28 22:15:32', 'name_color', 'distribate', '2024-10-28 22:10:32.93042'),
	(19, '2024-10-29 00:29:07', 'real_name', 'distribate', '2024-10-29 00:24:07.274451'),
	(20, '2024-10-29 00:29:11', 'real_name', 'distribate', '2024-10-29 00:24:11.98054'),
	(21, '2024-10-29 00:29:26', 'name_color', 'distribate', '2024-10-29 00:24:26.632461'),
	(22, '2024-10-29 01:15:08', 'favorite_item', 'distribate', '2024-10-29 01:10:08.613199'),
	(23, '2024-10-29 16:11:27', 'favorite_item', 'pureawake', '2024-10-29 16:06:27.181734'),
	(24, '2024-11-02 01:33:57', 'favorite_item', 'distribate', '2024-11-02 01:28:57.396055');


--
-- Data for Name: users_saved_threads; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: users_security; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users_security" ("email", "token", "user_nickname") VALUES
	('fank.tomphson@gmail.com', NULL, 'pureawake');


--
-- Data for Name: users_session; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users_session" ("id", "expires_at", "user_id", "browser", "cpu", "ip", "isBot", "os", "ua") VALUES
	('g6scadwuww2os2eat4du4dh3k6zk54rsopeiqcjy', '2024-09-10 14:15:28.106+00', 'c2e8de6f-a450-4ca0-ba50-828bedb053ba', 'Chrome', 'amd64', NULL, false, 'Windows10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'),
	('mf4jzvcs2bhym7fjpkpgrm2y5bh4hbhlyddcrjpj', '2024-09-11 00:27:19.803+00', 'c2508ed9-c992-4eb3-98a6-e149d01c4b2a', 'Chrome', 'amd64', NULL, false, 'Windows10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'),
	('xbu7fdjysvop5kcnnxd3dugxmsyjt5dckdq2odei', '2024-09-24 22:20:49.384+00', 'd905f002-1370-44c6-bef3-885063b5332f', 'Chrome', 'amd64', NULL, false, 'Windows10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'),
	('ethbbwfuo5v3mlayfskiksbhw4z6r57hcgz4fadd', '2024-09-28 12:42:08.33+00', 'd905f002-1370-44c6-bef3-885063b5332f', 'Chrome', 'amd64', NULL, false, 'Windows10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'),
	('kww44ungl2tswwtyaxdxwurl6w7o6rklcwzbnuyr', '2024-10-29 17:37:12.412+00', 'ffbc7e08-1838-4d80-8931-713168de7c20', 'Firefox', 'amd64', NULL, false, 'Windows10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0'),
	('oivypy4ohwkmepgor6buzv3a4uqa75csx7yz5qp2', '2024-11-16 00:08:30.504+00', 'ffbc7e08-1838-4d80-8931-713168de7c20', 'Firefox', 'amd64', NULL, false, 'Windows10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0'),
	('aroaote6pobpbac6oh5777d526qpp4qmxttmwb6d', '2024-11-16 01:13:12.317+00', 'c2508ed9-c992-4eb3-98a6-e149d01c4b2a', 'Chrome', 'amd64', NULL, false, 'Windows10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36');


--
-- Data for Name: users_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('user_images', 'user_images', NULL, '2024-06-24 13:46:39.726137+00', '2024-06-24 13:46:39.726137+00', true, false, 37748736, '{image/*}', NULL),
	('threads', 'threads', NULL, '2024-08-25 13:10:01.705744+00', '2024-08-25 13:10:01.705744+00', true, false, 16777216, '{image/*}', NULL),
	('static', 'static', NULL, '2024-07-03 20:59:29.053004+00', '2024-07-03 20:59:29.053004+00', true, false, 15728640, '{image/*}', NULL);


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") VALUES
	('1ece811c-d4e9-4249-ae84-0e5b947d6d6d', 'static', 'items/firework.webp', NULL, '2024-10-22 12:19:45.341786+00', '2024-10-22 12:19:45.341786+00', '2024-10-22 12:19:45.341786+00', '{"eTag": "\"87792a440b26cff05a2e89eaa4eeca30\"", "size": 156, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2024-10-22T12:19:45.333Z", "contentLength": 156, "httpStatusCode": 200}', 'a2dd8e4a-f212-4887-b2ab-3d9619916dda', NULL, NULL),
	('371830d2-7470-4d49-a760-97e1dfbb4c87', 'static', 'items/iron_helmet.webp', NULL, '2024-10-22 12:20:01.450912+00', '2024-10-22 12:20:01.450912+00', '2024-10-22 12:20:01.450912+00', '{"eTag": "\"e12b449e3f611b7e5761a9ab9c7fb2d1\"", "size": 120, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2024-10-22T12:20:01.434Z", "contentLength": 120, "httpStatusCode": 200}', '750b2116-4ce6-471e-abfa-3af3d0141f2f', NULL, NULL),
	('3f27234d-e072-456a-9604-79f2ed14e523', 'static', 'auth_background/1.png', NULL, '2024-10-22 12:37:57.784746+00', '2024-10-22 12:38:01.14169+00', '2024-10-22 12:37:57.784746+00', '{"eTag": "\"537db7a74b825ef0efcb83935f02185e\"", "size": 3047281, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-10-22T12:38:01.056Z", "contentLength": 3047281, "httpStatusCode": 200}', '8804d4d8-ae1d-44c9-86b6-bb6397fa3c77', NULL, NULL),
	('c99bc8f5-b447-4242-a30e-284cb7c1d2a8', 'static', 'auth_background/6.png', NULL, '2024-10-22 12:37:19.956836+00', '2024-10-22 12:37:19.956836+00', '2024-10-22 12:37:19.956836+00', '{"eTag": "\"d4392e76cabd6aeb3061c6f27fadbb06\"", "size": 2774801, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-10-22T12:37:19.824Z", "contentLength": 2774801, "httpStatusCode": 200}', '3a7a99ff-3a71-47ca-9dd1-467f91ab3066', NULL, NULL),
	('0fa736eb-67cd-47e7-ab0f-8ae8ee510666', 'threads', '.emptyFolderPlaceholder', NULL, '2024-10-23 22:06:06.627184+00', '2024-10-23 22:06:06.627184+00', '2024-10-23 22:06:06.627184+00', '{"eTag": "\"d41d8cd98f00b204e9800998ecf8427e\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2024-10-23T22:06:06.532Z", "contentLength": 0, "httpStatusCode": 200}', '13444e84-c77f-4fde-bde2-1231d6670e61', NULL, '{}'),
	('b2a8fc55-0f76-42bd-81b7-608c0dc1ea70', 'static', 'items/missing_texture.webp', NULL, '2024-10-22 12:20:38.425663+00', '2024-10-22 12:20:38.425663+00', '2024-10-22 12:20:38.425663+00', '{"eTag": "\"f543ead08fdf738b29d4583fd7f10447\"", "size": 54, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2024-10-22T12:20:38.405Z", "contentLength": 54, "httpStatusCode": 200}', '3140c5b2-d34f-4ec9-9002-58b3bbf335a3', NULL, NULL),
	('4f71144d-9162-4dfc-84da-d0d85c96d8bb', 'static', 'items/dirt.webp', NULL, '2024-10-22 12:20:54.394316+00', '2024-10-22 12:20:54.394316+00', '2024-10-22 12:20:54.394316+00', '{"eTag": "\"91b4035180b33e243c720454c6c5e00c\"", "size": 290, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2024-10-22T12:20:54.374Z", "contentLength": 290, "httpStatusCode": 200}', '9632556a-83e8-4d11-89e6-821d786c92a7', NULL, NULL),
	('c05e065d-7883-4d04-8e06-28938cba668d', 'static', 'items/arrow_of_swiftness.webp', NULL, '2024-10-22 12:21:17.864945+00', '2024-10-22 12:21:17.864945+00', '2024-10-22 12:21:17.864945+00', '{"eTag": "\"893982e52694bdf1c2744ef07177d9ba\"", "size": 226, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2024-10-22T12:21:17.846Z", "contentLength": 226, "httpStatusCode": 200}', '8a4c65a0-4e0f-4c9c-adbe-377f015b65c8', NULL, NULL),
	('a8e09f48-0a84-43fc-9223-d04287ab11f1', 'static', 'items/minecart_chest.webp', NULL, '2024-10-22 12:21:31.979087+00', '2024-10-22 12:21:31.979087+00', '2024-10-22 12:21:31.979087+00', '{"eTag": "\"6946fcbedd07fa61d682736490b5b1f4\"", "size": 326, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2024-10-22T12:21:31.966Z", "contentLength": 326, "httpStatusCode": 200}', '3de2da73-7a2f-4bab-a4ee-43c5fda0e1b1', NULL, NULL),
	('8fcad7ff-bd7c-4fd1-b2a6-e9bbbae6a03f', 'static', 'auth_background/auth-image-4xRvWb5bGYdT7668eaS8h.png', NULL, '2024-10-24 00:14:14.027522+00', '2024-10-24 00:14:14.027522+00', '2024-10-24 00:14:14.027522+00', '{"eTag": "\"0f223f5e340b116566b250ccf8e12699\"", "size": 3493239, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-10-24T00:14:13.962Z", "contentLength": 3493239, "httpStatusCode": 200}', '576ee4d7-124a-48c5-8ec9-e8795cd9065c', NULL, '{}'),
	('17029ca0-65e6-4068-9e15-8238f03e7fd3', 'static', 'auth_background/auth-image-8aZsXTUtkuLK6KFUbG-ZZ.png', NULL, '2024-10-25 01:11:20.672277+00', '2024-10-25 01:11:20.672277+00', '2024-10-25 01:11:20.672277+00', '{"eTag": "\"e3617c0672ff7251520e6b2a741aa31c\"", "size": 7898345, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-10-25T01:11:20.386Z", "contentLength": 7898345, "httpStatusCode": 200}', '346f8ebb-04af-4b9a-bb87-dfbcf210563c', NULL, '{}'),
	('02ad939a-b4c1-4edd-9413-e216d4100254', 'static', 'auth_background/5.png', NULL, '2024-10-22 12:37:19.90105+00', '2024-10-22 12:37:19.90105+00', '2024-10-22 12:37:19.90105+00', '{"eTag": "\"cc40cd03fd74b487ed104cbf3d34cda9\"", "size": 3755403, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-10-22T12:37:19.714Z", "contentLength": 3755403, "httpStatusCode": 200}', '9ae7fa1f-f4f3-496a-b521-ecb7835c187d', NULL, NULL),
	('636b9117-9ee4-4c80-ad85-d8461e4cd4c8', 'threads', 'a867a362-8b75-4c36-9e57-1a32efcf49ba-3y', NULL, '2024-10-29 00:46:08.750069+00', '2024-10-29 00:46:08.750069+00', '2024-10-29 00:46:08.750069+00', '{"eTag": "\"3f705cb7607ac41143f15fc830209011\"", "size": 412593, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-10-29T00:46:08.647Z", "contentLength": 412593, "httpStatusCode": 200}', '01c5ed1c-b83a-44a0-9a00-5251829c4ac4', NULL, '{}'),
	('ceb03da1-40f6-4295-83a5-1feac2777762', 'threads', 'a006faae-0dde-483a-af8e-d66fef569467-dO', NULL, '2024-10-31 06:18:14.03031+00', '2024-10-31 06:18:14.03031+00', '2024-10-31 06:18:14.03031+00', '{"eTag": "\"6103b38f6aa8cea4cc2385fd1266bd64\"", "size": 135645, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-10-31T06:18:14.005Z", "contentLength": 135645, "httpStatusCode": 200}', '71fa6478-541b-45f5-a052-a9bc575a1b29', NULL, '{}'),
	('cb867f9e-5997-4d55-82d5-dd8fb21e69e7', 'threads', '7e7586b2-ebc3-44ba-8721-022029a9a9bb-Lq', NULL, '2024-10-31 21:12:26.514487+00', '2024-10-31 21:12:26.514487+00', '2024-10-31 21:12:26.514487+00', '{"eTag": "\"8ebfb4a93786cc666da73b7a97e0f6e3\"", "size": 180576, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-10-31T21:12:26.318Z", "contentLength": 180576, "httpStatusCode": 200}', '01852ac9-c496-47cd-9a6f-f63c94084b9a', NULL, '{}'),
	('d919dc00-ea73-49ff-b402-8f640b16450c', 'threads', 'dbf53dcf-add8-425d-883a-d71ece170515-jM', NULL, '2024-11-02 22:34:51.162186+00', '2024-11-02 22:34:51.162186+00', '2024-11-02 22:34:51.162186+00', '{"eTag": "\"2159bc588cdfe36fa5ebdfced95672a3\"", "size": 194765, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-11-02T22:34:50.998Z", "contentLength": 194765, "httpStatusCode": 200}', 'fdd93916-74a6-48bd-b35e-de7b5e8e6b84', NULL, '{}'),
	('b98e368f-b059-4d73-a753-8e2667a85b61', 'user_images', 'cover/.emptyFolderPlaceholder', NULL, '2024-10-22 12:04:13.526745+00', '2024-10-22 12:04:13.526745+00', '2024-10-22 12:04:13.526745+00', '{"eTag": "\"d41d8cd98f00b204e9800998ecf8427e\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2024-10-22T12:04:13.497Z", "contentLength": 0, "httpStatusCode": 200}', 'aa9e1f45-6b4e-460a-a673-5b92e5ac2fc9', NULL, '{}'),
	('5e94584b-a524-4976-959e-79c9fe032626', 'static', 'items/shield.png', NULL, '2024-10-22 12:23:58.319791+00', '2024-10-22 12:23:58.319791+00', '2024-10-22 12:23:58.319791+00', '{"eTag": "\"4c563b22e87972691326034b8dc731db\"", "size": 342, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-10-22T12:23:58.300Z", "contentLength": 342, "httpStatusCode": 200}', 'aca2621e-885a-4f12-b591-23ba4787c1da', NULL, NULL),
	('c9f5b7bc-2c7c-4071-a0f8-757d8b45c8db', 'user_images', 'default/adventure-in-end.jpg', NULL, '2024-10-22 12:08:54.034834+00', '2024-10-22 12:08:54.034834+00', '2024-10-22 12:08:54.034834+00', '{"eTag": "\"ee460c4af3bd442389c48a86d92411f8\"", "size": 317053, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-10-22T12:08:53.996Z", "contentLength": 317053, "httpStatusCode": 200}', 'a8d94748-a5bd-4473-a1d6-485a0576932f', NULL, NULL),
	('7f047244-33e2-4dd0-b1c7-a6c5b342b8fe', 'user_images', 'default/adventure-in-blossom.jpg', NULL, '2024-10-22 12:08:54.0519+00', '2024-10-22 12:08:54.0519+00', '2024-10-22 12:08:54.0519+00', '{"eTag": "\"e9cb1489e81158dfe1cefed74cde2053\"", "size": 600052, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-10-22T12:08:53.996Z", "contentLength": 600052, "httpStatusCode": 200}', 'aea8cc78-ef14-4a5d-b4af-71863b88c975', NULL, NULL),
	('237e1f3a-83ae-4055-82db-d8a5ba02d612', 'user_images', 'default/sand-camel.jpg', NULL, '2024-10-22 12:09:43.543984+00', '2024-10-22 12:09:43.543984+00', '2024-10-22 12:09:43.543984+00', '{"eTag": "\"be63da46d059e2fb51e8f40c7107ef6a\"", "size": 311190, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-10-22T12:09:43.508Z", "contentLength": 311190, "httpStatusCode": 200}', 'cb6eb5e3-9251-454e-948b-145b88cba100', NULL, NULL),
	('1a24f8db-7448-4325-9a64-428cebd998eb', 'threads', '764d84f2-4610-4208-b12f-cc98b510802b-oe', NULL, '2024-10-28 21:12:59.046414+00', '2024-10-28 21:12:59.046414+00', '2024-10-28 21:12:59.046414+00', '{"eTag": "\"360641edf1af3d42bebb377ae633a466\"", "size": 59907, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-10-28T21:12:59.034Z", "contentLength": 59907, "httpStatusCode": 200}', '79c4978d-dbd6-42da-846f-98f4de7c617e', NULL, '{}'),
	('251d0c1f-1c09-4a95-91fb-2defa351d1f6', 'threads', '764d84f2-4610-4208-b12f-cc98b510802b-IC', NULL, '2024-10-28 21:12:59.184038+00', '2024-10-28 21:12:59.184038+00', '2024-10-28 21:12:59.184038+00', '{"eTag": "\"55b4e13a72c0e1fc6ac283373babfd2a\"", "size": 305917, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-10-28T21:12:59.154Z", "contentLength": 305917, "httpStatusCode": 200}', '32177106-d3af-4d35-95fc-c91d4532d769', NULL, '{}'),
	('c76505e6-4383-4ec7-9a60-43fbd2c349d8', 'user_images', 'cover/ffbc7e08-1838-4d80-8931-713168de7c20Y0T', NULL, '2024-11-02 22:37:35.530723+00', '2024-11-02 22:37:35.530723+00', '2024-11-02 22:37:35.530723+00', '{"eTag": "\"360641edf1af3d42bebb377ae633a466\"", "size": 59907, "mimetype": "image/png", "cacheControl": "max-age=0", "lastModified": "2024-11-02T22:37:35.521Z", "contentLength": 59907, "httpStatusCode": 200}', 'efa538b3-a2eb-4ad2-8611-93ea5fe58e80', NULL, '{}'),
	('e5713e18-fc54-472b-8b30-4bacafc490b0', 'static', 'auth_background/3.png', NULL, '2024-10-22 12:37:20.432059+00', '2024-10-22 12:37:20.432059+00', '2024-10-22 12:37:20.432059+00', '{"eTag": "\"972143f523d284a6654804f35f951323\"", "size": 9222514, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-10-22T12:37:19.874Z", "contentLength": 9222514, "httpStatusCode": 200}', 'e944abab-9594-4064-b826-3383945d42f4', NULL, NULL),
	('1524686c-dbd9-4fe1-a493-884e6482a7b2', 'static', 'auth_background/7.png', NULL, '2024-10-22 12:37:19.616236+00', '2024-10-22 12:37:33.650714+00', '2024-10-22 12:37:19.616236+00', '{"eTag": "\"304772779a1cc2562cd6789a34b11438\"", "size": 85500, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-10-22T12:37:33.635Z", "contentLength": 85500, "httpStatusCode": 200}', 'b1948329-180e-43b2-94d1-023b21d676c7', NULL, NULL),
	('cb54a229-f45c-4cbc-bc39-723d2b04f575', 'user_images', 'default/village-art.jpg', NULL, '2024-10-22 12:09:53.436164+00', '2024-10-22 12:09:53.436164+00', '2024-10-22 12:09:53.436164+00', '{"eTag": "\"5c6e76ea1077c09f69ce365364fe9bf4\"", "size": 355625, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-10-22T12:09:53.418Z", "contentLength": 355625, "httpStatusCode": 200}', '648f31a6-59a4-4d0e-9b14-545d9e86216d', NULL, NULL),
	('a769f40a-47e0-4f6c-a04f-ce7839328415', 'static', 'items/belkoin_wallet.png', NULL, '2024-10-22 12:23:58.320096+00', '2024-10-22 12:23:58.320096+00', '2024-10-22 12:23:58.320096+00', '{"eTag": "\"496ab8ea0fe63690cc39cc488bd58a95\"", "size": 7703, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-10-22T12:23:58.300Z", "contentLength": 7703, "httpStatusCode": 200}', '74d344e6-7ead-4b7b-98b7-e558d5e68128', NULL, NULL),
	('ebe8b873-5e28-4796-bbee-e2dff1445b72', 'threads', 'db2f82ca-e82f-4861-a750-c303b007ed65-Mw', NULL, '2024-10-28 21:20:31.014228+00', '2024-10-28 21:20:31.014228+00', '2024-10-28 21:20:31.014228+00', '{"eTag": "\"f5a0a573e8748a85b1a6834a2b5fda51\"", "size": 96737, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-10-28T21:20:30.986Z", "contentLength": 96737, "httpStatusCode": 200}', '9fb29679-01d5-4921-bd09-513115914ee2', NULL, '{}'),
	('968b335d-8e12-4d7f-a397-948926411515', 'static', 'items/minecraft-item-iyO', NULL, '2024-10-29 01:09:54.561485+00', '2024-10-29 01:09:54.561485+00', '2024-10-29 01:09:54.561485+00', '{"eTag": "\"f375d4394e55f2eb35622c5462ba08db\"", "size": 254, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-10-29T01:09:54.536Z", "contentLength": 254, "httpStatusCode": 200}', 'c7ab52f1-542d-40d9-b290-ccf16f6bc7b3', NULL, '{}'),
	('352a5666-ca14-4e62-8dbb-77fdaf17cd20', 'static', 'items/bust_painting.webp', NULL, '2024-10-22 12:17:39.816513+00', '2024-10-22 12:17:39.816513+00', '2024-10-22 12:17:39.816513+00', '{"eTag": "\"841f7fee2c27666998c1788f6eeb7b2a\"", "size": 3240, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2024-10-22T12:17:39.799Z", "contentLength": 3240, "httpStatusCode": 200}', 'e9a37bbb-c610-40f9-a7b4-7dd1dcb6d15b', NULL, NULL),
	('0daf32e5-6676-4657-8e73-990a2167301d', 'static', 'items/diamond_pickaxe.webp', NULL, '2024-10-22 12:18:14.691539+00', '2024-10-22 12:18:14.691539+00', '2024-10-22 12:18:14.691539+00', '{"eTag": "\"2b4c606b1fec45285f8aced7e91979b1\"", "size": 208, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2024-10-22T12:18:14.680Z", "contentLength": 208, "httpStatusCode": 200}', '3d0801b5-282c-4d03-a429-180deda893c1', NULL, NULL),
	('69896888-0079-409c-950a-df392d56f47c', 'static', 'auth_background/2.png', NULL, '2024-10-22 12:37:19.92645+00', '2024-10-22 12:37:19.92645+00', '2024-10-22 12:37:19.92645+00', '{"eTag": "\"4fbcbb774cc03fe315b8c6f2fa522a56\"", "size": 3980952, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-10-22T12:37:19.754Z", "contentLength": 3980952, "httpStatusCode": 200}', '92ed97a5-5c15-4b0b-bae2-cb32df734257', NULL, NULL),
	('246e2b8d-1f9a-4725-96cd-829fddd914ac', 'static', 'items/barrier.webp', NULL, '2024-10-22 12:18:34.718535+00', '2024-10-22 12:18:34.718535+00', '2024-10-22 12:18:34.718535+00', '{"eTag": "\"b3c484b0196a4db5f906bbd483e17aa5\"", "size": 170, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2024-10-22T12:18:34.701Z", "contentLength": 170, "httpStatusCode": 200}', 'a9378aab-04ee-4185-9372-447ef35025ca', NULL, NULL),
	('53194d41-5213-4420-8bd8-476ac757d7b4', 'static', 'items/allay_spawn_egg.webp', NULL, '2024-10-22 12:18:53.726074+00', '2024-10-22 12:18:53.726074+00', '2024-10-22 12:18:53.726074+00', '{"eTag": "\"03ca41fb820dba152bd67d5a26fe9318\"", "size": 312, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2024-10-22T12:18:53.712Z", "contentLength": 312, "httpStatusCode": 200}', '31038228-df1e-4e37-911a-98a74fb90220', NULL, NULL),
	('fa51748f-8d38-41d1-a38d-8ec6f93e6b49', 'static', 'auth_background/8.png', NULL, '2024-10-22 12:37:20.174833+00', '2024-10-22 12:37:20.174833+00', '2024-10-22 12:37:20.174833+00', '{"eTag": "\"381684100c67cde5784b90d4dfc64b57\"", "size": 3267956, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-10-22T12:37:20.054Z", "contentLength": 3267956, "httpStatusCode": 200}', '0eaf96ea-5ebf-49c7-b6f4-0620b75bd7dc', NULL, NULL),
	('7cdfbaab-7548-492c-b0c9-5f500b2f28fc', 'static', 'items/elytra.webp', NULL, '2024-10-22 12:19:13.061259+00', '2024-10-22 12:19:13.061259+00', '2024-10-22 12:19:13.061259+00', '{"eTag": "\"8258d064c7192324d36f8abc9e996f80\"", "size": 200, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2024-10-22T12:19:13.043Z", "contentLength": 200, "httpStatusCode": 200}', '4e8cc72a-e19e-4c7d-b289-65e6b215480d', NULL, NULL),
	('8b1f8f6f-9190-47a6-8f30-153b2337d616', 'static', 'items/fancy_feather.webp', NULL, '2024-10-22 12:19:29.472318+00', '2024-10-22 12:19:29.472318+00', '2024-10-22 12:19:29.472318+00', '{"eTag": "\"7804e81bbebf368f4eaa74e1d43e4586\"", "size": 216, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2024-10-22T12:19:29.454Z", "contentLength": 216, "httpStatusCode": 200}', 'fd5cf5e3-1afe-4f28-ba85-b1dc7f673600', NULL, NULL);


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

INSERT INTO "vault"."secrets" ("id", "name", "description", "secret", "key_id", "nonce", "created_at", "updated_at") VALUES
	('ac943f29-ef69-470d-86f5-c260d25a21a0', 'decrypted_secrets', '', '9x0cC86YxFxOI42QE+y9EP/TcVzMgoO/6dOJ639XTMYhBtoYPHv5x5f9lhdhxdiiAdZ7eudguGav
fRpHQ2THSSYL6aoxcC7xJxi+3r7yuHIdCrSoh7jPXfDosKK2j3Gqe/VY5eGh8nKPe2JtJuKxi8m7
N7kqZkVDp02F6ZO9/LjuRDi2ybFmOaLyXcrN+REjpJr3O7tkd4EVMyxePhuL6SAxY6iEheJbLEdl
r2QlIoyIIUf/dwC5d2d0b1G4FOMNolzYiXnZmu6L5mHRY19HWW4z6+IXbxYGRgVo8FXnoehUco4L
z2McQ8NiRuhn5b7QPNelt+lVUDkRW0ajrGEd1eh+FzUH8HE6FNJOa1DCxXNgZjymrNTjd+ZSSw==', '7d6e5d09-426c-4aed-a6e8-03b0ba43b0e1', '\xbc103d3a5b26955c3a437a4fd37cc405', '2024-06-20 22:49:44.80295+00', '2024-06-20 22:49:44.80295+00'),
	('c7b9de6a-171c-4c5f-baa9-3baa958de4ec', 'service_role', 'aboba', 'G6UG/1jOiimPMM/qMf65TUG+XnxfSHVeZOIlJD1HzGLz9v9dtGZYuPl8OZhuAfawkzxSmJFsTXY8
EoWgaLIZkZZCTXN1ebR71Kod/iDNnxue7s7e8DPWleN18Wu+PVAdufDpUt+05KswVTUonpg0TvLv
Y06OYzy5VAmQ9IiPC5S9Zgb/ZLenPPFck/WY2G+EUI2pIdfbglxkd9JH3CDUbC3G8Aevv/E8QI8q
IRseyr7SCLJK1zT0iNFhBe7AnejvCwNmJRnriVnp3YXlyWIjtBcqXd4kes1wrugZsEph9I22atYu
Lpa6aJC+dDLWkgKfpl7iCayeTvX7aTgMkaf35dDvdV2MbYVkxBOzIX6snTUHXdBxsVr3hFZvqpTG
b1CNahueAHg4H3pe0eo=', 'c3729e72-a786-4eff-9cc7-e380f57fcf97', '\x193663f2fed9f240e459f2161b79997b', '2024-06-21 22:16:52.565283+00', '2024-06-24 13:42:41.170653+00');


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, false);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 2, true);


--
-- Name: admins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."admins_id_seq"', 1, false);


--
-- Name: admins_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."admins_id_seq1"', 1, true);


--
-- Name: category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."category_id_seq"', 1, false);


--
-- Name: category_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."category_id_seq1"', 1, false);


--
-- Name: config_advertisement_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."config_advertisement_id_seq"', 1, false);


--
-- Name: config_alerts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."config_alerts_id_seq"', 1, false);


--
-- Name: config_alerts_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."config_alerts_id_seq1"', 14, true);


--
-- Name: config_minecraft_facts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."config_minecraft_facts_id_seq"', 1, false);


--
-- Name: config_minecraft_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."config_minecraft_items_id_seq"', 1, false);


--
-- Name: config_minecraft_items_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."config_minecraft_items_id_seq1"', 19, true);


--
-- Name: info_findout_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."info_findout_id_seq"', 11, true);


--
-- Name: luckperms_actions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."luckperms_actions_id_seq"', 1, false);


--
-- Name: luckperms_group_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."luckperms_group_permissions_id_seq"', 326, true);


--
-- Name: luckperms_user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."luckperms_user_permissions_id_seq"', 122, true);


--
-- Name: moderators_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."moderators_id_seq"', 1, false);


--
-- Name: posts_comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."posts_comments_id_seq"', 1, false);


--
-- Name: posts_comments_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."posts_comments_id_seq1"', 8, true);


--
-- Name: profile_views_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."profile_views_id_seq"', 1, false);


--
-- Name: reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."reports_id_seq"', 1, false);


--
-- Name: reports_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."reports_id_seq1"', 10, true);


--
-- Name: t_comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."t_comments_id_seq"', 35, true);


--
-- Name: t_comments_replies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."t_comments_replies_id_seq"', 1, false);


--
-- Name: t_comments_replies_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."t_comments_replies_id_seq1"', 8, true);


--
-- Name: threads_comments_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."threads_comments_comment_id_seq"', 1, false);


--
-- Name: threads_comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."threads_comments_id_seq"', 1, false);


--
-- Name: threads_comments_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."threads_comments_id_seq1"', 33, true);


--
-- Name: threads_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."threads_images_id_seq"', 1, false);


--
-- Name: threads_images_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."threads_images_id_seq1"', 17, true);


--
-- Name: threads_pinned_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."threads_pinned_id_seq"', 1, false);


--
-- Name: threads_rating_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."threads_rating_id_seq"', 1, false);


--
-- Name: threads_rating_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."threads_rating_id_seq1"', 200, true);


--
-- Name: threads_stars_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."threads_stars_id_seq"', 1, false);


--
-- Name: threads_tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."threads_tags_id_seq"', 1, false);


--
-- Name: threads_tags_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."threads_tags_id_seq1"', 24, true);


--
-- Name: threads_views_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."threads_views_id_seq"', 222, true);


--
-- Name: users_banned_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."users_banned_id_seq"', 1, false);


--
-- Name: users_banned_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."users_banned_id_seq1"', 34, true);


--
-- Name: users_blocked_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."users_blocked_id_seq"', 1, false);


--
-- Name: users_blocked_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."users_blocked_id_seq1"', 1, false);


--
-- Name: users_requests_timeout_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."users_requests_timeout_id_seq"', 24, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;

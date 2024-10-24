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

INSERT INTO "public"."config_minecraft_items" ("id", "image", "title") VALUES
	(1, 'allay_spawn_egg.webp', 'Эллей'),
	(2, 'arrow_of_swiftness.webp', 'Стрела'),
	(3, 'barrier.webp', 'Барьер'),
	(4, 'belkoin_wallet.png', 'Белкоин'),
	(5, 'bust_painting.webp', 'Картина'),
	(6, 'diamond_pickaxe.webp', 'Алмазная кирка'),
	(7, 'dirt.webp', 'Земля'),
	(8, 'elytra.webp', 'Элитры'),
	(9, 'fancy_feather.webp', 'Перо'),
	(10, 'firework.webp', 'Фейерверк'),
	(11, 'iron_helmet.webp', 'Железный шлем'),
	(12, 'minecart_chest.webp', 'Сундук'),
	(13, 'missing_texture.webp', 'Ошибка');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users" ("acceptrules", "birthday", "cover_image", "created_at", "description", "id", "name_color", "nickname", "preferences", "real_name", "status", "uuid", "visibility", "favorite_item") VALUES
	(true, NULL, 'default/bees.jpg', '2024-10-15 17:37:04.629915+00', NULL, 'ffbc7e08-1838-4d80-8931-713168de7c20', '#9AF9DC', 'distribate', '{"coverOutline": "true", "friendRequest": "false", "realNameVisibility": "true", "gameStatsVisibility": "false"}', 'Руся', NULL, 'c1686a0f-5f76-3694-84d7-c40ba8bf8174', 'all', 10),
	(true, NULL, 'cover/c2e8de6f-a450-4ca0-ba50-828bedb053bal4NAWYsBowZ5s6HwUnGFq', '2024-06-22 18:29:11.063752+00', 'Я полежу и встану Для начала, хотя бы на колени', 'c2e8de6f-a450-4ca0-ba50-828bedb053ba', '#ffffff', 'discludness', '{"coverOutline": "false", "friendRequest": "true", "realNameVisibility": "true", "gameStatsVisibility": "true"}', 'Мария', NULL, '5744cd36-94bd-3e2f-9c97-aa564b146417', 'friends', NULL),
	(true, NULL, 'default/adventure-in-end.jpg', '2024-06-22 21:07:32.429882+00', 'My Flaws Burn Through My Skin Like Demonic Flames from Hell', 'd905f002-1370-44c6-bef3-885063b5332f', '#F2DEF2', 'pureawake', '{"coverOutline": "false", "friendRequest": "true", "realNameVisibility": "true", "gameStatsVisibility": "true"}', 'Руся', NULL, 'a6570be9-f25f-3767-bd09-6588cac34cdb', 'friends', 6),
	(true, NULL, 'cover/c2508ed9-c992-4eb3-98a6-e149d01c4b2aNw3WWi_TCb2WSdhuV5pzF', '2024-08-25 23:10:56.949548+00', 'Привет', 'c2508ed9-c992-4eb3-98a6-e149d01c4b2a', '#ffffff', 'george_wastaken', '{"coverOutline": "false", "friendRequest": "true", "realNameVisibility": "true", "gameStatsVisibility": "true"}', 'Владислав', NULL, '71fe71d1-0161-32cd-8b57-a76486d69aee', 'all', NULL),
	(true, NULL, NULL, '2024-08-28 15:46:21.066781+00', NULL, '45d2de08-a28a-482f-9c0a-3d0ef166aa8f', '#ffffff', 'ferngazer', '{"coverOutline": "false", "friendRequest": "true", "realNameVisibility": "true", "gameStatsVisibility": "true"}', NULL, NULL, '40a5257a-9ed8-31b8-9239-5f316881aafa', 'all', NULL),
	(true, NULL, 'default/render-warden-hide.jpg', '2024-08-28 15:47:23.653119+00', 'шмебьюлок', 'e0e2fb96-9de7-430b-80df-59398a20b95d', '#ffffff', 'kendrick', '{"coverOutline": "false", "friendRequest": "true", "realNameVisibility": "true", "gameStatsVisibility": "true"}', NULL, NULL, 'a0799d91-0bb2-33d1-8115-792747b934c8', 'all', NULL),
	(true, NULL, 'default/sand-camel.jpg', '2024-08-28 15:44:43.14115+00', NULL, '73c4acab-b1ab-430b-bc42-d6da78ab1092', '#ffffff', 'borbuse', '{"coverOutline": "false", "friendRequest": "true", "realNameVisibility": "true", "gameStatsVisibility": "true"}', NULL, NULL, '45d682c0-526e-3a95-8fb2-ec2e9c16ab90', 'all', NULL);


--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: postgres
--



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
	('d0a25fc4-a7d6-4e47-89d4-538cadecf2c9', 'Абоба тайтл (без фото) ', '2024-08-25 13:06:23.662697+00', NULL, 'all', 'Абоба дескрипш', true, false, '[{"type": "paragraph", "children": [{"text": "Абоба контент, "}, {"bold": true, "text": "контентище"}, {"text": ", контент навален успешно"}]}]', false),
	('b558eb07-d050-462b-8249-b5d34ddb1b9e', 'Абоба тайтл ( фото)', '2024-08-25 13:11:20.921499+00', NULL, 'all', 'Абоба дескрипшн', true, false, '[{"type": "paragraph", "children": [{"text": "Абоба контент, "}, {"bold": true, "text": "контентище"}, {"text": ", навален контент успешно (с "}, {"text": "кошками", "italic": true}, {"text": ")"}]}]', false),
	('f0a49e6e-ae3c-4934-a217-5c0dafada849', '123123123123', '2024-09-14 15:52:08.703896+00', NULL, 'all', '123123123123', true, false, '[{"type": "paragraph", "children": [{"text": "jkjkljkljkljkljkljkljklkjljkljkljklkljjkljkl"}]}]', false),
	('ea82edea-b220-4a93-8712-db27ae168bb9', 'fghfghghfgfhfgh', '2024-09-14 15:50:36.414145+00', NULL, 'all', 'hgffghgfhfghfgh', true, false, '[{"type": "paragraph", "children": [{"text": ";'''';;'';'';'';''hjfghfghfghfghfghhfgfghyuihjkhjk"}]}]', false),
	('18896a50-3e1a-43d8-b415-446b757ee97f', 'привет тест название для треда', '2024-10-15 18:15:27.453828+00', NULL, 'all', '', false, false, '[{"type": "paragraph", "children": [{"bold": true, "text": "прррр"}, {"text": "пиетфывфывыфвфывфывф"}, {"bold": true, "text": "ывфывфывфывфывфывфыв"}]}]', false),
	('1a19b4c2-7d58-40f7-a372-9b220fcf5e78', 'sadasdasdasdasdasdasdasdasdasdasd', '2024-10-15 18:04:45.446144+00', NULL, 'all', '', true, false, '[{"type": "paragraph", "children": [{"text": "asdasdasdasdasdasdadsasdasdsdadasasd"}]}]', false);


--
-- Data for Name: category_threads; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."category_threads" ("category_id", "thread_id") VALUES
	(1, 'd0a25fc4-a7d6-4e47-89d4-538cadecf2c9'),
	(4, 'b558eb07-d050-462b-8249-b5d34ddb1b9e'),
	(3, 'ea82edea-b220-4a93-8712-db27ae168bb9'),
	(5, 'f0a49e6e-ae3c-4934-a217-5c0dafada849'),
	(2, '1a19b4c2-7d58-40f7-a372-9b220fcf5e78'),
	(3, '18896a50-3e1a-43d8-b415-446b757ee97f');


--
-- Data for Name: config_advertisement; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: config_alerts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."config_alerts" ("created_at", "id", "link", "title") VALUES
	('2024-07-04 12:12:02.483728+00', 1, 'https://t.me/fasberry', 'Вступайте в телеграмм-канал проекта!');


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
	('746a482d-989f-4165-93f3-2132b47caf6d', 'pureawake', 'george_wastaken', '2024-08-28 14:36:28.529934+00'),
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
	('2024-08-28 17:16:59.76032+00', 'kendrick', 'ferngazer', '04994e24-6ed0-47e7-b588-2184167bdcde'),
	('2024-08-28 17:17:52.719319+00', 'kendrick', 'george_wastaken', '039332c3-8e99-4548-93dd-cfac011a7c9b');


--
-- Data for Name: info_findout; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."info_findout" ("id", "findout", "user_nickname") VALUES
	(1, 'от абобы', 'Ded____Inside'),
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
-- Data for Name: p_comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."p_comments" ("id", "content", "created_at", "user_nickname") VALUES
	('e065de94-931d-4524-b697-6bb4cc9af6d7', 'uioyuiyui', '2024-08-25 12:46:39.769671+00', 'pureawake'),
	('a3695338-adf3-4427-b5d3-c6786d4d89fb', 'шщшщзщзшзщш', '2024-08-25 12:48:08.1004+00', 'pureawake'),
	('d220c6bd-8790-437e-a43b-bb4a0da70324', 'АХАХАХЫВАПХХЫУПХЫВХПВВПЫПВЫВ', '2024-08-25 12:48:24.597517+00', 'pureawake'),
	('92151289-b174-42db-ab06-3e7b4e3305b2', 'asdasdsad', '2024-08-25 23:03:57.120235+00', 'discludness');


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
	(true, 'sddsas', '2024-07-03 18:35:04.817232+00', '1a44bd9d-06e1-422d-a761-58abcb5367aa', 'all');


--
-- Data for Name: posts_comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."posts_comments" ("comment_id", "id", "post_id") VALUES
	('a3695338-adf3-4427-b5d3-c6786d4d89fb', 2, 'd2a2fd1c-ca8a-4b0a-9793-d448e8bc2682'),
	('d220c6bd-8790-437e-a43b-bb4a0da70324', 3, '2db918c7-ba45-42bc-94ef-4bbf56c8ebbb'),
	('92151289-b174-42db-ab06-3e7b4e3305b2', 4, 'd2a2fd1c-ca8a-4b0a-9793-d448e8bc2682');


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
	('1a44bd9d-06e1-422d-a761-58abcb5367aa', 'pureawake');


--
-- Data for Name: reports; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: status; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."status" ("user_id", "value") VALUES
	('d905f002-1370-44c6-bef3-885063b5332f', true);


--
-- Data for Name: t_comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."t_comments" ("content", "created_at", "user_nickname", "id") VALUES
	('а когда фото?', '2024-08-25 13:23:02.703634+00', 'pureawake', 2),
	('скоро', '2024-08-25 13:23:07.409214+00', 'pureawake', 3),
	('ооо спс', '2024-08-25 13:23:19.080311+00', 'pureawake', 4),
	('XZsaXZsaXZsaXZsaXZsaXZsaXZsaXZsaXZsaXZsaXZsaXZsaXZsaXZsaXZsaXZsaXZsaXZsaXZsaXZsaXZsaXZsaXZsaXZsaXZsaXZsaXZsaXZsaXZsaXZsaXZsaXZsa', '2024-09-04 16:34:29.459349+00', 'pureawake', 5),
	('sddsfasd
', '2024-09-04 17:39:49.147801+00', 'pureawake', 6);


--
-- Data for Name: t_comments_replies; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."t_comments_replies" ("created_at", "id", "initiator_comment_id", "recipient_comment_id") VALUES
	('2024-08-25 13:23:07.482687+00', 1, 3, 2),
	('2024-09-04 17:39:49.217042+00', 2, 6, 5);


--
-- Data for Name: threads_comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."threads_comments" ("id", "thread_id", "comment_id") VALUES
	(1, 'd0a25fc4-a7d6-4e47-89d4-538cadecf2c9', 2),
	(2, 'd0a25fc4-a7d6-4e47-89d4-538cadecf2c9', 3),
	(3, 'b558eb07-d050-462b-8249-b5d34ddb1b9e', 4),
	(4, 'b558eb07-d050-462b-8249-b5d34ddb1b9e', 5),
	(5, 'b558eb07-d050-462b-8249-b5d34ddb1b9e', 6);


--
-- Data for Name: threads_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."threads_images" ("id", "images", "thread_id") VALUES
	(1, '{b558eb07-d050-462b-8249-b5d34ddb1b9e-image-0,b558eb07-d050-462b-8249-b5d34ddb1b9e-image-1}', 'b558eb07-d050-462b-8249-b5d34ddb1b9e'),
	(2, '{ea82edea-b220-4a93-8712-db27ae168bb9-image-0}', 'ea82edea-b220-4a93-8712-db27ae168bb9'),
	(3, '{f0a49e6e-ae3c-4934-a217-5c0dafada849-image-0,f0a49e6e-ae3c-4934-a217-5c0dafada849-image-1}', 'f0a49e6e-ae3c-4934-a217-5c0dafada849');


--
-- Data for Name: threads_pinned; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: threads_rating; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."threads_rating" ("id", "type", "thread_id", "user_id") VALUES
	(12, 'increment', 'b558eb07-d050-462b-8249-b5d34ddb1b9e', '73c4acab-b1ab-430b-bc42-d6da78ab1092'),
	(86, 'increment', 'b558eb07-d050-462b-8249-b5d34ddb1b9e', 'c2e8de6f-a450-4ca0-ba50-828bedb053ba'),
	(90, 'decrement', 'd0a25fc4-a7d6-4e47-89d4-538cadecf2c9', 'c2e8de6f-a450-4ca0-ba50-828bedb053ba'),
	(98, 'decrement', 'b558eb07-d050-462b-8249-b5d34ddb1b9e', 'd905f002-1370-44c6-bef3-885063b5332f'),
	(100, 'increment', 'd0a25fc4-a7d6-4e47-89d4-538cadecf2c9', 'd905f002-1370-44c6-bef3-885063b5332f');


--
-- Data for Name: threads_stars; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: threads_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."threads_tags" ("id", "tags", "thread_id") VALUES
	(2, '{"\"абоба\"","\"тред\"","\"контентище\"","\"без фото\""}', 'd0a25fc4-a7d6-4e47-89d4-538cadecf2c9'),
	(6, '{"\"тред\"","\"абоба\"","\"кошки\"","\"контентище\"","\"с фото\""}', 'b558eb07-d050-462b-8249-b5d34ddb1b9e'),
	(7, '{"\"\""}', 'ea82edea-b220-4a93-8712-db27ae168bb9'),
	(8, '{"\"\""}', 'f0a49e6e-ae3c-4934-a217-5c0dafada849');


--
-- Data for Name: threads_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."threads_users" ("thread_id", "user_nickname") VALUES
	('d0a25fc4-a7d6-4e47-89d4-538cadecf2c9', 'pureawake'),
	('b558eb07-d050-462b-8249-b5d34ddb1b9e', 'pureawake'),
	('ea82edea-b220-4a93-8712-db27ae168bb9', 'pureawake'),
	('f0a49e6e-ae3c-4934-a217-5c0dafada849', 'pureawake'),
	('1a19b4c2-7d58-40f7-a372-9b220fcf5e78', 'distribate'),
	('18896a50-3e1a-43d8-b415-446b757ee97f', 'distribate');


--
-- Data for Name: users_banned; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users_banned" ("id", "nickname", "reason", "time", "created_at") VALUES
	(1, 'kendrick', 'лох', '2024-09-04 22:36:41+00', '2024-09-03 22:36:49.933635+00');


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
	(17, '2024-10-15 17:44:56', 'real_name', 'distribate', '2024-10-15 17:39:56.536793');


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
	('shfyorcivdcjtcfynbfutjasbayhuzqmz3xrfcbs', '2024-09-22 17:53:24.226+00', 'c2508ed9-c992-4eb3-98a6-e149d01c4b2a', 'Firefox', 'amd64', NULL, false, 'Windows10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0'),
	('wduqs5xixckrxm7ifdof4suqplu6lzzrnxn5qem4', '2024-09-10 10:30:14.51+00', 'c2e8de6f-a450-4ca0-ba50-828bedb053ba', 'Chrome', 'amd64', NULL, false, 'Windows10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'),
	('g6scadwuww2os2eat4du4dh3k6zk54rsopeiqcjy', '2024-09-10 14:15:28.106+00', 'c2e8de6f-a450-4ca0-ba50-828bedb053ba', 'Chrome', 'amd64', NULL, false, 'Windows10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'),
	('mf4jzvcs2bhym7fjpkpgrm2y5bh4hbhlyddcrjpj', '2024-09-11 00:27:19.803+00', 'c2508ed9-c992-4eb3-98a6-e149d01c4b2a', 'Chrome', 'amd64', NULL, false, 'Windows10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'),
	('xbu7fdjysvop5kcnnxd3dugxmsyjt5dckdq2odei', '2024-09-24 22:20:49.384+00', 'd905f002-1370-44c6-bef3-885063b5332f', 'Chrome', 'amd64', NULL, false, 'Windows10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'),
	('ethbbwfuo5v3mlayfskiksbhw4z6r57hcgz4fadd', '2024-09-28 12:42:08.33+00', 'd905f002-1370-44c6-bef3-885063b5332f', 'Chrome', 'amd64', NULL, false, 'Windows10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'),
	('kww44ungl2tswwtyaxdxwurl6w7o6rklcwzbnuyr', '2024-10-29 17:37:12.412+00', 'ffbc7e08-1838-4d80-8931-713168de7c20', 'Firefox', 'amd64', NULL, false, 'Windows10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0');


--
-- Data for Name: users_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('user_images', 'user_images', NULL, '2024-06-24 13:46:39.726137+00', '2024-06-24 13:46:39.726137+00', true, false, 37748736, '{image/*}', NULL),
	('static', 'static', NULL, '2024-07-03 20:59:29.053004+00', '2024-07-03 20:59:29.053004+00', true, false, 0, '{image/*}', NULL),
	('threads', 'threads', NULL, '2024-08-25 13:10:01.705744+00', '2024-08-25 13:10:01.705744+00', true, false, 16777216, '{image/*}', NULL);


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") VALUES
	('2b95342e-3eb0-472f-b53e-304f9f99e85b', 'user_images', 'default/bzzvanet-.jpg', NULL, '2024-08-25 14:29:17.324063+00', '2024-08-25 14:29:17.324063+00', '2024-08-25 14:29:17.324063+00', '{"eTag": "\"047bef878d58bfcb8657da05f66179ac\"", "size": 370631, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-08-25T14:29:17.287Z", "contentLength": 370631, "httpStatusCode": 200}', '211ec8f9-0d87-4ef6-bd37-3040f21a0497', NULL, NULL),
	('65b8f68b-679c-4023-8ebb-20ed10811444', 'user_images', 'cover/c2508ed9-c992-4eb3-98a6-e149d01c4b2aNw3WWi_TCb2WSdhuV5pzF', NULL, '2024-08-25 23:12:59.430413+00', '2024-08-25 23:12:59.430413+00', '2024-08-25 23:12:59.430413+00', '{"eTag": "\"c2dd07d463891aa3e1339743adadf22d\"", "size": 3896225, "mimetype": "image/png", "cacheControl": "max-age=0", "lastModified": "2024-08-25T23:12:59.245Z", "contentLength": 3896225, "httpStatusCode": 200}', '091eba30-dfab-4a80-ad20-bef046ddce4f', NULL, '{}'),
	('4c45aacc-92a7-42cd-a20c-9b83aafcb764', 'user_images', 'cover/e0e2fb96-9de7-430b-80df-59398a20b95dmnIyjoMBpeG_Ax7p3dGB7', NULL, '2024-08-28 17:18:32.446133+00', '2024-08-28 17:18:32.446133+00', '2024-08-28 17:18:32.446133+00', '{"eTag": "\"33ebbf8cb35a1ae8e1fa1aa6b3c5cd9b\"", "size": 4702837, "mimetype": "image/png", "cacheControl": "max-age=0", "lastModified": "2024-08-28T17:18:32.223Z", "contentLength": 4702837, "httpStatusCode": 200}', '91b9fc96-d76b-463c-93a9-000e2ef494fd', NULL, '{}'),
	('2aefc661-cef2-4250-83e4-cfa75a59bc86', 'user_images', 'cover/c2e8de6f-a450-4ca0-ba50-828bedb053bal4NAWYsBowZ5s6HwUnGFq', NULL, '2024-09-10 22:20:35.635016+00', '2024-09-10 22:20:35.635016+00', '2024-09-10 22:20:35.635016+00', '{"eTag": "\"86f2c8744ef418a474ded11af287b231\"", "size": 75123, "mimetype": "image/jpeg", "cacheControl": "max-age=0", "lastModified": "2024-09-10T22:20:35.522Z", "contentLength": 75123, "httpStatusCode": 200}', '37c961e3-ba03-4886-922b-304c15796c85', NULL, '{}'),
	('74ed9b2f-65de-41e4-ba36-2cf0866159e3', 'threads', 'ea82edea-b220-4a93-8712-db27ae168bb9-image-0', NULL, '2024-09-14 15:50:38.560756+00', '2024-09-14 15:50:38.560756+00', '2024-09-14 15:50:38.560756+00', '{"eTag": "\"ad3cee4f83b5bce5a2395cf848630d25\"", "size": 4613130, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-09-14T15:50:38.061Z", "contentLength": 4613130, "httpStatusCode": 200}', 'e0872678-79e5-4911-ba24-560b1d45ef52', NULL, '{}'),
	('6dde649e-aeeb-4d89-bef0-e650b55e7e6c', 'user_images', 'cover/ffbc7e08-1838-4d80-8931-713168de7c20zhADK_wQS39LWc_xlzXdl', NULL, '2024-10-15 17:39:03.907756+00', '2024-10-15 17:39:03.907756+00', '2024-10-15 17:39:03.907756+00', '{"eTag": "\"5efb479df5173ba0fbc30a6e8a3ea4dd\"", "size": 3180693, "mimetype": "image/png", "cacheControl": "max-age=0", "lastModified": "2024-10-15T17:39:03.789Z", "contentLength": 3180693, "httpStatusCode": 200}', 'b5e48969-c892-410b-8c72-9b6d86303eaa', NULL, '{}'),
	('a85d5e41-3463-4284-8406-aed2db2d1ae4', 'user_images', 'default/adventure-in-end.jpg', NULL, '2024-08-25 14:30:26.060765+00', '2024-08-25 14:30:26.060765+00', '2024-08-25 14:30:26.060765+00', '{"eTag": "\"ee460c4af3bd442389c48a86d92411f8\"", "size": 317053, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-08-25T14:30:26.046Z", "contentLength": 317053, "httpStatusCode": 200}', '61a91072-8668-4f83-af61-389fbf760cc4', NULL, NULL),
	('da6f23db-09e6-445d-b2fa-a689408eb9c4', 'threads', 'f0a49e6e-ae3c-4934-a217-5c0dafada849-image-0', NULL, '2024-09-14 15:52:09.002036+00', '2024-09-14 15:52:09.002036+00', '2024-09-14 15:52:09.002036+00', '{"eTag": "\"86f2c8744ef418a474ded11af287b231\"", "size": 75123, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-09-14T15:52:08.980Z", "contentLength": 75123, "httpStatusCode": 200}', '06ddefa0-931f-4fd6-b6a7-38080326dca7', NULL, '{}'),
	('4be6f104-6986-4edb-9b83-457aee692474', 'threads', 'f0a49e6e-ae3c-4934-a217-5c0dafada849-image-1', NULL, '2024-09-14 15:52:09.252436+00', '2024-09-14 15:52:09.252436+00', '2024-09-14 15:52:09.252436+00', '{"eTag": "\"2bb01bc64757aceab04b64335a4a1328\"", "size": 533645, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-09-14T15:52:09.200Z", "contentLength": 533645, "httpStatusCode": 200}', '19dc6af2-bddd-4879-8a11-726917c9186a', NULL, '{}'),
	('18b7077b-fe56-4f52-b661-59062a391c83', 'user_images', 'default/render-warden-hide.jpg', NULL, '2024-08-24 19:47:07.320126+00', '2024-08-24 19:47:07.320126+00', '2024-08-24 19:47:07.320126+00', '{"eTag": "\"72569e9110c34d8456d0f5202190f57f\"", "size": 292849, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-08-24T19:47:07.084Z", "contentLength": 292849, "httpStatusCode": 200}', '2299a6f5-e376-4e5e-89a3-ce70fc5805f3', NULL, NULL),
	('cd493ad2-9398-4610-9ff6-2daa1640cc73', 'user_images', 'default/village-art.jpg', NULL, '2024-08-24 19:47:07.354842+00', '2024-08-24 19:47:07.354842+00', '2024-08-24 19:47:07.354842+00', '{"eTag": "\"5c6e76ea1077c09f69ce365364fe9bf4\"", "size": 355625, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-08-24T19:47:07.024Z", "contentLength": 355625, "httpStatusCode": 200}', '165443da-626d-490e-8cf8-8f9d2979a12f', NULL, NULL),
	('e08dadbe-322d-4fd3-b2f5-24483d17cb76', 'user_images', 'default/snow-mountain.jpg', NULL, '2024-08-24 19:47:07.308209+00', '2024-08-24 19:47:07.308209+00', '2024-08-24 19:47:07.308209+00', '{"eTag": "\"332592e326adc249d297baa2b675ca94\"", "size": 299800, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-08-24T19:47:07.014Z", "contentLength": 299800, "httpStatusCode": 200}', '2383a69e-f528-4f21-b9df-46aed6f31feb', NULL, NULL),
	('e7bb9cbf-3a25-453f-a7fc-75b518744619', 'user_images', 'default/sand-adventure.jpg', NULL, '2024-08-24 19:47:07.348843+00', '2024-08-24 19:47:07.348843+00', '2024-08-24 19:47:07.348843+00', '{"eTag": "\"9090d1e3382cc573078a9f3710c00dac\"", "size": 309312, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-08-24T19:47:07.084Z", "contentLength": 309312, "httpStatusCode": 200}', 'b591626e-5233-4dcd-a0cf-4c801ed887a3', NULL, NULL),
	('ba0ae506-fb74-42e3-9a9e-a168ee37e805', 'user_images', 'default/bees.jpg', NULL, '2024-08-24 19:47:07.365945+00', '2024-08-24 19:47:07.365945+00', '2024-08-24 19:47:07.365945+00', '{"eTag": "\"2bb01bc64757aceab04b64335a4a1328\"", "size": 533645, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-08-24T19:47:07.024Z", "contentLength": 533645, "httpStatusCode": 200}', '1ef44733-fb51-40cd-9ddf-6970757239dc', NULL, NULL),
	('c94e4911-a9a0-4c5a-993c-6e357b932c4b', 'user_images', 'default/sand-camel.jpg', NULL, '2024-08-24 19:47:07.300225+00', '2024-08-24 19:47:07.300225+00', '2024-08-24 19:47:07.300225+00', '{"eTag": "\"be63da46d059e2fb51e8f40c7107ef6a\"", "size": 311190, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-08-24T19:47:07.014Z", "contentLength": 311190, "httpStatusCode": 200}', '1d45853b-612d-404f-a6c5-dd257efe938f', NULL, NULL),
	('f88708a5-a922-4160-9257-75692a115b20', 'user_images', 'default/adventure-in-blossom.jpg', NULL, '2024-08-24 19:47:13.70809+00', '2024-08-24 19:47:13.70809+00', '2024-08-24 19:47:13.70809+00', '{"eTag": "\"e9cb1489e81158dfe1cefed74cde2053\"", "size": 600052, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-08-24T19:47:13.685Z", "contentLength": 600052, "httpStatusCode": 200}', 'e96105c4-36a1-4be5-93b9-61d832be07d7', NULL, NULL),
	('96ae2bc6-c8ab-419e-af02-5248d8a4025e', 'user_images', 'default/rain-weather.jpg', NULL, '2024-08-24 19:47:16.089968+00', '2024-08-24 19:47:16.089968+00', '2024-08-24 19:47:16.089968+00', '{"eTag": "\"e5c8c76a941035a8cfaf12b8f799ab36\"", "size": 478479, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-08-24T19:47:16.065Z", "contentLength": 478479, "httpStatusCode": 200}', 'd80f6963-da72-451b-ae96-8a285dbfafce', NULL, NULL),
	('acc953d9-cfe5-4464-9beb-bdeb9ab6c318', 'threads', 'b558eb07-d050-462b-8249-b5d34ddb1b9e-image-0', NULL, '2024-08-25 13:11:21.58453+00', '2024-08-25 13:11:21.58453+00', '2024-08-25 13:11:21.58453+00', '{"eTag": "\"6b21ad6349de906d6096bc8e974fbb68\"", "size": 28946, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-08-25T13:11:21.516Z", "contentLength": 28946, "httpStatusCode": 200}', '5ed76f9e-6d36-46aa-9278-540e1d8fcfaf', NULL, '{}'),
	('08a154fb-501e-443e-bd19-839b318986ad', 'threads', 'b558eb07-d050-462b-8249-b5d34ddb1b9e-image-1', NULL, '2024-08-25 13:11:21.723326+00', '2024-08-25 13:11:21.723326+00', '2024-08-25 13:11:21.723326+00', '{"eTag": "\"48a855855f7b3cbf83a185d339be30ab\"", "size": 32593, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-08-25T13:11:21.716Z", "contentLength": 32593, "httpStatusCode": 200}', '2487760d-741a-44be-b520-2ba7b487d0af', NULL, '{}'),
	('3bb0695a-5c4a-4491-8fd6-1295a5d3e596', 'static', 'items/belkoin_wallet.png', NULL, '2024-08-25 13:39:34.272726+00', '2024-08-25 13:39:34.272726+00', '2024-08-25 13:39:34.272726+00', '{"eTag": "\"496ab8ea0fe63690cc39cc488bd58a95\"", "size": 7703, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-08-25T13:39:34.215Z", "contentLength": 7703, "httpStatusCode": 200}', 'c14b5e0f-000d-48b9-8a2f-5202747836d3', NULL, NULL),
	('5f8cbea4-ddb0-4237-88fc-7eef2fd2b969', 'static', 'items/fancy_feather.webp', NULL, '2024-08-25 13:39:34.274035+00', '2024-08-25 13:39:34.274035+00', '2024-08-25 13:39:34.274035+00', '{"eTag": "\"7804e81bbebf368f4eaa74e1d43e4586\"", "size": 216, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2024-08-25T13:39:34.215Z", "contentLength": 216, "httpStatusCode": 200}', 'a0ea309d-052d-4d6a-94c5-90040a9a5219', NULL, NULL),
	('287b4256-d96b-40a7-8f4a-e5fd75cd7053', 'static', 'items/iron_helmet.webp', NULL, '2024-08-25 13:39:34.434278+00', '2024-08-25 13:39:34.434278+00', '2024-08-25 13:39:34.434278+00', '{"eTag": "\"e12b449e3f611b7e5761a9ab9c7fb2d1\"", "size": 120, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2024-08-25T13:39:34.385Z", "contentLength": 120, "httpStatusCode": 200}', '2ff9346f-6586-4202-9794-fd8f9c2b38d7', NULL, NULL),
	('e9dde739-4c5a-45db-a6cd-ea4c626af42b', 'static', 'items/barrier.webp', NULL, '2024-08-25 13:39:34.746647+00', '2024-08-25 13:39:34.746647+00', '2024-08-25 13:39:34.746647+00', '{"eTag": "\"b3c484b0196a4db5f906bbd483e17aa5\"", "size": 170, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2024-08-25T13:39:34.705Z", "contentLength": 170, "httpStatusCode": 200}', '49455cfd-6177-4f98-b1cf-02a0c2255e85', NULL, NULL),
	('5016781a-92f9-4008-b045-b1cdd8d8e310', 'static', 'items/diamond_pickaxe.webp', NULL, '2024-08-25 13:39:34.275624+00', '2024-08-25 13:39:34.275624+00', '2024-08-25 13:39:34.275624+00', '{"eTag": "\"2b4c606b1fec45285f8aced7e91979b1\"", "size": 208, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2024-08-25T13:39:34.215Z", "contentLength": 208, "httpStatusCode": 200}', '61fa124d-77d3-4153-8846-31d1353e36f9', NULL, NULL),
	('bbc6eb87-1a88-4156-8754-06d16df2cf51', 'static', 'items/elytra.webp', NULL, '2024-08-25 13:39:34.377537+00', '2024-08-25 13:39:34.377537+00', '2024-08-25 13:39:34.377537+00', '{"eTag": "\"8258d064c7192324d36f8abc9e996f80\"", "size": 200, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2024-08-25T13:39:34.355Z", "contentLength": 200, "httpStatusCode": 200}', 'd66c5ac7-88b9-46aa-9acc-0f5aad9f7280', NULL, NULL),
	('08388571-8cab-446b-804d-3c727476dd14', 'static', 'items/firework.webp', NULL, '2024-08-25 13:39:34.31163+00', '2024-08-25 13:39:34.31163+00', '2024-08-25 13:39:34.31163+00', '{"eTag": "\"87792a440b26cff05a2e89eaa4eeca30\"", "size": 156, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2024-08-25T13:39:34.225Z", "contentLength": 156, "httpStatusCode": 200}', '04281066-731c-44b5-b590-bb77a77b4eb7', NULL, NULL),
	('36b84fae-58f9-48d9-832a-67d31733b857', 'static', 'items/missing_texture.webp', NULL, '2024-08-25 13:39:34.470719+00', '2024-08-25 13:39:34.470719+00', '2024-08-25 13:39:34.470719+00', '{"eTag": "\"f543ead08fdf738b29d4583fd7f10447\"", "size": 54, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2024-08-25T13:39:34.445Z", "contentLength": 54, "httpStatusCode": 200}', '32803215-8c6b-401b-95e6-51800f885ab5', NULL, NULL),
	('36d8cf29-a25a-463b-baa4-fe8272b1265c', 'static', 'items/allay_spawn_egg.webp', NULL, '2024-08-25 13:39:34.741899+00', '2024-08-25 13:39:34.741899+00', '2024-08-25 13:39:34.741899+00', '{"eTag": "\"03ca41fb820dba152bd67d5a26fe9318\"", "size": 312, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2024-08-25T13:39:34.705Z", "contentLength": 312, "httpStatusCode": 200}', '38f525cf-fd54-45b1-b95c-ec30ab30f174', NULL, NULL),
	('b484dbff-86a4-4993-9b87-faa945340602', 'static', 'items/bust_painting.webp', NULL, '2024-08-25 13:39:34.316854+00', '2024-08-25 13:39:34.316854+00', '2024-08-25 13:39:34.316854+00', '{"eTag": "\"841f7fee2c27666998c1788f6eeb7b2a\"", "size": 3240, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2024-08-25T13:39:34.255Z", "contentLength": 3240, "httpStatusCode": 200}', 'a93e01b2-8755-4be0-b209-f7bee684fce9', NULL, NULL),
	('8a8ccd5e-4ebc-4b37-997e-90c9c77bcdcf', 'static', 'items/minecart_chest.webp', NULL, '2024-08-25 13:39:34.458553+00', '2024-08-25 13:39:34.458553+00', '2024-08-25 13:39:34.458553+00', '{"eTag": "\"6946fcbedd07fa61d682736490b5b1f4\"", "size": 326, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2024-08-25T13:39:34.445Z", "contentLength": 326, "httpStatusCode": 200}', '8fd832f6-3807-43c8-8038-df164e9c0e49', NULL, NULL),
	('e5e38548-b448-4468-8396-385441f2d42c', 'static', 'items/arrow_of_swiftness.webp', NULL, '2024-08-25 13:39:34.722548+00', '2024-08-25 13:39:34.722548+00', '2024-08-25 13:39:34.722548+00', '{"eTag": "\"893982e52694bdf1c2744ef07177d9ba\"", "size": 226, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2024-08-25T13:39:34.685Z", "contentLength": 226, "httpStatusCode": 200}', '7d430e1b-f680-4beb-8f44-b3bbabec019d', NULL, NULL),
	('07efc1bd-96b5-4d81-8c61-41ef00a30c73', 'static', 'auth_background/6.png', NULL, '2024-08-25 14:17:07.251725+00', '2024-08-25 14:18:02.631706+00', '2024-08-25 14:17:07.251725+00', '{"eTag": "\"c3865e2cf657239d0311c8d322161a35\"", "size": 1094977, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-08-25T14:18:02.600Z", "contentLength": 1094977, "httpStatusCode": 200}', 'a6535eaf-6cc5-400a-ade5-801298cc0ec1', NULL, NULL),
	('a71b1a3d-e5cd-47d2-af8a-b61cfce29ea4', 'static', 'auth_background/8.png', NULL, '2024-08-25 14:17:07.574324+00', '2024-08-25 14:18:13.358757+00', '2024-08-25 14:17:07.574324+00', '{"eTag": "\"c2dd07d463891aa3e1339743adadf22d\"", "size": 3896225, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-08-25T14:18:13.211Z", "contentLength": 3896225, "httpStatusCode": 200}', 'ddbd86b6-db8a-48ea-9c05-70fffbe2c904', NULL, NULL),
	('7deb5f6a-22b7-4482-a421-f13fbd1feaa3', 'static', 'auth_background/7.png', NULL, '2024-08-25 14:17:07.972215+00', '2024-08-25 14:18:07.273+00', '2024-08-25 14:17:07.972215+00', '{"eTag": "\"593a4ec31bc39e95ed9526a74c6b657c\"", "size": 3891117, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-08-25T14:18:07.180Z", "contentLength": 3891117, "httpStatusCode": 200}', '1a0398ed-81be-4559-ab5e-91875a3d9b36', NULL, NULL),
	('3579c622-04cc-4562-b918-18589082d251', 'static', 'auth_background/4.png', NULL, '2024-08-25 14:17:08.173945+00', '2024-08-25 14:17:58.439561+00', '2024-08-25 14:17:08.173945+00', '{"eTag": "\"9ffecd39148de915fa8bef9e84e6d7e3\"", "size": 2553120, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-08-25T14:17:58.380Z", "contentLength": 2553120, "httpStatusCode": 200}', '6b3f134d-9e99-4626-aa8f-050e7889e002', NULL, NULL),
	('c6e5ac70-86fa-45b6-a7b4-8a3746b8d901', 'static', 'auth_background/5.png', NULL, '2024-08-25 14:17:08.226694+00', '2024-08-25 14:18:00.651187+00', '2024-08-25 14:17:08.226694+00', '{"eTag": "\"ad3cee4f83b5bce5a2395cf848630d25\"", "size": 4613130, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-08-25T14:18:00.460Z", "contentLength": 4613130, "httpStatusCode": 200}', 'c9d3fdc5-7919-467e-96d6-5ef32f55808f', NULL, NULL),
	('806282c3-464b-497e-8ced-54a71def1771', 'static', 'auth_background/3.png', NULL, '2024-08-25 14:17:08.058015+00', '2024-08-25 14:17:53.942505+00', '2024-08-25 14:17:08.058015+00', '{"eTag": "\"edbdb3bfcc5804329e892ec9b5e9b71e\"", "size": 3392696, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-08-25T14:17:53.750Z", "contentLength": 3392696, "httpStatusCode": 200}', '48fe0b92-60c7-4c19-a678-87db2ea2083d', NULL, NULL),
	('4cc5aebe-2c84-4b6c-b665-de04347b3313', 'static', 'auth_background/2.png', NULL, '2024-08-25 14:17:08.208272+00', '2024-08-25 14:17:56.09265+00', '2024-08-25 14:17:08.208272+00', '{"eTag": "\"73ce42b8a7db412e78e6d0af84b0d50b\"", "size": 2317700, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-08-25T14:17:55.990Z", "contentLength": 2317700, "httpStatusCode": 200}', '8002e8ed-17f0-4210-a2a3-ecc9602526e6', NULL, NULL),
	('eb97ac66-4889-4882-aa70-5be92a233225', 'static', 'auth_background/1.png', NULL, '2024-08-25 14:17:08.206446+00', '2024-08-25 14:17:48.241331+00', '2024-08-25 14:17:08.206446+00', '{"eTag": "\"33ebbf8cb35a1ae8e1fa1aa6b3c5cd9b\"", "size": 4702837, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-08-25T14:17:47.809Z", "contentLength": 4702837, "httpStatusCode": 200}', '1321ca12-5964-427d-b15b-1d145e53ff47', NULL, NULL),
	('e9906127-9e63-4911-816a-a78fe7a871bd', 'static', 'items/dirt.webp', NULL, '2024-08-25 13:39:34.283107+00', '2024-08-25 13:39:34.283107+00', '2024-08-25 13:39:34.283107+00', '{"eTag": "\"91b4035180b33e243c720454c6c5e00c\"", "size": 290, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2024-08-25T13:39:34.215Z", "contentLength": 290, "httpStatusCode": 200}', 'df7352ad-d84f-48b3-a680-57867f667ac7', NULL, NULL);


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

SELECT pg_catalog.setval('"public"."config_minecraft_items_id_seq1"', 13, true);


--
-- Name: info_findout_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."info_findout_id_seq"', 10, true);


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
-- Name: posts_comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."posts_comments_id_seq"', 1, false);


--
-- Name: posts_comments_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."posts_comments_id_seq1"', 4, true);


--
-- Name: reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."reports_id_seq"', 1, false);


--
-- Name: t_comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."t_comments_id_seq"', 6, true);


--
-- Name: t_comments_replies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."t_comments_replies_id_seq"', 1, false);


--
-- Name: t_comments_replies_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."t_comments_replies_id_seq1"', 2, true);


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

SELECT pg_catalog.setval('"public"."threads_comments_id_seq1"', 5, true);


--
-- Name: threads_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."threads_images_id_seq"', 1, false);


--
-- Name: threads_images_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."threads_images_id_seq1"', 3, true);


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

SELECT pg_catalog.setval('"public"."threads_rating_id_seq1"', 103, true);


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

SELECT pg_catalog.setval('"public"."threads_tags_id_seq1"', 9, true);


--
-- Name: users_banned_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."users_banned_id_seq"', 1, false);


--
-- Name: users_banned_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."users_banned_id_seq1"', 1, true);


--
-- Name: users_blocked_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."users_blocked_id_seq"', 1, false);


--
-- Name: users_requests_timeout_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."users_requests_timeout_id_seq"', 17, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;

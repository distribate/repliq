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
	('mongoose', 'mongoose', '$2a$10$4.jDKk1rZUDKBuxS8B.ajeXaQzxx0Tq.baiRHAjL7is1O9CTCZywK', '', '', 1719656421413, '0e303495-341d-3999-bd9b-2245f39cc0e6', '', '127.0.0.1', 1719656421507, 1719656421498),
	('Ded____Inside', 'ded____inside', '$2a$10$yDHRmU8Ro2hv5yGmeXEBH.r7JMP23KAvvl01kmdKc9DkvLC.tRONu', '127.0.0.1', '', 1720034051747, 'e9a7380d-c788-3da9-99ef-f896405d4135', '', '127.0.0.1', 1720034051848, 1720034051835);


--
-- Data for Name: SOCIAL; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."category" ("description", "id", "title") VALUES
	('', 1, 'Идеи и предложения'),
	(NULL, 2, 'Сообщество'),
	(NULL, 3, 'Жалобы'),
	(NULL, 4, 'Помощь'),
	(NULL, 5, 'Гайды');


--
-- Data for Name: threads; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."threads" ("content", "created_at", "description", "title", "comments", "permission", "auto_remove", "id") VALUES
	('asdasdsdaasd', '2024-07-04 13:50:45.904886', 'test test desc', 'aboba test', true, false, false, 'e9bbc4cd-7668-4bee-aa7a-59d4a147185c'),
	('привет ;)', '2024-07-04 15:09:51.825165', '', 'Приветственный тред', true, false, false, '64cdce51-53ec-4155-b28e-db2199993343'),
	('Hey everyone,

With the ongoing trend towards remote work, I wanted to gather some of the best practices that have helped you stay productive and maintain a good work-life balance. Here are a few that work for me:

1. Setting a consistent schedule
2. Creating a dedicated workspace
3. Taking regular breaks
4. Using project management tools

Looking forward to hearing your tips and experiences!

Cheers,
Alex', '2024-07-04 16:58:44.568804', NULL, 'Best Practices for Remote Work', false, false, false, 'f5232406-c72a-4c61-8046-947bb4e94551'),
	('Hi book lovers,

As we approach the end of the year, I thought it would be great to share our favorite books from this year. Fiction, non-fiction, self-help, anything goes! What were the books that you couldn’t put down?

Here are mine:
- “Where the Crawdads Sing” by Delia Owens
- “Educated” by Tara Westover
- “The Silent Patient” by Alex Michaelides

Can’t wait to add more to my reading list!

Happy reading,
Lucas', '2024-07-04 16:59:06.892867', NULL, 'Best Books of the Year', true, true, false, '50d5d02d-cd20-4f54-9756-04269fb2fbd7');


--
-- Data for Name: category_threads; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."category_threads" ("category_id", "thread_id") VALUES
	(1, 'e9bbc4cd-7668-4bee-aa7a-59d4a147185c'),
	(2, '64cdce51-53ec-4155-b28e-db2199993343'),
	(2, 'f5232406-c72a-4c61-8046-947bb4e94551'),
	(2, '50d5d02d-cd20-4f54-9756-04269fb2fbd7');


--
-- Data for Name: config_advertisement; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: config_alerts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."config_alerts" ("id", "created_at", "title", "link") VALUES
	(1, '2024-07-04 12:12:02.483728+00', 'Вступайте в телеграмм-канал проекта!', 'https://t.me/fasberry');


--
-- Data for Name: config_minecraft_facts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."config_minecraft_facts" ("id", "fact") VALUES
	(1, 'Изначально Крипер не был мобом — он появился в результате ошибки при создании свиньи. Позже ему изменили текстуру и добавили способность взрываться.'),
	(2, 'У снежного голема есть лицо за маской из тыквы.'),
	(3, 'С шансом в 0.01% в главном меню вместо большой надписи "Minecraft" появится название с ошибкой "Minceraft".'),
	(4, 'Язык Странников Края (Эндермэнов) — английский задом наперед.'),
	(5, 'Верстак в мире Minecraft можно использовать как компас — на северной его части всегда будет текстура с пилой и молотком, независимо от положения игрока в момент установки блока.'),
	(6, 'Все коровы в Minecraft — женского пола, так как все дают молоко.'),
	(7, 'Свинью можно превратить в свинозомби, если по ней ударит молния.'),
	(8, 'А если ударить молнией в Крипера, то он станет заряженным. Сила и радиус взрыва будут увеличены.'),
	(9, 'В Странника Края невозможно попасть стрелой из лука, снежком или яйцом. На него также нельзя уронить наковальню.'),
	(10, 'Однако если выстрелить в него стрелой с эффектом, то, хоть стрела не попадёт в моба, он всё равно получит её эффект.'),
	(11, 'Сундук невозможно поджечь или сдвинуть поршнем.'),
	(12, 'Попавший в паутину Ифрит не может стрелять. Также ему можно нанести урон снежками.'),
	(13, 'Спавн Слизней зависит от фазы луны — больше всего их будет в полнолуние, а в новолуние спавн Слизней приостановлен.'),
	(14, 'Иероглифы в столе зачарования — не спонтанно нарисованные буквы, а настоящий шифр, имеющий смысл.'),
	(15, 'Криперы хоть и не имеют рук, но всё равно способны подниматься по лестницам.'),
	(16, 'Есть заблуждение, что обсидиан невозможно сломать рукой. Это не правда — на его уничтожение в таком случае уйдёт 4 минуты и 10 секунд. Однако сломав его, он не выпадет, так как добывать его, соответственно, можно только алмазной киркой.'),
	(17, 'Никогда не спите в Нижнем Мире. При взаимодействии с кроватью, она взорвётся и вы получите урон.'),
	(18, 'В самых ранних версиях игры со скелетов с небольшим шансом мог выпасть колчан. Он позволял стрелять из лука, не тратя стрелы. Данный предмет вскоре удалили, и добавили зачарование "Бесконечность" с тем же эффектом.'),
	(19, 'Кактус в доме можно использовать вместо мусорного ведра — когда выпавший предмет касается его, он пропадает.'),
	(20, 'Переименовав моба с помощью бирки, используя имена "Grumm" или "Dinnerbone", вы перевернёте игровую модель данного моба.'),
	(21, 'Если вы переименуете большого или среднего слизня, то, убив его, более мелкие слизни также сохранят имя, данное "предку".'),
	(22, 'Самое интересное про бирки: если переименуете овцу в "jeb_", то она станет переливаться радужным цветом. Jeb_ — ник одного из разработчиков игры.'),
	(23, 'Немного о разработчиках: Notch и Jeb_ (Маркус Перссон и Йенс Бергенстен, соответственно) были включены в 100 самых влиятельных людей планеты 2013 года по версии журнала "Time".'),
	(24, 'Концептом для чёрно-белой кошки в Minecraft служила настоящая кошка Йенса — Ньютон.'),
	(25, 'Самые маленькие мобы в игре — детёныш черепахи, чешуйница Края и летучая мышь.'),
	(26, 'Если умереть в битве с Гастом, или быть в его поле зрения во время смерти, то он всё равно будет в вас стрелять, пока вы не возродитесь.'),
	(27, 'Надев на голову тыкву, вы спокойно можете смотреть на Странников Края — они не будут вас атаковать.'),
	(28, 'Обычно с скелетов лук в правой руке, однако с шансом в 5% он может появится в левой.'),
	(29, 'На Хэллоуин (31 октября) зомби и скелеты могут появится с тыквой или светильником Джека на голове.'),
	(30, 'А на 24-25 декабря сундуки приобретают праздничный рождественский вид.'),
	(31, 'Если курица/свинья/корова/овца будут убиты, будучи подожжёными, то мясо, выпавшее с них, будет сразу пожареным.'),
	(32, 'Скелет-наездник заспавнится на пауке с шансом 1%.'),
	(33, 'Любые пауки неуязвимы к зелью отравления.'),
	(34, 'Пещерные пауки появляются только рядом со спавнером.'),
	(35, 'Ведьма не может сгореть в лаве или утонуть в воде.'),
	(36, 'Странник Края получают урон от воды. Более того, им можно нанести урон с помощью пузырька с водой.'),
	(37, 'Изначально зелья должны были вариться в котлах, по позже способ их создания заменили на варочную стойку.'),
	(38, 'Железный голем может подарить жителям или детям цветок. Это отслыка к аниме "Небесный Замок Лапута".'),
	(39, 'Железный голем, наряду с Разорителем, — третий моб в игре по количеству здоровья (100 HP). На первом месте Иссушитель (300 HP), а на втором Дракон Края (200 HP).'),
	(40, 'Снежками можно отталкивать огненные шары Гастов.'),
	(41, 'Зомби-жителя можно вылечить, если кинуть в него зелье слабости и нажать ПКМ золотым яблоком.'),
	(42, 'Если поставить ковёр сверху забора, то вы сможете перепрыгнуть такую конструкцию, а вот мобы — нет.'),
	(43, 'Есть возможность изменить цвет луча маяка. Достаточно поставить блок стекла того цвета, которым вы хотите окрасить луч.'),
	(44, 'Когда вы находите Портал в Край, то некоторые Очи Края уже буду установлены в рамку. Суть: есть шанс один к триллиону, что все рамки будут заполнены и Портал будет сразу же активированным.'),
	(45, 'Держа в руках краситель и нажав ПКМ по табличке, вы сможете изменить цвет надписи.'),
	(46, 'Если песок, гравий или яйцо Дракона упадут на факел, то они выпадут как предмет и их можно будет подобрать.'),
	(47, 'Лук при максимальном натяжении может сломать лодку и вагонетку'),
	(48, 'Молоко убирает эффекты яда и зелий'),
	(49, 'Если песок душ разместить поверх льда, он будет замедлять еще сильнее'),
	(50, 'Если стрелять через лаву, то стрелы будут наносить еще и повреждения от огня'),
	(51, 'Тыква на голове отпугивает эндерменов (они не нападают, даже если смотреть прямо на них)'),
	(52, 'Яйцо дракона можно получить, сдвинув его поршнем'),
	(53, 'Слизни всегда прыгают только по прямой линии и не могут плавать'),
	(54, 'Взрыв ТНТ убирает лаву'),
	(55, 'Если нажать на грибную корову правой кнопкой с зажатой в руке миской, то вы получите тушеные грибы'),
	(56, 'Если под падающим блоком гравия или песка находится факел, то блоки гравия или песка разрушатся при падении'),
	(57, 'В дождь рыба ловится лучше'),
	(58, 'Если предмет бросить в текущую по льду воду, то он поплывет невероятно быстро'),
	(59, 'Нажимные плиты преграждают распространение воды и лавы'),
	(60, 'Через сундуки и таблички нельзя увидеть имя игрока'),
	(61, 'Если эндермена убивает железный голем, то всегда выпадает жемчужина'),
	(62, 'Рыбу можно ловить и под водой'),
	(63, 'Адский забор и обычный не соединяются'),
	(64, 'Обсидиан и админиум нельзя сдвинуть поршнями'),
	(65, 'Здоровье не восстанавливается, если шкала еды меньше 79%'),
	(68, 'С помощью кактуса можно уничтожить предмет'),
	(69, 'Дождь с небольшим шансом заполняет котел'),
	(70, 'Если около крипера паутина, то отсчет времени до взрыва длится дольше'),
	(71, 'Во время роста саженцы уничтожают стекло на своем пути'),
	(72, 'Днем и в полностью освещенной комнате пауки дружелюбны, если на них не напасть'),
	(73, 'Если поджечь корову или свинью, с них выпадет жареное мясо'),
	(74, 'Лавовый куб не получает повреждений от падений'),
	(75, 'Некоторое время назад спрута можно было подоить'),
	(76, 'Взрыв ТНТ уничтожает 70% предметов вокруг'),
	(77, 'У яйца есть шанс равный 1/256 одновременно наспавнить четырех куриц'),
	(78, 'Вагонеткой можно управлять, как машиной, если в вагонетке сидит оседланная свинья, а вы на ней'),
	(79, 'Таблички, заборы, лестницы, ворота и люки преграждают путь воде по горизонтали и вертикали'),
	(80, 'Вода и лава текут к ближайшему углублению'),
	(81, 'На свинозомби не действует лава и огонь'),
	(82, 'Если кинуть яйцо в спокойного паука, то он все равно останется нейтральным'),
	(83, 'Во время грозы можно спать, даже если на дворе день'),
	(84, 'Волки не нападают на криперов'),
	(66, 'Если криперы и скелеты не в состоянии нападения, они не видят игрока через стекло'),
	(85, 'В Эндермена невозможно попасть стрелой, яйцом или снежком'),
	(86, 'Изначально губка обладала способностью впитывать всю жидкость в радиусе 2 блоков. Теперь это просто декорация'),
	(87, 'Если днем паук упадет и получит повреждение от падения или уколется об кактус, то он снова станет нейтральным'),
	(88, 'Полублоки не обрывают цепь рэдстоуна'),
	(89, 'Для того, чтобы разбить обсидиан рукой, нужно 4 минуты и 10 секунд'),
	(90, 'Если зомби и скелеты стоят на песке душ, то утром они не сгорят'),
	(91, 'Если под деревянной нажимной плитой находится огонь, то ее можно активировать стрелой'),
	(92, 'Огненному шару можно нанести критический удар'),
	(93, 'Съев паучий глаз, вы отравитесь'),
	(94, 'В отличие от маленьких слизней, маленькие лавовые кубы наносят повреждения игроку'),
	(95, 'Если огромный слизень сидит в вагонетке, то вагонетку не видно, и толкнуть ее можно только другой вагонеткой'),
	(96, 'Звуки, которые издает гаст, принадлежат кошке C418'),
	(97, 'Сундук можно открыть, если над ним расположен другой сундук или не цельный блок (ступени, полублоки, стекло, заборы и т.д.)');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users" ("acceptrules", "birthday", "created_at", "description", "id", "nickname", "status", "uuid", "cover_image", "name_color", "donate_weight", "visibility", "real_name") VALUES
	(true, NULL, '2024-07-03 16:52:49.047513', 'someday you have to', '10282229-ae9e-4fa5-9237-7bd35dd07120', 'george_wastaken', NULL, '71fe71d1-0161-32cd-8b57-a76486d69aee', 'cover/10282229-ae9e-4fa5-9237-7bd35dd07120TEhn8k1Sn6WninInsS2uH', '#FFFFFF', 0, 'all', NULL),
	(true, NULL, '2024-07-03 22:10:13.034092', NULL, '988aecf5-28a2-4d62-9625-284b8d401a8b', 'Ded____Inside', NULL, 'e9a7380d-c788-3da9-99ef-f896405d4135', 'cover/988aecf5-28a2-4d62-9625-284b8d401a8bjxS6UPQTGRktAf0pE7bmQ', '#FFFFFF', 0, 'all', NULL),
	(true, NULL, '2024-06-29 10:22:43.94017', 'абоба полная', '82146009-5574-476a-9254-013937d75132', 'mongoose', NULL, '0e303495-341d-3999-bd9b-2245f39cc0e6', 'cover/82146009-5574-476a-9254-013937d75132p3N8LL_iD0MyzTI0PAMcl', '#FFFFFF', 43, 'all', NULL),
	(true, NULL, '2024-06-22 21:07:32.429882', 'Я админ', 'd905f002-1370-44c6-bef3-885063b5332f', 'pureawake', NULL, 'a6570be9-f25f-3767-bd09-6588cac34cdb', 'cover/d905f002-1370-44c6-bef3-885063b5332fyLxE87j_txri6BkYmtAO-', '#ffffff', 2, 'friends', NULL),
	(true, NULL, '2024-06-22 18:29:11.063752', 'я', 'c2e8de6f-a450-4ca0-ba50-828bedb053ba', 'discludness', NULL, '5744cd36-94bd-3e2f-9c97-aa564b146417', 'cover/c2e8de6f-a450-4ca0-ba50-828bedb053baKwbA4Q1JGOeAX2PA9WuAr', '#ffffff', 1, 'friends', NULL);


--
-- Data for Name: friends_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: info_findout; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."info_findout" ("user_nickname", "findout", "id") VALUES
	('Ded____Inside', 'от абобы', 1);


--
-- Data for Name: p_comments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."posts" ("content", "post_id", "visibility", "created_at", "comments") VALUES
	('Сегодня был отличный день! Прогулялся по парку, наслаждался солнечной погодой и встретил старых друзей. Жизнь прекрасна, когда окружен хорошими людьми. 💖', 'a36aa1b6-bbab-426b-8b3e-2c56ee0ecf78', 'all', '2024-06-29 10:57:50.493599+00', true),
	('🎮 Всем привет! Недавно нашёл в Minecraft новое эпическое подземелье! 🌌 Это просто невероятно! Готовьтесь к приключению и собирайте ресурсы! ⚒️ Сталкивался с новыми, очень сильными мобами, но награды стоят того! 💎 Советую брать с собой больше факелов и зелий, чтобы выжить. 🏰 Кстати, кто уже исследовал это подземелье? Делитесь своими находками и стратегиями! 🚀 Давайте вместе разгадаем все тайны этого места! #Minecraft #Приключения #Подземелье', 'd2a2fd1c-ca8a-4b0a-9793-d448e8bc2682', 'all', '2024-06-29 10:57:50.493599+00', true),
	('ПОЛНАЯ АБОБА 🤣🤣🤣🤣', 'a3b4a325-c6b8-46b0-9f28-ecc77471b926', 'friends', '2024-06-28 10:57:50+00', true),
	('uwu 👣', 'dabf5a2a-b9cf-4b7f-a4cb-30b00065497b', 'only', '2024-07-01 11:28:04.306058+00', true),
	('седня жиденько покакал', 'd62d6377-d383-421d-90cb-839a2777861d', 'all', '2024-06-29 17:23:57.249775+00', true),
	('А зачем какать? Скажите парни', '39bd527b-17ec-4866-8bf6-2db02177acd3', 'friends', '2024-07-01 11:40:11.187736+00', true),
	('🎮 Привет, искатели приключений! 🌍 Сегодня нашёл новое подземелье в Minecraft, и это что-то с чем-то! ⚔️ Оно просто огромное и полное опасностей! Сначала пришлось сразиться с кучей скелетов и зомби, а потом ещё и пауки налетели. 😱 Но самое интересное началось, когда нашёл сокровищницу с редкими ресурсами и зачарованным оружием! 💎 Не забудьте взять с собой побольше факелов и зелий исцеления, они там очень пригодятся. 🏰 В центре подземелья есть сложная головоломка, которую мы с друзьями еле-еле разгадали. 🔍 Кто уже проходил это подземелье? Поделитесь своими советами и лайфхаками! Очень интересно, что у кого получилось найти! 🌟 В общем, настоятельно рекомендую всем исследовать это место. Удачи вам и много удачных находок! #Minecraft #Подземелье #Приключения #Исследование #Сокровища', 'c05b6ee8-a7f4-42e4-8e20-e3920a487525', 'only', '2024-06-29 20:57:50+00', true),
	('ахахх', '2db918c7-ba45-42bc-94ef-4bbf56c8ebbb', 'all', '2024-07-01 17:32:24.717443+00', true),
	('ПЕРВЫЙ ПОСТ!', 'da69df33-b0a5-4e06-b221-1e1422ed0ed6', 'all', '2024-07-03 17:05:05.169706+00', true),
	('sddsas', '1a44bd9d-06e1-422d-a761-58abcb5367aa', 'all', '2024-07-03 18:35:04.817232+00', true);


--
-- Data for Name: posts_comments; Type: TABLE DATA; Schema: public; Owner: postgres
--



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
	('da69df33-b0a5-4e06-b221-1e1422ed0ed6', 'george_wastaken'),
	('1a44bd9d-06e1-422d-a761-58abcb5367aa', 'pureawake');


--
-- Data for Name: status; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."status" ("user_id", "value") VALUES
	('d905f002-1370-44c6-bef3-885063b5332f', true);


--
-- Data for Name: t_comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."t_comments" ("created_at", "id", "content", "user_nickname") VALUES
	('2024-07-04 14:25:33.786025+00', '5f5825d1-9b4e-4363-853a-ba53a3e41349', 'ХАХАХА ЛОХ БЛЯТЬ', 'mongoose');


--
-- Data for Name: threads_comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."threads_comments" ("thread_id", "comment_id") VALUES
	('e9bbc4cd-7668-4bee-aa7a-59d4a147185c', '5f5825d1-9b4e-4363-853a-ba53a3e41349');


--
-- Data for Name: threads_pinned; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: threads_stars; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."threads_stars" ("id", "user_id", "thread_id") VALUES
	(1, '988aecf5-28a2-4d62-9625-284b8d401a8b', 'e9bbc4cd-7668-4bee-aa7a-59d4a147185c');


--
-- Data for Name: threads_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."threads_users" ("thread_id", "user_nickname") VALUES
	('e9bbc4cd-7668-4bee-aa7a-59d4a147185c', 'pureawake'),
	('64cdce51-53ec-4155-b28e-db2199993343', 'pureawake'),
	('f5232406-c72a-4c61-8046-947bb4e94551', 'mongoose'),
	('50d5d02d-cd20-4f54-9756-04269fb2fbd7', 'discludness');


--
-- Data for Name: users_blocked; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: users_friends; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users_friends" ("id", "created_at", "user_1", "user_2") VALUES
	('f101cd41-285b-4a52-a1ea-87e3b3058999', '2024-07-01 20:19:08.516631+00', 'discludness', 'pureawake');


--
-- Data for Name: users_security; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users_security" ("user_nickname", "email", "token") VALUES
	('george_wastaken', 'asd@gmail.com', NULL),
	('pureawake', 'fank.tomphson@gmail.com', NULL),
	('Ded____Inside', 'adsasdasdasd@gmail.com', NULL);


--
-- Data for Name: users_session; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users_session" ("expires_at", "id", "user_id", "ua", "browser", "os", "cpu", "isBot", "created_at", "ip") VALUES
	('2024-07-18 11:25:33.28', 'fvsk6oxqttic5jshns3h4jo7upqgq7akqa76hza6', 'c2e8de6f-a450-4ca0-ba50-828bedb053ba', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0', 'Edge', 'Windows10', 'amd64', false, '2024-07-04 11:25:33.324341+00', NULL),
	('2024-07-18 10:01:45.492', 'kqqdw5ggoq6ceokp3kqa255dxikqaxaqtfsqlmp3', 'd905f002-1370-44c6-bef3-885063b5332f', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0', 'Firefox', 'Windows10', 'amd64', false, '2024-07-04 10:01:45.544471+00', NULL);


--
-- Data for Name: users_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: users_status; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('user_images', 'user_images', NULL, '2024-06-24 13:46:39.726137+00', '2024-06-24 13:46:39.726137+00', true, false, 37748736, '{image/*}', NULL),
	('static', 'static', NULL, '2024-07-03 20:59:29.053004+00', '2024-07-03 20:59:29.053004+00', true, false, 0, '{image/*}', NULL);


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id") VALUES
	('70a49a39-3ea5-4563-9d30-cd765b567311', 'user_images', 'cover/26ec9d74-cec1-42f7-a472-28195c6b03d7FBnoGiwwRrn8wtaIH7eEU', NULL, '2024-06-29 17:51:23.421827+00', '2024-06-29 17:51:23.421827+00', '2024-06-29 17:51:23.421827+00', '{"eTag": "\"642a0f4767a0cfa0acb2ac32008473d1\"", "size": 3567250, "mimetype": "image/jpeg", "cacheControl": "max-age=0", "lastModified": "2024-06-29T17:51:23.246Z", "contentLength": 3567250, "httpStatusCode": 200}', 'c3d8ef49-3bb6-4754-86d8-8dd59718fd43', NULL),
	('ce851e18-3d09-4eca-9e28-cfcc860c0ee3', 'user_images', 'cover/d905f002-1370-44c6-bef3-885063b5332fx2GLOINEWpCUKkYdKfojU', NULL, '2024-06-30 14:47:42.471194+00', '2024-06-30 14:47:42.471194+00', '2024-06-30 14:47:42.471194+00', '{"eTag": "\"df92d5778823890f2504628304907eac\"", "size": 2086518, "mimetype": "image/jpeg", "cacheControl": "max-age=0", "lastModified": "2024-06-30T14:47:42.435Z", "contentLength": 2086518, "httpStatusCode": 200}', '91e04c5b-df8c-460d-abae-652ba3dbf800', NULL),
	('db749c14-42e6-4ac3-8e9c-94acb9b18568', 'user_images', 'cover/d905f002-1370-44c6-bef3-885063b5332fbuNsPap9twwUajB7B8wiE', NULL, '2024-06-30 15:00:07.536477+00', '2024-06-30 15:00:07.536477+00', '2024-06-30 15:00:07.536477+00', '{"eTag": "\"cc51d1216902f36a48b667c6f45d4f66\"", "size": 2418519, "mimetype": "image/jpeg", "cacheControl": "max-age=0", "lastModified": "2024-06-30T15:00:07.473Z", "contentLength": 2418519, "httpStatusCode": 200}', '35c3e184-fd42-4fc7-994d-3195e2a1956f', NULL),
	('1d15f6b4-78f1-4003-9926-fefd687beb8d', 'user_images', 'cover/d905f002-1370-44c6-bef3-885063b5332fR3yxvdUK_b9cC7D9_8qmS', NULL, '2024-06-30 19:34:16.6694+00', '2024-06-30 19:34:16.6694+00', '2024-06-30 19:34:16.6694+00', '{"eTag": "\"0ad2451ecf96220041ce60fba13a0741\"", "size": 454344, "mimetype": "image/png", "cacheControl": "max-age=0", "lastModified": "2024-06-30T19:34:16.617Z", "contentLength": 454344, "httpStatusCode": 200}', '9b3ed090-c749-4cf1-b68f-c7af1894e684', NULL),
	('b8fafe09-f73b-4eeb-964c-46878edbcadf', 'user_images', 'default/render-warden-hide.jpg', NULL, '2024-07-01 05:42:19.710868+00', '2024-07-01 05:42:19.710868+00', '2024-07-01 05:42:19.710868+00', '{"eTag": "\"72569e9110c34d8456d0f5202190f57f\"", "size": 292849, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-07-01T05:42:19.581Z", "contentLength": 292849, "httpStatusCode": 200}', 'f31494fe-6b66-4be6-85a0-dd0a4d9cb1dc', NULL),
	('607fcf14-d871-4046-ba4d-3bf32637af4a', 'user_images', 'default/sand-camel.jpg', NULL, '2024-07-01 05:42:19.734484+00', '2024-07-01 05:42:19.734484+00', '2024-07-01 05:42:19.734484+00', '{"eTag": "\"be63da46d059e2fb51e8f40c7107ef6a\"", "size": 311190, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-07-01T05:42:19.681Z", "contentLength": 311190, "httpStatusCode": 200}', 'ddf3d83d-3041-4350-a647-221a3ee6f599', NULL),
	('91a01c41-96cf-483c-b1f0-fbf21a269d30', 'user_images', 'default/snow-mountain.jpg', NULL, '2024-07-01 05:42:19.741157+00', '2024-07-01 05:42:19.741157+00', '2024-07-01 05:42:19.741157+00', '{"eTag": "\"332592e326adc249d297baa2b675ca94\"", "size": 299800, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-07-01T05:42:19.691Z", "contentLength": 299800, "httpStatusCode": 200}', '0be05b92-3698-41ab-b1b5-3a541e3bdb8d', NULL),
	('2b05ff95-734d-4274-87e4-fdd34e5f386e', 'user_images', 'default/adventure-in-blossom.jpg', NULL, '2024-07-01 05:42:19.74473+00', '2024-07-01 05:42:19.74473+00', '2024-07-01 05:42:19.74473+00', '{"eTag": "\"e9cb1489e81158dfe1cefed74cde2053\"", "size": 600052, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-07-01T05:42:19.641Z", "contentLength": 600052, "httpStatusCode": 200}', '3e12f55b-dda7-4565-8ddb-be5ef6127071', NULL),
	('5a01db2a-0bfe-4fa3-b21d-af9623bfe4b5', 'user_images', 'default/village-art.png', NULL, '2024-07-01 05:42:20.229632+00', '2024-07-01 05:42:20.229632+00', '2024-07-01 05:42:20.229632+00', '{"eTag": "\"936e8ea31e9c817bb1702ad0b57362e0\"", "size": 9535096, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-07-01T05:42:19.931Z", "contentLength": 9535096, "httpStatusCode": 200}', 'fcff7702-7a17-4a80-a96c-f9fda49b9186', NULL),
	('1cd9ebc5-4c2d-4f36-9483-5329d4636bf9', 'user_images', 'cover/82146009-5574-476a-9254-013937d75132p3N8LL_iD0MyzTI0PAMcl', NULL, '2024-06-29 10:26:16.809462+00', '2024-06-29 10:26:16.809462+00', '2024-06-29 10:26:16.809462+00', '{"eTag": "\"fcd027a8a01310f854d5894c7582d464\"", "size": 46154, "mimetype": "image/jpeg", "cacheControl": "max-age=0", "lastModified": "2024-06-29T10:26:16.792Z", "contentLength": 46154, "httpStatusCode": 200}', '50572888-4149-4442-accd-71f07e6efdc4', NULL),
	('bbb266ca-fdad-4afd-8ec0-092d654e208d', 'user_images', 'cover/26ec9d74-cec1-42f7-a472-28195c6b03d7jrjz_OPBlWzf-J0eBVHZ-', NULL, '2024-06-29 13:20:04.086573+00', '2024-06-29 13:20:04.086573+00', '2024-06-29 13:20:04.086573+00', '{"eTag": "\"81c5f8ca328637045694722d0ad46b86\"", "size": 2427370, "mimetype": "image/jpeg", "cacheControl": "max-age=0", "lastModified": "2024-06-29T13:20:03.964Z", "contentLength": 2427370, "httpStatusCode": 200}', 'aeb6514e-eb4a-44c3-bc82-5abb9079022a', NULL),
	('b3e2a53f-f8d1-4e9d-b377-6d821a3d7ae8', 'user_images', 'cover/26ec9d74-cec1-42f7-a472-28195c6b03d7fibag0XpTM7Y7l5EyUoM9', NULL, '2024-06-29 13:32:28.278334+00', '2024-06-29 13:32:28.278334+00', '2024-06-29 13:32:28.278334+00', '{"eTag": "\"fec50d103baf1537cf097cf3200b414e\"", "size": 4946146, "mimetype": "image/jpeg", "cacheControl": "max-age=0", "lastModified": "2024-06-29T13:32:28.143Z", "contentLength": 4946146, "httpStatusCode": 200}', '55362e2f-d7d2-43f3-bb9c-526a17f03f14', NULL),
	('253a4cc4-d917-48e4-9215-45d909d3499f', 'user_images', 'cover/26ec9d74-cec1-42f7-a472-28195c6b03d7Gi7NjDGT4_aQcSCxRmRub', NULL, '2024-06-29 13:36:06.570743+00', '2024-06-29 13:36:06.570743+00', '2024-06-29 13:36:06.570743+00', '{"eTag": "\"b76388044519fc1a853bffdc173afebf\"", "size": 1897343, "mimetype": "image/jpeg", "cacheControl": "max-age=0", "lastModified": "2024-06-29T13:36:06.457Z", "contentLength": 1897343, "httpStatusCode": 200}', '933e4973-e826-4cfe-9a4d-d78e2de5041a', NULL),
	('f179f05e-388b-4e20-9838-ff857a3df159', 'user_images', 'cover/d905f002-1370-44c6-bef3-885063b5332fTgrTFK6zqCqw828dp0Jgw', NULL, '2024-07-01 07:33:42.394799+00', '2024-07-01 07:33:42.394799+00', '2024-07-01 07:33:42.394799+00', '{"eTag": "\"5b9917a8a7b47d340daa7a317b7741ff\"", "size": 4018932, "mimetype": "image/png", "cacheControl": "max-age=0", "lastModified": "2024-07-01T07:33:42.278Z", "contentLength": 4018932, "httpStatusCode": 200}', 'e07fc84c-d227-4575-ba8f-d16b9e7e25d6', NULL),
	('ea991a98-3685-47ca-8d76-1c1b41b19957', 'user_images', 'cover/d905f002-1370-44c6-bef3-885063b5332fPFEKA_7hZpXflBYpIynC8', NULL, '2024-07-01 17:03:42.40523+00', '2024-07-01 17:03:42.40523+00', '2024-07-01 17:03:42.40523+00', '{"eTag": "\"1cac8d39f721d9b4bc41c4c6147d3a44\"", "size": 2660311, "mimetype": "image/png", "cacheControl": "max-age=0", "lastModified": "2024-07-01T17:03:42.325Z", "contentLength": 2660311, "httpStatusCode": 200}', 'dc97eab1-addd-45d6-94ee-20fb87767603', NULL),
	('da1893d1-5f13-43e9-a804-8658dea1a5d2', 'user_images', 'cover/d905f002-1370-44c6-bef3-885063b5332fFo_yTRnVyE6knrUiAkbQa', NULL, '2024-07-01 17:11:25.696903+00', '2024-07-01 17:11:25.696903+00', '2024-07-01 17:11:25.696903+00', '{"eTag": "\"9e3c315c133bf336d443a7e4999638bd\"", "size": 3752067, "mimetype": "image/png", "cacheControl": "max-age=0", "lastModified": "2024-07-01T17:11:25.589Z", "contentLength": 3752067, "httpStatusCode": 200}', '3f4e1697-8b9c-4928-82ba-2cd1f1661b5c', NULL),
	('b23a7825-a137-47e7-b75e-f66baea02fe8', 'user_images', 'cover/d905f002-1370-44c6-bef3-885063b5332fV9PWIqjQ_glCpDYv3TVCs', NULL, '2024-07-01 17:12:22.443764+00', '2024-07-01 17:12:22.443764+00', '2024-07-01 17:12:22.443764+00', '{"eTag": "\"39f5b8cacf9dc1674fb79630543ab883\"", "size": 3201033, "mimetype": "image/png", "cacheControl": "max-age=0", "lastModified": "2024-07-01T17:12:22.348Z", "contentLength": 3201033, "httpStatusCode": 200}', 'e9fc3bbe-7c48-4093-abee-242771cad8e9', NULL),
	('be3f5ef0-0a38-4277-ad93-882c83ea6b0b', 'user_images', 'cover/c2e8de6f-a450-4ca0-ba50-828bedb053baKwbA4Q1JGOeAX2PA9WuAr', NULL, '2024-07-01 17:45:38.322038+00', '2024-07-01 17:45:38.322038+00', '2024-07-01 17:45:38.322038+00', '{"eTag": "\"6363cad935cd3cb165f4efe4c5e0ff91\"", "size": 9983096, "mimetype": "image/png", "cacheControl": "max-age=0", "lastModified": "2024-07-01T17:45:38.143Z", "contentLength": 9983096, "httpStatusCode": 200}', '96b63d63-66bb-4260-bba0-c2850d078aa2', NULL),
	('5cfbfae7-801e-4915-baff-866f45390ea2', 'user_images', 'cover/a2149fd5-6e29-4c8e-81cb-f923ca54ea1d10tdVd_DYv6BjJyjzqSbA', NULL, '2024-07-03 16:37:12.318599+00', '2024-07-03 16:37:12.318599+00', '2024-07-03 16:37:12.318599+00', '{"eTag": "\"cc40cd03fd74b487ed104cbf3d34cda9\"", "size": 3755403, "mimetype": "image/png", "cacheControl": "max-age=0", "lastModified": "2024-07-03T16:37:12.075Z", "contentLength": 3755403, "httpStatusCode": 200}', '0c473a2a-c9cf-48b4-b092-728f398164bc', NULL),
	('440fe2fc-2adb-4dc3-b882-bbd0e38c845e', 'user_images', 'cover/10282229-ae9e-4fa5-9237-7bd35dd07120TEhn8k1Sn6WninInsS2uH', NULL, '2024-07-03 17:00:51.995141+00', '2024-07-03 17:00:51.995141+00', '2024-07-03 17:00:51.995141+00', '{"eTag": "\"cc40cd03fd74b487ed104cbf3d34cda9\"", "size": 3755403, "mimetype": "image/png", "cacheControl": "max-age=0", "lastModified": "2024-07-03T17:00:51.871Z", "contentLength": 3755403, "httpStatusCode": 200}', 'fa7bfec7-15e3-4242-9af3-04a590bdafc5', NULL),
	('c479b3cc-25bd-43c7-859a-a1815c89c589', 'user_images', 'cover/98a33edc-29bc-414e-ae7d-97ccac246749uIGv1nKLkGVU8IsmtEk_s', NULL, '2024-07-03 20:21:31.379758+00', '2024-07-03 20:21:31.379758+00', '2024-07-03 20:21:31.379758+00', '{"eTag": "\"d900570d401cdb00c4c83cbcf371e650\"", "size": 1685041, "mimetype": "image/png", "cacheControl": "max-age=0", "lastModified": "2024-07-03T20:21:31.300Z", "contentLength": 1685041, "httpStatusCode": 200}', '0ac95317-9875-4853-b069-ed27f67dec5a', NULL),
	('1f7889e4-0cfd-454f-bbca-70f8616e8114', 'static', 'auth_background/4.png', NULL, '2024-07-03 21:00:37.435126+00', '2024-07-03 21:00:37.435126+00', '2024-07-03 21:00:37.435126+00', '{"eTag": "\"9714e664c8a989c95e32e7b15aee5048\"", "size": 2936050, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-07-03T21:00:36.653Z", "contentLength": 2936050, "httpStatusCode": 200}', '84ec1ac7-3860-4f4a-957a-fe5344892f9b', NULL),
	('e305060d-bb06-4095-9a33-88e9bcf96c67', 'static', 'auth_background/9.png', NULL, '2024-07-03 21:00:37.478627+00', '2024-07-03 21:00:37.478627+00', '2024-07-03 21:00:37.478627+00', '{"eTag": "\"8d254e540c9acd0851e3d1f8ba95ded8\"", "size": 2826566, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-07-03T21:00:36.753Z", "contentLength": 2826566, "httpStatusCode": 200}', 'e15e6f96-96d4-4b15-a467-9d3398598975', NULL),
	('d335648a-fd98-4bf9-987d-ca770dd2da82', 'static', 'auth_background/5.png', NULL, '2024-07-03 21:00:37.539451+00', '2024-07-03 21:00:37.539451+00', '2024-07-03 21:00:37.539451+00', '{"eTag": "\"6be38464014c3c01e1eecc2412b1550e\"", "size": 4375188, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-07-03T21:00:36.833Z", "contentLength": 4375188, "httpStatusCode": 200}', 'fe5a59c8-3b38-4c86-913e-4e1673d3893b', NULL),
	('28afd0ca-0b13-42ae-9586-a4dff1c6276d', 'static', 'auth_background/1.png', NULL, '2024-07-03 21:00:37.54232+00', '2024-07-03 21:00:37.54232+00', '2024-07-03 21:00:37.54232+00', '{"eTag": "\"a47eaaca8794d4a2f20f89c1cbd3a1bb\"", "size": 4499515, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-07-03T21:00:36.843Z", "contentLength": 4499515, "httpStatusCode": 200}', '906e317c-67a1-4308-b514-104171c798f7', NULL),
	('f7f55003-9752-4775-a787-adea53f611ec', 'static', 'auth_background/2.png', NULL, '2024-07-03 21:00:37.800847+00', '2024-07-03 21:00:37.800847+00', '2024-07-03 21:00:37.800847+00', '{"eTag": "\"68243b551a2c84e9d48d0db374ac8fe8\"", "size": 5301248, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-07-03T21:00:36.903Z", "contentLength": 5301248, "httpStatusCode": 200}', '2988c7c8-d99a-42a7-b4e1-cfea59e0f2f6', NULL),
	('e42c9a94-b77f-4254-83e1-c028f8248ca8', 'static', 'auth_background/3.png', NULL, '2024-07-03 21:00:37.968397+00', '2024-07-03 21:00:37.968397+00', '2024-07-03 21:00:37.968397+00', '{"eTag": "\"cab8392d9b8b4f0a31741281c2a2275f\"", "size": 7045514, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-07-03T21:00:36.913Z", "contentLength": 7045514, "httpStatusCode": 200}', 'e003cd07-9d71-4e5d-aa24-2f25c4d451d3', NULL),
	('de884758-97f4-4d5f-afb5-c18bbfa83621', 'static', 'auth_background/6.png', NULL, '2024-07-03 21:00:38.101187+00', '2024-07-03 21:00:38.101187+00', '2024-07-03 21:00:38.101187+00', '{"eTag": "\"cca4943019d7e698753d0514eb124b48\"", "size": 1978582, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-07-03T21:00:37.973Z", "contentLength": 1978582, "httpStatusCode": 200}', '8fc03984-d218-4fc7-a8a0-d428fa75acc3', NULL),
	('56cca8a7-333e-4c08-a48f-27000b1687b1', 'static', 'auth_background/7.png', NULL, '2024-07-03 21:00:38.182923+00', '2024-07-03 21:00:38.182923+00', '2024-07-03 21:00:38.182923+00', '{"eTag": "\"ac48ae9e8cc67f6a70e88884e32ad51d\"", "size": 3721642, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-07-03T21:00:38.023Z", "contentLength": 3721642, "httpStatusCode": 200}', '0f137dfc-7c61-4c37-8024-14c30d16cd0e', NULL),
	('3c338df8-05fb-4cb5-a24b-cc2590e09099', 'static', 'auth_background/8.png', NULL, '2024-07-03 21:00:38.253883+00', '2024-07-03 21:00:38.253883+00', '2024-07-03 21:00:38.253883+00', '{"eTag": "\"b4c67db9a1e448ca2bea11c2b8ed0db9\"", "size": 3248935, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-07-03T21:00:38.083Z", "contentLength": 3248935, "httpStatusCode": 200}', 'fa1ee9d5-0b0b-4e9c-8167-f5a84e40b1ac', NULL),
	('35cda75f-ecfd-4c4b-be8e-da400ab31cdc', 'static', 'auth_background/10.png', NULL, '2024-07-03 21:00:38.274622+00', '2024-07-03 21:00:38.274622+00', '2024-07-03 21:00:38.274622+00', '{"eTag": "\"9c0c512a55f17f6d260a374e6b0cd2c0\"", "size": 3870792, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-07-03T21:00:38.123Z", "contentLength": 3870792, "httpStatusCode": 200}', 'a26c6e6c-0b46-4cd9-abd1-cd9e2fb9195e', NULL),
	('fca5046d-a9d2-4ed6-8e98-c416afb8645b', 'static', 'auth_background/12.png', NULL, '2024-07-03 21:00:38.702343+00', '2024-07-03 21:00:38.702343+00', '2024-07-03 21:00:38.702343+00', '{"eTag": "\"27fc6c8f9df9a206b72731e241291406\"", "size": 3053204, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-07-03T21:00:38.593Z", "contentLength": 3053204, "httpStatusCode": 200}', '8374173d-ff68-4a15-a947-6f6be1eff15e', NULL),
	('a856f132-9ec0-48e5-92a4-37c1ba101217', 'static', 'auth_background/11.png', NULL, '2024-07-03 21:00:38.926079+00', '2024-07-03 21:00:38.926079+00', '2024-07-03 21:00:38.926079+00', '{"eTag": "\"d388b9c2b09e64cb3442da714da2d457\"", "size": 4619452, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-07-03T21:00:38.643Z", "contentLength": 4619452, "httpStatusCode": 200}', 'c0cf4c4c-f716-4d0e-820f-e43408b14718', NULL),
	('d9c1ed79-067c-49ec-8acd-d58a83f714c2', 'static', 'auth_background/13.png', NULL, '2024-07-03 21:00:39.0077+00', '2024-07-03 21:00:39.0077+00', '2024-07-03 21:00:39.0077+00', '{"eTag": "\"537db7a74b825ef0efcb83935f02185e\"", "size": 3047281, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-07-03T21:00:38.923Z", "contentLength": 3047281, "httpStatusCode": 200}', '0373b43b-fb06-4131-b224-0cc5026d86f5', NULL),
	('01079908-5c65-4b54-869b-8806fad57cc2', 'static', 'auth_background/14.png', NULL, '2024-07-03 21:00:39.379159+00', '2024-07-03 21:00:39.379159+00', '2024-07-03 21:00:39.379159+00', '{"eTag": "\"894a471f0744a3c03f580069a2f8c470\"", "size": 13648699, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-07-03T21:00:39.093Z", "contentLength": 13648699, "httpStatusCode": 200}', '5a81edb6-324d-4cfd-ad59-51fc35f1aaf7', NULL),
	('71be45cd-e99f-44c9-8052-05deeea741cc', 'user_images', 'cover/988aecf5-28a2-4d62-9625-284b8d401a8bjxS6UPQTGRktAf0pE7bmQ', NULL, '2024-07-03 22:12:42.091834+00', '2024-07-03 22:12:42.091834+00', '2024-07-03 22:12:42.091834+00', '{"eTag": "\"d900570d401cdb00c4c83cbcf371e650\"", "size": 1685041, "mimetype": "image/png", "cacheControl": "max-age=0", "lastModified": "2024-07-03T22:12:41.989Z", "contentLength": 1685041, "httpStatusCode": 200}', '4bd185dc-b178-4bf0-bd0e-735a6eba8ac9', NULL),
	('6bd0abd3-e2cd-4567-a77f-6262021b350f', 'user_images', 'cover/d905f002-1370-44c6-bef3-885063b5332fyLxE87j_txri6BkYmtAO-', NULL, '2024-07-04 10:57:58.636947+00', '2024-07-04 10:57:58.636947+00', '2024-07-04 10:57:58.636947+00', '{"eTag": "\"cc40cd03fd74b487ed104cbf3d34cda9\"", "size": 3755403, "mimetype": "image/png", "cacheControl": "max-age=0", "lastModified": "2024-07-04T10:57:58.553Z", "contentLength": 3755403, "httpStatusCode": 200}', 'ca21d1b8-c1ce-498c-970d-071f81920cfc', NULL);


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
	('ac943f29-ef69-470d-86f5-c260d25a21a0', 'decrypted_secrets', '', 'a8D7t/osFhZoiNaEZsD1pq1ugZ6Is/vBT7wG3UQpuZpyQuv9e0p8blUNgdTNWVNKfxKiqmxsXpGw
dCYGk7G6vBydW2h9JP51kJGn7mVyKM1AOCsnqeYJKl6DHHGODbeK6J5l7Ji1Hdx+YpCOFhklmtXd
ZXXs6C9ELd66QL8X91+AK+bs6aeq1aXoq/ZFvJhXt23scLkH4385nkOfRG4/fNU26UBECoKs6/gY
t5rhjMZvv3uCnF7hKr8=', '7d6e5d09-426c-4aed-a6e8-03b0ba43b0e1', '\xbc103d3a5b26955c3a437a4fd37cc405', '2024-06-20 22:49:44.80295+00', '2024-06-20 22:49:44.80295+00'),
	('c7b9de6a-171c-4c5f-baa9-3baa958de4ec', 'service_role', 'aboba', 'uGJ9DvfG38TiWLlFZdIuWv0hm/DzmTwnAqQQn5AFYpvbXX0/zpuUo7px1N2Kp9lTPzLANZ5XWLCW
96y2Bc9pFK4VomNw4fHFN/SQR6mbI2CNY1fr/p2yUct5Kt766HE3z/qhxhCVuTiTIrRfV72Jq+N7
r3ZG3vf0hetsFJcY29ejya0+5tab728UIcb2LkO2qm3IVAb1zLTSx/l6p+efyAW9PKgIqpsRy1xR
Syx6xAIaHmULB5vfTEiu67AbQj+dfcsk4w==', 'c3729e72-a786-4eff-9cc7-e380f57fcf97', '\x193663f2fed9f240e459f2161b79997b', '2024-06-21 22:16:52.565283+00', '2024-06-24 13:42:41.170653+00');


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, false);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 2, true);


--
-- Name: category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."category_id_seq"', 1, false);


--
-- Name: category_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."category_id_seq1"', 5, true);


--
-- Name: config_advertisement_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."config_advertisement_id_seq"', 1, false);


--
-- Name: config_alerts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."config_alerts_id_seq"', 1, true);


--
-- Name: config_minecraft_facts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."config_minecraft_facts_id_seq"', 97, true);


--
-- Name: info_findout_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."info_findout_id_seq"', 2, true);


--
-- Name: threads_pinned_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."threads_pinned_id_seq"', 1, false);


--
-- Name: threads_stars_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."threads_stars_id_seq"', 1, true);


--
-- Name: users_blocked_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."users_blocked_id_seq"', 1, false);


--
-- Name: users_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."users_status_id_seq"', 1, false);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;

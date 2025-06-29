SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Albums
DROP TABLE IF EXISTS `albums`;

CREATE TABLE `albums`  (
  `id` int(111) NOT NULL AUTO_INCREMENT,
  `user` int(11) NULL DEFAULT NULL,
  `album` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `time_created` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- Channels
DROP TABLE IF EXISTS `channels`;

CREATE TABLE `channels`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `channel` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `color_background` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL CHECK (json_valid(`color_background`)),
  `color_highlight` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL CHECK (json_valid(`color_highlight`)),
  `background` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL CHECK (json_valid(`background`)),
  `time_created` datetime NULL DEFAULT NULL,
  `time_updated` datetime NULL DEFAULT NULL,
  `restrictions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL CHECK (json_valid(`restrictions`)),
  `info` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL CHECK (json_valid(`info`)),
  `users_lc` int(11) NULL DEFAULT NULL,
  `users_hc` int(11) NULL DEFAULT NULL,
  `erotic` enum('YES','NO') CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT 'NO',
  `type` enum('USER','TEMP','SYSTEM') CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `topic` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL CHECK (json_valid(`topic`)),
  `category` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `stars` int(1) NULL DEFAULT NULL,
  `moderators` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL CHECK (json_valid(`moderators`)),
  `management` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL CHECK (json_valid(`management`)),
  `owner` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `time_registred` datetime NULL DEFAULT NULL,
  `time_deleted` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- Comments
DROP TABLE IF EXISTS `comments`;

CREATE TABLE `comments`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` int(11) NULL DEFAULT NULL,
  `comment` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `type` enum('PROFILE','ALBUM') CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `author` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `text` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `time_created` datetime NULL DEFAULT NULL,
  `time_posted` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id` DESC) USING BTREE,
  INDEX `idx_comments_author_time`(`author` ASC, `time_posted` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- Migration
DROP TABLE IF EXISTS `migration`;

CREATE TABLE `migration`  (
  `id` int(11) NOT NULL,
  `user` int(11) NULL DEFAULT NULL,
  `nickname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- Pictures
DROP TABLE IF EXISTS `pictures`;

CREATE TABLE `pictures`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` int(11) NOT NULL,
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `checksum` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `time_created` datetime NULL DEFAULT NULL,
  `time_deleted` datetime NULL DEFAULT NULL,
  `ki_value` decimal(5, 2) UNSIGNED ZEROFILL NULL DEFAULT NULL CHECK (`ki_value` >= 0.00 and `ki_value` <= 100.00),
  `ki_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL CHECK (json_valid(`ki_data`)),
  `time_ki` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_time`(`user` ASC, `time_created` ASC) USING BTREE,
  INDEX `idx_ki_value`(`ki_value` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- Profiles
DROP TABLE IF EXISTS `profiles`;

CREATE TABLE `profiles`  (
  `id` int(11) NOT NULL,
  `city` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `readme` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL CHECK (json_valid(`readme`)),
  `birthday` date NULL DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `time_created` datetime NULL DEFAULT NULL,
  `time_updated` datetime NULL DEFAULT NULL,
  `hobbies` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL CHECK (json_valid(`hobbies`)),
  `music` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL CHECK (json_valid(`music`)),
  `movies` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL CHECK (json_valid(`movies`)),
  `series` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL CHECK (json_valid(`series`)),
  `books` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL CHECK (json_valid(`books`)),
  `languages` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL CHECK (json_valid(`languages`)),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_profiles_id`(`id` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- Statistics
DROP TABLE IF EXISTS `statistics`;

CREATE TABLE `statistics`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `value` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id` DESC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

INSERT INTO `statistics` (`name`, `value`) VALUES
  ('unknown', 0),
  ('binary_she', 0),
  ('binary_he', 0),
  ('female', 0),
  ('male', 0),
  ('comments_albums', 0),
  ('comments_photo', 0),
  ('pictures', 0),
  ('albums_pictures', 0),
  ('ai_checked', 0),
  ('albums', 0),
  ('profiles', 0),
  ('users', 0),
  ('channels', 0);

-- Users
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users`  (
  `id` int(11) NOT NULL,
  `nickname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `age` int(11) NULL DEFAULT NULL,
  `gender` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `time_created` datetime NULL DEFAULT NULL,
  `time_updated` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_time_updated_id`(`time_updated` ASC, `id` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- Visits
DROP TABLE IF EXISTS `visits`;

CREATE TABLE `visits`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` int(11) NULL DEFAULT NULL,
  `date` date NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_visits_date_user`(`date` ASC, `user` ASC) USING BTREE,
  INDEX `idx_visits_user_date`(`user` ASC, `date` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- View: Count
DROP VIEW IF EXISTS `Count`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `Count` AS select format((select count(0) from `users`),0,'de_DE') AS `users`,format((select count(0) from `profiles`),0,'de_DE') AS `profiles`;

-- View: Readmes
DROP VIEW IF EXISTS `Readmes`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `Readmes` AS select `users`.`id` AS `id`,`users`.`nickname` AS `nickname`,json_unquote(json_extract(`profiles`.`readme`,'$.text.text')) AS `readme` from (`users` join `profiles`) where `users`.`id` = `profiles`.`id` and `profiles`.`readme` is not null;

-- View: Statistics
DROP VIEW IF EXISTS `Statistics`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `Statistics` AS select max(case when `statistics`.`name` = 'users' then `statistics`.`value` end) AS `users`,max(case when `statistics`.`name` = 'male' then `statistics`.`value` end) AS `male`,max(case when `statistics`.`name` = 'female' then `statistics`.`value` end) AS `female`,max(case when `statistics`.`name` = 'binary_he' then `statistics`.`value` end) AS `binary_he`,max(case when `statistics`.`name` = 'binary_she' then `statistics`.`value` end) AS `binary_she`,max(case when `statistics`.`name` = 'unknown' then `statistics`.`value` end) AS `unknown`,max(case when `statistics`.`name` = 'profiles' then `statistics`.`value` end) AS `profiles`,max(case when `statistics`.`name` = 'pictures' then `statistics`.`value` end) AS `pictures`,max(case when `statistics`.`name` = 'albums_pictures' then `statistics`.`value` end) AS `albums_pictures`,max(case when `statistics`.`name` = 'ai_checked' then `statistics`.`value` end) AS `ai_checked`,max(case when `statistics`.`name` = 'comments_photo' then `statistics`.`value` end) AS `comments_photo`,max(case when `statistics`.`name` = 'comments_albums' then `statistics`.`value` end) AS `comments_albums`,max(case when `statistics`.`name` = 'albums' then `statistics`.`value` end) AS `albums`,max(case when `statistics`.`name` = 'channels' then `statistics`.`value` end) AS `channels` from `statistics`;

SET FOREIGN_KEY_CHECKS = 1;

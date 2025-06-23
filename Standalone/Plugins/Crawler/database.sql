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
  PRIMARY KEY (`id` DESC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

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
  PRIMARY KEY (`id`) USING BTREE
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
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

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
  INDEX `idx_visits_date_user`(`date` ASC, `user` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;


-- View: Count
DROP VIEW IF EXISTS `Count`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `Count` AS select format((select count(0) from `users`),0,'de_DE') AS `users`,format((select count(0) from `profiles`),0,'de_DE') AS `profiles`;

-- View: Readmes
DROP VIEW IF EXISTS `Readmes`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `Readmes` AS select `users`.`id` AS `id`,`users`.`nickname` AS `nickname`,json_unquote(json_extract(`profiles`.`readme`,'$.text.text')) AS `readme` from (`users` join `profiles`) where `users`.`id` = `profiles`.`id` and `profiles`.`readme` is not null;

SET FOREIGN_KEY_CHECKS = 1;

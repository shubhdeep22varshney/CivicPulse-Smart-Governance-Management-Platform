-- phpMyAdmin SQL Dump for civicpulse database

CREATE DATABASE IF NOT EXISTS civicpulse;
USE civicpulse;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `citizens`
--
CREATE TABLE IF NOT EXISTS `citizens` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--
CREATE TABLE IF NOT EXISTS `departments` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `department_name` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--
INSERT INTO `departments` (`id`, `department_name`, `location`, `phone`, `user_id`) VALUES
(1, 'Water Supply', 'Zone A - Main Office', '1800-111-001', NULL),
(2, 'Sanitation & Health', 'Zone D - Health HQ', '1800-111-004', NULL),
(3, 'Electricity & Power', 'Zone B - Power Grid', '1800-111-002', NULL),
(4, 'Roads & Infrastructure', 'Zone C - Works Dept', '1800-111-003', NULL),
(5, 'Public Safety & Transport', 'Zone E - Traffic HQ', '1800-111-005', NULL)
ON DUPLICATE KEY UPDATE `department_name` = VALUES(`department_name`);

-- --------------------------------------------------------

--
-- Table structure for table `complaints`
--
CREATE TABLE IF NOT EXISTS `complaints` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `category` varchar(255) DEFAULT NULL,
  `citizen_id` bigint(20) DEFAULT NULL,
  `department_id` bigint(20) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `priority` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `complaints`
--
INSERT INTO `complaints` (`id`, `category`, `citizen_id`, `department_id`, `description`, `location`, `priority`, `status`, `title`) VALUES
(1, 'Sanitation', 1, 2, 'Garbage has not been collected for three days.', 'Main Road', 'HIGH', 'RESOLVED', 'Garbage not collected')
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

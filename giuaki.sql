-- phpMyAdmin SQL Dump
-- version 4.8.0.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 19, 2018 lúc 05:44 PM
-- Phiên bản máy phục vụ: 10.1.32-MariaDB
-- Phiên bản PHP: 7.2.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `giuaki`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `request`
--

CREATE TABLE `request` (
  `id_request` int(11) NOT NULL,
  `name` varchar(45) CHARACTER SET utf8 DEFAULT NULL,
  `phone` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `address` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `note` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  `status` int(1) DEFAULT NULL,
  `lat` double DEFAULT NULL,
  `lng` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `request`
--

INSERT INTO `request` (`id_request`, `name`, `phone`, `address`, `note`, `time`, `status`, `lat`, `lng`) VALUES
(2, 'Nguyễn Hữu Thân', '0357409117', '18/13 Trần văn Thành', 'Không có gì', '2018-10-24 20:14:05', 2, 10.748754099692444, 106.67897611004639),
(18, 'hữu Thân', '0357409117', '227 Nguyễn Văn Cừ', 'Xe 4 chỗ', '2018-11-02 11:05:36', 2, 10.7624176, 106.68119679999995),
(19, 'Hữu Thân', '0357409117', '18/13 Trần Văn Thành', 'test', '2018-11-02 16:45:42', 2, 10.753161510981329, 106.68040647846928),
(20, 'Hữu Thân', '0357409117', '18/13 Trần Văn Thành', 'test', '2018-11-02 16:47:00', 2, 10.756210677931046, 106.68478665668357),
(21, 'Hữu Thân', '0357409117', '18/13 Trần Văn Thành', 'test', '2018-11-02 16:49:18', 2, 10.75223849878175, 106.68208273933011),
(22, 'Hữu Thân', '0357409117', '18/13 Trần Văn Thành', 'test', '2018-11-02 16:51:29', 2, 10.751117617820851, 106.67476347499837),
(23, 'Hữu Thân', '0357409117', '18/13 Trần Văn Thành', 'test', '2018-11-02 16:51:32', 2, 10.750862, 106.679843),
(24, 'Hữu Thân', '0357409117', '18/13 Trần Văn Thành', 'test', '2018-11-02 18:48:49', 1, 10.750862, 106.679843),
(25, 'Hữu Thân', '0357409117', '18/13 Trần Văn Thành', 'test', '2018-11-02 18:50:20', 2, 10.753715094366845, 106.68053651196318),
(26, 'Hữu Thân', '0357409117', '18/13 Trần Văn Thành', 'test', '2018-11-02 19:28:51', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `userrefreshtokenext`
--

CREATE TABLE `userrefreshtokenext` (
  `ID` int(11) NOT NULL,
  `token` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `userrefreshtokenext`
--

INSERT INTO `userrefreshtokenext` (`ID`, `token`, `time`) VALUES
(1, 'Zzarrjrh98lNia0Rw9Rq2ZDA7KDMKPLyvFGAM1RTUXj7E5tv22Q4MxxK3Hihh9OnIjltPBtOlRN7Tl5o', '2018-11-17 21:04:38'),
(2, 'seYvze0VLjlQJu6lVjF3kISbYLieEc4mwUemr3Jg2fgt3QJxltW5zwQZAVUnx6EHf9KeKi8F6AxmcIPJ', '2018-11-19 23:39:24'),
(3, 'GDFLa5alCzHnIViVOpi0MSNO7BInk1MZtdmfueXS4XzMexH9Hvy2KFLBjPTYNGcpBsnFOZz34IVc3YII', '2018-11-19 23:43:20'),
(4, 'NSLcm19AmsbZDeZEIc6HhoVpT7NaTtsGvnjYUHmSShYnYLnqf1BpIjhJkOlYsLlIdLHIn7GUJrJmtEJv', '2018-11-17 15:26:07'),
(6, 'l1TwfBOj86QgXYpYXjoocXPLptu9ztICObQKCiYOOHHWhvYE0mxwGziH2hx1uPUFyPJgTVpEenPwevgB', '2018-11-19 23:39:10');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `ID` int(11) NOT NULL,
  `username` varchar(45) CHARACTER SET utf8 DEFAULT NULL,
  `password` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `permission` int(11) DEFAULT NULL,
  `SDT` varchar(11) COLLATE utf8_unicode_ci NOT NULL,
  `Status` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`ID`, `username`, `password`, `permission`, `SDT`, `Status`) VALUES
(1, 'huuthan', 'd55a408d6785037f17efee9ed6be998d', 2, '', ''),
(2, 'caothien', 'd55a408d6785037f17efee9ed6be998d', 4, '0971746559', 'BUSY'),
(3, 'caotri', 'd55a408d6785037f17efee9ed6be998d', 4, '123456789', 'READY'),
(4, 'caothang', 'd55a408d6785037f17efee9ed6be998d', 4, '113456789', 'READY'),
(5, 'caothang2', 'd55a408d6785037f17efee9ed6be998d', 4, '0971746559', 'READY'),
(6, 'caothang3', 'd55a408d6785037f17efee9ed6be998d', 4, '0971746889', 'BUSY');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `request`
--
ALTER TABLE `request`
  ADD PRIMARY KEY (`id_request`);

--
-- Chỉ mục cho bảng `userrefreshtokenext`
--
ALTER TABLE `userrefreshtokenext`
  ADD PRIMARY KEY (`ID`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `request`
--
ALTER TABLE `request`
  MODIFY `id_request` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 4.1.8
-- http://www.phpmyadmin.net
--
-- Client :  localhost
-- Généré le :  Ven 24 Octobre 2014 à 15:25
-- Version du serveur :  5.5.34-MariaDB-cll-lve
-- Version de PHP :  5.4.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données :  `abc_MyTodo`
--

-- --------------------------------------------------------

--
-- Structure de la table `EX_Todo`
--

CREATE TABLE IF NOT EXISTS `EX_Todo` (
  `TodoID` bigint(20) NOT NULL AUTO_INCREMENT,
  `id` text,
  `TodoDesc` text,
  `RessourceID` int(11) NOT NULL,
  `CategorieID` int(11) NOT NULL,
  `TodoDate` date DEFAULT NULL,
  `TodoFait` tinyint(1) DEFAULT NULL,
  `BDBid` char(13) NOT NULL,
  `last_sync_date` datetime NOT NULL,
  PRIMARY KEY (`TodoID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=21 ;

--
-- Contenu de la table `EX_Todo`
--

INSERT INTO `EX_Todo` (`TodoID`, `id`, `TodoDesc`, `RessourceID`, `CategorieID`, `TodoDate`, `TodoFait`, `BDBid`, `last_sync_date`) VALUES
(1, '1', 'test1', 1, 1, '2014-10-01', NULL, '1412127751000', '2014-10-11 11:52:11'),
(2, '2', 'test2', 1, 2, '2014-10-01', NULL, '1412168946000', '2014-10-15 14:19:30'),
(3, '3', 'test3', 1, 3, '2014-10-18', NULL, '1413657040000', '2014-10-18 16:29:20');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

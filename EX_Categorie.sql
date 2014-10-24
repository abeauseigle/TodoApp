-- phpMyAdmin SQL Dump
-- version 4.1.8
-- http://www.phpmyadmin.net
--
-- Client :  localhost
-- Généré le :  Ven 24 Octobre 2014 à 15:30
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
-- Structure de la table `EX_Categorie`
--

CREATE TABLE IF NOT EXISTS `EX_Categorie` (
  `CategorieID` int(11) NOT NULL AUTO_INCREMENT,
  `CategorieNom` varchar(100) NOT NULL DEFAULT '',
  `CategorieTaux` decimal(7,2) NOT NULL,
  `CategorieDerniereModifUsagerID` int(11) DEFAULT NULL,
  `CategorieDerniereModifDateH` datetime DEFAULT NULL,
  `OrganisationID` int(11) NOT NULL DEFAULT '0',
  `CategorieActive` tinyint(1) NOT NULL DEFAULT '1',
  `UniteID` int(11) NOT NULL DEFAULT '0',
  `CategorieLock` binary(1) NOT NULL DEFAULT '1',
  `CategorieCompte` varchar(8) DEFAULT NULL,
  `last_sync_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`CategorieID`),
  UNIQUE KEY `CategorieNom` (`CategorieNom`),
  KEY `OrganisationID` (`OrganisationID`),
  KEY `UniteID` (`UniteID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=40 ;

--
-- Contenu de la table `EX_Categorie`
--

INSERT INTO `EX_Categorie` (`CategorieID`, `CategorieNom`, `CategorieTaux`, `CategorieDerniereModifUsagerID`, `CategorieDerniereModifDateH`, `OrganisationID`, `CategorieActive`, `UniteID`, `CategorieLock`, `CategorieCompte`, `last_sync_date`) VALUES
(1, 'Cat1', '1.00', 7, '2008-05-09 10:03:13', 0, 1, 0, '0', NULL, '2014-02-04 03:00:38'),
(2, 'Cat2', '1.00', 7, '2008-05-20 08:28:59', 0, 1, 0, '0', NULL, '2014-02-04 03:00:38'),
(3, 'Cat3', '1.00', 7, '2008-05-20 08:29:30', 0, 1, 0, '0', NULL, '2014-02-04 03:00:38'),
(4, 'Cat4', '0.51', 7, '2008-05-20 08:29:59', 0, 1, 1, '0', '5735', '2014-02-04 03:00:38'),
(5, 'Cat5', '1.00', 7, '2008-05-08 08:29:45', 0, 1, 2, '0', '5617', '2014-02-04 03:00:38'),
(6, 'Cat6', '1.00', 7, '2008-05-08 08:29:53', 0, 1, 2, '0', '5737', '2014-02-04 03:00:38');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

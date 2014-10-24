-- phpMyAdmin SQL Dump
-- version 4.1.8
-- http://www.phpmyadmin.net
--
-- Client :  localhost
-- Généré le :  Ven 24 Octobre 2014 à 15:28
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
-- Structure de la table `EX_Ressource`
--

CREATE TABLE IF NOT EXISTS `EX_Ressource` (
  `RessourceID` bigint(20) NOT NULL AUTO_INCREMENT,
  `RessourceIni` varchar(4) DEFAULT NULL,
  `RessourceNom` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `RessourceTel` varchar(30) DEFAULT NULL,
  `RessourceCourriel` varchar(100) DEFAULT NULL,
  `RessourceExpertise` varchar(100) DEFAULT NULL,
  `RessourceTaux` decimal(7,2) NOT NULL DEFAULT '0.00',
  `RessourceActive` tinyint(1) DEFAULT NULL,
  `RessourceDerniereModifUsagerID` int(11) DEFAULT NULL,
  `RessourceDerniereModifDateH` datetime DEFAULT NULL,
  `OrganisationID` int(11) NOT NULL DEFAULT '0',
  `RessourcePayable` decimal(7,2) NOT NULL,
  `FirmeID` bigint(20) NOT NULL,
  `RessCatID` bigint(20) NOT NULL DEFAULT '0',
  `last_sync_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`RessourceID`),
  KEY `OrganisationID` (`OrganisationID`),
  KEY `FirmeID` (`FirmeID`),
  KEY `CategorieID` (`RessCatID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=86 ;

--
-- Contenu de la table `EX_Ressource`
--

INSERT INTO `EX_Ressource` (`RessourceID`, `RessourceIni`, `RessourceNom`, `RessourceTel`, `RessourceCourriel`, `RessourceExpertise`, `RessourceTaux`, `RessourceActive`, `RessourceDerniereModifUsagerID`, `RessourceDerniereModifDateH`, `OrganisationID`, `RessourcePayable`, `FirmeID`, `RessCatID`, `last_sync_date`) VALUES
(1, 'AB', 'Alain Beauseigle', NULL, NULL, 'Consultant', '0.00', 1, 1, '2013-01-15 15:42:22', 1, '-1051.50', 1, 3, '0000-00-00 00:00:00');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

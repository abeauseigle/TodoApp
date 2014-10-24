-- phpMyAdmin SQL Dump
-- version 4.1.8
-- http://www.phpmyadmin.net
--
-- Client :  localhost
-- Généré le :  Ven 24 Octobre 2014 à 15:26
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
-- Structure de la table `EX_Usager`
--

CREATE TABLE IF NOT EXISTS `EX_Usager` (
  `UsagerID` int(11) NOT NULL AUTO_INCREMENT,
  `UsagerNom` varchar(100) NOT NULL DEFAULT '',
  `UsagerPassword` varchar(100) DEFAULT NULL,
  `UsagerActif` tinyint(1) DEFAULT '1',
  `UsagerDernierIPLog` varchar(200) NOT NULL DEFAULT '',
  `UsagerDernierHostLog` varchar(100) DEFAULT '',
  `UsagerDerniereDateHLog` datetime DEFAULT NULL,
  `UsagerDerniereModifUsagerID` int(11) DEFAULT NULL,
  `UsagerDerniereModifDateH` datetime DEFAULT NULL,
  `OrganisationID` int(11) DEFAULT '1',
  `NiveauID` int(11) DEFAULT '0',
  `RessourceID` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`UsagerID`),
  UNIQUE KEY `UsagerNom` (`UsagerNom`),
  KEY `OrganisationID` (`OrganisationID`),
  KEY `NiveauID` (`NiveauID`),
  KEY `RessourceID` (`RessourceID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=51 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

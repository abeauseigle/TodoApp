-- phpMyAdmin SQL Dump
-- version 4.1.8
-- http://www.phpmyadmin.net
--
-- Client :  localhost
-- Généré le :  Ven 24 Octobre 2014 à 15:29
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
-- Structure de la table `EX_Organisation`
--

CREATE TABLE IF NOT EXISTS `EX_Organisation` (
  `OrganisationID` int(11) NOT NULL AUTO_INCREMENT,
  `OrganisationNom` varchar(100) NOT NULL DEFAULT '',
  `OrganisationNomLong` varchar(100) DEFAULT NULL,
  `OrganisationPrefix` varchar(3) NOT NULL,
  `OrganisationContactPrincipalNom` varchar(100) DEFAULT NULL,
  `OrganisationContactPrincipalFonction` varchar(100) DEFAULT NULL,
  `OrganisationAdresse` varchar(255) DEFAULT NULL,
  `OrganisationTel` varchar(30) DEFAULT NULL,
  `OrganisationFax` varchar(30) DEFAULT NULL,
  `OrganisationCourriel` varchar(100) NOT NULL,
  `OrganisationSiteWeb` varchar(100) DEFAULT NULL,
  `OrganisationProduitService` varchar(100) DEFAULT NULL,
  `OrganisationAutresInfos` varchar(200) DEFAULT NULL,
  `OrganisationNote` varchar(200) DEFAULT NULL,
  `OrganisationActif` tinyint(1) DEFAULT NULL,
  `OrganisationDerniereModifUsagerID` int(11) DEFAULT NULL,
  `OrganisationGold` tinyint(1) DEFAULT '0',
  `OrganisationDerniereModifDateH` datetime DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`OrganisationID`),
  UNIQUE KEY `ClientNom` (`OrganisationNom`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=12 ;

--
-- Contenu de la table `EX_Organisation`
--

INSERT INTO `EX_Organisation` (`OrganisationID`, `OrganisationNom`, `OrganisationNomLong`, `OrganisationPrefix`, `OrganisationContactPrincipalNom`, `OrganisationContactPrincipalFonction`, `OrganisationAdresse`, `OrganisationTel`, `OrganisationFax`, `OrganisationCourriel`, `OrganisationSiteWeb`, `OrganisationProduitService`, `OrganisationAutresInfos`, `OrganisationNote`, `OrganisationActif`, `OrganisationDerniereModifUsagerID`, `OrganisationGold`, `OrganisationDerniereModifDateH`) VALUES
(1, 'ABC inc.', 'ABC Inc.', 'Aff', 'Alain Beauseigle', 'Président', '000, 00 Avenue\r\nLachine, QC\r\nHiH 1H1', '(123) 456-7890 #1', '(123) 456-7890', 'info@AffairesUP.com', 'www.AffairesUP.com', 'Expert en crédits d''impôt R&D, Qualité', NULL, NULL, 1, 28, 1, '2012-02-08 14:33:13');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

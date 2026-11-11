-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           12.3.2-MariaDB - MariaDB Server
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              12.17.0.7270
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para estoque_sql
CREATE DATABASE IF NOT EXISTS `estoque_sql` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci */;
USE `estoque_sql`;

-- Copiando estrutura para tabela estoque_sql.estoque
CREATE TABLE IF NOT EXISTS `estoque` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `NOME` varchar(100) DEFAULT NULL,
  `MEDIDA` double(50,2) DEFAULT NULL,
  `UNIDADE` enum('CM','M') DEFAULT NULL,
  `SAIDA` int(4) DEFAULT NULL,
  `ENTRADA` int(4) DEFAULT NULL,
  `VALOR` double(50,4) DEFAULT NULL,
  `QUANTIDADE` int(11) DEFAULT NULL,
  `CATEGORIA` enum('ALIMENTO','HIGIENE','LAZER') DEFAULT NULL,
  PRIMARY KEY (`ID`),
  CONSTRAINT `quantidade_limite` CHECK (`QUANTIDADE` >= 0 and `QUANTIDADE` <= 500)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela estoque_sql.estoque_historico
CREATE TABLE IF NOT EXISTS `estoque_historico` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Id_produto` int(11) NOT NULL,
  `saida` int(11) DEFAULT NULL,
  `entrada` int(11) DEFAULT NULL,
  `tempo` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`ID`),
  KEY `Id_produto` (`Id_produto`),
  CONSTRAINT `1` FOREIGN KEY (`Id_produto`) REFERENCES `estoque` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para view estoque_sql.vw_estoque
-- Criando tabela temporária para evitar erros de dependência de VIEW
CREATE TABLE `vw_estoque` (
	`ID` INT(11) NOT NULL,
	`NOME` VARCHAR(1) NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`MEDIDA` DOUBLE(50,2) NULL,
	`UNIDADE` ENUM('CM','M') NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`SAIDA` INT(4) NULL,
	`ENTRADA` INT(4) NULL,
	`VALOR` DOUBLE(50,4) NULL,
	`QUANTIDADE` INT(11) NULL,
	`CATEGORIA` ENUM('ALIMENTO','HIGIENE','LAZER') NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`valor total` DOUBLE(21,4) NULL,
	`porcentagem` DECIMAL(17,4) NULL
);

-- Copiando estrutura para trigger estoque_sql.registrar_entrada
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER registrar_entrada
AFTER UPDATE ON estoque
FOR EACH ROW
BEGIN
    IF NOT (OLD.entrada <=> NEW.entrada) THEN

        INSERT INTO ESTOQUE_historico (
            Id_produto,
            entrada,
            saida
        )
        VALUES (
            NEW.id,
            NEW.entrada - COALESCE(OLD.entrada, 0),
            0
        );

    END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Copiando estrutura para trigger estoque_sql.registrar_saida
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER registrar_saida
AFTER UPDATE ON estoque
FOR EACH ROW
BEGIN
    IF NOT (OLD.saida <=> NEW.saida) THEN

        INSERT INTO ESTOQUE_historico (
            Id_produto,
            entrada,
            saida
        )
        VALUES (
            NEW.id,
            0,
            NEW.saida - COALESCE(OLD.saida, 0)
        );

    END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Copiando estrutura para trigger estoque_sql.trg_atualiza_quantidade
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `trg_atualiza_quantidade` BEFORE UPDATE ON `estoque` FOR EACH ROW BEGIN
    SET NEW.quantidade = GREATEST(0,
        COALESCE(OLD.quantidade, 0)
        + (COALESCE(NEW.entrada, 0) - COALESCE(OLD.entrada, 0))
        - (COALESCE(NEW.saida, 0) - COALESCE(OLD.saida, 0))
        
        );
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Removendo tabela temporária e criando a estrutura VIEW final
DROP TABLE IF EXISTS `vw_estoque`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vw_estoque` AS SELECT 
ID,NOME,MEDIDA,UNIDADE,SAIDA,ENTRADA,VALOR,QUANTIDADE,
CATEGORIA,valor * quantidade AS "valor total", quantidade * 100 / 500 AS porcentagem
FROM estoque 
;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

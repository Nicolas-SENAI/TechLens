-- =====================================================================
-- TechLens Database Schema
-- Charset: utf8mb4 / Collation: utf8mb4_unicode_ci
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `techlens`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `techlens`;

-- Desabilita checagem de FK para recriação limpa se necessário
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `mensagem_chat`;
DROP TABLE IF EXISTS `pesquisa`;
DROP TABLE IF EXISTS `preco`;
DROP TABLE IF EXISTS `comparacao`;
DROP TABLE IF EXISTS `fonte`;
DROP TABLE IF EXISTS `avaliacao_resumo`;
DROP TABLE IF EXISTS `especificacao`;
DROP TABLE IF EXISTS `produto`;
DROP TABLE IF EXISTS `dispositivo`;

SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------------
-- 1. Tabela: dispositivo (identificação anônima por UUID, sem login)
-- ---------------------------------------------------------------------
CREATE TABLE `dispositivo` (
  `id` VARCHAR(36) NOT NULL,
  `criado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `privacidade_aceita_em` DATETIME NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2. Tabela: produto (catálogo de aparelhos e cabos)
-- ---------------------------------------------------------------------
CREATE TABLE `produto` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `nome` VARCHAR(255) NOT NULL,
  `marca` VARCHAR(100) NOT NULL,
  `modelo` VARCHAR(100) NULL,
  `categoria` VARCHAR(100) NOT NULL,
  `imagem_url` TEXT NOT NULL,
  `resumo_simples` TEXT NOT NULL,
  `criado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_produto_categoria` (`categoria`),
  INDEX `idx_produto_criado_em` (`criado_em`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3. Tabela: especificacao (especificações técnicas traduzidas)
-- ---------------------------------------------------------------------
CREATE TABLE `especificacao` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `produto_id` INT NOT NULL,
  `termo` VARCHAR(100) NOT NULL,
  `valor` VARCHAR(150) NOT NULL,
  `explicacao_simples` TEXT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_especificacao_produto` (`produto_id`),
  CONSTRAINT `fk_especificacao_produto`
    FOREIGN KEY (`produto_id`) REFERENCES `produto` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4. Tabela: avaliacao_resumo (síntese de prós e contras de usuários)
-- ---------------------------------------------------------------------
CREATE TABLE `avaliacao_resumo` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `produto_id` INT NOT NULL,
  `pontos_positivos` TEXT NOT NULL,
  `pontos_atencao` TEXT NOT NULL,
  `gerado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_avaliacao_produto` (`produto_id`),
  CONSTRAINT `fk_avaliacao_produto`
    FOREIGN KEY (`produto_id`) REFERENCES `produto` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 5. Tabela: fonte (portais editoriais e fontes independentes)
-- ---------------------------------------------------------------------
CREATE TABLE `fonte` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `produto_id` INT NOT NULL,
  `tipo` ENUM('avaliacao', 'especificacao') NOT NULL,
  `nome` VARCHAR(150) NOT NULL,
  `url` VARCHAR(500) NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_fonte_produto` (`produto_id`),
  CONSTRAINT `fk_fonte_produto`
    FOREIGN KEY (`produto_id`) REFERENCES `produto` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 6. Tabela: comparacao (produtos semelhantes ou alternativos)
-- ---------------------------------------------------------------------
CREATE TABLE `comparacao` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `produto_id` INT NOT NULL,
  `produto_comparado_nome` VARCHAR(255) NOT NULL,
  `preco_referencia` DECIMAL(10,2) NULL,
  `diferencas` TEXT NOT NULL,
  `resumo` TEXT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_comparacao_produto` (`produto_id`),
  CONSTRAINT `fk_comparacao_produto`
    FOREIGN KEY (`produto_id`) REFERENCES `produto` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 7. Tabela: preco (cotações de lojas com data e hora da consulta)
-- ---------------------------------------------------------------------
CREATE TABLE `preco` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `produto_id` INT NOT NULL,
  `loja` VARCHAR(150) NOT NULL,
  `valor` DECIMAL(10,2) NOT NULL,
  `url` VARCHAR(500) NULL,
  `consultado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_preco_produto` (`produto_id`),
  INDEX `idx_preco_consultado_em` (`consultado_em`),
  CONSTRAINT `fk_preco_produto`
    FOREIGN KEY (`produto_id`) REFERENCES `produto` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 8. Tabela: pesquisa (histórico de consultas do usuário)
-- ---------------------------------------------------------------------
CREATE TABLE `pesquisa` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `dispositivo_id` VARCHAR(36) NOT NULL,
  `produto_id` INT NULL,
  `tipo_entrada` ENUM('foto', 'texto') NOT NULL,
  `termo_digitado` VARCHAR(255) NULL,
  `confianca` ENUM('alta', 'media', 'baixa') NOT NULL DEFAULT 'alta',
  `status` ENUM('identificado', 'confirmado', 'nao_identificado', 'erro') NOT NULL DEFAULT 'identificado',
  `criado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_pesquisa_dispositivo` (`dispositivo_id`),
  INDEX `idx_pesquisa_produto` (`produto_id`),
  INDEX `idx_pesquisa_criado_em` (`criado_em`),
  CONSTRAINT `fk_pesquisa_dispositivo`
    FOREIGN KEY (`dispositivo_id`) REFERENCES `dispositivo` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_pesquisa_produto`
    FOREIGN KEY (`produto_id`) REFERENCES `produto` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 9. Tabela: mensagem_chat (conversa com a IA sobre o produto da pesquisa)
-- ---------------------------------------------------------------------
CREATE TABLE `mensagem_chat` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `pesquisa_id` INT NOT NULL,
  `autor` ENUM('usuario', 'ia') NOT NULL,
  `conteudo` TEXT NOT NULL,
  `criado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_mensagem_pesquisa` (`pesquisa_id`),
  INDEX `idx_mensagem_criado_em` (`criado_em`),
  CONSTRAINT `fk_mensagem_pesquisa`
    FOREIGN KEY (`pesquisa_id`) REFERENCES `pesquisa` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

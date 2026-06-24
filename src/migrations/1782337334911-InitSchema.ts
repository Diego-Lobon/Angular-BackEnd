import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1782337334911 implements MigrationInterface {
    name = 'InitSchema1782337334911'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`usuarios\` DROP FOREIGN KEY \`fk_usuarios_tipo_usuarios\``);
        await queryRunner.query(`ALTER TABLE \`productos\` DROP FOREIGN KEY \`fk_productos_categorias\``);
        await queryRunner.query(`ALTER TABLE \`productos\` DROP FOREIGN KEY \`fk_productos_marcas\``);
        await queryRunner.query(`ALTER TABLE \`cotizaciones\` DROP FOREIGN KEY \`fk_cotizaciones_clientes\``);
        await queryRunner.query(`CREATE TABLE \`cart_items\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` varchar(255) NOT NULL, \`product_id\` varchar(255) NOT NULL, \`quantity\` int NOT NULL DEFAULT '1', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` CHANGE \`correo\` \`correo\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` CHANGE \`celular\` \`celular\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` CHANGE \`tipo_id\` \`tipo_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`clientes\` ADD UNIQUE INDEX \`IDX_93f5182802c068a9571734f44b\` (\`username\`)`);
        await queryRunner.query(`ALTER TABLE \`clientes\` CHANGE \`correo\` \`correo\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`clientes\` CHANGE \`celular\` \`celular\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`clientes\` CHANGE \`id_precio_lista\` \`id_precio_lista\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`clientes\` DROP COLUMN \`password\``);
        await queryRunner.query(`ALTER TABLE \`clientes\` ADD \`password\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`clientes\` CHANGE \`correo\` \`correo\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`clientes\` CHANGE \`celular\` \`celular\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`clientes\` CHANGE \`id_precio_lista\` \`id_precio_lista\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`marcas\` DROP COLUMN \`nombre\``);
        await queryRunner.query(`ALTER TABLE \`marcas\` ADD \`nombre\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`productos\` DROP COLUMN \`referencia_interna\``);
        await queryRunner.query(`ALTER TABLE \`productos\` ADD \`referencia_interna\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`productos\` DROP COLUMN \`nombre\``);
        await queryRunner.query(`ALTER TABLE \`productos\` ADD \`nombre\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`productos\` DROP COLUMN \`unidad_medida\``);
        await queryRunner.query(`ALTER TABLE \`productos\` ADD \`unidad_medida\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`productos\` DROP COLUMN \`imagen_url\``);
        await queryRunner.query(`ALTER TABLE \`productos\` ADD \`imagen_url\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`productos\` CHANGE \`categoria_id\` \`categoria_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`productos\` CHANGE \`marca_id\` \`marca_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`categorias\` DROP COLUMN \`nombre\``);
        await queryRunner.query(`ALTER TABLE \`categorias\` ADD \`nombre\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cotizaciones\` CHANGE \`numero_cotizacion\` \`numero_cotizacion\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`cotizaciones\` CHANGE \`razon_social\` \`razon_social\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`cotizaciones\` CHANGE \`solicitante\` \`solicitante\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`cotizaciones\` CHANGE \`pdf_url\` \`pdf_url\` varchar(512) NULL`);
        await queryRunner.query(`ALTER TABLE \`cotizaciones\` CHANGE \`fecha_creacion\` \`fecha_creacion\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`cotizaciones\` CHANGE \`id_cliente\` \`id_cliente\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` ADD CONSTRAINT \`FK_53efc99ed95b2a570093ae68ecd\` FOREIGN KEY (\`tipo_id\`) REFERENCES \`tipo_usuario\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`productos\` ADD CONSTRAINT \`FK_5aaee6054b643e7c778477193a3\` FOREIGN KEY (\`categoria_id\`) REFERENCES \`categorias\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`productos\` ADD CONSTRAINT \`FK_db0c18bdd5f379d40ae838e74bd\` FOREIGN KEY (\`marca_id\`) REFERENCES \`marcas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cotizaciones\` ADD CONSTRAINT \`FK_75ab3bc50a70ad252a31aa25ac1\` FOREIGN KEY (\`id_cliente\`) REFERENCES \`clientes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cotizaciones\` DROP FOREIGN KEY \`FK_75ab3bc50a70ad252a31aa25ac1\``);
        await queryRunner.query(`ALTER TABLE \`productos\` DROP FOREIGN KEY \`FK_db0c18bdd5f379d40ae838e74bd\``);
        await queryRunner.query(`ALTER TABLE \`productos\` DROP FOREIGN KEY \`FK_5aaee6054b643e7c778477193a3\``);
        await queryRunner.query(`ALTER TABLE \`usuarios\` DROP FOREIGN KEY \`FK_53efc99ed95b2a570093ae68ecd\``);
        await queryRunner.query(`ALTER TABLE \`cotizaciones\` CHANGE \`id_cliente\` \`id_cliente\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`cotizaciones\` CHANGE \`fecha_creacion\` \`fecha_creacion\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`cotizaciones\` CHANGE \`pdf_url\` \`pdf_url\` varchar(512) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`cotizaciones\` CHANGE \`solicitante\` \`solicitante\` varchar(100) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`cotizaciones\` CHANGE \`razon_social\` \`razon_social\` varchar(100) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`cotizaciones\` CHANGE \`numero_cotizacion\` \`numero_cotizacion\` varchar(50) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`categorias\` DROP COLUMN \`nombre\``);
        await queryRunner.query(`ALTER TABLE \`categorias\` ADD \`nombre\` varchar(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`productos\` CHANGE \`marca_id\` \`marca_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`productos\` CHANGE \`categoria_id\` \`categoria_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`productos\` DROP COLUMN \`imagen_url\``);
        await queryRunner.query(`ALTER TABLE \`productos\` ADD \`imagen_url\` varchar(250) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`productos\` DROP COLUMN \`unidad_medida\``);
        await queryRunner.query(`ALTER TABLE \`productos\` ADD \`unidad_medida\` varchar(300) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`productos\` DROP COLUMN \`nombre\``);
        await queryRunner.query(`ALTER TABLE \`productos\` ADD \`nombre\` varchar(300) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`productos\` DROP COLUMN \`referencia_interna\``);
        await queryRunner.query(`ALTER TABLE \`productos\` ADD \`referencia_interna\` varchar(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`marcas\` DROP COLUMN \`nombre\``);
        await queryRunner.query(`ALTER TABLE \`marcas\` ADD \`nombre\` varchar(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`clientes\` CHANGE \`id_precio_lista\` \`id_precio_lista\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`clientes\` CHANGE \`celular\` \`celular\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`clientes\` CHANGE \`correo\` \`correo\` varchar(50) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`clientes\` DROP COLUMN \`password\``);
        await queryRunner.query(`ALTER TABLE \`clientes\` ADD \`password\` varchar(150) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`clientes\` CHANGE \`id_precio_lista\` \`id_precio_lista\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`clientes\` CHANGE \`celular\` \`celular\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`clientes\` CHANGE \`correo\` \`correo\` varchar(50) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`clientes\` DROP INDEX \`IDX_93f5182802c068a9571734f44b\``);
        await queryRunner.query(`ALTER TABLE \`usuarios\` CHANGE \`tipo_id\` \`tipo_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` CHANGE \`celular\` \`celular\` varchar(100) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` CHANGE \`correo\` \`correo\` varchar(100) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`DROP TABLE \`cart_items\``);
        await queryRunner.query(`ALTER TABLE \`cotizaciones\` ADD CONSTRAINT \`fk_cotizaciones_clientes\` FOREIGN KEY (\`id_cliente\`) REFERENCES \`clientes\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`productos\` ADD CONSTRAINT \`fk_productos_marcas\` FOREIGN KEY (\`marca_id\`) REFERENCES \`marcas\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`productos\` ADD CONSTRAINT \`fk_productos_categorias\` FOREIGN KEY (\`categoria_id\`) REFERENCES \`categorias\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` ADD CONSTRAINT \`fk_usuarios_tipo_usuarios\` FOREIGN KEY (\`tipo_id\`) REFERENCES \`tipo_usuario\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`);
    }

}

module.exports = class Data1715278515072 {
    name = 'Data1715278515072'

    async up(db) {
        await db.query(`CREATE TABLE "send_packet" ("id" character varying NOT NULL, "dispatcher_address" text NOT NULL, "dispatcher_type" text NOT NULL, "dispatcher_client_name" text NOT NULL, "source_port_address" text NOT NULL, "source_channel_id" text NOT NULL, "packet" text NOT NULL, "sequence" numeric NOT NULL, "timeout_timestamp" numeric NOT NULL, "block_number" integer NOT NULL, "block_timestamp" numeric NOT NULL, "transaction_hash" text NOT NULL, "chain_id" integer NOT NULL, "gas" numeric NOT NULL, "max_fee_per_gas" numeric, "max_priority_fee_per_gas" numeric, "from" text NOT NULL, CONSTRAINT "PK_bc0d01e2854533c77c8b5e6260a" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "recv_packet" ("id" character varying NOT NULL, "dispatcher_address" text NOT NULL, "dispatcher_type" text NOT NULL, "dispatcher_client_name" text NOT NULL, "dest_port_address" text NOT NULL, "dest_channel_id" text NOT NULL, "sequence" numeric NOT NULL, "block_number" integer NOT NULL, "block_timestamp" numeric NOT NULL, "transaction_hash" text NOT NULL, "chain_id" integer NOT NULL, "gas" numeric NOT NULL, "max_fee_per_gas" numeric, "max_priority_fee_per_gas" numeric, "from" text NOT NULL, CONSTRAINT "PK_79ecca659a764997adc8794f123" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "write_ack_packet" ("id" character varying NOT NULL, "dispatcher_address" text NOT NULL, "dispatcher_type" text NOT NULL, "dispatcher_client_name" text NOT NULL, "writer_port_address" text NOT NULL, "writer_channel_id" text NOT NULL, "sequence" numeric NOT NULL, "ack_packet_success" boolean NOT NULL, "ack_packet_data" text NOT NULL, "block_number" integer NOT NULL, "block_timestamp" numeric NOT NULL, "transaction_hash" text NOT NULL, "chain_id" integer NOT NULL, "gas" numeric NOT NULL, "max_fee_per_gas" numeric, "max_priority_fee_per_gas" numeric, "from" text NOT NULL, CONSTRAINT "PK_c5236bd249c16bb655e20660911" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "acknowledgement" ("id" character varying NOT NULL, "dispatcher_address" text NOT NULL, "dispatcher_type" text NOT NULL, "dispatcher_client_name" text NOT NULL, "source_port_address" text NOT NULL, "source_channel_id" text NOT NULL, "sequence" numeric NOT NULL, "block_number" integer NOT NULL, "block_timestamp" numeric NOT NULL, "transaction_hash" text NOT NULL, "chain_id" integer NOT NULL, "gas" numeric NOT NULL, "max_fee_per_gas" numeric, "max_priority_fee_per_gas" numeric, "from" text NOT NULL, CONSTRAINT "PK_8f6e435390595b00ff0b476cac1" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "packet" ("id" character varying NOT NULL, "state" character varying(13) NOT NULL, "send_packet_id" character varying, "recv_packet_id" character varying, "write_ack_packet_id" character varying, "ack_packet_id" character varying, CONSTRAINT "REL_2f849cd746e0708773d46af527" UNIQUE ("send_packet_id"), CONSTRAINT "REL_3aed1702c2c27f733c1c3c0460" UNIQUE ("recv_packet_id"), CONSTRAINT "REL_08ed04d8e5b3a07dbc6468b7bc" UNIQUE ("write_ack_packet_id"), CONSTRAINT "REL_2eb1a0b6e1c9967db3079d80cb" UNIQUE ("ack_packet_id"), CONSTRAINT "PK_0bef789c4d597bd0b7723f6d878" PRIMARY KEY ("id"))`)
        await db.query(`CREATE UNIQUE INDEX "IDX_2f849cd746e0708773d46af527" ON "packet" ("send_packet_id") `)
        await db.query(`CREATE UNIQUE INDEX "IDX_3aed1702c2c27f733c1c3c0460" ON "packet" ("recv_packet_id") `)
        await db.query(`CREATE UNIQUE INDEX "IDX_08ed04d8e5b3a07dbc6468b7bc" ON "packet" ("write_ack_packet_id") `)
        await db.query(`CREATE UNIQUE INDEX "IDX_2eb1a0b6e1c9967db3079d80cb" ON "packet" ("ack_packet_id") `)
        await db.query(`ALTER TABLE "packet" ADD CONSTRAINT "FK_2f849cd746e0708773d46af527c" FOREIGN KEY ("send_packet_id") REFERENCES "send_packet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "packet" ADD CONSTRAINT "FK_3aed1702c2c27f733c1c3c04601" FOREIGN KEY ("recv_packet_id") REFERENCES "recv_packet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "packet" ADD CONSTRAINT "FK_08ed04d8e5b3a07dbc6468b7bcb" FOREIGN KEY ("write_ack_packet_id") REFERENCES "write_ack_packet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "packet" ADD CONSTRAINT "FK_2eb1a0b6e1c9967db3079d80cb1" FOREIGN KEY ("ack_packet_id") REFERENCES "acknowledgement"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "send_packet"`)
        await db.query(`DROP TABLE "recv_packet"`)
        await db.query(`DROP TABLE "write_ack_packet"`)
        await db.query(`DROP TABLE "acknowledgement"`)
        await db.query(`DROP TABLE "packet"`)
        await db.query(`DROP INDEX "public"."IDX_2f849cd746e0708773d46af527"`)
        await db.query(`DROP INDEX "public"."IDX_3aed1702c2c27f733c1c3c0460"`)
        await db.query(`DROP INDEX "public"."IDX_08ed04d8e5b3a07dbc6468b7bc"`)
        await db.query(`DROP INDEX "public"."IDX_2eb1a0b6e1c9967db3079d80cb"`)
        await db.query(`ALTER TABLE "packet" DROP CONSTRAINT "FK_2f849cd746e0708773d46af527c"`)
        await db.query(`ALTER TABLE "packet" DROP CONSTRAINT "FK_3aed1702c2c27f733c1c3c04601"`)
        await db.query(`ALTER TABLE "packet" DROP CONSTRAINT "FK_08ed04d8e5b3a07dbc6468b7bcb"`)
        await db.query(`ALTER TABLE "packet" DROP CONSTRAINT "FK_2eb1a0b6e1c9967db3079d80cb1"`)
    }
}

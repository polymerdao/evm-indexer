module.exports = class Data1724433295363 {
    name = 'Data1724433295363'

    async up(db) {
        await db.query(`DROP INDEX "public"."IDX_36524a30939bb522f1eda95267"`)
        await db.query(`DROP INDEX "public"."IDX_b05770c7b9f6fba9a0b12814e9"`)
        await db.query(`DROP INDEX "public"."IDX_9415c52ccc157e1a37c9f3f623"`)
        await db.query(`ALTER TABLE "send_packet_fee_deposited" DROP COLUMN "send_gas_limit"`)
        await db.query(`ALTER TABLE "send_packet_fee_deposited" DROP COLUMN "send_gas_price"`)
        await db.query(`ALTER TABLE "send_packet_fee_deposited" ADD "recv_gas_limit" numeric NOT NULL`)
        await db.query(`ALTER TABLE "send_packet_fee_deposited" ADD "recv_gas_price" numeric NOT NULL`)
        await db.query(`ALTER TABLE "send_packet" ADD "total_recv_fees_deposited" numeric`)
        await db.query(`ALTER TABLE "send_packet" ADD "total_ack_fees_deposited" numeric`)
        await db.query(`ALTER TABLE "send_packet_fee_deposited" DROP CONSTRAINT "FK_9415c52ccc157e1a37c9f3f6235"`)
        await db.query(`ALTER TABLE "send_packet_fee_deposited" ADD CONSTRAINT "UQ_9415c52ccc157e1a37c9f3f6235" UNIQUE ("send_packet_id")`)
        await db.query(`CREATE INDEX "IDX_2c83d97c2235020f49a5b6b03d" ON "send_packet_fee_deposited" ("recv_gas_limit") `)
        await db.query(`CREATE INDEX "IDX_8091819331faf8b95f5e8425ae" ON "send_packet_fee_deposited" ("recv_gas_price") `)
        await db.query(`CREATE UNIQUE INDEX "IDX_9415c52ccc157e1a37c9f3f623" ON "send_packet_fee_deposited" ("send_packet_id") `)
        await db.query(`CREATE INDEX "IDX_145dc81dfcbadcef6bc0e7165c" ON "send_packet" ("total_recv_fees_deposited") `)
        await db.query(`CREATE INDEX "IDX_fa9429f1c64a25e7c5b64ee8b0" ON "send_packet" ("total_ack_fees_deposited") `)
        await db.query(`ALTER TABLE "send_packet_fee_deposited" ADD CONSTRAINT "FK_9415c52ccc157e1a37c9f3f6235" FOREIGN KEY ("send_packet_id") REFERENCES "send_packet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`CREATE INDEX "IDX_36524a30939bb522f1eda95267" ON "send_packet_fee_deposited" ("send_gas_limit") `)
        await db.query(`CREATE INDEX "IDX_b05770c7b9f6fba9a0b12814e9" ON "send_packet_fee_deposited" ("send_gas_price") `)
        await db.query(`CREATE INDEX "IDX_9415c52ccc157e1a37c9f3f623" ON "send_packet_fee_deposited" ("send_packet_id") `)
        await db.query(`ALTER TABLE "send_packet_fee_deposited" ADD "send_gas_limit" numeric NOT NULL`)
        await db.query(`ALTER TABLE "send_packet_fee_deposited" ADD "send_gas_price" numeric NOT NULL`)
        await db.query(`ALTER TABLE "send_packet_fee_deposited" DROP COLUMN "recv_gas_limit"`)
        await db.query(`ALTER TABLE "send_packet_fee_deposited" DROP COLUMN "recv_gas_price"`)
        await db.query(`ALTER TABLE "send_packet" DROP COLUMN "total_recv_fees_deposited"`)
        await db.query(`ALTER TABLE "send_packet" DROP COLUMN "total_ack_fees_deposited"`)
        await db.query(`ALTER TABLE "send_packet_fee_deposited" ADD CONSTRAINT "FK_9415c52ccc157e1a37c9f3f6235" FOREIGN KEY ("send_packet_id") REFERENCES "send_packet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "send_packet_fee_deposited" DROP CONSTRAINT "UQ_9415c52ccc157e1a37c9f3f6235"`)
        await db.query(`DROP INDEX "public"."IDX_2c83d97c2235020f49a5b6b03d"`)
        await db.query(`DROP INDEX "public"."IDX_8091819331faf8b95f5e8425ae"`)
        await db.query(`DROP INDEX "public"."IDX_9415c52ccc157e1a37c9f3f623"`)
        await db.query(`DROP INDEX "public"."IDX_145dc81dfcbadcef6bc0e7165c"`)
        await db.query(`DROP INDEX "public"."IDX_fa9429f1c64a25e7c5b64ee8b0"`)
        await db.query(`ALTER TABLE "send_packet_fee_deposited" DROP CONSTRAINT "FK_9415c52ccc157e1a37c9f3f6235"`)
    }
}

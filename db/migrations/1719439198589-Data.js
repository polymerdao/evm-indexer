module.exports = class Data1719439198589 {
    name = 'Data1719439198589'

    async up(db) {
        await db.query(`CREATE TABLE "send_packet_fee_deposited" ("id" character varying NOT NULL, "channel_id" text NOT NULL, "sequence" numeric NOT NULL, "gas_limits" integer array NOT NULL, "gas_prices" integer array NOT NULL, "block_number" numeric NOT NULL, "block_timestamp" numeric NOT NULL, "transaction_hash" text NOT NULL, "chain_id" integer NOT NULL, "from" text NOT NULL, CONSTRAINT "PK_0dcda86a7cfb4b2c7869d1ae9ae" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_c4e29a084b0fcabfa33b2ab3fb" ON "send_packet_fee_deposited" ("channel_id") `)
        await db.query(`CREATE INDEX "IDX_3f4bedb3b85c7c38074e4b9e74" ON "send_packet_fee_deposited" ("sequence") `)
        await db.query(`CREATE INDEX "IDX_f82f8fe578dd9a0c99a6f61f43" ON "send_packet_fee_deposited" ("block_timestamp") `)
        await db.query(`CREATE INDEX "IDX_ccfe6fabc9a9c4b8524b42be8b" ON "send_packet_fee_deposited" ("transaction_hash") `)
        await db.query(`CREATE INDEX "IDX_f751d669e7008aa8669bb1f2fb" ON "send_packet_fee_deposited" ("chain_id") `)
        await db.query(`CREATE TABLE "open_channel_fee_deposited" ("id" character varying NOT NULL, "source_address" text NOT NULL, "version" text NOT NULL, "ordering" integer NOT NULL, "connection_hops" text array NOT NULL, "counterparty_port_id" text NOT NULL, "fee_amount" numeric NOT NULL, "block_number" numeric NOT NULL, "block_timestamp" numeric NOT NULL, "transaction_hash" text NOT NULL, "chain_id" integer NOT NULL, "from" text NOT NULL, CONSTRAINT "PK_86910d05c1b70573db78958fc1c" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_bff1ede641b8eaf6575a870684" ON "open_channel_fee_deposited" ("block_timestamp") `)
        await db.query(`CREATE INDEX "IDX_6803eabe5af5c9e4bf15f6740b" ON "open_channel_fee_deposited" ("transaction_hash") `)
        await db.query(`CREATE INDEX "IDX_5b7790804f9282c3b531a65300" ON "open_channel_fee_deposited" ("chain_id") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "send_packet_fee_deposited"`)
        await db.query(`DROP INDEX "public"."IDX_c4e29a084b0fcabfa33b2ab3fb"`)
        await db.query(`DROP INDEX "public"."IDX_3f4bedb3b85c7c38074e4b9e74"`)
        await db.query(`DROP INDEX "public"."IDX_f82f8fe578dd9a0c99a6f61f43"`)
        await db.query(`DROP INDEX "public"."IDX_ccfe6fabc9a9c4b8524b42be8b"`)
        await db.query(`DROP INDEX "public"."IDX_f751d669e7008aa8669bb1f2fb"`)
        await db.query(`DROP TABLE "open_channel_fee_deposited"`)
        await db.query(`DROP INDEX "public"."IDX_bff1ede641b8eaf6575a870684"`)
        await db.query(`DROP INDEX "public"."IDX_6803eabe5af5c9e4bf15f6740b"`)
        await db.query(`DROP INDEX "public"."IDX_5b7790804f9282c3b531a65300"`)
    }
}

module.exports = class Data1717003289441 {
    name = 'Data1717003289441'

    async up(db) {
        await db.query(`CREATE INDEX "IDX_c862c20d60c8fb72fd3ab5a732" ON "channel_open_init" ("block_timestamp") `)
        await db.query(`CREATE INDEX "IDX_bd1791b2368d70a7f042222d70" ON "channel_open_init" ("transaction_hash") `)
        await db.query(`CREATE INDEX "IDX_b3e246fd13b29747c2da2cd683" ON "channel_open_init" ("polymer_tx_hash") `)
        await db.query(`CREATE INDEX "IDX_406468e982e7c20317a75b5e83" ON "channel_open_try" ("block_timestamp") `)
        await db.query(`CREATE INDEX "IDX_380122978c05128157b00344df" ON "channel_open_try" ("transaction_hash") `)
        await db.query(`CREATE INDEX "IDX_dbdfa748f845c819060c25ebd5" ON "channel_open_try" ("polymer_tx_hash") `)
        await db.query(`CREATE INDEX "IDX_3caf0ccc47b67aba86d0590201" ON "channel_open_ack" ("block_timestamp") `)
        await db.query(`CREATE INDEX "IDX_3c17adb8c868b0890ed8af875f" ON "channel_open_ack" ("transaction_hash") `)
        await db.query(`CREATE INDEX "IDX_52518066d565975accf793a16c" ON "channel_open_ack" ("polymer_tx_hash") `)
        await db.query(`CREATE INDEX "IDX_173e4ff5ff95bf1caadf268c15" ON "channel_open_confirm" ("block_timestamp") `)
        await db.query(`CREATE INDEX "IDX_c8899aa8c8f659fb153096f09f" ON "channel_open_confirm" ("transaction_hash") `)
        await db.query(`CREATE INDEX "IDX_6e70d50106cef3eea5cbe0fc38" ON "channel_open_confirm" ("polymer_tx_hash") `)
        await db.query(`CREATE INDEX "IDX_a26a6a280dbe942d6809529984" ON "close_ibc_channel" ("block_timestamp") `)
        await db.query(`CREATE INDEX "IDX_15465d356bd5165f754f14a321" ON "close_ibc_channel" ("transaction_hash") `)
        await db.query(`CREATE INDEX "IDX_503061e86735077edd6a7d9d60" ON "close_ibc_channel" ("polymer_tx_hash") `)
        await db.query(`CREATE INDEX "IDX_161c95ba32beeb8aa68267b54a" ON "channel" ("channel_id") `)
        await db.query(`CREATE INDEX "IDX_93a75f61774fc73b5a58571b44" ON "channel" ("port_id") `)
        await db.query(`CREATE INDEX "IDX_2e9b6176d142e45170b555efac" ON "channel" ("counterparty_port_id") `)
        await db.query(`CREATE INDEX "IDX_8f6fb8727775f8be687c23988c" ON "channel" ("counterparty_channel_id") `)
        await db.query(`CREATE INDEX "IDX_48b75f7ab577a883ed4c2fa02d" ON "channel" ("block_timestamp") `)
        await db.query(`CREATE INDEX "IDX_4c035e1b7f5e9a6baade213c8f" ON "channel" ("transaction_hash") `)
        await db.query(`CREATE INDEX "IDX_8610d87c799b3129a33037ac74" ON "send_packet" ("block_timestamp") `)
        await db.query(`CREATE INDEX "IDX_4c5111a0d1e61428bd95873fce" ON "send_packet" ("transaction_hash") `)
        await db.query(`CREATE INDEX "IDX_df84b1c8dbc58dff2061c474a7" ON "send_packet" ("polymer_tx_hash") `)
        await db.query(`CREATE INDEX "IDX_b638ec58f5c18ea0ecd9ec2b57" ON "recv_packet" ("block_timestamp") `)
        await db.query(`CREATE INDEX "IDX_844497f9d07df1f68e7b3b02b5" ON "recv_packet" ("transaction_hash") `)
        await db.query(`CREATE INDEX "IDX_2e690d602a669b1c2e6d57f650" ON "write_ack_packet" ("block_timestamp") `)
        await db.query(`CREATE INDEX "IDX_ad0feb996c02cab8e29521fbf3" ON "write_ack_packet" ("transaction_hash") `)
        await db.query(`CREATE INDEX "IDX_055eb3e0ec6afb2e8a02229769" ON "write_ack_packet" ("polymer_tx_hash") `)
        await db.query(`CREATE INDEX "IDX_e6c4bf78e7addf82a7abe90bb2" ON "acknowledgement" ("block_timestamp") `)
        await db.query(`CREATE INDEX "IDX_c1335e15aa93230625d155bc5e" ON "acknowledgement" ("transaction_hash") `)
        await db.query(`CREATE INDEX "IDX_aa6dd6fab34307d69815f0b309" ON "timeout" ("block_timestamp") `)
        await db.query(`CREATE INDEX "IDX_f669cac32d288dc044ed04a795" ON "timeout" ("transaction_hash") `)
        await db.query(`CREATE INDEX "IDX_a15813778bfcd86e5aa1306392" ON "write_timeout_packet" ("block_timestamp") `)
        await db.query(`CREATE INDEX "IDX_da59eba985631109d14083150e" ON "write_timeout_packet" ("transaction_hash") `)
    }

    async down(db) {
        await db.query(`DROP INDEX "public"."IDX_c862c20d60c8fb72fd3ab5a732"`)
        await db.query(`DROP INDEX "public"."IDX_bd1791b2368d70a7f042222d70"`)
        await db.query(`DROP INDEX "public"."IDX_b3e246fd13b29747c2da2cd683"`)
        await db.query(`DROP INDEX "public"."IDX_406468e982e7c20317a75b5e83"`)
        await db.query(`DROP INDEX "public"."IDX_380122978c05128157b00344df"`)
        await db.query(`DROP INDEX "public"."IDX_dbdfa748f845c819060c25ebd5"`)
        await db.query(`DROP INDEX "public"."IDX_3caf0ccc47b67aba86d0590201"`)
        await db.query(`DROP INDEX "public"."IDX_3c17adb8c868b0890ed8af875f"`)
        await db.query(`DROP INDEX "public"."IDX_52518066d565975accf793a16c"`)
        await db.query(`DROP INDEX "public"."IDX_173e4ff5ff95bf1caadf268c15"`)
        await db.query(`DROP INDEX "public"."IDX_c8899aa8c8f659fb153096f09f"`)
        await db.query(`DROP INDEX "public"."IDX_6e70d50106cef3eea5cbe0fc38"`)
        await db.query(`DROP INDEX "public"."IDX_a26a6a280dbe942d6809529984"`)
        await db.query(`DROP INDEX "public"."IDX_15465d356bd5165f754f14a321"`)
        await db.query(`DROP INDEX "public"."IDX_503061e86735077edd6a7d9d60"`)
        await db.query(`DROP INDEX "public"."IDX_161c95ba32beeb8aa68267b54a"`)
        await db.query(`DROP INDEX "public"."IDX_93a75f61774fc73b5a58571b44"`)
        await db.query(`DROP INDEX "public"."IDX_2e9b6176d142e45170b555efac"`)
        await db.query(`DROP INDEX "public"."IDX_8f6fb8727775f8be687c23988c"`)
        await db.query(`DROP INDEX "public"."IDX_48b75f7ab577a883ed4c2fa02d"`)
        await db.query(`DROP INDEX "public"."IDX_4c035e1b7f5e9a6baade213c8f"`)
        await db.query(`DROP INDEX "public"."IDX_8610d87c799b3129a33037ac74"`)
        await db.query(`DROP INDEX "public"."IDX_4c5111a0d1e61428bd95873fce"`)
        await db.query(`DROP INDEX "public"."IDX_df84b1c8dbc58dff2061c474a7"`)
        await db.query(`DROP INDEX "public"."IDX_b638ec58f5c18ea0ecd9ec2b57"`)
        await db.query(`DROP INDEX "public"."IDX_844497f9d07df1f68e7b3b02b5"`)
        await db.query(`DROP INDEX "public"."IDX_2e690d602a669b1c2e6d57f650"`)
        await db.query(`DROP INDEX "public"."IDX_ad0feb996c02cab8e29521fbf3"`)
        await db.query(`DROP INDEX "public"."IDX_055eb3e0ec6afb2e8a02229769"`)
        await db.query(`DROP INDEX "public"."IDX_e6c4bf78e7addf82a7abe90bb2"`)
        await db.query(`DROP INDEX "public"."IDX_c1335e15aa93230625d155bc5e"`)
        await db.query(`DROP INDEX "public"."IDX_aa6dd6fab34307d69815f0b309"`)
        await db.query(`DROP INDEX "public"."IDX_f669cac32d288dc044ed04a795"`)
        await db.query(`DROP INDEX "public"."IDX_a15813778bfcd86e5aa1306392"`)
        await db.query(`DROP INDEX "public"."IDX_da59eba985631109d14083150e"`)
    }
}

export function stations(db:D1Database) {
    // upsert tuples
    // - if station_id exists, update existing tuple
    // - if station_id is new, insert tuple
    async function upsert(a0: string, a1: string, a2: string, a3: string, a4: string,
                          a5: string, a6: string, a7: string, a8: string, a9: string) {
        await db
            .prepare(
                "INSERT INTO " +
                "stations (station_id, owner, ttype, hull, name, payload, location, timezone, forecast, note, last_updated)" +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, current_timestamp)" +
                "ON CONFLICT(station_id) DO UPDATE SET " +
                "station_id = excluded.station_id, " +
                "owner = excluded.owner, " +
                "ttype = excluded.ttype, " +
                "hull = excluded.hull, " +
                "name = excluded.name, " +
                "payload = excluded.payload, " +
                "location = excluded.location, " +
                "timezone = excluded.timezone, " +
                "forecast = excluded.forecast, " +
                "note = excluded.note, " +
                "last_updated = excluded.last_updated")
            .bind(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9)
            .run();
    }
    return {upsert};
}
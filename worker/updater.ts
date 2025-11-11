// db access
import {stations} from "./db/stations.ts";

export function updater(db:D1Database) {
    // initialize stations table
    const db_stations = stations(db);

    // fetch station and upsert to db
    async function updateStation (){
        // get station tuples
        const tup = await getStationTable();
        // assign each tuple to table
        for(let i = 2; i < tup.length; i++) {
            const att = tup[i].split('|');
            if(att.length == 10)
                await db_stations.upsert(att[0], att[1], att[2], att[3], att[4], att[5], att[6], att[7], att[8], att[9])
        }
    }
    return { updateStation };
}

/*
------------------------------------------
    helpers
------------------------------------------
*/

// fetches station tables from JDBC
// returns data as an array of split tuples
async function getStationTable() {
    const res = await fetch("https://www.ndbc.noaa.gov/data/stations/station_table.txt")
    const text = await res.text();
    return text.split("\n");
}
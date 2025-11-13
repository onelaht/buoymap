// db access
import {stations} from "./db/stations.ts";
// types
import type {StationTableTuple} from "../types/StationTable.ts";

export function retriever(db:D1Database) {
    // initialize stations table
    const db_stations = stations(db);

    // extract stations and normalize location
    async function retrieveStations():Promise<StationTableTuple[]> {
        // get all tuples from station table
        const stations:StationTableTuple[] = await db_stations.getAll();
        // traverse through all stations and normalize location
        stations.forEach((s) => {
            s.location = normalizeLocation(s.location as string);
        })
        return stations;
    }

    // convert location to lat/lon
     function normalizeLocation(location:string):number[] {
        const splitData = location.split(" ");
        const lat = parseFloat(splitData[0]);
        const lon = parseFloat(splitData[2]);
        return [splitData[1] === "N" ? lat : -lat, splitData[3] === "E" ? lon : -lon]
    }

    return {retrieveStations};
}
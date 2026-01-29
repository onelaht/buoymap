// types and interfaces
import type {IStation} from "../types/IStation.ts";
import type {IStationData} from "../types/IStationData.ts";
import type {IStationTuple} from "../types/IStationTuple.ts";
import type {IMeteorologicalData} from "../types/IMeteorologicalData";

export function retriever(db:D1Database) {
    // extract stations and normalize location
    async function retrieveStations():Promise<IStation[]> {
        // get all tuples from station table
        const stations:IStation[] = await getStationsData(db);
        // traverse through all stations and normalize location
        stations.forEach((s) => {
            s.data.location = normalizeLocation(s.data.location as string);
        })
        return stations;
    }

    // retrieve unique (no dups) country code
    async function getUniqueCountries():Promise<Array<IStationData["country_code"]>> {
        const res = await db.prepare(
            "SELECT DISTINCT country_code FROM stations_owner").all<IStationData["country_code"]>();
        return res?.results ?? [];
    }

    // retrieve unique (no dups) owner data
    async function getUniqueOwners():Promise<Array<Pick<IStationData, "code" | "owner_name">>> {
        const res = await db.prepare(
            "SELECT DISTINCT code, name FROM stations_owner").all<Pick<IStationData, "code" | "owner_name">>();
        return res?.results ?? [];
    }

    //
    async function getMeteorologicalData(stationID: string):Promise<IMeteorologicalData> {
        const data:IMeteorologicalData = {
            label: [],
            wdir: [],
            wspd: [],
            gst: [],
            wvht: [],
            dpd: [],
            apd: [],
            mwd: [],
            pres: [],
            atmp: [],
            wtmp: [],
            dewp: [],
            vis: [],
            ptdy: [],
            tide: [],
        };
        // get data
        const req = await fetchData(`https://www.ndbc.noaa.gov/data/5day2/${stationID}_5day.txt`);
        // return empty arr if empty
        if(req.length > 2) {
            for (let i = 2; i < req.length; i++) {
                // split attributes (based on tab or space)
                const tup = req[i].split(/\s+/);
                // push data
                data.label.push(`${tup[0]}-${tup[1]}-${tup[2]}-${tup[3]}-${tup[4]}-${tup[5]}`);
                data.wdir.push(parseInt(tup[5]));
                data.wspd.push(parseFloat(tup[6]));
                data.gst.push(tup[7] === "MM" ? undefined : parseFloat(tup[7]));
                data.gst.push(tup[8] === "MM" ? undefined : parseFloat(tup[8]));
                data.wvht.push(tup[9] === "MM" ? undefined : parseFloat(tup[9]));
                data.dpd.push(tup[10] === "MM" ? undefined : parseFloat(tup[10]));
                data.apd.push(tup[11] === "MM" ? undefined : parseFloat(tup[11]));
                data.mwd.push(tup[12] === "MM" ? undefined : parseFloat(tup[12]));
                data.pres.push(tup[13] === "MM" ? undefined : parseFloat(tup[13]));
                data.atmp.push(tup[14] === "MM" ? undefined : parseFloat(tup[14]));
                data.wtmp.push(tup[15] === "MM" ? undefined : parseFloat(tup[15]));
                data.dewp.push(tup[16] === "MM" ? undefined : parseFloat(tup[16]));
                data.vis.push(tup[17] === "MM" ? undefined : parseFloat(tup[17]));
                data.ptdy.push(tup[18]);
                data.tide.push(tup[19] === "MM" ? undefined : parseFloat(tup[19]));
            }
        }
        return data;
    }
    return {retrieveStations, getUniqueCountries, getUniqueOwners, getMeteorologicalData};
}

//--------------------------------
//    helpers
//--------------------------------

// fetches data from NDBC
// returns data as an array of split tuples
async function fetchData(input:string) {
    const res = await fetch(input)
    if(res.ok) {
        const text = await res.text();
        return text.split("\n");
    } else
        return [];
}

// convert location to lat/lon
function normalizeLocation(location:string):number[] {
    const splitData = location.split(" ");
    const lat = parseFloat(splitData[0]);
    const lon = parseFloat(splitData[2]);
    return [splitData[1] === "N" ? lat : -lat, splitData[3] === "E" ? lon : -lon]
}

// retrieve station owners and stations table
async function getStationsData(db:D1Database):Promise<IStation[]> {
    const {results} = await db.prepare(
        "SELECT s.station_id, s.ttype, s.hull, s.name AS station_name, s.payload, s.location, " +
        "s.timezone, s.forecast, ss.code, ss.name AS owner_name, ss.country_code " +
        "FROM stations AS s " +
        "JOIN stations_owner AS ss " +
        "ON s.owner = ss.code"
    ).all<IStationTuple>();

    // retrieve and assign each tuples
    const data:IStation[] = results.map(r => ({
        station_id: r.station_id,
        data: {
            ttype: r.ttype,
            hull: r.hull,
            station_name: r.station_name,
            payload: r.payload,
            location: r.location,
            timezone: r.timezone,
            forecast: r.forecast,
            code: r.code,
            owner_name: r.owner_name,
            country_code: r.country_code,
        }
    }))
    return data ?? [];
}
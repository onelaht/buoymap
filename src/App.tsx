import {MapContainer, TileLayer} from "react-leaflet";
import 'leaflet/dist/leaflet.css'
import {useEffect} from "react";


export default function App() {
    // fetching via api
    const BASE = import.meta.env.DEV ? '' : 'https://buoymap.onelaht.workers.dev/'

    return (
            <MapContainer center={[51, -0]} zoom={13} style={{width: "100vw", height: "100vh"}}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
    )
}
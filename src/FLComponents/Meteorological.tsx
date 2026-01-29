import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import {Box} from "@mui/material";
import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import type {IMeteorologicalData} from "../../types/IMeteorologicalData.ts";

ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController
);

export default function Meteorological() {
    const {pathname} = useLocation();
    const [meteor, setMeteor] = useState<IMeteorologicalData>({
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
    });

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('/api/getMeteorological/', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: pathname.substring(1, pathname.length),
            });
            if(!res.ok)
                throw new Error(res.statusText);
            else {
                const data:IMeteorologicalData = await res.json();
                    setMeteor(data);
            }
        }
        fetchData();
    }, [pathname]);


    const data = {
        labels: meteor.label,
        datasets: [
            {
                type: "line" as const,
                label: "Wind Direction (degT)",
                borderColor: "rgb(255, 0, 0)",
                color: "rgb(255, 0, 0)",
                borderWidth: 2,
                fill: false,
                data: meteor?.wdir,
            },
            // {
            //     type: "line" as const,
            //     label: "Wind Speed (m/s)",
            //     borderColor: "rgb(0, 0, 255)",
            //     color: "rgb(0, 0, 255)",
            //     borderWidth: 2,
            //     fill: false,
            //     data: wspd,
            // },
            // {
            //     type: "line" as const,
            //     label: "Gust (m/s)",
            //     borderColor: "rgb(0, 0, 0)",
            //     color: "rgb(0, 0, 0)",
            //     borderWidth: 2,
            //     fill: false,
            //     data: gst,
            // },
            // {
            //     type: "line" as const,
            //     label: "Air Temperature (degC)",
            //     borderColor: "rgb(0, 255, 0)",
            //     color: "rgb(0, 255, 0)",
            //     borderWidth: 2,
            //     fill: false,
            //     data: atmp,
            // }
        ]
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
    }

    return (
        <Box sx={{display: "flex", width: "100%", height: "100%"}}>
            <Chart type='line' data={data} options={options} />
        </Box>
    )
}
// react
import {useMemo, useState} from "react";
// ChartJS components
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
// react-chartjs-2 (ChartJS wrapper)
import { Chart } from 'react-chartjs-2';
// react router (path)
import {useLocation} from "react-router-dom";
// MUI components
import {Box} from "@mui/material";
// types and interfaces
import type {ISolarRadiationData} from "../../../types/ISolarRadiationData.ts";
// child component
import PromptUser from "../Additional/PromptUser.tsx";
import SolarRadiationChartLoader from "../Loader/ChartLoader/SolarRadiationChartLoader.tsx";

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

export default function SolarRadiationChart() {
    // get router path
    const {pathname} = useLocation();
    // meteor data set used for chartjs
    const [typeData, setTypeData] = useState<ISolarRadiationData[]>([]);
    // determine if data fetch is completed
    const [isFetched, setIsFetched] = useState(false);
    // chartjs config
    const data = useMemo(() => {
        return {
            labels: typeData?.map(i => i.label),
                datasets: [
            {
                type: "line" as const,
                label: "SRAD1 / Shortwave Radiation (w/m2)",
                borderColor: "rgb(255, 0, 0)",
                borderWidth: 1,
                fill: false,
                data: typeData?.map(i => i.srad1),
            },
            {
                type: "line" as const,
                label: "SWRAD / Shortwave Radiation (w/m2)",
                borderColor: "rgb(0, 0, 255)",
                borderWidth: 1,
                fill: false,
                data: typeData?.map(i => i.swrad),
            },
            {
                type: "line" as const,
                label: "LWRAD / Longwave Radiation (w/m2)",
                borderColor: "rgb(0, 128, 255)",
                borderWidth: 1,
                fill: false,
                data: typeData?.map(i => i.lwrad),
            },
        ]}
    }, [typeData])

    const options = {
        responsive: true,
        maintainAspectRatio: false,
    }

    return (
        <>
            {pathname === "/" ?
                <PromptUser label={"No station selected"}/>
            : !isFetched ?
                        <SolarRadiationChartLoader
                            setTypeData={(val) => setTypeData(val)}
                            setIsFetched={(val) => setIsFetched(val)} />
                    :
                        typeData?.length > 0 ?
                                <Box sx={{display: "flex", width: "100%", height: "100%"}}>
                                    <Chart type='line' data={data} options={options} />
                                </Box>
                            :
                                <PromptUser label={"No meteorological data found"}/>
            }
        </>
    )
}
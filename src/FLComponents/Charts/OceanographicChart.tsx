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
// MUI components
import {Box} from "@mui/material";
// types and interfaces
import type {IOceanData} from "../../../types/IOceanData.ts";
// child component
import OceanographicChartLoader from "../Loader/ChartLoader/OceanographicChartLoader.tsx";

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

export default function OceanographicChart() {
    // meteor data set used for chartjs
    const [typeData, setTypeData] = useState<IOceanData[]>([]);
    // determine if data fetch is completed
    const [isFetched, setIsFetched] = useState(false);
    // chartjs config
    const data = useMemo(() => {
        return {
            labels: typeData?.map(i => i.label),
                datasets: [
            {
                type: "line" as const,
                label: "Depth (m)",
                borderColor: "rgb(255, 0, 0)",
                borderWidth: 1,
                fill: false,
                data: typeData?.map(i => i.depth),
            },
            {
                type: "line" as const,
                label: "Ocean Temperature (degC)",
                borderColor: "rgb(0, 0, 255)",
                borderWidth: 1,
                fill: false,
                data: typeData?.map(i => i.otmp),
            },
            {
                type: "line" as const,
                label: "Conductivity (mS/cm)",
                borderColor: "rgb(0, 0, 0)",
                borderWidth: 1,
                fill: false,
                data: typeData?.map(i => i.cond),
            },
            {
                type: "line" as const,
                label: "Salinity (psu)",
                borderColor: "rgb(128, 0, 128)",
                borderWidth: 1,
                fill: false,
                data: typeData?.map(i => i.sal),
            },
            {
                type: "line" as const,
                label: "Oxygen Concentration (ppm)",
                borderColor: "rgb(0, 255, 0)",
                borderWidth: 1,
                fill: false,
                data: typeData?.map(i => i.o2),
            },
            {
                type: "line" as const,
                label: "Chlorophyll Concentration (ug/l)",
                borderColor: "rgb(0, 255, 255)",
                borderWidth: 1,
                fill: false,
                data: typeData?.map(i => i.clcon),
            },
            {
                type: "line" as const,
                label: "Turbidity (FTU)",
                borderColor: "rgb(0, 128, 255)",
                borderWidth: 1,
                fill: false,
                data: typeData?.map(i => i.turb),
            },
            {
                type: "line" as const,
                label: "pH",
                borderColor: "rgb(128, 255, 128)",
                borderWidth: 1,
                fill: false,
                data: typeData?.map(i => i.ph),
            },
            {
                type: "line" as const,
                label: "Eh (Oxidation and Reduction)",
                borderColor: "rgb(255, 128, 128)",
                borderWidth: 1,
                fill: false,
                data: typeData?.map(i => i.eh),
            },
        ]}
    }, [typeData])

    const options = {
        responsive: true,
        maintainAspectRatio: false,
    }

    return (
        <>
            {!isFetched ?
                <OceanographicChartLoader
                    setTypeData={(val) => setTypeData(val)}
                    setIsFetched={(val) => setIsFetched(val)} />
            :
                <Box sx={{display: "flex", width: "100%", height: "100%"}}>
                    <Chart type='line' data={data} options={options} />
                </Box>
            }
        </>
    )
}
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
import type {IWaveSummaryData} from "../../../types/IWaveSummaryData.ts";
// child component
import SpectralWaveSummaryChartLoader from "../Loader/ChartLoader/SpectralWaveSummaryChartLoader.tsx";

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

export default function SpectralWaveSummaryChart() {
    // meteor data set used for chartjs
    const [typeData, setTypeData] = useState<IWaveSummaryData[]>([]);
    // determine if data fetch is completed
    const [isFetched, setIsFetched] = useState(false);
    // chartjs config
    const data = useMemo(() => {
        return {
            labels: typeData?.map(i => i.label),
                datasets: [
            {
                type: "line" as const,
                label: "Wind Height (m)",
                borderColor: "rgb(255, 0, 0)",
                borderWidth: 1,
                fill: false,
                data: typeData?.map(i => i.wvht),
            },
            {
                type: "line" as const,
                label: "Swell Height (m)",
                borderColor: "rgb(0, 0, 255)",
                borderWidth: 1,
                fill: false,
                data: typeData?.map(i => i.swh),
            },
            {
                type: "line" as const,
                label: "Swell Period (sec)",
                borderColor: "rgb(0, 0, 0)",
                borderWidth: 1,
                fill: false,
                data: typeData?.map(i => i.swp),
            },
            {
                type: "line" as const,
                label: "Wind Wave Height (m)",
                borderColor: "rgb(128, 0, 128)",
                borderWidth: 1,
                fill: false,
                data: typeData?.map(i => i.wwh),
            },
            {
                type: "line" as const,
                label: "Wind Wave Period (sec)",
                borderColor: "rgb(0, 255, 0)",
                borderWidth: 1,
                fill: false,
                data: typeData?.map(i => i.wwp),
            },
            {
                type: "line" as const,
                label: "Average Wave Period (sec)",
                borderColor: "rgb(0, 255, 255)",
                borderWidth: 1,
                fill: false,
                data: typeData?.map(i => i.apd),
            },
            {
                type: "line" as const,
                label: "Wave Direction (degT)",
                borderColor: "rgb(0, 128, 255)",
                borderWidth: 1,
                fill: false,
                data: typeData?.map(i => i.mwd),
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
                <SpectralWaveSummaryChartLoader
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
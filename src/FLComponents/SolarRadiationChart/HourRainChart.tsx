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
import type {IHourlyRainData} from "../../../types/IHourlyRainData.ts";
// child component
import PromptUser from "../Additional/PromptUser.tsx";
import HourlyRainChartLoader from "../Loader/ChartLoader/HourlyRainChartLoader.tsx";

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

export default function HourRainChart() {
    // get router path
    const {pathname} = useLocation();
    // typeData data set used for chartjs
    const [typeData, setTypeData] = useState<IHourlyRainData[]>([]);
    // determine if data fetch is completed
    const [isFetched, setIsFetched] = useState(false);
    // chartjs config
    const data = useMemo(() => {
        return {
            labels: typeData?.map(i => i.label),
                datasets: [
            {
                type: "line" as const,
                label: "Rain Accumulation (mm)",
                borderColor: "rgb(255, 0, 0)",
                borderWidth: 1,
                fill: false,
                data: typeData?.map(i => i.accum),
            },
        ]
        }
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
                        <HourlyRainChartLoader
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
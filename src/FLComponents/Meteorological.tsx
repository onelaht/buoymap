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

    const labels = ["2026 01 24 19", "2026 01 24 20", "2026 01 24 21", "2026 01 24 22", "2026 01 24 23"];
    // test sets
    const wdir = [70, 73, 74, 77, 68];
    const wspd = [6.8, 7.2, 6.5, 7.0, 7.0];
    const gst = [7.8, 8.8, 7.8, 8.1, 8.5];
    const atmp = [27.1, 27.2, 27.3, 27.4, 27.6];


    const data = {
        labels,
        datasets: [
            {
                type: "line" as const,
                label: "Wind Direction (degT)",
                borderColor: "rgb(255, 0, 0)",
                color: "rgb(255, 0, 0)",
                borderWidth: 2,
                fill: false,
                data: wdir,
            },
            {
                type: "line" as const,
                label: "Wind Speed (m/s)",
                borderColor: "rgb(0, 0, 255)",
                color: "rgb(0, 0, 255)",
                borderWidth: 2,
                fill: false,
                data: wspd,
            },
            {
                type: "line" as const,
                label: "Gust (m/s)",
                borderColor: "rgb(0, 0, 0)",
                color: "rgb(0, 0, 0)",
                borderWidth: 2,
                fill: false,
                data: gst,
            },
            {
                type: "line" as const,
                label: "Air Temperature (degC)",
                borderColor: "rgb(0, 255, 0)",
                color: "rgb(0, 255, 0)",
                borderWidth: 2,
                fill: false,
                data: atmp,
            }
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
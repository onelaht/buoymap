// react
import {useCallback, useEffect, useReducer, useRef, useState} from "react";
// flexlayout
import {Actions, DockLocation, Layout, Model} from 'flexlayout-react'
import 'flexlayout-react/style/light.css';
// flexlayout types
import {TabNode} from "flexlayout-react";
// flexlayout template
import {Layout1} from "./FLTemplates/Layout1.ts";
// react router
import {BrowserRouter as Router, Routes, Route, useLocation} from "react-router-dom";
// split components
import MapLayer from "./FLComponents/MapLayer.tsx";
import ProviderApp from "./Providers/ProviderApp.tsx";
import Filters from "./FLComponents/Filters.tsx";
import Metadata from "./FLComponents/Metadata.tsx";
import MeteorologicalChart from "./FLComponents/Charts/MeteorologicalChart.tsx";
import MeteorologicalDriftChart from "./FLComponents/Charts/MeteorologicalDriftChart.tsx";
import PromptUser from "./FLComponents/Additional/PromptUser.tsx";
import ContinuousWindChart from "./FLComponents/Charts/ContinuousWindChart.tsx";
import SupplementalChart from "./FLComponents/Charts/SupplementalChart.tsx";
import OceanographicChart from "./FLComponents/Charts/OceanographicChart.tsx";
import DartChart from "./FLComponents/Charts/DartChart.tsx";
import HourRainChart from "./FLComponents/Charts/HourRainChart.tsx";
import SpectralWaveSummaryChart from "./FLComponents/Charts/SpectralWaveSummaryChart.tsx";
import SolarRadiationChart from "./FLComponents/Charts/SolarRadiationChart.tsx";
// types and interfaces
import {chartLayoutComponents} from "../types/chartLayoutComponents.tsx"

function AppInner() {
    const [model] = useState<Model>(Model.fromJson(Layout1));
    const layoutRef = useRef<Layout>(null);
    const {pathname} = useLocation();
    const [prevDatatype, setPrevDatatype] = useState<Set<string>>(new Set<string>());
    const [, updateModel] = useReducer((x) => x + 1, 0)

    const deleteTab = useCallback((id:string) => {
        if(!model.getNodeById(id)) return;
        model.doAction(
            Actions.deleteTab(id),
        )
        updateModel();
    }, [model]);

    const addTab = useCallback((id:string, name:string, component:string, dest:string) => {
        // if already exists, ignore
        if(model.getNodeById(id)) return;
        model.doAction(
            Actions.addNode(
                {
                    id: id,
                    type: "tab",
                    name: name,
                    component: component,
                },
                dest,
                DockLocation.CENTER,
                -1,
                false
            )
        )
        updateModel()
    }, [model])

    const renderMetadata= useCallback(() => {
        if(model.getNodeById("metadata_tab") != null) return;
        addTab("metadata_tab", "Metadata", "Metadata", "col_c_tabset_1");
        deleteTab("metadata_placeholder");
    }, [addTab, deleteTab, model])

    const renderStationDataset = useCallback((dataset:Set<string>) => {
        const tempPrev = new Set<string>(prevDatatype);
        // render metadata
        renderMetadata();
        // if dataset is empty
        if(dataset.size == 0 || !dataset) return;
        // render each datatype
        dataset.forEach(d => {
            // skip if not part of att set
            if(!chartLayoutComponents.has(d)) return;
            const att = chartLayoutComponents.get(d);
            // skip if undefined
            if(!att) return;
            // if already exists
            if(model.getNodeById(att.id) != null)
                tempPrev.delete(d);
            else
                addTab(att.id, att.name, att.component, "col_c_tabset_2");
        })
        // delete remaining types from prev state
        tempPrev.forEach(d => {
            const att = chartLayoutComponents.get(d);
            if(!att) return;
            deleteTab(att.id);
        })
        // set current dataset as prev state
        setPrevDatatype(dataset);
        // placeholder still exists, delete placeholder
        if(model.getNodeById("chart_placeholder")) deleteTab("chart_placeholder");
    }, [addTab, deleteTab, model, prevDatatype, renderMetadata])

    const fetchDataset = useCallback(async () => {
        const res = await fetch("/api/getDatatype/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({stationID: pathname.substring(1)})
        });
        const data:string[] = await res.json();
        renderStationDataset(new Set<string>(data));
    }, [pathname, renderStationDataset])

    useEffect(() => {
        if(pathname === "/") return
        fetchDataset()
    }, [pathname]);

    const factory = useCallback((node:TabNode) => {
        const component = node.getComponent();
        if(component === "Map")
            return <MapLayer/>
        if(component === "Filters")
            return <Filters/>
        if(component === "Metadata")
            return <Metadata key={pathname}/>
        if(component === "Placeholder")
            return <PromptUser label={"No station selected"}/>
        // charts per datatype
        if(component === "MeteorologicalChart")
            return <MeteorologicalChart key={pathname}/>
        if(component === "DriftChart")
            return <MeteorologicalDriftChart key={pathname}/>
        if(component === "ContinuousWindChart")
            return <ContinuousWindChart key={pathname}/>
        if(component === "SupplementalChart")
            return <SupplementalChart key={pathname}/>
        if(component === "OceanographicChart")
            return <OceanographicChart key={pathname}/>
        if(component === "DartTsunametersChart")
            return <DartChart key={pathname}/>
        if(component === "RainMeasurementsChart")
            return <HourRainChart key={pathname}/>
        if(component === "SpectralWaveSummaryChart")
            return <SpectralWaveSummaryChart key={pathname}/>
        if(component === "SolarRadiationChart")
            return <SolarRadiationChart key={pathname}/>
    }, [pathname]);

    return (
        <Layout ref={layoutRef} model={model} factory={factory} />
    )
}

export default function App() {
    return (
        <ProviderApp>
            <Router>
                <Routes>
                    <Route path="/" element={<AppInner/>} />
                    <Route path="/:sID" element={<AppInner/>} />
                </Routes>
            </Router>
        </ProviderApp>
    )
}
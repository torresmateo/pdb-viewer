import { createSignal, onMount, createEffect, createResource } from 'solid-js'
import '../App.css'
import * as NGL from "ngl";

function TwoSided() {

    async function get_selection_keys() {
        const response = await fetch(`/selection-keys.json`);
        return response.json();
    }

    const [count, setCount] = createSignal(0);
    var stage: NGL.Stage;
    var component_ref: NGL.Component;
    var prediction_pioneer = [];
    var prediction_af3 = [];
    var prediction_pioneer_visible = true;
    var prediction_af3_visible = true;

    function createFile() {
        console.log("save image", count());
        setCount(count() + 1);
        console.log(stage);
        stage.viewer.makeImage({ "factor": 2 })
            .then((blob: Blob) => {
                const fileUrl = window.URL.createObjectURL(blob);
                const anchorElement = document.createElement('a');

                anchorElement.href = fileUrl;
                anchorElement.download = 'image.jpg';
                anchorElement.style.display = 'none';

                document.body.appendChild(anchorElement);

                anchorElement.click();
                anchorElement.remove();

                window.URL.revokeObjectURL(fileUrl);
            });
    }

    function togglePrediction(method: string, full: boolean = false) {
        switch (method) {
            case "pioneer":
                prediction_pioneer_visible = !prediction_pioneer_visible;
                for (const pred of prediction_pioneer) {
                    pred.setVisibility(prediction_pioneer_visible);
                }
                break;
            case "af3":
                prediction_af3_visible = !prediction_af3_visible;
                for (const pred of prediction_af3) {
                    pred.setVisibility(prediction_af3_visible);
                }
                break;
        }
    }

    async function get_interaction_info(interaction_id) {
        const response = await fetch(`/visualization_jsons/${interaction_id}.json`);
        return response.json();
    }


    onMount(async () => {
        var colors = {
            "tp": "#4eed5e",
            //"fp": "#ed4e51",
            "fp": "#4eed5e",
            "fn": "#e0b048",
            "tp2": "#4eed5e",
            "fp2": "#ed4e51",
            "fn2": "#e0b048",
            "target_chain": "#FF8C00",
            "partner_chain": "steelblue"
        }
        const selection_keys = await get_selection_keys();
        console.log("selection_keys", selection_keys);
        var idx = 7;
        var idx = 19;
        var idx = 21;
        //var idx = 23;
        var idx = 24;
        //var idx = 181;
        //var idx = 182;
        //var idx = 448;
        var current_interaction = selection_keys[idx];
        console.log("current_interaction", current_interaction);
        var load_file = `/pdb/${current_interaction.split("_")[2].toLowerCase()}.cif`;
        console.log(load_file);
        const interaction_information = await get_interaction_info(current_interaction);
        console.log("interaction_information", interaction_information);
        var real_color = NGL.ColormakerRegistry.addSelectionScheme([
            // these are the colors for the pioneer1 paper
            //["blue", interaction_information[current_interaction]["target_chain"]],
            //["cornflowerblue", interaction_information[current_interaction]["partner_chain"]],

            // these are colors for the pioneer2 poster
            ["steelblue", `:${interaction_information["target_chain"]}`],
            ["gold", `:${interaction_information["partner_chain"]}`],
            //["#41ab5d", ":z"],
            //["#41ab5d", ":F"],
        ], "real");
        stage = new NGL.Stage("viewport");
        stage.setParameters({
            backgroundColor: "white",
        });
        Promise.all([
            stage.loadFile(load_file)
                .then(function(component) {
                    if (component === undefined) return;
                    // bail out if the component does not contain a structure
                    if (component.type !== "structure") return;
                    // add three representations
                    component.addRepresentation("cartoon", {
                        sele: interaction_information["main_selection"],
                        opacity: 1,
                        surfaceType: "sas",
                        contour: true,
                        colorScheme: real_color,
                        //colorScheme: "chainid",
                        probeRadius: 1.2,
                    });
                    for (const group of ["target", "partner"]) {
                        for (const outcome of ["tp", "fp"]) {
                            if (group in interaction_information["PIONEER2.0"]) {
                                prediction_pioneer.push(component.addRepresentation("spacefill", {
                                    sele: interaction_information["PIONEER2.0"][group][outcome],
                                    color: colors[outcome],
                                }));
                            }
                            if (group in interaction_information["AF3"]) {
                                prediction_af3.push(component.addRepresentation("spacefill", {
                                    sele: interaction_information["AF3"][group][outcome],
                                    color: colors[outcome],
                                }));
                            }
                        }
                    }
                    stage.autoView();
                    component_ref = component;
                    return component;
                })
            // stage.toggleSpin();
        ]).then(function(ol) {
            return;
        });
    });
    return (
        <div>
            {/*
            <br />
            <button onClick={() => toggleTrue()}>PDB</button>
            <button onClick={() => toggleFoldDock()}>FoldDock</button>
            <button onClick={() => toggleAF2C()}>AF2C</button>
            <button onClick={() => toggleAFM()}>AFM</button>
            <br />
            <button onClick={() => toggleFoldDock(true)}>FoldDock FULL</button>
            <button onClick={() => toggleAF2C(true)}>AF2C FULL</button>
            <button onClick={() => toggleAFM(true)}>AFM FULL</button>
            <br />
            */}
            <button onClick={() => createFile()}>Make Image</button>
            <br />
            <button onClick={() => togglePrediction("pioneer")}>Predictions PIONEER</button>
            <button onClick={() => togglePrediction("af3")}>Predictions AF3</button>
            {/*
            <br />
            <button onClick={() => togglePrediction("folddock", true)}>Predictions FoldDock FULL</button>
            <button onClick={() => togglePrediction("af2c", true)}>Predictions AF2C FULL</button>
            <button onClick={() => togglePrediction("alphafold-multimer-new", true)}>Predictions AFM FULL</button>
            */}
            <div>Count: {count()}</div>
            <div id="viewport"></div>
        </div>
    )
}

export default TwoSided

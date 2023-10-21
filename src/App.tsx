import { createSignal, onMount } from 'solid-js'
import solidLogo from './assets/solid.svg'
import viteLogo from '/vite.svg'
import structure from '/structures/1crn.cif?url'
import './App.css'
import * as NGL from "ngl";

function App() {
    const [count, setCount] = createSignal(0)

    onMount( () => {
        console.log("asd");
        var stage = new NGL.Stage("viewport");
        stage.loadFile(structure)
        .then(function (component){
            if( component === undefined ) return;
            console.log("component", component);
            // bail out if the component does not contain a structure
            if( component.type !== "structure" ) return;
            // add three representations
            component.addRepresentation( "surface", {
                opacity: 0.5,
                surfaceType: "ms",
                contour: true,
                //colorScheme: cs_solid_surface
                colorScheme: "chainid"
            });
            // component.addRepresentation( "surface", {
            //     opacity: 0.3,
            //     surfaceType: "sas"
            // });
            component.addRepresentation( "tube", {
                // sele: "not 5",
                aspectRatio: 3.0,
                scale: 1.5,
                colorScheme: "chainid",
            });
            component.addRepresentation( "ball+stick", {
                sele: ":B",
                scale: 0.5,
                //colorScheme: cs_bas
            });
            component.autoView();
        });
    });
    return (
        <>
            <div id="viewport"></div>

            <div>
                <a href="https://vitejs.dev" target="_blank">
                    <img src={viteLogo} class="logo" alt="Vite logo" />
                </a>
                <a href="https://solidjs.com" target="_blank">
                    <img src={solidLogo} class="logo solid" alt="Solid logo" />
                </a>
            </div>
            <h1>Vite + Solid</h1>
            <div class="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count()}
                </button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p class="read-the-docs">
                Click on the Vite and Solid logos to learn more
            </p>
        </>
    )
}

export default App

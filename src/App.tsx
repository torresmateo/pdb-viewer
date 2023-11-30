import { createSignal, onMount } from 'solid-js'
import solidLogo from './assets/solid.svg'
import viteLogo from '/vite.svg'
import structure from '/structures/1ft2.cif?url'
import './App.css'
import * as NGL from "ngl";

function App() {
    const [count, setCount] = createSignal(0)

    onMount( () => {
        var stage = new NGL.Stage("viewport");
        stage.setParameters({
            backgroundColor:"white",
        });
        stage.loadFile(structure)
        .then(function (component){
            if( component === undefined ) return;
            console.log("component", component);
            // bail out if the component does not contain a structure
            if( component.type !== "structure" ) return;
            // add three representations
            component.addRepresentation( "surface", {
                // sele: "polymer",
                // sele: "polymer and :A",
                sele: "polymer and :B",
                opacity: 0.5,
                surfaceType: "sas",
                contour: true,
                //colorScheme: cs_solid_surface
                colorScheme: "chainid",
                // color: "green", 
                probeRadius: 1.2,
            });
            // component.addRepresentation( "surface", {
            //     sele: ":A and (80 or 81 or 82 or 83 or 85 or 86 or 87 or 88 or 89 or 90 or 91 or 92 or 93 or 96 or 107 or 112 or 127 or 129 or 131 or 132 or 135 or 143 or 164 or 166 or 170 or 173 or 198 or 200 or 203 or 204 or 207 or 230 or 232 or 234 or 235 or 237 or 238 or 241 or 270 or 271 or 272 or 273 or 274 or 275 or 278 or 279 or 285 or 309 or 310 or 317 or 320 or 349 or 350 or 351 or 352 or 353 or 354 or 355 or 358 or 361 or 362 or 365)",
            //     opacity: 1.0,
            //     // surfaceType: "sas",
            //     colorScheme: "chainid",
            // });
            // component.addRepresentation( "surface", {
            //     sele: ":A and (147 or 149 or 152 or 153 or 179 or 181 or or 182 or 183 or 184 or 186 or 187 or 215 or 217 or 218 or 220 or 221 or 222 or 224 or 225 or 228 or 258 or 262)",
            //     opacity: 1,
            //     surfaceType: "sas",
            //     probeRadius: 1.2,
            //     colorScheme: "chainid",
            //     color:"teal",
            // });
            // component.addRepresentation( "surface", {
            //     sele: "polymer and :B and (1 or 24 or 33 or 36 or 37 or 38 or 40 or 41 or 42 or 43 or 44 or 45 or 85 or 86 or 87 or 88 or 89 or 90 or 91 or 93 or 94 or 95 or 97 or 98 or 100 or 103 or 104 or 107 or 125 or 129 or 132 or 141 or 142 or 144 or 146 or 147 or 148 or 149 or 152 or 195 or 196 or 197 or 198 or 202 or 234 or 235 or 236 or 240 or 241 or 242 or 244 or 245 or 246 or 251 or 271 or 274 or 275 or 278 or 279 or 280 or 281 or 283 or 291 or 292 or 293 or 294 or 315 or 320 or 321 or 322 or 323 or 324 or 327 or 328 or 329 or 330 or 331 or 334)",
            //     opacity: 1.0,
            //     surfaceType: "sas",
            //     colorScheme: "chainid",
            // });
            component.addRepresentation( "surface", {
                sele: ":B and (166 or 215 or or 217 or 219 or 261 or 263 or 316 or 379 or 380 or 396 or 398 or 405 or 407 or 408 or 409 or 410 or 413 or 416 or 417 or 418 or 419 or 420)",
                opacity: 1,
                surfaceType: "sas",
                probeRadius: 1.2,
                colorScheme: "chainid",
                color:"slateblue",
            });
            // component.addRepresentation( "cartoon", {
            //     // sele: "not 5",
            //     // sele: ":A,:B",
            //     //aspectRatio: 3.0,
            //     //scale: 0.5,
            //     colorScheme: "chainid",
            // });
            // component.addRepresentation( "ball+stick", {
            //     // sele: "polymer",
            //     // sele: "polymer and :A",
            //     sele: "polymer and :B",
            //     //scale: 0.5,
            //     //colorScheme: cs_bas
            //     colorScheme: "chainid",
            // });
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

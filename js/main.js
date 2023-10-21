var cs_bas = NGL.ColormakerRegistry.addSelectionScheme([
    ["red", "5"],
    ["white", "*"]
], "ball+stick");

var cs_toon = NGL.ColormakerRegistry.addSelectionScheme([
    ["white", "5"],
    ["steelblue", "*"]
], "cartoon");

var cs_solid_surface = NGL.ColormakerRegistry.addSelectionScheme([
    // ["white", "5"],
    ["lime", "*"]
], "solid surface");

document.addEventListener("DOMContentLoaded", function () {
    var stage = new NGL.Stage("viewport");
    stage.loadFile("structures/1ft2.cif")
    .then(function (component){
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

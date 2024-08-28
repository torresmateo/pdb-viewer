import { createSignal, onMount, createEffect } from 'solid-js'
// import solidLogo from './assets/solid.svg'
// import viteLogo from '/vite.svg'
//import structure from '/structures/aligned/P26462_P54702_ref_aligned.pdb?url'
//import structure from '/structures/aligned-full/P26462_P54702_ref_aligned_all.pdb?url'
//import structure from '/structures/aligned/P29084_Q15542_ref_aligned.pdb?url'
import structure from '/structures/aligned-full/P29084_Q15542_ref_aligned_all.pdb?url'
//import structureAF from '/structures/P26462_P54702_AlphaFold-Multimer.pdb?url'
//import structureAF from '/structures/out.pdb?url'
//import structureAF from '/structures/aligned/P26462_P54702_afm_aligned.pdb?url'
//import structureAF from '/structures/aligned-full/P26462_P54702_afm_aligned_all.pdb?url'
//import structureAF from '/structures/aligned/P29084_Q15542_afm_aligned.pdb?url'
import structureAF from '/structures/aligned-full/P29084_Q15542_afm_aligned_all.pdb?url'
//import structureFoldDock from '/structures/P26462-P54702_FoldDock.pdb?url'
//import structureFoldDock from '/structures/aligned/P26462_P54702_folddock_aligned.pdb?url'
//import structureFoldDock from '/structures/aligned-full/P26462_P54702_folddock_aligned_all.pdb?url'
//import structureFoldDock from '/structures/aligned/P29084_Q15542_folddock_aligned.pdb?url'
import structureFoldDock from '/structures/aligned-full/P29084_Q15542_folddock_aligned_all.pdb?url'
//import structureAF2C from '/structures/P26462_P54702_AF2Complex.pdb?url'
//import structureAF2C from '/structures/aligned/P26462_P54702_af2c_aligned.pdb?url'
//import structureAF2C from '/structures/aligned-full/P26462_P54702_af2c_aligned_all.pdb?url'
//import structureAF2C from '/structures/aligned/P29084_Q15542_af2c_aligned.pdb?url'
import structureAF2C from '/structures/aligned-full/P29084_Q15542_af2c_aligned_all.pdb?url'
import './App.css'
import * as NGL from "ngl";

function App() {
    const [count, setCount] = createSignal(0);

    var stage: NGL.Stage;
    var component_ref: NGL.Component;
    var component_af2c: NGL.Component;
    var component_afm: NGL.Component;
    var component_folddock: NGL.Component;
    var component_af2c_full: NGL.Component;
    var component_afm_full: NGL.Component;
    var component_folddock_full: NGL.Component;
    var prediction_pioneer = [];
    var prediction_af2c = [];
    var prediction_afm = [];
    var prediction_folddock = [];
    var prediction_af2c_struct = [];
    var prediction_afm_struct = [];
    var prediction_folddock_struct = [];
    var prediction_pioneer_visible = true;
    var prediction_af2c_visible = true;
    var prediction_afm_visible = true;
    var prediction_folddock_visible = true;
    var prediction_af2c_struct_visible = true;
    var prediction_afm_struct_visible = true;
    var prediction_folddock_struct_visible = true;
    document.orientation = "test";

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

    function toggleTrue() {
        component_ref.setVisibility(!component_ref.visible);
    }
    function toggleFoldDock(full: boolean = false) {
        if (full) {
            component_folddock_full.setVisibility(!component_folddock_full.visible);
        } else {
            component_folddock.setVisibility(!component_folddock.visible);
        }
    }
    function toggleAF2C(full: boolean = false) {
        if (full) {
            component_af2c_full.setVisibility(!component_af2c_full.visible);
        } else {
            component_af2c.setVisibility(!component_af2c.visible);
        }
    }
    function toggleAFM(full: boolean = false) {
        if (full) {
            component_afm_full.setVisibility(!component_afm_full.visible);
        } else {
            component_afm.setVisibility(!component_afm.visible);
        }
    }

    function togglePrediction(method: string, full: boolean = false) {
        switch (method) {
            case "pioneer":
                prediction_pioneer_visible = !prediction_pioneer_visible;
                for (const pred of prediction_pioneer) {
                    pred.setVisibility(prediction_pioneer_visible);
                }
                break;
            case "af2c":
                if (full) {
                    prediction_af2c_struct_visible = !prediction_af2c_struct_visible;
                    for (const pred of prediction_af2c_struct) {
                        pred.setVisibility(prediction_af2c_struct_visible);
                    }
                } else {
                    prediction_af2c_visible = !prediction_af2c_visible;
                    for (const pred of prediction_af2c) {
                        pred.setVisibility(prediction_af2c_visible);
                    }
                }
                break;
            case "alphafold-multimer-new":
                if (full) {
                    prediction_afm_struct_visible = !prediction_afm_struct_visible;
                    for (const pred of prediction_afm_struct) {
                        pred.setVisibility(prediction_afm_struct_visible);
                    }
                } else {
                    prediction_afm_visible = !prediction_afm_visible;
                    for (const pred of prediction_afm) {
                        pred.setVisibility(prediction_afm_visible);
                    }
                }
                break;
            case "folddock":
                if (full) {
                    prediction_folddock_struct_visible = !prediction_folddock_struct_visible;
                    for (const pred of prediction_folddock_struct) {
                        pred.setVisibility(prediction_folddock_struct_visible);
                    }
                } else {
                    prediction_folddock_visible = !prediction_folddock_visible;
                    for (const pred of prediction_folddock) {
                        pred.setVisibility(prediction_folddock_visible);
                    }
                }
                break;
        }
    }


    onMount(() => {

        var colors = {
            "tp1": "#4eed5e",
            "fp1": "#ed4e51",
            "fn1": "#e0b048",
            "tp2": "#4eed5e",
            "fp2": "#ed4e51",
            "fn2": "#e0b048",
            "target_chain": "#FF8C00",
            "partner_chain": "steelblue"
        }

        var current_interaction = "P26462_P54702";
        var current_interaction = "P29084_Q15542";
        var current_method = "af2c";
        var current_method = "pioneer";
        var current_method = "folddock";
        var current_method = "alphafold-multimer-new";
        var interaction_information = {
            "P29084_Q15542": {
                "pioneer": {
                    "tp1": ":V and ( 105 or 107 or 109 or 114 ) and .CA",
                    "fp1": ":V and ( 83 or 110 or 117 or 118 ) and .CA",
                    "fn1": ":V and ( 84 or 91 or 104 or 106 ) and .CA",
                    "fn2": ":E and ( 517 or 518 or 519 or 520 or 521 or 522 or 523 or 525 or 526 ) and .CA",
                },
                "folddock": {
                    "fn1": ":V and ( 84 or 91 or 104 or 105 or 106 or 107 or 109 or 114 ) and .CA",
                    "fp1_full": ":A and (17) and .CA",
                    "fp2": ":E and ( 617 or 618 ) and .CA",
                    "fp2_full": ":B and ( 1108 or 1109 ) and .CA",
                    "fn2": ":E and ( 517 or 518 or 519 or 520 or 521 or 522 or 523 or 525 or 526 ) and .CA",
                    "ol_index": 1,
                    "prediction_selection_b": "polymer and :B and not (492 or 493 or 494 or 495 or 496 or 497 or 498 or 499 or 500 or 501 or 502 or 503 or 504 or 505 or 506 or 507 or 508 or 509 or 510 or 511 or 512 or 513 or 514 or 515 or 516 or 517 or 518 or 519 or 520 or 521 or 522 or 523 or 524 or 525 or 526 or 527 or 528 or 529 or 530 or 531 or 532 or 533 or 534 or 535 or 536 or 537 or 538 or 539 or 540 or 541 or 542 or 543 or 544 or 545 or 546 or 547 or 548 or 549 or 550 or 551 or 552 or 553 or 554 or 555 or 556 or 557 or 558 or 559 or 560 or 561 or 562 or 563 or 564 or 565 or 566 or 567 or 568 or 569 or 570 or 571 or 572 or 573 or 574 or 575 or 576 or 577 or 578 or 579 or 580 or 581 or 582 or 583 or 584 or 585 or 586 or 587 or 588 or 589 or 590 or 591 or 592 or 593 or 594 or 595 or 596 or 597 or 598 or 599 or 600 or 601 or 602 or 603 or 604 or 605 or 606 or 607 or 608 or 609 or 610 or 611 or 612 or 613 or 614 or 615 or 616 or 617 or 618 or 619 or 620 or 621 or 622 or 623 or 624 or 625 or 626 or 627 or 628 or 629 or 630 or 631 or 632 or 633 or 634 or 635 or 636 or 637 or 638 or 639 or 640 or 641 or 642 or 643 or 644 or 645 or 646 or 647 or 648 or 649 or 650 or 651 or 652 or 653 or 654 or 655 or 656 or 657 or 658 or 659 or 660 or 661 or 662 or 663 or 664 or 665 or 666 or 667 or 668 or 669 or 670 or 671 or 672 or 673 or 674 or 675 or 676 or 677 or 678 or 679 or 680 or 681 or 682 or 683 or 684 or 685 or 686 or 687 or 688 or 689 or 690 or 691 or 692 or 693 or 694 or 695 or 696 or 697 or 698 or 699 or 1239 or 1240 or 1241 or 1242 or 1243 or 1244 or 1290 or 1291 or 870 or 871 or 872 or 873 or 874 or 875 or 876 or 877 or 878 or 879 or 880 or 881 or 882 or 883 or 884 or 885 or 886 or 887 or 888 or 889 or 890 or 891 or 892 or 893 or 894 or 895 or 896 or 897 or 898 or 899 or 900 or 901 or 902 or 903 or 904 or 905 or 906 or 907)",
                },
                "af2c": {
                    "fp1": ":V and ( 94 or 144 or 146 or 150 or 153 or 157 or 160 or 161 or 162 ) and .CA",
                    "fp1_full": ":A and ( 1 or 5 or 8 or 15 or 94 or 144 or 146 or 150 or 153 or 157 or 160 or 161 or 162 or 245 or 246 or 247 or 248 or 274 or 275 ) and .CA",
                    "fn1": ":V and ( 84 or 91 or 104 or 105 or 106 or 107 or 109 or 114 ) and .CA",
                    "tp2": ":E and ( 518 ) and .CA",
                    "tp2_full": ":B and ( 518 ) and .CA",
                    "fp2": ":E and ( 431 or 433 or 568 or 577 or 578 or 579 or 580 or 585 or 621 or 657 or 658 or 660 ) and .CA",
                    "fp2_full": ":B and (187 or 189 or 190 or 192 or 193 or 194 or 195 or 431 or 433 or 568 or 577 or 578 or 579 or 580 or 585 or 621 or 657 or 658 or 660 ) and .CA",
                    "fn2": ":E and ( 517 or 519 or 520 or 521 or 522 or 523 or 525 or 526 ) and .CA",
                    "ol_index": 2,
                },
                "alphafold-multimer-new": {
                    "fn1": ":V and ( 84 or 91 or 104 or 105 or 106 or 107 or 109 or 114 ) and .CA",
                    "fp1_full": ":A and ( 1 or 5 or 8 or 9 or 12 or 13 or 15 or 16 or 19 or 21 or 248) and .CA",
                    "fp2": ":E and ( 428 or 431 or 501 or 598 or 615 or 616 or 619 or 620 or 621 or 622 or 657 or 658 ) and .CA",
                    "fp2_full": ":B and ( 428 or 431 or 501 or 598 or 615 or 616 or 619 or 620 or 621 or 622 or 657 or 658 ) and .CA",
                    "fn2": ":E and ( 517 or 518 or 519 or 520 or 521 or 522 or 523 or 525 or 526 ) and .CA",
                    "ol_index": 0
                },
                "load_models": ["pioneer", "af2c", "alphafold-multimer-new", "folddock"],
                "prediction_selection_a": "polymer and :A and not (1 or 2 or 3 or 4 or 5 or 6 or 7 or 8 or 9 or 10 or 11 or 12 or 13 or 14 or 15 or 16 or 17 or 18 or 19 or 20 or 21 or 22 or 23 or 24 or 25 or 26 or 27 or 28 or 29 or 30 or 31 or 32 or 33 or 34 or 35 or 36 or 37 or 38 or 39 or 40 or 41 or 42 or 43 or 44 or 45 or 46 or 47 or 48 or 49 or 50 or 51 or 52 or 53 or 54 or 55 or 56 or 57 or 58 or 59 or 60 or 61 or 62 or 63 or 64 or 65 or 66 or 67 or 240 or 241 or 242 or 243 or 244 or 245 or 246 or 247 or 248 or 249 or 250 or 251 or 252 or 253 or 254 or 255 or 256 or 257 or 258 or 259 or 260 or 261 or 262 or 263 or 264 or 265 or 266 or 267 or 268 or 269 or 270 or 271 or 272 or 273 or 274 or 275 or 276 or 277 or 278 or 279 or 280 or 281 or 282 or 283 or 284 or 285 or 286 or 287 or 288 or 289 or 290 or 291)",
                "prediction_selection_a_full": "polymer and :A",
                "prediction_selection_b": "polymer and :B and not (1 or 2 or 3 or 4 or 5 or 6 or 7 or 8 or 9 or 10 or 11 or 12 or 13 or 14 or 15 or 16 or 17 or 18 or 19 or 20 or 21 or 22 or 23 or 24 or 25 or 26 or 27 or 28 or 29 or 30 or 31 or 32 or 33 or 34 or 35 or 36 or 37 or 38 or 39 or 40 or 41 or 42 or 43 or 44 or 45 or 46 or 47 or 48 or 49 or 50 or 51 or 52 or 53 or 54 or 55 or 56 or 57 or 58 or 59 or 60 or 61 or 62 or 63 or 64 or 65 or 66 or 67 or 68 or 69 or 70 or 71 or 72 or 73 or 74 or 75 or 76 or 77 or 78 or 79 or 80 or 81 or 82 or 83 or 84 or 85 or 86 or 87 or 88 or 89 or 90 or 91 or 92 or 93 or 94 or 95 or 96 or 97 or 98 or 99 or 100 or 101 or 102 or 103 or 104 or 105 or 106 or 107 or 108 or 109 or 110 or 111 or 112 or 113 or 114 or 115 or 116 or 117 or 118 or 119 or 120 or 121 or 122 or 123 or 124 or 125 or 126 or 127 or 128 or 129 or 130 or 131 or 132 or 133 or 134 or 135 or 136 or 137 or 138 or 139 or 140 or 141 or 142 or 143 or 144 or 145 or 146 or 147 or 148 or 149 or 150 or 151 or 152 or 153 or 154 or 155 or 156 or 157 or 158 or 159 or 160 or 161 or 162 or 163 or 164 or 165 or 166 or 167 or 168 or 169 or 170 or 171 or 172 or 173 or 174 or 175 or 176 or 177 or 178 or 179 or 180 or 181 or 182 or 183 or 184 or 185 or 186 or 187 or 188 or 189 or 190 or 191 or 192 or 193 or 194 or 195 or 196 or 197 or 198 or 199 or 200 or 201 or 202 or 203 or 204 or 205 or 206 or 207 or 208 or 748 or 749 or 750 or 751 or 752 or 753 or 799 or 800 or 379 or 380 or 381 or 382 or 383 or 384 or 385 or 386 or 387 or 388 or 389 or 390 or 391 or 392 or 393 or 394 or 395 or 396 or 397 or 398 or 399 or 400 or 401 or 402 or 403 or 404 or 405 or 406 or 407 or 408 or 409 or 410 or 411 or 412 or 413 or 414 or 415 or 416)",
                "prediction_selection_b_full": "polymer and :B",
                "true_selection": "polymer and :V or :E",
                "target_chain": ":E",
                "partner_chain": ":V",
            },
            "P26462_P54702": {
                "pioneer": {
                    "tp1": ":z and ( 35 or 37 or 38 or 41 or 44 or 45 or 48 or 68 or 74 or 75 or 77 or 78 or 80 or 81 or 82 or 84 or 85 or 88 or 89 or 92 or 93 or 96 or 97 or 98 or 99 or 100 or 101 or 102 or 103 or 104 ) and .CA",
                    "fp1": ":z and ( 36 or 39 or 40 or 42 or 43 or 46 or 47 or 53 or 61 or 69 or 70 or 72 or 73 or 76 or 79 or 83 or 86 or 87 or 90 or 91 or 94 or 95 ) and .CA",
                    "fn1": ":z and ( 66 or 71 ) and .CA",
                    "fn2": ":F and ( 3 or 4 or 5 or 6 or 7 or 8 or 9 or 10 or 13 or 16 or 17 or 20 or 21 or 24 or 28 or 31 or 36 or 37 or 39 or 40 or 41 or 44 or 48 or 65 or 66 or 67 or 70 or 71 or 74 or 75 or 78 or 82 or 86 ) and .CA",
                },
                "folddock": {
                    "fp1": ":z and ( 87 or 91 ) and .CA",
                    "fn1": ":z and ( 35 or 37 or 38 or 41 or 44 or 45 or 48 or 66 or 68 or 71 or 74 or 75 or 77 or 78 or 80 or 81 or 82 or 84 or 85 or 88 or 89 or 92 or 93 or 96 or 97 or 98 or 99 or 100 or 101 or 102 or 103 or 104 ) and .CA",
                    "fp2": ":F and ( 116 or 117 or 119 ) and .CA",
                    "fn2": ":F and ( 3 or 4 or 5 or 6 or 7 or 8 or 9 or 10 or 13 or 16 or 17 or 20 or 21 or 24 or 28 or 31 or 36 or 37 or 39 or 40 or 41 or 44 or 48 or 65 or 66 or 67 or 70 or 71 or 74 or 75 or 78 or 82 or 86 ) and .CA",
                    "ol_index": 1,
                },
                "af2c": {
                    "fp1": ":z and ( 72 or 83 or 90 or 91 ) and .CA",
                    "fn1": ":z and ( 35 or 37 or 38 or 41 or 44 or 45 or 48 or 66 or 68 or 71 or 74 or 75 or 77 or 78 or 80 or 81 or 82 or 84 or 85 or 88 or 89 or 92 or 93 or 96 or 97 or 98 or 99 or 100 or 101 or 102 or 103 or 104 ) and .CA",
                    "fp2": ":F and ( 104 or 109 or 120 or 121 or 195 or 199 ) and .CA",
                    "fn2": ":F and ( 3 or 4 or 5 or 6 or 7 or 8 or 9 or 10 or 13 or 16 or 17 or 20 or 21 or 24 or 28 or 31 or 36 or 37 or 39 or 40 or 41 or 44 or 48 or 65 or 66 or 67 or 70 or 71 or 74 or 75 or 78 or 82 or 86 ) and .CA",
                    "ol_index": 2,
                },
                "alphafold-multimer-new": {
                    "tp1": ":z and ( 68 or 75 or 82 or 93 or 97 ) and .CA",
                    "fp1": ":z and ( 56 or 59 or 60 or 72 or 79 or 83 or 86 or 87 or 90 or 94 ) and .CA",
                    "fn1": ":z and ( 35 or 37 or 38 or 41 or 44 or 45 or 48 or 66 or 71 or 74 or 77 or 78 or 80 or 81 or 84 or 85 or 88 or 89 or 92 or 96 or 98 or 99 or 100 or 101 or 102 or 103 or 104 ) and .CA",
                    "fp2": ":F and ( 104 or 109 or 110 or 112 or 114 or 119 or 121 or 205 or 209 or 210 or 212 or 214 or 215 ) and .CA",
                    "fn2": ":F and ( 3 or 4 or 5 or 6 or 7 or 8 or 9 or 10 or 13 or 16 or 17 or 20 or 21 or 24 or 28 or 31 or 36 or 37 or 39 or 40 or 41 or 44 or 48 or 65 or 66 or 67 or 70 or 71 or 74 or 75 or 78 or 82 or 86 ) and .CA",
                    "ol_index": 0
                },
                "load_models": ["pioneer", "af2c", "alphafold-multimer-new", "folddock"],
                "prediction_selection_a": "polymer and :A and not (1 or 2 or 3 or 4 or 5 or 6 or 7 or 8 or 9 or 10 or 11 or 12 or 13 or 14 or 15 or 16 or 17 or 18 or 19 or 20 or 21 or 22 or 23 or 24 or 25 or 26 or 27 or 28 or 29 or 30 or 31 or 32 or 33 or 34)",
                "prediction_selection_a_full": "polymer and :A",
                "prediction_selection_b": "polymer and :B and not (264 or 1 or 2 or 263)",
                "prediction_selection_b_full": "polymer and :B",
                "true_selection": "polymer and :z or :F",
                "target_chain": ":F",
                "partner_chain": ":z",
            }
        };

        var real_color = NGL.ColormakerRegistry.addSelectionScheme([
            // these are the colors for the pioneer1 paper
            //["blue", interaction_information[current_interaction]["target_chain"]],
            //["cornflowerblue", interaction_information[current_interaction]["partner_chain"]],

            // these are colors for the pioneer2 poster
            ["blue", interaction_information[current_interaction]["target_chain"]],
            ["crimson", interaction_information[current_interaction]["partner_chain"]],
            //["#41ab5d", ":z"],
            //["#41ab5d", ":F"],
        ], "real");

        var prediction_color = NGL.ColormakerRegistry.addSelectionScheme([
            ["gold", ":A"],
            ["orange", ":B"],
            //["#4292c6", ":A"],
            //["#4292c6", ":B"],
        ], "AF");
        stage = new NGL.Stage("viewport");
        stage.setParameters({
            backgroundColor: "white",
        });
        //stage.spinAnimation = stage.animationControls.spin([0, 1, 0], 0.03);
        let arrow = new NGL.Shape("arrow", { disableImpostor: true });
        arrow.addArrow([35, 30, 50],
            [45, 50, 50],
            [0.2, 0.5, 1],
            4.0, "asd");

        // let shapeComp = stage.addComponentFromObject(arrow);
        // if (shapeComp !== undefined){
        //     shapeComp.addRepresentation("buffer", { wireframe: true });
        //     shapeComp.autoView();
        // }

        Promise.all([
            stage.loadFile(structureAF)
                .then(function(component) {
                    //if( current_method != "alphafold-multimer-new" ) return;
                    if (component === undefined) return;
                    component.addRepresentation("cartoon", {
                        sele: interaction_information[current_interaction]["prediction_selection_a"],
                        opacity: 1,
                        surfaceType: "sas",
                        contour: true,
                        colorScheme: prediction_color,
                        probeRadius: 1.2,
                    });
                    component.addRepresentation("cartoon", {
                        sele: interaction_information[current_interaction]["prediction_selection_b"],
                        opacity: 1,
                        surfaceType: "sas",
                        contour: true,
                        colorScheme: prediction_color,
                        //colorScheme: "chainid",
                        //color: "green", 
                        probeRadius: 1.2,
                    });
                    component_afm = component;
                    return component;
                }),
            stage.loadFile(structureAF)
                .then(function(component) {
                    //if( current_method != "alphafold-multimer-new" ) return;
                    if (component === undefined) return;
                    component.addRepresentation("cartoon", {
                        sele: interaction_information[current_interaction]["prediction_selection_a_full"],
                        opacity: 1,
                        surfaceType: "sas",
                        contour: true,
                        colorScheme: prediction_color,
                        probeRadius: 1.2,
                    });
                    component.addRepresentation("cartoon", {
                        sele: interaction_information[current_interaction]["prediction_selection_b"],
                        opacity: 1,
                        surfaceType: "sas",
                        contour: true,
                        colorScheme: prediction_color,
                        //colorScheme: "chainid",
                        //color: "green", 
                        probeRadius: 1.2,
                    });
                    for (const group of ["tp1_full", "fp1_full", "tp2_full", "fp2_full"]) {
                        if (group in interaction_information[current_interaction]["alphafold-multimer-new"]) {
                            prediction_afm_struct.push(component.addRepresentation("spacefill", {
                                sele: interaction_information[current_interaction]["alphafold-multimer-new"][group],
                                color: colors["fp1"],
                            }));
                        }
                    }
                    component_afm_full = component;
                    return component;
                }),
            stage.loadFile(structureFoldDock)
                .then(function(component) {
                    //if( current_method != "folddock" ) return;
                    if (component === undefined) return;
                    component.addRepresentation("cartoon", {
                        sele: interaction_information[current_interaction]["prediction_selection_a"],
                        opacity: 1,
                        surfaceType: "sas",
                        contour: true,
                        colorScheme: prediction_color,
                        probeRadius: 1.2,
                    });
                    component.addRepresentation("cartoon", {
                        sele: interaction_information[current_interaction]["folddock"]["prediction_selection_b"],
                        opacity: 1,
                        surfaceType: "sas",
                        contour: true,
                        colorScheme: prediction_color,
                        //colorScheme: "chainid",
                        //color: "green", 
                        probeRadius: 1.2,
                    });
                    component_folddock = component;
                    return component;
                }),
            stage.loadFile(structureFoldDock)
                .then(function(component) {
                    //if( current_method != "folddock" ) return;
                    if (component === undefined) return;
                    component.addRepresentation("cartoon", {
                        sele: interaction_information[current_interaction]["prediction_selection_a_full"],
                        opacity: 1,
                        surfaceType: "sas",
                        contour: true,
                        colorScheme: prediction_color,
                        probeRadius: 1.2,
                    });
                    component.addRepresentation("cartoon", {
                        //sele: interaction_information[current_interaction]["prediction_selection_b"],
                        sele: interaction_information[current_interaction]["folddock"]["prediction_selection_b"],
                        opacity: 1,
                        surfaceType: "sas",
                        contour: true,
                        colorScheme: prediction_color,
                        //colorScheme: "chainid",
                        //color: "green", 
                        probeRadius: 1.2,
                    });
                    for (const group of ["tp1_full", "fp1_full", "tp2_full", "fp2_full"]) {
                        if (group in interaction_information[current_interaction]["folddock"]) {
                            prediction_folddock_struct.push(component.addRepresentation("spacefill", {
                                sele: interaction_information[current_interaction]["folddock"][group],
                                color: colors["fp1"],
                            }));
                        }
                    }
                    component_folddock_full = component;
                    return component;
                }),
            stage.loadFile(structureAF2C)
                .then(function(component) {
                    console.log("adding representations for", current_method);
                    //if( current_method != "af2c" ) return;
                    if (component === undefined) return;
                    console.log("adding representations for", current_method);
                    component.addRepresentation("cartoon", {
                        sele: interaction_information[current_interaction]["prediction_selection_a"],
                        opacity: 1,
                        surfaceType: "sas",
                        contour: true,
                        colorScheme: prediction_color,
                        probeRadius: 1.2,
                    });
                    component.addRepresentation("cartoon", {
                        sele: interaction_information[current_interaction]["prediction_selection_b"],
                        opacity: 1,
                        surfaceType: "sas",
                        contour: true,
                        colorScheme: prediction_color,
                        //colorScheme: "chainid",
                        //color: "green", 
                        probeRadius: 1.2,
                    });
                    component_af2c = component;
                    return component;
                }),
            stage.loadFile(structureAF2C)
                .then(function(component) {
                    console.log("adding representations for", current_method);
                    //if( current_method != "af2c" ) return;
                    if (component === undefined) return;
                    console.log("adding representations for", current_method);
                    component.addRepresentation("cartoon", {
                        sele: interaction_information[current_interaction]["prediction_selection_a_full"],
                        opacity: 1,
                        surfaceType: "sas",
                        contour: true,
                        colorScheme: prediction_color,
                        probeRadius: 1.2,
                    });
                    component.addRepresentation("cartoon", {
                        sele: interaction_information[current_interaction]["prediction_selection_b"],
                        opacity: 1,
                        surfaceType: "sas",
                        contour: true,
                        colorScheme: prediction_color,
                        //colorScheme: "chainid",
                        //color: "green", 
                        probeRadius: 1.2,
                    });
                    for (const group of ["tp1_full", "fp1_full", "tp2_full", "fp2_full"]) {
                        if (group in interaction_information[current_interaction]["af2c"]) {
                            prediction_af2c_struct.push(component.addRepresentation("spacefill", {
                                sele: interaction_information[current_interaction]["af2c"][group],
                                color: colors["fp1"],
                            }));
                        }
                    }
                    component_af2c_full = component;
                    return component;
                }),
            stage.loadFile(structure)
                .then(function(component) {
                    if (component === undefined) return;
                    console.log("component", component);
                    // bail out if the component does not contain a structure
                    if (component.type !== "structure") return;
                    // add three representations
                    component.addRepresentation("cartoon", {
                        sele: interaction_information[current_interaction]["true_selection"],
                        opacity: 1,
                        surfaceType: "sas",
                        contour: true,
                        colorScheme: real_color,
                        //colorScheme: "chainid",
                        probeRadius: 1.2,
                    });
                    for (const group of ["tp1", "fp1", "fn1", "tp2", "fp2", "fn2"]) {
                        //for (const group of ["tp1", "fp1", "tp2", "fp2"]) {
                        if (group in interaction_information[current_interaction]["pioneer"]) {
                            prediction_pioneer.push(component.addRepresentation("spacefill", {
                                sele: interaction_information[current_interaction]["pioneer"][group],
                                //color: colors[group],
                                color: colors["tp1"],
                            }));
                        }
                        if (group in interaction_information[current_interaction]["folddock"]) {
                            prediction_folddock.push(component.addRepresentation("spacefill", {
                                sele: interaction_information[current_interaction]["folddock"][group],
                                //color: colors[group],
                                color: colors["fp1"],
                            }));
                        }
                        if (group in interaction_information[current_interaction]["alphafold-multimer-new"]) {
                            prediction_afm.push(component.addRepresentation("spacefill", {
                                sele: interaction_information[current_interaction]["alphafold-multimer-new"][group],
                                //color: colors[group],
                                color: colors["fp1"],
                            }));
                        }
                        if (group in interaction_information[current_interaction]["af2c"]) {
                            prediction_af2c.push(component.addRepresentation("spacefill", {
                                sele: interaction_information[current_interaction]["af2c"][group],
                                //color: colors[group],
                                color: colors["fp1"],
                            }));
                        }
                    }
                    stage.autoView();
                    component_ref = component;
                    return component;
                })
            // stage.toggleSpin();
        ]).then(function(ol) {
            return;
            console.log(ol);
            let curr_index = interaction_information[current_interaction][current_method]["ol_index"];
            if (current_method == "pioneer") return;
            if (ol[0] === undefined) return;
            if (ol[1] === undefined) return;
            if (ol[2] === undefined) return;
            if (ol[3] === undefined) return;
            console.log("superimpose");
            ol[3].superpose(
                ol[0],
                true,
                ":F",
                ":B"
            );
            ol[3].superpose(
                ol[1],
                true,
                ":F",
                ":B"
            );
            ol[3].superpose(
                ol[2],
                true,
                ":F",
                ":B"
            );
            ol[3].autoView();
        });

        /*
        var topPosition = 12;

        function getTopPosition (increment) {
            if (increment) topPosition += increment;
            return topPosition + "px";
        }

        function addElement (el) {
            Object.assign(el.style, {
                position: "absolute",
                zIndex: 10
            })
            stage.viewer.container.appendChild(el)
        }

        function createElement (name, properties, style) {
            var el = document.createElement(name);
            Object.assign(el, properties);
            Object.assign(el.style, style);
            return el;
        }

        var fullButton = createElement("input", {
            value: "save image",
            type: "button",
            onclick: createFile,
        }, { top: getTopPosition(30), left: "12px" })
        //addElement(fullButton);
        */
    });
    return (
        <div>
            <button onClick={() => createFile()}>Make Image</button>
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
            <button onClick={() => togglePrediction("pioneer")}>Predictions PIONEER</button>
            <button onClick={() => togglePrediction("folddock")}>Predictions FoldDock</button>
            <button onClick={() => togglePrediction("af2c")}>Predictions AF2C</button>
            <button onClick={() => togglePrediction("alphafold-multimer-new")}>Predictions AFM</button>
            <br />
            <button onClick={() => togglePrediction("folddock", true)}>Predictions FoldDock FULL</button>
            <button onClick={() => togglePrediction("af2c", true)}>Predictions AF2C FULL</button>
            <button onClick={() => togglePrediction("alphafold-multimer-new", true)}>Predictions AFM FULL</button>
            <div>Count: {count()}</div>
            <div id="viewport"></div>
        </div>
    )
}

export default App

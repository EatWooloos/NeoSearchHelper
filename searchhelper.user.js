// ==UserScript==
// @name       Neopets - Search Helper
// @version    1.0.7
// @match      http://www.neopets.com/halloween/witchtower*.phtml
// @match      http://www.neopets.com/island/kitchen*.phtml
// @match      http://www.neopets.com/medieval/earthfaerie.phtml*
// @match      http://www.neopets.com/faerieland/darkfaerie.phtml*
// @match      http://www.neopets.com/safetydeposit.phtml*
// @match      http://www.neopets.com/market_your.phtml*
// @match      http://www.neopets.com/market.phtml*
// @match      http://www.neopets.com/space/coincidence.phtml
// @match      http://www.neopets.com/island/*training.phtml?*type=status*
// @match      http://www.neopets.com/pirates/academy.phtml?type=status
// @match      http://www.neopets.com/inventory.phtml*
// @match      http://www.neopets.com/halloween/esophagor*.phtml
// @match      http://www.neopets.com/faerieland/employ/employment.phtml*
// @match      http://www.neopets.com/closet.phtml*
// @match      http://www.neopets.com/auctions.phtml*
// @match      http://www.neopets.com/genie.phtml*
// @match      http://www.neopets.com/winter/snowfaerie*.phtml
// @match      http://www.neopets.com/quests.phtml
// @match      http://www.neopets.com/games/kadoatery/index.phtml
// @match      http://www.neopets.com/games/kadoatery/*
// @match      http://www.neopets.com/process_cash_object.phtml
// @match      http://www.neopets.com/hospital.phtml
// @match      http://www.neopets.com/objects.phtml?*type=shop*
// @match      http://www.neopets.com/winter/igloo2.phtml
// @match      http://www.neopets.com/island/tradingpost.phtml*
// @match      http://www.neopets.com/generalstore.phtml*
// @match      http://www.neopets.com/faerieland/hiddentower938.phtml
// @match      http://www.neopets.com/dome/neopets.phtml*
// @match      http://www.neopets.com/gallery/index.phtml*
// @match      http://www.neopets.com/shops/wizard.phtml*
// @grant      GM_getValue
// @grant      GM_setValue
// ==/UserScript==

const imgSize = 20; // for the search images

if (!GM_getValue) {
    GM_getValue = (key, def) => localStorage[key] || def;
    GM_setValue = (key, value) => localStorage[key] = value;
}

/*****************************************************************************************************/
//

//--------------------------------------------------------------
// Some keys are combined:
// mainshops      = Main shops, Igloo garage sale, General store
// inventory      = Inventory, NC redemption popup
// yourshop       = Shop stock, shop sales history
// npcquests      = Snow Faerie, Edna, Esophagor, Kitchen Quest
// trainingschool = Pirate/Island/Ninja schools
//--------------------------------------------------------------

const newestConfig = { // update our latest changes here
    // @formatter:off
    "mainshops"      : {ssw: 1, sw: 1, tp: 1, au: 1, sdb: 1, jni: 1, battlepedia: 1, closet: 0, dti: 0},
    "inventory"      : {ssw: 1, sw: 1, tp: 1, au: 1, sdb: 1, jni: 1, battlepedia: 1, closet: 1, dti: 1},
    "tradingpost"    : {ssw: 1, sw: 1, tp: 1, au: 1, sdb: 1, jni: 1, battlepedia: 1, closet: 0, dti: 0},
    "auction"        : {ssw: 1, sw: 1, tp: 1, au: 1, sdb: 1, jni: 1, battlepedia: 1, closet: 0, dti: 0},
    "sdb"            : {ssw: 1, sw: 1, tp: 1, au: 1, sdb: 0, jni: 1, battlepedia: 1, closet: 1, dti: 1},
    "yourshop"       : {ssw: 1, sw: 1, tp: 1, au: 1, sdb: 1, jni: 1, battlepedia: 1, closet: 0, dti: 0},
    "gallery"        : {ssw: 1, sw: 1, tp: 1, au: 1, sdb: 1, jni: 1, battlepedia: 1, closet: 0, dti: 0},
    "coincidence"    : {ssw: 1, sw: 1, tp: 1, au: 1, sdb: 1, jni: 1, battlepedia: 0, closet: 0, dti: 0},
    "trainingschool" : {ssw: 1, sw: 1, tp: 1, au: 1, sdb: 1, jni: 1, battlepedia: 0, closet: 0, dti: 0},
    "npcquests"      : {ssw: 1, sw: 1, tp: 1, au: 1, sdb: 1, jni: 1, battlepedia: 0, closet: 0, dti: 0},
    "illusen"        : {ssw: 1, sw: 1, tp: 1, au: 1, sdb: 1, jni: 1, battlepedia: 1, closet: 0, dti: 0},
    "employment"     : {ssw: 1, sw: 1, tp: 1, au: 1, sdb: 1, jni: 1, battlepedia: 1, closet: 0, dti: 0},
    "quests"         : {ssw: 0, sw: 1, tp: 1, au: 1, sdb: 1, jni: 1, battlepedia: 1, closet: 0, dti: 0},
    "kadoatery"      : {ssw: 1, sw: 1, tp: 1, au: 1, sdb: 1, jni: 1, battlepedia: 0, closet: 0, dti: 0},
    "hiddentower"    : {ssw: 1, sw: 1, tp: 1, au: 1, sdb: 1, jni: 1, battlepedia: 1, closet: 0, dti: 0},
    "battledome"     : {ssw: 1, sw: 1, tp: 1, au: 1, sdb: 1, jni: 1, battlepedia: 1, closet: 0, dti: 0},
    "hospital"       : {ssw: 1, sw: 1, tp: 1, au: 1, sdb: 1, jni: 1, battlepedia: 0, closet: 0, dti: 0},
    // @formatter:on
};

if (!GM_getValue("Config")) {
    GM_setValue("Config", newestConfig);
}
Config = GM_getValue("Config");

// If current saved configuration doesn't match newest format, update and save it
if (JSON.stringify(Object.keys(Config)) !== JSON.stringify(Object.keys(newestConfig))) {
    Config = newestConfig;
    GM_setValue("Config", Config);
}

//
/*****************************************************************************************************/

$(`<style type='text/css'>.searchimg { cursor: pointer; height: ${imgSize}px !important; width: ${imgSize}px !important; } .search-helper { margin-top: 0; margin-bottom: 0; }</style>`).appendTo("head");

jQuery.fn.exists = function () {
    return this.length > 0;
};

// if the active pet dropdown image is there, we're in beta
const isBeta = $("[class^='nav-pet-menu-icon']").exists();

const linkmap = { // for urls and images for each search type
    // if the image is not from images.neopets.com, base64 it
    ssw: {
        "img": "http://images.neopets.com/premium/shopwizard/ssw-icon.svg"
    },
    sw: {
        "url": "http://www.neopets.com/shops/wizard.phtml?string=%s",
        "img": "http://images.neopets.com/themes/h5/basic/images/shopwizard-icon.png"
    },
    tp: {
        "url": "http://www.neopets.com/island/tradingpost.phtml?type=browse&criteria=item_exact&search_string=%s",
        "img": "http://images.neopets.com/themes/h5/basic/images/tradingpost-icon.png"
    },
    au: {
        "url": "http://www.neopets.com/genie.phtml?type=process_genie&criteria=exact&auctiongenie=%s",
        "img": "http://images.neopets.com/themes/h5/basic/images/auction-icon.png"
    },
    sdb: {
        "url": "http://www.neopets.com/safetydeposit.phtml?obj_name=%s&category=0",
        "img": "http://images.neopets.com/images/emptydepositbox.gif"
    },
    jni: {
        "url": "https://items.jellyneo.net/search/?name=%s&name_type=3",
        "img": "http://images.neopets.com/items/toy_plushie_negg_fish.gif"
    },
    battlepedia: {
        "url": "http://battlepedia.jellyneo.net/index.php?search=%s",
        "img": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAChklEQVQ4T5XRW0iTARQH8P83Vi7n2CUvm0hroW7aFK1t+nkBe1BYK7KHoCYZXpplPUTkQ0WQQg9FIURiZHRDs8wEK6QNibFhZagT3drmFadJlq3mnM55+cIvIqKmdZ4Pv/M/5xAhigO5LOaGWI975hkGXnzAfxbBSy84oi3Q3vP7/Qv91n6Tw+547PXOtMPeNvYvFoFYdUTJsaPDMTExHKlUitnZWej1+hm705n0/sll13oIsdqgKLyoL9Pp8qanp8FgMCAQCNDU1GQnNi4qDVcrfGshNMAnC05UVlXdYLFYcDqdEIlE8Hg8MJvN9cbaisPrApDtji8pLXWQJElQFAWXywU2m43x8XEMj46Uvbx28lYwhE5AV4I6XbNnb4P2kHab2+3G5OQknSIQCMzdrqlOwYhpcLUtTY7k8DBGoW9h5ZHRgq5fAIDoHF345kh+XVZWdr5EIoHNZgOXy4XF0tNn7m5WkP5uTrGasHFCIbz5HK1GC5X/G/AzzJa84zqpTFotl8tDV9OIxWI0NjY2cB0116+UL3XWGxAYmqBkpj6M/hWgofgcWUSUuE6pUmUxmUzExcWht+V8a1Hq2319I0CHldJ09KMtOPAjDhGmPFiVmJhQIRQKQySCuTenxKfJM7VwTXyhVJ1WTK0J5KSA551H6s4d0Q/ZYtKrkQ5EGgxWbs8gcbe9a6WYnhDsPRkJECu3E3VFauQ6xoCtIqDFBETwgKVl4NNXuLqGKEVQQJOOc8Ua4tI7OxY/ukF99sDhm6OeZsiJyig+kJkEXLhDnQ0K7EpGGmsTUe3zU/f9C2gOZWHZ2ItvJRqic382VK+t9CF16x3xjw0zpeDw+CifD2DqVQ8efAfoI/lhtfaY7AAAAABJRU5ErkJggg=="
    },
    closet: {
        "url": "http://www.neopets.com/closet.phtml?obj_name=%s",
        "img": "http://images.neopets.com/items/ffu_illusen_armoire.gif"
    },
    dti: {
        "img": "data:image/gif;base64,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"
    }
};

// Add Search Helper configuration menu to inventory
if (isBeta && document.URL.includes("inventory")) {

    // Can't get left navbar positioning to work lol
    // $(`<div id="searchhelper-settings" style="display:inline-block;"><div style="height: 30px; width: 30px; margin: auto 4px auto 0;  vertical-align: middle; background: url(http://images.neopets.com/premium/portal/images/settings-icon.png) center center no-repeat; background-size: 100% auto; display:inline-flex;"></div> <span class="np-text__2020">Search Helper</span></div>`).appendTo($("[class^='navsub-left']"));

    $(`<div id="searchhelper-settings" class="navsub-np-meter__2020"><div style="height: 25px; width: 23px; margin: auto 4px auto 0; float: left; vertical-align: middle; background: url(http://images.neopets.com/premium/portal/images/settings-icon.png) center center no-repeat; background-size: 100% auto;"></div> <span class="np-text__2020">Search Helper</span></div>`).prependTo($("[class^='navsub-right']"));

    //  Create a table row with this format:
    //  | Page name | (icons) | Check all |
    const checkboxes = (name, configkey, title) => {

        let row = ` <!--${name}--><tr>
            <td ${title !== undefined ? 'title="' + title + '"' : ``} style="cursor:pointer;">${name}</td>
            <td><input type="checkbox" class="ssw_${configkey}"></td>
            <td><input type="checkbox" class="sw_${configkey}"></td>
            <td><input type="checkbox" class="tp_${configkey}"></td>
            <td><input type="checkbox" class="au_${configkey}"></td>
            <td><input type="checkbox" class="sdb_${configkey}"></td>
            <td><input type="checkbox" class="jni_${configkey}"></td>
            <td><input type="checkbox" class="battlepedia_${configkey}"></td>`;

        if (configkey === "inventory" || configkey === "sdb") {
            row += `
            <td><input type="checkbox" class="closet_${configkey}"></td>
            <td><input type="checkbox" class="dti_${configkey}"></td>`;
        } else {
            row += `
            <td><input class="0_0" type="checkbox" disabled></td>
            <td><input class="0_0" type="checkbox" disabled></td>`;
        }

        row += `<td style="background-color: #7D7D7D"><input type="checkbox" class="rowALL_${configkey}"></td></tr>`;

        return row;

        // <!--${name}-->
        // <tr>
        //     <td title="${title}" style="cursor: pointer;">${name}</td>
        //     <td><input type="checkbox" class="ssw_${configkey}"></td>
        //     <td><input type="checkbox" class="sw_${configkey}"></td>
        //     <td><input type="checkbox" class="tp_${configkey}"></td>
        //     <td><input type="checkbox" class="au_${configkey}"></td>
        //     <td><input type="checkbox" class="sdb_${configkey}"></td>
        //     <td><input type="checkbox" class="jni_${configkey}"></td>
        //     <td><input type="checkbox" class="battlepedia_${configkey}"></td>
        //     <td><input type="checkbox" class="closet_${configkey}"></td>
        //     <td><input type="checkbox" class="dti_${configkey}"></td>
        //     <td style="background-color: #7D7D7D"><input type="checkbox" class="rowALL_${configkey}"></td>
        // </tr>
    };

    // Add configuration menu to Beta pages
    // Can only be accessed from inventory & main shops for now
    $(`
<style>
    .sh-menu {
        z-index: 9000;
        background-color: #FFFFFF;
        font-family: MuseoSansRounded500, Arial, sans-serif;
    }
    
    #sh-tabs-table img, input[type=checkbox] {
        height: ${imgSize}px !important;
        width: ${imgSize}px !important;
    }

    #sh-tabs-table td:first-child {
        padding: 5px 4px;
    }

    #sh-tabs-table tr td:not(:first-child) {
        text-align: center;
    }

    #sh-tabs-table tr:hover {
        background-color: #a8a8a8;
    }

    .sh-wrapper th {
        position: sticky;
        top: 0;
        background-color: #FFFFFF;
    }

    .sh-wrapper tfoot td {
        position: sticky;
        bottom: 0;
        background-color: #FFFFFF;
        font-weight: bold;
        text-align: center;
    }

    .sh-tabs button {
        display: inline-block;
        width: 45%;
    }
    
    .sh-tabs .active {
        background-color: #aaaeff;
    }
    
    #sh-tabs-export textarea {
        font-family: Arial, sans-serif;
        font-size: 12px;
        resize: none;
        width: 100%;
        padding: 6px;
    }
    
    #sh-tabs-export td {
        padding: 20px;
    }
</style>
<div class="sh-menu togglePopup__2020" style="display:none; width: 80%; max-width: 1000px; max-height: 800px;">
    <div class="popup-header__2020">
        <h3>Search Helper Settings</h3>
        <div id="sh-close" class="inv-popup-exit button-default__2020 button-red__2020 popup-left-button__2020">
            <div class="button-x__2020"></div>
        </div>
        <div class="popup-header-pattern__2020"></div>
    </div>
    <div class="sh-wrapper" style="display:flex; max-height:700px">
        <table id="sh-tabs-table" style="width: 95%; overflow-y: scroll; border-collapse: collapse; margin: 10px;">
            <thead>
                <tr>
                    <th></th>
                    <th><img src="${linkmap.ssw.img}" title="Super Shop Wizard"></th>
                    <th><img src="${linkmap.sw.img}" title="Shop Wizard"></th>
                    <th><img src="${linkmap.tp.img}" title="Trading Post"></th>
                    <th><img src="${linkmap.au.img}" title="Auction"></th>
                    <th><img src="${linkmap.sdb.img}" title="Safety Deposit Box"></th>
                    <th><img src="${linkmap.jni.img}" title="Jellyneo"></th>
                    <th><img src="${linkmap.battlepedia.img}" title="Battlepedia"></th>
                    <th><img src="${linkmap.closet.img}" title="Closet"></th>
                    <th><img src="${linkmap.dti.img}" title="Dress to Impress"></th>
                    <th style="background-color: #7D7D7D"><b>All</b></th>
                </tr>
            </thead>
            <tbody>
                ${checkboxes("Inventory", "inventory")}
                ${checkboxes("Safety Deposit Box", "sdb")}
                ${checkboxes("Main Shops", "mainshops", "- Main shops\n- Igloo Garage Sale\n- General Store")}
                ${checkboxes("Trading Post", "tradingpost")}
                ${checkboxes("Auction", "auction")}
                ${checkboxes("Your Shop", "yourshop", "- Shop stock\n- Your shop's sales history")}
                ${checkboxes("Gallery", "gallery")}
                ${checkboxes("Coincidence", "coincidence")}
                ${checkboxes("Training Schools", "trainingschool")}
                ${checkboxes("NPC Quests", "npcquests", "- Snow Faerie quests\n- Esophagor\n- Edna's quests\n- Kitchen quest")}
                ${checkboxes("Illusen & Jhudora", "illusen")}
                ${checkboxes("Employment Agency", "employment")}
                ${checkboxes("Faerie Quests", "quests")}
                ${checkboxes("Kadoatery", "kadoatery")}
                ${checkboxes("Hidden Tower", "hiddentower")}
                ${checkboxes("Battledome", "battledome")}
                ${checkboxes("Hospital", "hospital")}
            </tbody>
            <tfoot>
                ${checkboxes("Check all", "colALL")}
            </tfoot>
        </table>
        <table id="sh-tabs-export" style="display: none; text-align: center; margin: 10px auto; width: 80%;">
            <tr>
                <td>
                    <textarea id="text-export" rows="25" readonly></textarea>
                    <br><br>
                    <button id="click-export" class="button-default__2020 button-blue__2020" style="width: 50%">Export</button>
                </td>
                <td>
                    <textarea id="text-import" rows="25" placeholder="This isn't working yet. WIP."></textarea>
                    <br><br>
                    <button id="click-import" class="button-default__2020 button-blue__2020" style="width: 50%">Import</button>
                </td>
            </tr>
        </table>
        <!--div id="sh-tabs-import" style="display: none; text-align: center; margin: 10px; width: 80%;">
            <textarea style="font-family: Arial, sans-serif; font-size: 12px; resize: none; width: 90%;" rows="25"></textarea>
            <button>Import</button>
        </div-->
    </div>
    <div class="sh-tabs" style="text-align: center; padding: 8px">
        <button id="tab-table" class="button-default__2020 active">Pages</button>
        <button id="tab-export" class="button-default__2020">Export</button>
        <!--button id="tab-import" class="button-default__2020">Import</button-->
    </div>
    <div style="padding: 10px; text-align: center;">
        <button id="sh-default" class="button-default__2020 button-yellow__2020" style="width: 20%; display:inline;">Reset to default</button>
        &nbsp;&nbsp;
        <button id="sh-save" class="button-default__2020 button-green__2020" style="width: 20%; display:inline;">Save</button>
    </div>
</div>
    `).appendTo("body");

// Tab buttons
    $(".sh-tabs").find("button").each(function (index, element) {
        $(element).on("click", function () {
            const tab = $(element).attr("id").replace(/tab-/, ``);
            $(".sh-tabs").find("button").removeClass("active");
            $(element).toggleClass("active");
            $(".sh-wrapper").find("[id^='sh-tabs']").hide();
            $(`#sh-tabs-${tab}`).show();
        });
    });

// Preload configuration
    importSettings(Config);

    $("#sh-default").on("click", function () {
        if (window.confirm("Configurations will be reset to default. Proceed?")) {
            importSettings(newestConfig);
            $(".sh-wrapper").find("input[class*='ALL']").prop("checked", false);
        }
    });

    function importSettings(Settings) {
        $(".sh-wrapper tbody").find("input:not([class*='ALL'], :disabled)").each(function (index, element) {
            const [icon, configkey] = $(element).attr("class").split("_");
            $(element).prop("checked", !!Settings[configkey][icon]);
        });
    }

// Export/import
    $("#text-export").val(JSON.stringify(Config));

    $(`<div id="copied-popup" style="text-align: center; padding: 10px; opacity: 90%; background-color: #3c3f41; color: #FFFFFF; font-size: 16px; border-radius: 5px; display: none; width: auto; font-family: MuseoSansRounded500, Arial, sans-serif;"></div>`).appendTo("body");

    $("#click-export").on("click", function (e) {

        $("#text-export").select();
        document.execCommand("copy");

        $("#copied-popup").html("Copied to clipboard!").css({
            "position": "absolute",
            "top": e.pageY,
            "left": e.pageX,
            "z-index": 9001
        }).fadeIn(100);

        setTimeout(function () {
            $("#copied-popup").fadeOut(100);
        }, 1000);
    });

    $("#click-import").on("click", function (e) {

        let input;

        try {
            input = JSON.parse($("#text-import").val());

            if (JSON.stringify(Object.keys(input)) !== JSON.stringify(Object.keys(newestConfig))) {
                $("#copied-popup").html("There was an error parsing your input.").css({
                    "position": "absolute",
                    "top": e.pageY,
                    "left": e.pageX,
                    "z-index": 9001
                }).fadeIn(100);
            } else {
                $("#copied-popup").html("Success").css({
                    "position": "absolute",
                    "top": e.pageY,
                    "left": e.pageX,
                    "z-index": 9001
                }).fadeIn(100);

                Config = input;
            }

        } catch (error) {
            $("#copied-popup").html(error).css({
                "position": "absolute",
                "top": e.pageY,
                "left": e.pageX,
                "z-index": 9001
            }).fadeIn(100);
        }

        setTimeout(function () {
            $("#copied-popup").fadeOut(100);
        }, 2000);

    });


// Menu positioning
    $("#searchhelper-settings").on("click", function () {

        $("#navdropdownshade__2020").fadeIn(300);
        reposition();
        $(".sh-menu").fadeIn(300);

        // Temporary method to fix all three tabs to the same height
        const tableHeight = $("#sh-tabs-table").css("height");
        $("#sh-tabs-export, #sh-tabs-import").css({"height": tableHeight});

    });
    $(window).on("resize", reposition);

    function reposition() {
        $(".sh-menu").css({
            "position": "fixed",
            "left": ($(window).outerWidth() - $(".sh-menu").outerWidth()) / 2,
            "top": ($(window).outerHeight() - $(".sh-menu").outerHeight()) / 2,
            "margin-top": 0,
            "margin-left": 0
        });
    }

// Close menu
    $("body").on("keydown", function (e) {
        // Press esc to close menu
        if ($(".sh-menu").is(":visible") && e.which === 27) {
            closeMenu();
        }
    });
    $("#sh-close").on("click", closeMenu); // Click X to close menu

    function closeMenu() {
        $("#navdropdownshade__2020").fadeOut(300);
        $(".sh-menu").fadeOut(300);
    }

// Check all
    $("input[class*='ALL']").each(function (index, element) {
        const thisClass = $(element).attr("class");
        $(element).on("change", function () {
            const isChecked = $(element).is(":checked");
            // Both
            if (thisClass === "rowALL_colALL") {
                const isChecked = $(this).is(":checked");
                $(".sh-wrapper :checkbox:not(:disabled)").prop("checked", isChecked);
            } else {
                // Vertical (search icon)
                if (thisClass.includes("colALL")) {
                    const thisColumn = $(element).attr("class").split("_")[0];
                    $(`input[class^='${thisColumn}']`).prop("checked", isChecked);
                }
                // Horizontal (page)
                if (thisClass.includes("rowALL")) {
                    const thisRow = $(element).attr("class").split("_")[1];
                    $(`input[class*='_${thisRow}']`).prop("checked", isChecked);
                }
            }
        });
    });

// Save the configuration settings
    $("#sh-save").on("click", function () {
        $(".sh-wrapper tbody").find("input:not([class*='ALL'], :disabled)").each(function (index, element) {
            const [icon, configkey] = $(element).attr("class").split("_");
            Config[configkey][icon] = $(element).is(":checked") ? 1 : 0;
            GM_setValue("Config", Config);
        });
        closeMenu();
        $("#text-export").val(JSON.stringify(Config));
    });
}


// user has premium toolbar
let premium = isBeta ? $("[class^='navsub-ssw-icon']").exists() : $("#sswmenu .imgmenu").exists();

function combiner(item, url, image) {
    url = url.replace("%s", item); // javascript needs sprintf.
    return "<a tabindex='-1' target='_blank' href='" + url + "'><img src='" + image + "' class='searchimg'></a>";
}

function sswlink(item) {
    // the only different one because it doesn't use a URL
    return "<img item='" + item + "' class='ssw-helper searchimg' src='" + linkmap.ssw.img + "'>";
}

// overall linker thing
function makelinks(page, item, extras) {
    // extras is an object that can only have boolean of 'cash' and 'wearable' (for now) | and a string/int number 'itemid' (only needed for wearable being true)
    let links = "";

    item = $.trim(item);
    if (typeof extras === "undefined") {
        extras = {cash: false, wearable: false, tradeable: true};
    }

    if (typeof extras.tradeable === "undefined") {
        extras.tradeable = true;
    }

    const sswurl = sswlink(item);
    item = item.replace(/&/g, "%26").replace(/ /g, '+');

    if (extras.cash === false && extras.tradeable === true) {

        // SSW
        if (premium && page.ssw) {
            links += sswurl;
        }

        // Regular SW
        if (page.sw) {
            links += combiner(item, linkmap.sw.url, linkmap.sw.img);
        }

        // TP
        if (page.tp) {
            links += combiner(item, linkmap.tp.url, linkmap.tp.img);
        }

        // Auctions
        if (page.au) {
            links += combiner(item, linkmap.au.url, linkmap.au.img);
        }
    }

    // SDB
    if (page.sdb) {
        links += combiner(item, linkmap.sdb.url, linkmap.sdb.img);
    }

    // JN items
    if (page.jni) {
        links += combiner(item, linkmap.jni.url, linkmap.jni.img);
    }

    // Battlepedia
    if (page.battlepedia) {
        links += combiner(item, linkmap.battlepedia.url, linkmap.battlepedia.img);
    }

    // Closet
    if (extras.wearable && page.closet) {
        links += combiner(item, linkmap.closet.url, linkmap.closet.img);
    }

    // DTI
    if (extras.wearable && page.dti) {
        let link = "http://impress.openneo.net/items?utf8=%E2%9C%93&q=%s&commit=search";
        if (extras.itemid !== -1 && typeof extras.itemid != "undefined") {
            link = "http://impress.openneo.net/items/" + extras.itemid;
        }
        links += combiner(item, link, linkmap.dti.img);
    }

    // Changed quests to use div, because p makes the text spill out of RE box
    const element = document.URL.match(/\/(quests|tradingpost).phtml/) ? "span" : "p";
    const helper = $(`<${element} class='search-helper'>${links}</${element}>`);

    // TODO: remove when TP is converted (hopefully)
    // because of how ugly this makes the TP, let's inline it
    let isOnTP = document.URL.includes("/island/tradingpost.phtml");
    if (isOnTP) {
        helper.css({
            //"display" : "inline-block",
            "margin-left": "4px"
        });
    }

    return helper;
}

jQuery.fn.justtext = function () {
    return $(this).clone().children().remove().end().text();
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// I don't really approve of doing the code this way, but in an effort to save as few headaches as possible
// for the countless people who may use this, it's easier to just put beta & non-beta into one file.
// As pages are converted, they will be removed from the non-beta half of the following if-statement, as TNT
// mentioned in their end-of-flash update that beta pages will be the default when those pages are done.
// That said, the point of no return starts here. May Sloth have mercy on us.

if (isBeta) {
    /*
     Adds the search icons under things in:
     Inventory
     Main Shops
    */

    // Main Shops
    if (document.URL.includes("objects.phtml?") && document.URL.includes("type=shop")) {
        const page = Config.mainshops;
        $(".item-name").each(function (k, v) {
            $(v).after(makelinks(page, $(v).text()));
        });
    }

    // Inventory
    if (document.URL.includes("inventory")) {
        const page = Config.inventory;
        // the inventory system is more flexible than it used to be, so we have to do this a little differently
        $(document).ajaxSuccess(
            function () {
                $(".item-name").each(function (index, element) {
                    // this will add more and more if you do things like SSW searching, so check first
                    if ($(element).parent().find(".search-helper").length === 0) {
                        let extras = {
                            cash: document.getElementById("invDisplay").dataset.type === "nc",
                            wearable: $(element).parent().find(":contains('wearable')").length > 0,
                            tradeable: $(element).parent().find(":contains('(no trade)')").length === 0,
                            itemid: -1
                        };
                        $(element).after(makelinks(page, $(element).text(), extras));
                    }
                });
            }
        );
    }

    // Shop Wiz Auto-Exact
    if (document.URL.includes("wizard.phtml?string=")) {
        $("#criteria").val("exact");
    }

    function sswopen(item) {
        // open this in such a way that if the "__2020" was changed/removed without warning, this will still work
        // TODO: hardcode the class name better once out of beta
        $("[class^='ssw-header']").last().parent().show();

        // if results are currently up, close them
        $("#ssw-button-new-search").click();

        $("#ssw-criteria").val("exact");
        $("#searchstr").val(item);
    }
} else {

    // Main Shops
    if (document.URL.includes("objects.phtml?") && document.URL.includes("type=shop")) {
        const page = Config.mainshops;
        $("img[src*='/items/']").parent().parent().find("b").each(function (k, v) {
            $(v).after(makelinks(page, $(v).text()));
        });
    }

    // Igloo Garage
    if (document.URL.includes("/winter/igloo2.phtml")) {
        const page = Config.mainshops;
        $("img[src*='/items/']").parent().parent().find("b").each(function (k, v) {
            $(v).after(makelinks(page, $(v).text()));
        });
    }

    // Trading Post
    if (document.URL.includes("/island/tradingpost.phtml")) {
        const page = Config.tradingpost;
        $("img[src*='/items/']").each(function (k, v) {
            $(this.nextSibling).after(makelinks(page, $(this)[0].nextSibling.nodeValue));
        });
        $(".content table:first").css("width", "600px");
    }

    // Hospital
    if (document.URL.includes("/hospital.phtml")) {
        const page = Config.hospital;
        $("img[src*='/items/']").parent().prev().find("b").each(function (k, v) {
            $(v).after(makelinks(page, $(v).text())).before("<br>");
            $(v).parent().width(150);
        });
    }

    // Redeeming Cash
    if (document.URL.includes("process_cash_object")) {
        const page = Config.inventory;
        extras = {cash: true, wearable: true};
        $("img[src*='/items/']").parent().find("b").each(function (k, v) {
            $(v).before("<br>").after(makelinks(page, $(v).text(), extras));
        });
    }

    // Auctions
    if (document.URL.includes("auction_id")) {
        const page = Config.auction;
        nameb = $("b:contains('owned by')");
        let fixname = nameb.html();
        fixname = fixname.substr(0, fixname.indexOf(" (own")); // remove "owned by..."
        nameb.parent().find("img").after(makelinks(page, fixname));
    }
    if (document.URL.match(/\/(auctions|genie).phtml/)) {
        const page = Config.auction;
        $("a[href*='?type=bids&auction_id=']:not(:has('img'))").each(function (index, element) {
            const itemname = $(element).text();
            $(element).after(makelinks(page, itemname));
        })
    }

    // Inventory
    if (document.URL.includes("inventory")) {
        const page = Config.inventory;
        $("img[src*='/items/']").each(function (k, v) {
            let $nametd = $(v).parent().parent();

            let extras = {cash: $(v).hasClass("otherItem"), wearable: $nametd.hasClass("wearable"), itemid: -1};

            if ($nametd.find("hr").exists()) {
                extras.tradeable = !$nametd.find("span:contains('(no trade)')").exists();
                $nametd.find("hr").before(makelinks(page, $nametd.justtext(), extras));
            } else {
                $nametd.append(makelinks(page, $nametd.justtext(), extras));
            }
        });
    }

    // SDB & Closet
    // only downside is not knowing if something is NC if it's in the closet. Oh well, no way to know.
    if (document.URL.includes("safetydeposit") || document.URL.includes("closet")) {
        const page = Config.sdb;
        $("img[src*='/items/']").each(function (k, v) {
            let id = $(v).parent().parent().find("td").eq(5).find("input").attr("name").match(/\d+/g)[0];

            let iswearable = $(v).parent().parent().find("td").eq(1).text().includes("(wearable)");
            if (document.URL.includes("closet")) { // because it'll always be wearable if it's in the closet...
                iswearable = true;
            }
            let category = $(v).parent().parent().find("td").eq(3);
            let extras = {cash: (category.text().trim() === "Neocash"), wearable: iswearable, itemid: id};
            let nametd = $(v).parent().parent().find("td").eq(1);
            nametd.find("b").eq(0).after(makelinks(page, nametd.find("b").eq(0).justtext(), extras));
        });
    }

    // Your Shop
    if (document.URL.includes("type=your") || document.URL.includes("market_your") || $("[name=subbynext]").length === 2) { // because pressing the Previous/Next 30 is a POST and has nothing of value in the URL
        const page = Config.yourshop;
        $("img[src*='/items/']").each(function (k, v) {
            let nametd = $(v).parent().parent().find("td").eq(0);
            let itemname = nametd.text();
            itemname = itemname.replace(nametd.find(".medText").text(), "");

            nametd.find("b").eq(0).after(makelinks(page, itemname));
        });
    }

    // Coincidence
    if (document.URL.includes("space/coincidence")) {
        const page = Config.coincidence;
        $("img[src*='/items/']").each(function (k, v) {
            nametd = $(v).parent();
            nametd.find("b").eq(0).after(makelinks(page, nametd.justtext()));
        });
    }

    // KI Training
    if (document.URL.includes("/pirates/academy.phtml?type=status")) {
        const page = Config.trainingschool;
        $("img[src*='/items/']").each(function (k, v) {
            let nametd = $(v).parent();
            let itemname = nametd.parent().find("td > b").eq(0).text();
            nametd.parent().find("td > b").eq(0).after(makelinks(page, itemname));
        });
    }

    // MI Training
    if (document.URL.includes("/island/training.phtml?type=status")) {
        const page = Config.trainingschool;
        $("img[src*='/items/']").each(function (k, v) {
            $(v).after(makelinks(page, $(v).prev().text()));
        });
    }

    // Secret Training
    if (document.URL.includes("/island/fight_training.phtml?type=status")) {
        const page = Config.trainingschool;
        $("img[src*='/items/']").each(function (k, v) {
            $(v).after(makelinks(page, $(v).prev().text()));
        });
    }

    // Snow Faerie
    // essentially same as kitchen. woo, lazy!
    if (document.URL.includes("winter/snowfaerie")) {
        const page = Config.npcquests;
        addhr = (document.URL.includes("snowfaerie2") === false);
        $("img[src*='/items/']").parent().find("b").each(function (k, v) {
            $(v).after(makelinks(page, $(v).text()));
        });
    }

    // Esophagor
    if (document.URL.includes("halloween/esophagor")) {
        const page = Config.npcquests;
        $("img[src*='/items/']").each(function (k, v) {
            let itemname = $(v).parent().find("b");
            itemname.after(makelinks(page, itemname.text()));
        });
    }

    // Edna
    if (document.URL.includes("halloween/witchtower")) {
        const page = Config.npcquests;
        $("img[src*='/items/']").each(function (k, v) {
            let itemname = $(v).parent().find("b");
            itemname.after(makelinks(page, itemname.text()));
        });
    }

    // Kitchen
    if (document.URL.includes("island/kitchen")) {
        const page = Config.npcquests;
        $("img[src*='/items/']").parent().find("b").each(function (k, v) {
            $(v).after(makelinks(page, $(v).text()));
        });
    }

    // illusen & jhudora
    if ($("img[src*='ef_2.gif']").exists() || $("img[src*='darkfaeriequest2.gif']").exists()) {
        const page = Config.illusen;
        let itemname = $("center:contains('Where is my') > b").text();
        $("center:contains('Where is my')").parent().find("img[src*='/items/']").after(makelinks(page, itemname));
    }

    // employment agency
    if (document.URL.includes("employment")) {
        const page = Config.employment;
        if (document.URL.includes("type=jobs")) {
            $("b:contains('Find')").each(function (k, v) {
                let itemname = $(v).parent().clone().find("b").remove().end().html().split("<br>")[0];
                $($(v)[0].nextSibling).after(makelinks(page, itemname));
            });
        }
        if (document.URL.includes("job_id")) {
            $("b:contains('Find')").eq(0).after(makelinks(page, $("b:contains('Find')").eq(0).justtext()));
        }
    }

    // Faerie Quests
    if (document.URL.includes("quests.phtml")) {
        const page = Config.quests;
        $("img[src*='/items/']").each(function (k, v) {
            let itemname = $(v).parent().find("b");
            itemname.after(makelinks(page, itemname.text()));
        });
    }

    // Kadoatery
    if (document.URL.includes("games/kadoatery")) {
        const page = Config.kadoatery;
        $("td:contains('You should give it'):not(:contains('Thanks,'))").each(function (k, v) {
            let itemname = $(v).find("strong").last();
            itemname.after(makelinks(page, itemname.text()));
        });
    }

    // General Store
    if (document.URL.includes("generalstore.phtml")) {
        const page = Config.mainshops;
        $("td:contains('Cost'):not(:has('td'))").find("strong").each(function (index, element) {
            $(element).after(makelinks(page, $(element).text()));
        });
    }

    // Hidden Tower
    if (document.URL.includes("hiddentower938.phtml")) {
        const page = Config.hiddentower;
        $(".content table").find("b:not([style*='red;'])").each(function (index, element) {
            $(element).after(makelinks(page, $(element).text()));
        });
    }

    // Your Shop's Sales History
    if (document.URL.includes("market.phtml?type=sales")) {
        const page = Config.yourshop;
        $('[value="Clear Sales History"]').parent().parent().parent().parent().find('tr').each(function (index, element) {
            // make sure it's not the header or footer of this table
            let cell = $(element).find("td").eq(1);
            if (cell.attr('bgcolor') === "#ffffcc") {
                $(cell).append(makelinks(page, $(cell).text()));
            }
        });
    }

    // Battledome
    if (document.URL.includes("/dome/neopets")) {
        const page = Config.battledome;
        $(".equipFrame").each(function (index, element) {
            const itemname = $(element).text().trim();
            if (itemname) { // ignore if empty slot
                $(makelinks(page, itemname)).appendTo($(element));
            }
        });
        $(".equipTable").css({"overflow-y": "scroll"});
    }

    // Gallery
    if (document.URL.includes("/gallery/index.phtml")) {
        const page = Config.gallery;
        $("#gallery_form").find("b").each(function (index, element) {
            const itemname = $(element).html();
            $(element).after(makelinks(page, itemname));
        });
    }

    function sswopen(item) {
        if ($(".sswdrop").hasClass("panel_hidden")) {
            $("#sswmenu .imgmenu").click();
        }

        if ($("#ssw-tabs-1").hasClass("ui-tabs-hide")) {
            $('#ssw-tabs').tabs('select', 0);
        }

        $("#ssw-criteria").val("exact");

        $("#searchstr").val(item);
    }
}

$("body").on("click", ".ssw-helper", function () {
    sswopen($(this).attr("item"));
});

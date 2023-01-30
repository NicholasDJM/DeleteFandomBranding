// ==UserScript==
// @name         Delete Fandom Branding
// @namespace    https://github.com/NicholasDJM/DeleteFandomBranding
// @version      0.5.0
// @description  Deletes links and branding for other Fandom articles on every wiki page, and expands wiki content space.
// @author       Nicholas Miller
// @updateURL    https://raw.githubusercontent.com/NicholasDJM/DeleteFandomBranding/main/deleteFandomBranding.user.js
// @downloadURL  https://raw.githubusercontent.com/NicholasDJM/DeleteFandomBranding/main/deleteFandomBranding.user.js
// @match        https://*.fandom.com/wiki/*
// @icon         https://icons.duckduckgo.com/ip2/www.fandom.com.ico
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js#sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=
// @grant        GM_log
// @grant        GM_addStyle
// ==/UserScript==

function log(text) {
	GM_log("Delete Fandom Branding: " + text);
}
if (jQuery?.fn?.jquery == "3.6.0") {
	log("Loading userscript...");
	$(()=>{
		let timer;
		timer = setInterval(()=>{
			$("#SurveyModule").css("display", "none");
		}, 1000);
		setTimeout(()=>{clearInterval(timer);}, 15000);
		$(".global-navigation").css("display", "none");
		$("#WikiaBar").css("display", "none");
		$(".page__right-rail").css("display", "none");
		$("#mixed-content-footer").css("display", "none");
		$(".main-container").css("width", "100%");
		$(".main-container").css("margin-left", "0");
		$(".fandom-sticky-header").css("left", "0");
		$(".resizable-container").css("max-width", "100%");
		$(".fandom-community-header__background").css("width", "100%");
		// Couldn't seem to apply an inline style to a 'before' pseudo class, so I instead injected my own override style.
		GM_addStyle(`/* Delete Fandom Branding Style Override. https://github.com/NicholasDJM/DeleteFandomBranding */
.search-modal, .search-modal::before {
    left: 0 !important;
}`);
		$(".unified-search__layout__right-rail").css("display", "none");
		// Ensure each corner has a matching radius.
        $(".page__main").css("border-radius", $(".page__main").css("border-radius").split(" ")[0]);
	});
	log("Done!");
} else {
	log("Incorrect jQuery version. Expecting 3.6.0");
}

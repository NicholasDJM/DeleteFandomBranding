// ==UserScript==
// @name         Delete Fandom Branding
// @namespace    https://github.com/NicholasDJM/DeleteFandomBranding
// @version      0.6.3
// @description  Deletes links and branding for other Fandom articles on every wiki page, and expands wiki content space.
// @author       Nicholas Miller
// @updateURL    https://raw.githubusercontent.com/NicholasDJM/DeleteFandomBranding/main/deleteFandomBranding.user.js
// @downloadURL  https://raw.githubusercontent.com/NicholasDJM/DeleteFandomBranding/main/deleteFandomBranding.user.js
// @match        https://*.fandom.com/*/*
// @icon         https://icons.duckduckgo.com/ip2/www.fandom.com.ico
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.3/dist/jquery.min.js#sha256-pvPw+upLPUjgMXY0G+8O0xUf+/Im1MZjXxxgOcBQBXU=
// @grant        GM_log
// @grant        GM_addStyle
// ==/UserScript==

const jqueryVersion = "3.6.3",
	delay = 100;
function log(text) {
	GM_log("Delete Fandom Branding: " + text);
}
if (jQuery?.fn?.jquery == jqueryVersion) {
	log("Loading userscript...");
	$(()=>{
		let timer;
		timer = setInterval(()=>{
			if ($("#SurveyModule")) {
				$("#SurveyModule").css("display", "none");
			}
			if ($("#SurveyModule").length === 0) {
				clearInterval(timer);
				log("Cleared survey");
			}
		}, delay);
		log("Style Point");
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
		log("Added Styles...");
		log("Scroll Point");
		const url = new URL(window.location.href);
		let element;
		if (url.hash) {
			element = $(url.hash);
		}
		if (url.hash && element) {
			setTimeout(()=>{element.scrollIntoView();}, 100);
			log("Scrolling...");
			// This fixes content being hidden due to layout shifts.
			// The browser loads the page, scrolls to the element. And then we change the layout, so we need to scroll again.
		}
		log("Gate point");
		const gateTimer = setInterval(()=>{
			if ($("#adult")) {
				$("#adult").trigger("click");
			}
			if ($("#adult").length === 0) {
				clearInterval(gateTimer);
				log("Cleared gate");
			}
			// Auto clicks the "I am an adult" button on the age gate modal.
		}, delay);
		log("Notice point");
		const noticeTimer = setInterval(()=>{
			const element = $(".sitenotice-wrapper");
			if (element) {
				element.css("display", "none");
			}
			if (element.length === 0) {
				clearInterval(noticeTimer);
				log("Cleared notice");
			}
		}, delay);
		log("Size toggle point");
		const toggleTimer = setInterval(()=>{
			const element = $("[name=content-size-toggle]");
			if (element && element.data("wds-tooltip") === "Expand") {
				log("Expanding...");
				element.trigger("click");
				clearInterval(toggleTimer);
			}
		}, delay);
		log("End point");
	});
	log("Done!");
} else {
	log("Incorrect jQuery version. Expecting " + jqueryVersion);
}
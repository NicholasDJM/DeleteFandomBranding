// ==UserScript==
// @name         Delete Fandom Branding
// @namespace    https://github.com/NicholasDJM/DeleteFandomBranding
// @version      0.7.5
// @description  Deletes links and branding for other Fandom articles on every wiki page, and expands wiki content space.
// @author       Nicholas Miller
// @updateURL    https://raw.githubusercontent.com/NicholasDJM/DeleteFandomBranding/main/deleteFandomBranding.user.js
// @downloadURL  https://raw.githubusercontent.com/NicholasDJM/DeleteFandomBranding/main/deleteFandomBranding.user.js
// @match        https://*.fandom.com/*/*
// @icon         https://icons.duckduckgo.com/ip2/www.fandom.com.ico
// @grant        GM_log
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

const delay = 100;
function log(text) {
	GM_log("Delete Fandom Branding: " + text);
}
log("Loading userscript...");
GM_addStyle(`/* Delete Fandom Branding Style Override. https://github.com/NicholasDJM/DeleteFandomBranding */
#SurveyModule,
.global-navigation,
#WikiaBar,
.page__right-rail,
#mixed-content-footer,
.unified-search__layout__right-rail,
.site-notice-wrapper {
	display: none !important;
}
.main-container {
	width: 100% !important;
	margin-left: 0 !important;
}
.fandom-sticky-header {
	left: 0 !important;
}
.resizable-container {
	max-width: 100% !important;
}
.fandom-community-header__background {
	width: 100% !important;
}
.page__main {
	border-radius: var(--radius, 3px);
}
.search-modal, .search-modal::before {
	left: 0 !important;
}`);
// https://youmightnotneedjquery.com/#trigger_native
function trigger(element, eventType) {
	if (typeof eventType === "string" && typeof element[eventType] === "function") {
		element[eventType]();
	} else {
		const event =
		typeof eventType === "string"
			? new Event(eventType, {bubbles: true})
			: eventType;
		element.dispatchEvent(event);
	}
}
document.addEventListener("DOMContentLoaded", ()=>{
	const gateTimer = setInterval(()=>{
		const gate = document.querySelector("#adult");
		if (gate) trigger(gate, "click");
		// Auto clicks the "I am an adult" button on the age gate modal.
	}, delay);
	log("Size toggle");
	const toggleTimer = setInterval(()=>{
		const element = document.querySelector(".content-size-toggle");
		if (element && element.getAttribute("aria-label") === "Expand" && localStorage.getItem("contentwidth") !== "expanded") {
			log("Expanding...");
			trigger(element, "click");
		} else if (element && element.getAttribute("aria-label") === "Collapse") {
			log("Expanded.");
			clearInterval(toggleTimer);
		}
	}, delay);
	log("Done!");
});
// ==UserScript==
// @name         Delete Fandom Branding
// @namespace    https://github.com/NicholasDJM/DeleteFandomBranding
// @version      0.8.1
// @description  Deletes links and branding for other Fandom articles on every wiki page, and expands wiki content space. Makes the website tolerable to use, without all the bloat.
// @author       Nicholas Miller
// @updateURL    https://raw.githubusercontent.com/NicholasDJM/DeleteFandomBranding/main/deleteFandomBranding.user.js
// @downloadURL  https://raw.githubusercontent.com/NicholasDJM/DeleteFandomBranding/main/deleteFandomBranding.user.js
// @match        https://*.fandom.com/*/*
// @icon         https://icons.duckduckgo.com/ip2/www.fandom.com.ico
// @grant        GM_log
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

const delay = 100; // You can edit this variable. In milliseconds.
const expand = true; // You can edit this variable. true or false. Should we automatically click the expand button on articles?
function log(text) {
	GM_log("Delete Fandom Branding: " + text);
}
log("Loading UserScript...");
GM_addStyle(`/* Delete Fandom Branding Style Override. https://github.com/NicholasDJM/DeleteFandomBranding */
#SurveyModule,
.global-navigation,
#WikiaBar,
.page__right-rail,
#mixed-content-footer,
.unified-search__layout__right-rail,
.site-notice-wrapper,
.notifications-placeholder,
.global-explore-navigation,
.community-navigation__fandom-heart {
	display: none !important;
}
.global-top-navigation {
	/* For some reason, hiding it via "display: none" breaks the secondary nav bar (doesn't load). 
		Maybe the site uses it's height to set the secondary nav bar's height? */
    visibility: hidden;
}
.main-container {
	width: 100% !important;
	margin-left: 0 !important;
}
.fandom-sticky-header {
	left: 0 !important;
    transition: none;
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
}
`);
// https://youmightnotneedjquery.com/#trigger_native
// Slight modification, I check if the element exists.
function trigger(element, eventType) {
	if (element) {
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
}
document.addEventListener("DOMContentLoaded", ()=>{
	const gateTimer = setInterval(()=>{
		const gate = document.querySelector("#adult");
		if (gate) {
			trigger(gate, "click");
			clearInterval(gateTimer);
		}
		// Auto clicks the "I am an adult" button on the age gate modal.
	}, delay);
	if (expand) {
		const toggleTimer = setInterval(()=>{
			// Tries to expand content area, via Fandom's own button.
			// Conveniently, Fandom has a localStorage item that keeps track of button's state. We can use that to ensure the content is always expanded.
			const element = document.querySelector(".content-size-toggle");
			if (element) trigger(element, "click");
			if (localStorage.getItem("contentwidth") === "expanded") clearInterval(toggleTimer);
		}, delay);
	}
	const element = document.querySelector("#community-navigation");
	if (element) {
		// We want this to always be shown.
		// By default, the secondary nav bar is hidden, and visible when page is scrolled. We want to override this behaviour, since we've hidden the primary nav bar (.global-navigation-explore).
		// I've hidden the primary nav bar because it's easier than dissecting the CSS to hide the branding.
		element.style.transform = "translateY(100%)";

		// Listens for changes to the 'inert' attribute and sets it to false if changed.
		// Needed to prevent the secondary nav bar from being disabled.
		element.addEventListener("attributechange", function(event) {
			if (event.attributeName === "inert") {
				element.setAttribute("inert", false);
			}
		});
	}
	log("Done!");
});
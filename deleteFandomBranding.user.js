// ==UserScript==
// @name         Delete Fandom Branding
// @namespace    https://github.com/NicholasDJM/DeleteFandomBranding
// @version      0.8.6
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

/*
	This program, unless otherwise stated, is licensed under Do What The Fuck You Want To Public License (WTFPL).
	This program uses code licensed under MIT, and is stated as such near those sections.
*/


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
// Slight modification from original: I check if the element exists beforehand.
// This code below is licensed under MIT
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
// The above code is licensed under MIT.
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
			const contentSizeToggle = document.querySelector(".content-size-toggle");
			if (contentSizeToggle) {
				// We check for the localStorage item first, so we don't shrink the content by accident.
				if (localStorage.getItem("contentwidth") === "expanded") {
					clearInterval(toggleTimer);
				} else {
					trigger(contentSizeToggle, "click");
				}
			}
		}, delay);
	}
	const navBar = document.querySelector("#community-navigation");
	if (navBar) {
		// We want this to always be shown.
		// By default, the secondary nav bar is hidden, and visible when page is scrolled. We want to override this behaviour, since we've hidden the primary nav bar (.global-navigation-explore).
		// I've hidden the primary nav bar because it's easier than dissecting the CSS to hide the branding.
		navBar.style.transform = "translateY(100%)";

		// Remove inert attribute on page load.
		navBar.removeAttribute("inert");

		// Uses a mutation observer to listen for changes to the 'inert' attribute and sets it to false if changed.
		// Needed to prevent the secondary nav bar from being disabled.
		// Added a debouncer to prevent observing our own mutations.
		let debounceTimer;
		const observer = new MutationObserver(mutations => {
			clearTimeout(debounceTimer);
			debounceTimer = setTimeout(() => {
				for (const mutation of mutations) {
					if (mutation.type === "attributes" && mutation.attributeName === "inert") {
						navBar.removeAttribute("inert");
					}
				}
			}, 0);
		});

		observer.observe(navBar, {
			attributes: true,
			attributeFilter: ["inert"]
		});
	}
	else {
		log("Cannot find #community-navigation element.");
	}
	log("Done!");
});
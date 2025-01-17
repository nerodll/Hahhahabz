// ==UserScript==
// @name         Add Button Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a button to a specific page
// @author       You
// @match        *://*.tinder.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

async function unblur() {
  const teasers = await fetch("https://api.gotinder.com/v2/fast-match/teasers", {
    headers: {
      "X-Auth-Token": localStorage.getItem("TinderWeb/APIToken"),
      platform: "android",
    },
  })
  .then((res) => res.json())
  .then((res) => res.data.results);

  const teaserEls = document.querySelectorAll(
    ".Expand.enterAnimationContainer > div:nth-child(1)"
  );

  teasers.forEach((teaser, index) => {
    const teaserEl = teaserEls[index];
    const teaserImage = `https://preview.gotinder.com/${teaser.user._id}/original_${teaser.user.photos[0].id}.jpeg`;
    teaserEl.style.backgroundImage = `url(${teaserImage})`;
  });
}

console.log("TamperMonkey script started");

(function() {
    'use strict';

    function waitForSpecificDivAndExecute() {
        const observer = new MutationObserver((mutations, obs) => {
            let divs = document.querySelectorAll("div.Expand.enterAnimationContainer");
            if (divs.length > 0) {
                console.log("Specific div found by MutationObserver");
                // Execute unblur after the div has stopped loading
                setTimeout(() => {
                    console.log("Executing unblur after div has stopped loading");
                    unblur();
                }, 1000); // Adjust the timeout as needed
                obs.disconnect(); // Stop observing once the element is found and unblur is executed
            }
        });

        // Start observing the document for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function checkAndRunScript() {
        if (window.location.pathname === "/app/likes-you") {
            console.log("TamperMonkey script started");
            waitForSpecificDivAndExecute();
        } else {
            console.log("Script not running on this page");
        }
    }

    // Initial check
    checkAndRunScript();

    // Listen for URL changes
    const pushState = history.pushState;
    history.pushState = function() {
        pushState.apply(history, arguments);
        checkAndRunScript();
    };

    window.addEventListener('popstate', function() {
        checkAndRunScript();
    });

    // Optionally, listen for hash changes if relevant
    window.addEventListener('hashchange', function() {
        checkAndRunScript();
    });
})();

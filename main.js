// Progressive Enhancement
if (navigator.serviceWorker) {
  // Register SW
  navigator.serviceWorker.register("sw.js").catch(console.error);
  // Pics cache clean
  function picsCacheClean(pics) {
    // Get service worker registration
    navigator.serviceWorker.getRegistration().then(function(reg) {
      // Only post message to active SW
      if (reg.active)
        reg.active.postMessage({ action: "cleanPicsCache", pics: pics });
    });
  }
}

// Get template
const template = document.querySelector("#template");
// Get comments div
const comments = document.getElementById("comments");
let picCount = 1;
// Populate array of latest pics
let latestPics = [];

// DISPLAY FEED
// GET request using fetch()
fetch("https://jsonplaceholder.typicode.com/comments?_start=1&_limit=15")
  // Converting received data to JSON
  .then(response => response.json())
  .then(json => {
    // Loop through each data and add a card
    json.forEach(comment => {
      const clone = document.importNode(template.content, true);
      clone.querySelector("#name").innerText = comment.name;
      clone.querySelector("#email").innerText = comment.email;
      clone.querySelector("#text").innerText = comment.body;
      // Add a pic from lorem picsum
      let url = "https://picsum.photos/id/" + picCount + "/70";
      clone.querySelector("img").setAttribute("src", url);
      // Add to latest pics
      latestPics.push(url);
      // Push card on top of the feed
      comments.insertBefore(clone, comments.firstChild);
      picCount += 10;
    });
  })
  .catch(function(error) {
    console.log("Problem with fetch: " + error.message);
  })
  .then(function() {
    // Testing the latestPics array
    console.log(latestPics);
    // Inform the SW (if available) of current pics
    if (navigator.serviceWorker) picsCacheClean(latestPics);
  });

// WRITE MESSAGE
document.querySelector("#share").addEventListener("click", () => {
  if (navigator.onLine) {
    let message = document.querySelector("#message").value;
    let title = document.querySelector("#title").value;
    const tplClone = document.importNode(template.content, true);
    tplClone.querySelector("#name").innerText = title;
    tplClone.querySelector("#email").innerText = "jane.doe@gmail.com";
    tplClone.querySelector("#text").innerText = message;
    tplClone
      .querySelector("img")
      .setAttribute("src", "https://picsum.photos/id/306/70");
    comments.insertBefore(tplClone, comments.firstChild);
  } else {
    $(".alert").slideDown();
    setTimeout(function() {
      $(".alert").slideUp();
    }, 4000);
  }
});

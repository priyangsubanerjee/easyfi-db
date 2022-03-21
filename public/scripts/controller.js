let apiDocsOpen = false;

var viewApiDocs = document.getElementById("view-api-docs");
var apiDocsContainer = document.getElementById("api-docs-container");

viewApiDocs.addEventListener("click", function () {
  if (!apiDocsOpen) {
    viewApiDocs.innerHTML = "Collapse";
    apiDocsContainer.classList.remove("h-0");
    apiDocsContainer.classList.add("h-fit");
    apiDocsOpen = true;
  } else {
    viewApiDocs.innerHTML = "View Docs";
    apiDocsContainer.classList.remove("h-fit");
    apiDocsContainer.classList.add("h-0");
    apiDocsOpen = false;
  }
});

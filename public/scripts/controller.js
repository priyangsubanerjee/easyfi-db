let apiDocsOpen = false;
let faqOpen = false;

var viewApiDocs = document.getElementById("view-api-docs");
var apiDocsContainer = document.getElementById("api-docs-container");

var viewFaq = document.getElementById("view-faq");
var faqContainer = document.getElementById("faq-container");

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

viewFaq.addEventListener("click", function () {
  if (!faqOpen) {
    viewFaq.innerHTML = "Collapse";
    faqContainer.classList.remove("h-0");
    faqContainer.classList.add("h-fit");
    faqOpen = true;
  } else {
    viewFaq.innerHTML = "View FAQ";
    faqContainer.classList.remove("h-fit");
    faqContainer.classList.add("h-0");
    faqOpen = false;
  }
});

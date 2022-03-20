class File {
  constructor(name, url, date) {
    this.name = name;
    this.url = url;
    this.date = date;
  }

  getName() {
    return this.name;
  }

  getUrl() {
    return this.url;
  }

  getDate() {
    return this.date;
  }
}

// Variables

const uploadedFilesContainer = document.getElementById("uploaded-files");
const uploadedFilesContainerEmpty = document.getElementById(
  "uploaded-files-empty"
);

const fileUploadInput = document.getElementById("file-upload-input");
const fileUploadBox = document.getElementById("file-upload-box");

const closeUploadModal = document.getElementById("close-upload-modal");
const uploadingParentLayer = document.getElementById("uploading-parent-layer");
const uploadingContainer = document.getElementById("uploading-container");
const uploadedContainer = document.getElementById("uploaded-container");
const fileUploadedAnchor = document.getElementById("file-uploaded-anchor");

const askBeforeDeleting = document.getElementById("ask-before-deleting");
const showQuickMenu = document.getElementById("show-modal-while-uploading");

// Event Listeners

fileUploadBox.addEventListener("click", () => {
  fileUploadInput.click();
});

fileUploadInput.addEventListener("change", (e) => {
  if (e.target.files.length > 0) {
    if (showQuickMenu.checked) {
      uploadingParentLayer.style.display = "flex";
      uploadingContainer.style.display = "block";
      uploadedContainer.style.display = "none";
    }

    const file = e.target.files[0];
    const fileSize = file.size / 1024 / 1024;
    if (fileSize > 20) {
      alert("File size is too big. Max file size is 20MB");
      uploadingParentLayer.style.display = "none";
      uploadingContainer.style.display = "none";
      uploadedContainer.style.display = "block";
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    axios.post("/upload-file", formData).then(function (response) {
      if (showQuickMenu.checked) {
        uploadedContainer.style.display = "block";
        uploadingContainer.style.display = "none";
        fileUploadedAnchor.href = response.data.fileUrl;
        fileUploadedAnchor.innerHTML = response.data.fileName;
      }

      const file = new File(
        response.data.fileName,
        response.data.fileUrl,
        new Date().toLocaleString()
      );

      saveFileToLocalStorage(file);
    });
  }
});

closeUploadModal.addEventListener("click", () => {
  uploadingParentLayer.style.display = "none";
  uploadingContainer.style.display = "block";
  uploadedContainer.style.display = "none";
  document.body.style.overflow = "auto";
});

uploadedFilesContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    if (askBeforeDeleting.checked) {
      if (!confirm("Are you sure you want to delete this file?")) {
        return;
      }
    }

    const files = localStorage.getItem("files")
      ? JSON.parse(localStorage.getItem("files"))
      : [];

    const fileUrl = e.target.getAttribute("file-url");
    const index = files.findIndex((file) => file.url === fileUrl);
    files.splice(index, 1);
    localStorage.setItem("files", JSON.stringify(files));
    updateUploads();
    deleteFile(fileUrl);
  } else if (e.target.classList.contains("copy")) {
    const fileUrl = e.target.getAttribute("file-url");
    copyToClipboard(fileUrl, e.target);
  }
});

askBeforeDeleting.addEventListener("click", () => {
  if (askBeforeDeleting.checked) {
    localStorage.setItem("askBeforeDeleting", true);
  } else {
    localStorage.setItem("askBeforeDeleting", false);
  }
});

showQuickMenu.addEventListener("click", () => {
  if (showQuickMenu.checked) {
    localStorage.setItem("showQuickMenu", true);
  } else {
    localStorage.setItem("showQuickMenu", false);
  }
});

// Arrow functions

const getTemplate = (file) => {
  const template = `
    <div class="flex items-center border-b px-6 py-3">
        <div class="items-center whitespace-nowrap">
            <p class="font-medium">${
              file.getName().length > 20
                ? file.getName().substring(0, 17) + "..."
                : file.getName()
            }</p>
            <p class="text-gray-500 text-xs mt-1">(${file.getDate()})</p>
        </div>
        <div class="w-full px-6 text-sm text-gray-400 text-center">
            <a target="_blank" href="${file.getUrl()}">${
    file.getUrl().substring(0, 50) + "..."
  }</a>
        </div>
        <div class="whitespace-nowrap flex items-center cursor-pointer">
            <img src="./icons/copy.png" file-url="${file.getUrl()}" class="w-5 h-5 mr-4 copy" alt="">
            <img src="./icons/delete.png" file-url="${file.getUrl()}" class="w-5 h-5 mr-3 delete" alt="">
        </div>
    </div>`;

  return template;
};

const saveFileToLocalStorage = (file) => {
  const files = localStorage.getItem("files")
    ? JSON.parse(localStorage.getItem("files"))
    : [];

  files.push(file);
  localStorage.setItem("files", JSON.stringify(files));
  updateUploads();
};

const updateUploads = () => {
  const files = localStorage.getItem("files")
    ? JSON.parse(localStorage.getItem("files"))
    : [];

  if (files.length > 0) {
    uploadedFilesContainer.innerHTML = "";
    uploadedFilesContainerEmpty.style.display = "none";
    files.forEach((file) => {
      uploadedFilesContainer.innerHTML += getTemplate(
        new File(file.name, file.url, file.date)
      );
    });
  } else {
    uploadedFilesContainer.innerHTML = "";
    uploadedFilesContainerEmpty.style.display = "flex";
  }
};

const deleteFile = (fileUrl) => {
  const fileName = fileUrl.split("/")[fileUrl.split("/").length - 1];
  axios.post("/delete", JSON.stringify({ name: fileName }), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
};

const copyToClipboard = (fileUrl, img) => {
  navigator.clipboard.writeText(fileUrl).then(function () {
    img.src = "./icons/copied.png";
    setTimeout(() => {
      img.src = "./icons/copy.png";
    }, 3000);
  });
};

// Window onload

window.onload = () => {
  const files = localStorage.getItem("files")
    ? JSON.parse(localStorage.getItem("files"))
    : [];

  if (files.length > 0) {
    uploadedFilesContainer.innerHTML = "";
    uploadedFilesContainerEmpty.style.display = "none";
    files.forEach((file) => {
      uploadedFilesContainer.innerHTML += getTemplate(
        new File(file.name, file.url, file.date)
      );
    });
  } else {
    uploadedFilesContainer.innerHTML = "";
    uploadedFilesContainerEmpty.style.display = "flex";
  }

  askBeforeDeleting.checked = localStorage.getItem("askBeforeDeleting")
    ? localStorage.getItem("askBeforeDeleting") == "true"
      ? true
      : false
    : true;
  showQuickMenu.checked = localStorage.getItem("showQuickMenu")
    ? localStorage.getItem("showQuickMenu") == "true"
      ? true
      : false
    : true;
};

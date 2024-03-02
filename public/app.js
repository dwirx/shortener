document.addEventListener("DOMContentLoaded", function () {
  const serverUrl = window.location.origin;
  const vercelJsonUrl = `${serverUrl}/data/vercel.json`; // Menggunakan path dengan folder "data"

  fetch(vercelJsonUrl)
    .then((response) => response.json())
    .then((data) => {
      const linkList = document.getElementById("linkList");
      const searchInput = document.getElementById("searchInput");
      const searchButton = document.getElementById("searchButton");

      searchButton.addEventListener("click", function () {
        searchLinks(linkList, searchInput.value.trim());
      });

      searchInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          searchLinks(linkList, searchInput.value.trim());
        }
      });

      data.redirects.forEach((redirect) => {
        const listItem = document.createElement("li");
        listItem.classList.add("list-group-item");

        const linkContainer = document.createElement("div");
        linkContainer.classList.add(
          "d-flex",
          "flex-column",
          "align-items-start",
        );

        // Display title above the link
        if (redirect.title) {
          const titleSpan = document.createElement("span");
          titleSpan.textContent = `Title: ${redirect.title}`;
          titleSpan.classList.add("title");
          linkContainer.appendChild(titleSpan);
        }

        // Display description above the link
        if (redirect.description) {
          const descriptionSpan = document.createElement("span");
          descriptionSpan.textContent = `Description: ${redirect.description}`;
          descriptionSpan.classList.add("description");
          linkContainer.appendChild(descriptionSpan);
        }

        const link = document.createElement("a");
        link.href = redirect.destination;
        link.target = "_blank";
        link.textContent = `${serverUrl}/${redirect.source}`;
        link.classList.add("link");

        const copyButton = document.createElement("button");
        copyButton.textContent = "Copy";
        copyButton.classList.add("btn", "btn-primary", "btn-sm", "mt-2");
        copyButton.addEventListener("click", function () {
          const dummy = document.createElement("textarea");
          document.body.appendChild(dummy);
          dummy.value = `${serverUrl}/${redirect.source}`;
          dummy.select();
          document.execCommand("copy");
          document.body.removeChild(dummy);
          alert("Link copied to clipboard!");
        });

        linkContainer.appendChild(link);
        linkContainer.appendChild(copyButton);

        listItem.appendChild(linkContainer);
        linkList.appendChild(listItem);
      });
    })
    .catch((error) => console.error("Error fetching data:", error));
});

function searchLinks(linkList, searchQuery) {
  const items = linkList.getElementsByTagName("li");

  for (let i = 0; i < items.length; i++) {
    const itemText = items[i].textContent.toLowerCase();

    if (itemText.includes(searchQuery.toLowerCase())) {
      items[i].style.display = "";
    } else {
      items[i].style.display = "none";
    }
  }
}

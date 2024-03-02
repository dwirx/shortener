document.addEventListener("DOMContentLoaded", function () {
    const serverUrl = window.location.origin;
    const vercelJsonUrl = `${serverUrl}/vercel.json`;

    fetch(vercelJsonUrl)
        .then(response => response.json())
        .then(data => {
            const linkList = document.getElementById('linkList');
            const searchInput = document.getElementById('searchInput');
            const searchButton = document.getElementById('searchButton');

            searchButton.addEventListener('click', function () {
                searchLinks(linkList, searchInput.value.trim());
            });

            searchInput.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    searchLinks(linkList, searchInput.value.trim());
                }
            });

            data.redirects.forEach(redirect => {
                const listItem = document.createElement('li');
                listItem.classList.add('list-group-item');

                const linkContainer = document.createElement('div');
                linkContainer.classList.add('d-flex', 'justify-content-between', 'align-items-center');

                const link = document.createElement('a');
                link.href = redirect.destination;
                link.target = '_blank';
                link.textContent = `${serverUrl}/${redirect.source}`;
                link.classList.add('link');

                const copyButton = document.createElement('button');
                copyButton.textContent = 'Copy';
                copyButton.classList.add('btn', 'btn-primary', 'btn-sm');
                copyButton.addEventListener('click', function () {
                    const dummy = document.createElement('textarea');
                    document.body.appendChild(dummy);
                    dummy.value = `${serverUrl}/${redirect.source}`;
                    dummy.select();
                    document.execCommand('copy');
                    document.body.removeChild(dummy);
                    alert('Link copied to clipboard!');
                });

                linkContainer.appendChild(link);
                linkContainer.appendChild(copyButton);

                listItem.appendChild(linkContainer);
                linkList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});

function searchLinks(linkList, searchQuery) {
    const links = linkList.getElementsByTagName('a');
    for (let i = 0; i < links.length; i++) {
        const linkText = links[i].textContent.toLowerCase();
        if (linkText.includes(searchQuery.toLowerCase())) {
            links[i].parentElement.parentElement.style.display = '';
        } else {
            links[i].parentElement.parentElement.style.display = 'none';
        }
    }
}

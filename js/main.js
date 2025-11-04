//global vars
const container = document.querySelector('#thumb-wrapper');

// get current and last year
let currentyear = 2025;
// let currentyear = new Date().getFullYear();
// let lastYear = currentyear - 1;

// Global variable to store the JSON data
let jsonData = {};

// Fetch the JSON file
fetch('js/repos.json')
    .then(response => response.json())
    .then(data => {
        // Store the parsed data in the global variable
        jsonData = data;

        // Initialize thumbnails with the default year (e.g., the first year in the JSON data)
        //const defaultYear = Object.keys(jsonData)[0];
        updateThumbnails(currentyear);

}).catch(error => {
        console.error('Error fetching the JSON file:', error);
});

// Function to get URLs for a specific year
function getUrlsForYear(year) {
    // Find the year object in the data
    const yearData = jsonData.find(item => item.year === year);
    if (yearData) {
        // Extract the URLs where active is true
        return yearData.urls
            .filter(urlObj => urlObj.active) // Filter URLs based on active property
            .map(urlObj => urlObj.url); // Map to URLs
    } else {
        console.log(`Year ${year} not found in the data.`);
        return [];
    }
}

// check which radiobutton is active in filter-year
document.querySelector("#filter-year").addEventListener("change", function() {
    const radios = document.querySelectorAll("#filter-year input[type=radio]:checked");
   
    for (let i = 0; i < radios.length; i++) {
        year = radios[i].value;
        
        // year cant be a string
        year = parseInt(year);

        updateThumbnails(year);

    }
});

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function stringToHTML (text) {
	let parser = new DOMParser();
	let doc = parser.parseFromString(text, 'text/html');
    return doc.head;
}

async function updateThumbnails(year) {
    // remove old stuff when calling update first
    document.querySelectorAll('.thumb-cont-first, .thumb-cont-rest, #student-list ul, .image-wrap').forEach(element => {
        if (element.classList.contains('image-wrap')) {
            element.remove();
        } else {
            element.innerHTML = '';
        }
    });

    // reset the search input and the cat checkboxes
    document.querySelector("#search-btn").value = "";
    document.querySelectorAll("#filter-cat input[type=checkbox]:checked").forEach(checkbox => {
        checkbox.checked = false;
    });

    
    // lets count thumbs
    let i = 0;

    // Get URLs for the selected year
    const urls = getUrlsForYear(year);

    for (let repo of urls) {
        
        let promise;
        let data;
        try {
            promise = await fetch(repo);
            data = await promise.text();
            data = stringToHTML(data);
        } catch (error) {
            //skip this repo, don't show students that didn't submit
            continue;
        }
        
        // build loop vars
        let html = data;

        const urlArticle = html.querySelector('meta[name="twitter:article:url"]')?.getAttribute("content") || "#";
        const category = html.querySelector('meta[name="twitter:category"]')?.getAttribute("content") || "Geen categorie";
        const creator = html.querySelector('meta[name="twitter:creator"]')?.getAttribute("content") || "Geen naam";
        const title = html.querySelector('meta[name="twitter:title"]')?.getAttribute("content") || "";
        const rndImage = `https://generative-placeholders.glitch.me/image?width=900&height=900&style=cellular-automata&cells=${randomIntFromInterval(20, 60)}`;
        let image = html.querySelector('meta[name="twitter:image"]')?.getAttribute("content") || rndImage;
        if (image.includes("[[")) image = rndImage;
        
        // //img
        const img = document.createElement("img");
        img.alt = "";
        img.src = "";

        img.setAttribute("src", image);
        // give img the title as alt text, when no title is available, give it the url
        img.setAttribute("alt", title || "CMD student werk");
        // if image is not found, use placeholder
        img.onerror = function () {
            this.classList.add("img-not-found");
            this.onerror = null;
            this.src = rndImage;
        }

        // Remove occurrences of [[ and ]] from the category
        let modifiedCategory = category.replace(/\[\[|\]\]/g, "");


        // // h4 category
        const h4 = document.createElement("h4");
        h4.innerText = modifiedCategory;

        // // h3 article title
        const h3 = document.createElement("h3");

        // Remove occurrences of [[ and ]] from the title
        let modifiedTitle = title.replace(/\[\[|\]\]/g, "");


        h3.innerText = modifiedTitle;
        // add 3 dots in text when title is longer than 110 characters   
        if (h3.innerText.length > 110) {
            h3.innerText = h3.innerText.substring(0, 110) + "...";
        }

        // Remove occurrences of [[ and ]] from the creator
        let modifiedCreator = creator.replace(/\[\[|\]\]/g, "");


        // // student naam
        const p = document.createElement("p");
        p.innerText = modifiedCreator;

        // place all creator names inside the li of #classes
        const li = document.createElement("li");
        li.innerText = modifiedCreator;

        if (creator != "[[naam]]" && creator != "Geen naam"){
            document.querySelector("#student-list ul").appendChild(li);
            // add class to li's "visible"
            li.classList.add("visible");


             // category check
            if (modifiedCategory.toLowerCase() == "kunst") li.setAttribute("data-cat", "art");
            if (modifiedCategory.toLowerCase() == "technologie") li.setAttribute("data-cat", "tech");
            if (modifiedCategory.toLowerCase() == "ontwerp") li.setAttribute("data-cat", "design");
            if (modifiedCategory.toLowerCase() == "ethiek") li.setAttribute("data-cat", "eth");


            // place the text inside li in a an a and add the urlArticle as href
            li.innerHTML = `<a href="${urlArticle}">${creator}</a>`;
        }


        // arrange names in #classes in alphabetical order
        const ul = document.querySelector("#student-list ul");
        const items = ul.querySelectorAll("li");
        const sorted = Array.from(items).sort((a, b) => a.textContent.localeCompare(b.textContent));
        ul.innerHTML = "";
        ul.append(...sorted);

        // build thumb nodes

        const thumb = document.createElement("a");
        thumb.setAttribute("href", urlArticle);
        thumb.classList.add("thumb");
        thumb.appendChild(img);
        thumb.appendChild(h4);
        thumb.appendChild(h3);
        thumb.appendChild(p);

        // category check
        if (category.toLowerCase() == "kunst") h4.parentElement.classList.add("art");
        if (category.toLowerCase() == "technologie") h4.parentElement.classList.add("tech");
        if (category.toLowerCase() == "ontwerp") h4.parentElement.classList.add("design");
        if (category.toLowerCase() == "ethiek") h4.parentElement.classList.add("eth");


        // if the href of the thumb is a "#" the prevent default link behaviour
        if (thumb.getAttribute("href") == "#") {
            thumb.addEventListener('click', function (e) {
                e.preventDefault();
            });
        }

        // append the first 8 thumbs to .thumb-cont-first
        if (creator != "[[naam]]" && creator != "Geen naam"){
            if (i < 8) {
                document.querySelector(".thumb-cont-first").appendChild(thumb);
            } else {
                document.querySelector(".thumb-cont-rest").appendChild(thumb);
            }
        }   


        // after the 3rd thumb, add div with the class extra (for text item)
        if (i === 2) {
            const extra = document.createElement("div");
            extra.classList.add("extra");
            extra.classList.add("thumb");
            const thumbCont = document.querySelector(".thumb-cont");
            thumbCont.appendChild(extra);

            // add 5 different spans with class and text
            const span1 = document.createElement("span");
            span1.innerText = "Design Research";

            const span2 = document.createElement("span");
            span2.innerText = "Writting Skills";


            const span3 = document.createElement("span");
            span3.innerText = "Photography";


            const span4 = document.createElement("span");
            span4.innerText = "Visual Design";


            const span5 = document.createElement("span");
            span5.innerText = "Multimedia & Technology";

            extra.appendChild(span1);
            extra.appendChild(span2);
            extra.appendChild(span3);
            extra.appendChild(span4);
            extra.appendChild(span5);
        }


        // //  when more-btn is clicked append 9 more thumb
        // document.querySelector("#more-btn").addEventListener("click", function() {
        //     const thumbCont = document.querySelector(".thumb-cont:last-child");
        //     thumbCont.appendChild(thumb);
        // }
        // )
        i++;
    }

    // loop trough all divs with the class thumb-cont, only after the first thumb-cont add a div
    const thumbConts = document.querySelectorAll(".thumb-cont");
    for (let i = 0; i < thumbConts.length; i++) {


        if (i == 0) {

            const fullWrap = document.createElement("div");
            fullWrap.classList.add("image-wrap");
            thumbConts[i].after(fullWrap);
            //add extra div inside fullWrap named overlay
            const overlay = document.createElement("div");
            overlay.classList.add("overlay");
            fullWrap.appendChild(overlay);

            // // give image-wrap a random background image from generative placeholders
            // const rndInt = randomIntFromInterval(20, 60)
            // fullWrap.style.backgroundImage = `url(https://generative-placeholders.glitch.me/image?width=900&height=900&style=cellular-automata&cells=${rndInt})`;

        }
    }

    // when user is typing in search-btn to filter the names in student-list
    const searchBtn = document.querySelector("#search-btn");
    searchBtn.addEventListener("keyup", function () {
        const filter = searchBtn.value.toUpperCase();
        const li = document.querySelector("#student-list ul").getElementsByTagName("li");

        for (let i = 0; i < li.length; i++) {
            const txtValue = li[i].textContent || li[i].innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {

                // add class to li when it is visible
                li[i].classList.add("visible");

                // add class to thumb when it is visible

            } else {

                // remove class from li when it is not visible
                li[i].classList.remove("visible");
   

            }
        }

        // if input has no value, show all li's
        if (searchBtn.value == "") {
            for (let i = 0; i < li.length; i++) {
                li[i].classList.add("visible");
            }
        }
    });

    // when a checkbox in #filter-cat is checked compare the value of the checked checkbox with one of the classes in all the .thumb. Only show .thumb's that have the same class as the checked checkbox
    const filter = document.querySelector("#filter-cat");
    filter.addEventListener("change", function () {
        const checkboxes = document.querySelectorAll("#filter-cat input[type=checkbox]:checked");
        const thumbs = document.querySelectorAll(".thumb");
        for (let i = 0; i < thumbs.length; i++) {
            thumbs[i].classList.add("hidden");
            for (let j = 0; j < checkboxes.length; j++) {
                if (thumbs[i].classList.contains(checkboxes[j].value)) {
                    thumbs[i].classList.remove("hidden");
                }
            }
        }
    }
    );
    // if no checkbox is checked, show all .thumb's
    filter.addEventListener("change", function () {
        const checkboxes = document.querySelectorAll("#filter-cat input[type=checkbox]:checked");
        const thumbs = document.querySelectorAll(".thumb");
        if (checkboxes.length == 0) {
            for (let i = 0; i < thumbs.length; i++) {
                thumbs[i].classList.remove("hidden");
            }
        }
    }
    );




} // end updateThumbnails



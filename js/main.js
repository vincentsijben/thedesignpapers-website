
        //example array student work urls
        const urls = [
            "https://mia-mmt1-2122.github.io/city-pop-milavberkel/",
            "https://jsonplaceholder.typicode.com/comments/2",
            "https://jsonplaceholder.typicode.com/comments/3",
            "https://mia-mmt4-2122.github.io/sharing-like-a-pro-Juulkeuuuh/",
            "https://vincentsijben.github.io/will-wacky-website/",
            "https://mia-mmt1-2122.github.io/city-pop-milavberkel/",
            "https://jsonplaceholder.typicode.com/comments/2",
            "https://jsonplaceholder.typicode.com/comments/3",
            "https://mia-mmt4-2122.github.io/sharing-like-a-pro-Juulkeuuuh/",
            "https://vincentsijben.github.io/will-wacky-website/",
            "https://mia-mmt1-2122.github.io/city-pop-milavberkel/",
            "https://jsonplaceholder.typicode.com/comments/2",
            "https://jsonplaceholder.typicode.com/comments/3",
            "https://mia-mmt4-2122.github.io/sharing-like-a-pro-Juulkeuuuh/",
            "https://vincentsijben.github.io/will-wacky-website/", 
            "https://mia-mmt4-2122.github.io/sharing-like-a-pro-Juulkeuuuh/",
            "https://vincentsijben.github.io/will-wacky-website/",
            "https://mia-mmt1-2122.github.io/city-pop-milavberkel/",
            "https://jsonplaceholder.typicode.com/comments/2",
            "https://jsonplaceholder.typicode.com/comments/3",
            "https://mia-mmt4-2122.github.io/sharing-like-a-pro-Juulkeuuuh/",
            "https://vincentsijben.github.io/will-wacky-website/"
            ];
        
            //global vars
            const container = document.querySelector('#thumb-wrapper');
        
            (async () => {
                // await all urls from array
                const response = await Promise.all(urls.map(u => fetch(u)))
            
                // loop trough response with a maximum of 18 items
    
                for (let i = 0; i < 18; i++) {
                    // random function mix max
                    function randomIntFromInterval(min, max) { 
                        return Math.floor(Math.random() * (max - min + 1) + min)
                    }
    
                    // build loop vars
                    const text = await response[i].text();
                    const html = document.createElement("html");
                    html.innerHTML = text;
                    
                    const url = html.querySelector('meta[name="twitter:site"]')?.getAttribute("content") || "";
                    const urlArticle = html.querySelector('meta[name="twitter:article:url"]')?.getAttribute("content") || "#";
                    const category = html.querySelector('meta[name="twitter:category"]')?.getAttribute("content") || "Geen categorie";
                    const creator = html.querySelector('meta[name="twitter:creator"]')?.getAttribute("content") || "Geen naam";
                    const title = html.querySelector('meta[name="twitter:title"]')?.getAttribute("content") || "";
                    const rndInt = randomIntFromInterval(20, 60)
                    const image = html.querySelector('meta[name="twitter:image"]')?.getAttribute("content") || `https://generative-placeholders.glitch.me/image?width=900&height=900&style=cellular-automata&cells=${rndInt}`;
                    
                    // //img
                    const img = document.createElement("img");
                    img.setAttribute("src",image);
                    // give img the title as alt text, when no title is available, give it the url
                    img.setAttribute("alt", title || "CMD student werk");
                    // if image is not found, use placeholder
                    img.onerror = function() {
                        this.onerror=null;
                        this.src = 'https://generative-placeholders.glitch.me/image?width=900&height=900&style=cellular-automata&cells=${rndInt}';
                    }
    
                    // // h4 category
                    const h4 = document.createElement("h4");
                    h4.innerText = category;
                    // check if innerText is "tech", if so, add class to parent
                    
                   
        
                    // // h3 article title
                    const h3 = document.createElement("h3");
                    h3.innerText = title;
                    // add 3 dots in text when title is longer than 110 characters   
                    if (h3.innerText.length > 110) {
                        h3.innerText = h3.innerText.substring(0, 110) + "...";
                    }
        
                    // // student naam
                    const p = document.createElement("p");
                    p.innerText = creator;

                    // place all creator names inside the li of #classes
                    const li = document.createElement("li");
                    li.innerText = creator;
                    document.querySelector("#classes").appendChild(li);
                    // add class to li's "visible"
                    li.classList.add("visible");
                    

                    // arrange names in #classes in alphabetical order
                    const ul = document.querySelector("#classes");
                    const items = ul.querySelectorAll("li");
                    const sorted = Array.from(items).sort((a, b) => a.textContent.localeCompare(b.textContent));
                    ul.innerHTML = "";
                    ul.append(...sorted);
                   


        
                    // // url article
                    // const a = document.createElement("a");
                    // a.setAttribute("href", urlArticle);
                    // a.innerText = creator;
                    // thumb.appendChild(a);
                    // container.append(thumb);
    
                    // build thumb nodes 
                    const thumb = document.createElement("a");
                    thumb.setAttribute("href", urlArticle);
                    thumb.classList.add("thumb");
                    thumb.appendChild(img);
                    thumb.appendChild(h4);
                    thumb.appendChild(h3);
                    thumb.appendChild(p);

                    // category check
                    const categoryCheck = h4.innerText;
                    if (categoryCheck === "tech" || categoryCheck === "Tech" || categoryCheck === "TECH") {
                        h4.parentElement.classList.add("tech");
                    }
                    if (categoryCheck === "art" || categoryCheck === "Art" || categoryCheck === "ART") {
                        h4.parentElement.classList.add("art");
                    }
                    if (categoryCheck === "design" || categoryCheck === "Design" || categoryCheck === "DESIGN") {
                        h4.parentElement.classList.add("design");
                    }
                    if (categoryCheck === "eth" || categoryCheck === "Ethiek" || categoryCheck === "ethics" || categoryCheck === "Ethics" || categoryCheck === "ETH" || categoryCheck === "ETHIEK" || categoryCheck === "ETHICS") {
                        h4.parentElement.classList.add("eth");
                    }

    
                    // if the href of the thumb is a "#" the prevent default link behaviour
                    if (thumb.getAttribute("href") == "#") {
                        thumb.addEventListener('click', function(e) {
                            e.preventDefault();
                        });
                    }
           
                    // wrap every 9 thumb inside thumb-cont
                    if (i % 9 === 0) {
                        const thumbCont = document.createElement("div");
                        thumbCont.classList.add("thumb-cont");
                        thumbCont.classList.add("container-grid");
                        thumbCont.classList.add("container-flex");
                        thumbCont.appendChild(thumb);
                        container.appendChild(thumbCont);
                    } else {
                        const thumbCont = document.querySelector(".thumb-cont:last-child");
                        thumbCont.appendChild(thumb);
                    }
    
    
    
                        
    
    
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

                // when user is typing in search-btn to filter the names in #classes
                const searchBtn = document.querySelector("#search-btn");
                searchBtn.addEventListener("keyup", function() {
                    const filter = searchBtn.value.toUpperCase();
                    const li = document.querySelector("#classes").getElementsByTagName("li");
                    for (let i = 0; i < li.length; i++) {
                        const txtValue = li[i].textContent || li[i].innerText;
                        if (txtValue.toUpperCase().indexOf(filter) > -1) {
                            
                            // add class to li when it is visible
                            li[i].classList.add("visible");
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

    
              
                
    
               
    
                
    
    
               
        
            })()
    
           
    
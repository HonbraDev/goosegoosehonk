if (typeof getParam("q") === "string" && getParam("q")) {
    document.getElementById("search").value = getParam("q");
    searchboxsearch();
}

function searchboxsearch() {
    search(document.getElementById("search").value);
    document.querySelector(".main-wrapper").classList.add("top");
}

async function search(q) {
    document.getElementById("results").innerHTML = "";
    document.getElementById("answer").innerHTML = "";
    document.getElementById("answer").classList.remove("show");
    setTimeout(() => {
        document.querySelector(".results").classList.add("show");
    }, 500);
    if (typeof q === "string" && q) {
        history.pushState("", "", `?q=${encodeURI(q)}`);
        (async() => {
            var answer = await getInstant(q);
            console.log(answer);
            if (answer.Type) {
                document.getElementById("answer").innerHTML = `
                    <img src="${answer.Image}" class="image" draggable="false" />
                    <div class="title">${answer.Heading}</div>
                    <div class="entity">${answer.Entity}</div>
                    <div class="description">${answer.Abstract}</div>
                    <a class="waves-effect more" href="${answer.AbstractURL}">More at ${answer.AbstractSource}</a>
                `;
                document.getElementById("answer").classList.add("show");
            }
        })();
        (async() => {
            var results = await fetch(`/api/search?q=${encodeURI(q)}`).then(res => res.json());
            var html = "";
            results.forEach(result => {
                html += `
                <a class="waves-effect result" href="${result.url}" draggable="false">
                    <div class="title">${result.title}</div>
                    <div class="url">${result.url}</div>
                    <div class="snippet">${result.snippet}</div>
                </a>
                `;
            });
            document.getElementById("results").innerHTML = html;
        })();
    }
}

async function getInstant(q) {
    if (typeof q === "string" && q) {
        var random = makeString(10);
        var text = await fetch(`https://api.duckduckgo.com/?q=${encodeURI(q)}&format=json&t=GooseGooseHonk&callback=${random}`).then(res => res.text());
        text = text.slice(11);
        text = text.substring(0, text.length - 2);
        return JSON.parse(text);
    }
}

function makeString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function getParam(p) {
    return new URL(location.href).searchParams.get(p);
}
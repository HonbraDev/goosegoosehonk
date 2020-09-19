const express = require("express"),
    fs = require("fs"),
    fetch = require("node-fetch"),
    cors = require("cors"),
    app = express(),
    { JSDOM } = require("jsdom");

var port = 80;

app.use(cors());
app.use(express.static("public"));

app.get("/api/suggestions", async(req, res) => {
    if (typeof req.query.q === "string") {
        res.send(
            await fetch(`https://duckduckgo.com/ac/?q=${req.query.q}`, {
                headers: {
                    "accept": "application/json, text/javascript, */*; q=0.01",
                    "accept-encoding": "gzip, deflate, br",
                    "accept-language": req.headers["accept-language"],
                    "referer": "https://duckduckgo.com/",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "user-agent": req.headers["user-agent"],
                    "x-requested-with": "XMLHttpRequest"
                }
            }).then(res => res.text())
        );
    } else {
        res.send(JSON.stringify({
            error: "The requested query is not a string."
        }));
    }
});

app.get("/api/search", async(req, res) => {
    console.log(req.headers["accept-language"]);
    if (typeof req.query.q === "string") {
        var html = await fetch("https://html.duckduckgo.com/html/", {
            method: "POST",
            headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": req.headers["accept-language"],
                "cache-control": "max-age=0",
                "content-length": "11",
                "content-type": "application/x-www-form-urlencoded",
                "origin": "https://html.duckduckgo.com",
                "referer": "https://html.duckduckgo.com/",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                "user-agent": req.headers["user-agent"]
            },
            body: `q=${encodeURI(req.query.q)}`
        }).then(res => res.text());

        var resHtml = new JSDOM(html).window.document;

        var results = [];
        resHtml.querySelectorAll(".web-result").forEach(elem => {
            results.push({
                title: elem.querySelector(".result__a").innerHTML,
                url: elem.querySelector(".result__a").href,
                snippet: elem.querySelector(".result__snippet").innerHTML
            });
        });

        res.send(results);

    } else {
        res.send(JSON.stringify({
            error: "The requested query is not a string."
        }));
    }
});

app.listen(port, () => {
    console.log(`App listening on port ${port}.`);
});
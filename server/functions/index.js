const server = require('./server');

const { onRequest } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const logger = require("firebase-functions/logger");
const fetch = require("node-fetch");
const cors = require("cors");

setGlobalOptions({
    region: 'europe-central2'
});

exports.api = onRequest((req, res) => {
    server.emit('request', req, res);
});

exports.fetchAuctionNews = onRequest((req, res) => {
    cors()(req, res, async () => {
        try {
            const NEWS_API_URL = "https://newsapi.org/v2/everything?q=%22auction%22&searchIn=title&sortBy=publishedAt&language=en&pageSize=10&domains=bbc.com,cnn.com,forbes.com,bloomberg.com,reuters.com,nytimes.com,wsj.com,guardian.com,sothebys.com,christies.com,christiantoday.com,robbreport.com&apiKey=712955d977944dffbcf8372294aabaae";

            const response = await fetch(NEWS_API_URL);

            if (response.ok) {
                const data = await response.json();
                res.json(data);
            } else {
                logger.error("Error fetching news:", response.statusText);
                res.status(500).json({ error: "Failed to fetch news" });
            }
        } catch (error) {
            logger.error("Error fetching news:", error);
            res.status(500).json({ error: "Failed to fetch news" });
        }
    });
});
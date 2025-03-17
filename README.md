# BidNBuy Project Documentation

## Project Overview
BidNBuy is a web application where users can create auctions, bid on ongoing auctions, and interact with other users. Each auction has a defined owner who can decide when to close it, and the highest bid at the time of closure determines the winner. Additionally, users can comment on auctions (but not their own), and manage their own auctions through a user profile. Users can view their created auctions and the auctions they have won.

### Key Features:
- **Auction Creation**: Users can create new auctions by providing auction details such as the item description, price, category.
- **Bidding**: Users can place bids on active auctions, with each bid needing to be either higher than the current highest bid or higher than or equal to the starting price.
- **Auction Closure**: The auction owner can close the auction manually, and the highest bidder at that time wins the auction.
- **Commenting**: Users can comment on active auctions they are interested in, but they cannot comment on their own auctions. Comments can be deleted only by the owner of the comment and if the auction is not closed. Auction "Superyacht 150ft" has pre-populated comments.
- **Profile Management**: Users have profiles where they can manage their own auctions, view the auctions they've won, and track their activities.
- **Auction Editing and Deleting**: Auction creators can edit or delete their own auctions, only if they are not closed.
- **Pagination**: Catalog, Search, Profile and Details (comments) pages has pagination. Changing the variable "recordsPerPage" in Catalog.jsx, Search.jsx or Profile.jsx determines how many auctions will be shown per page. On Details Page you will see the newest 3 comments and if you press "Load older comments" 3 more comments will be loaded. If user adds a new comment it will be shown at the top.
- **Search**: Users can search for auctions by Auction Name, Category, Min Start Price, Max Start Price and Status. Search is case insensitive and by partial match, except for min/max start price.

# Project Setup

## Starting the Client
To start the client, navigate to the `client` folder in the terminal and run "npm install", then after the installation of node_modules is ready, run "npm run dev".

## Starting the Server
To start the server, navigate to the `server` folder in the terminal and run "node server.js".

Default credentials, with pre-populated data:

email: "nasko@abv.bg"
password: 123456

email: "pesho@abv.bg"
password: 123456

email: "ivan@abv.bg"
password: 123456
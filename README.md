# BidNBuy Project Documentation

## Project Overview
BidNBuy is a web application where users can create auctions, bid on ongoing auctions, and interact with other users. Each auction has a defined owner who can decide when to close it, and the highest bid at the time of closure determines the winner. Additionally, users can comment on open auctions (but not their own), and manage their own auctions through a user profile. Users can view their created auctions and the auctions they have won.

### Key Features:
- **Auction Creation**: Users can create new auctions by providing auction details such as the item description, price, category.
- **Bidding**: Users can place bids on active auctions, with each bid needing to be either higher than the current highest bid or higher than or equal to the starting price.
- **Auction Closure**: The auction owner can close the auction manually, and the highest bidder at that time wins the auction.
- **Commenting**: Users can comment on active auctions they are interested in, but they cannot comment on their own auctions. Comments can be deleted only by the owner of the comment and if the auction is not closed. Auction "Superyacht 150ft" has pre-populated comments.
- **Profile Management**: Users have profiles where they can manage their own auctions, view the auctions they've won, and track their activities.
- **Auction Editing and Deleting**: Auction creators can edit or delete their own auctions, only if they are not closed.
- **Pagination**: Catalog, Search, Profile and Details (comments) pages has pagination. Changing the variable "recordsPerPage" in Catalog.jsx, Search.jsx or Profile.jsx determines how many auctions will be shown per page. On Details Page you will see the newest 3 comments and if you press "Load older comments" 3 more comments will be loaded. If user adds a new comment it will be shown at the top.
- **Search**: Users can search for auctions by Auction Name, Category, Min Start Price, Max Start Price and Status. I modified the SoftUni Practice Server to make the search case-insensitive and allow partial matches when using '='. The search by min/max start price remains unchanged.

### Project Setup
The project is also deployed at: "https://reactjs-project-bidnbuy.web.app"

- **Starting the Client**
To start the client, navigate to the `client` folder in the terminal and run "npm install", then after the installation of node_modules is ready, run "npm run dev".

- **Starting the Server**
To start the server, navigate to the `server` folder in the terminal and run "node server.js".

Default credentials with pre-populated data, created by normal users for the convenience of the examiners:

email: "nasko@abv.bg"
password: 123456

email: "pesho@abv.bg"
password: 123456

### Project Tests
The project has tests for Register , Login and Home pages. To run the tests, first make sure you have installed all dependencies, then navigate to the `client` folder in the terminal and run "npm test".

- **Register Tests**: If the register is successful it checks if the page will redirect to home page. If the register is not successful it checks if an error message is shown with the exact error message (tests include all possible erros on register: already existing email, invalid email format, invalid phone number, missmatch in password and repeat-password, invalid password).
- **Login Tests**: If the login is successful it checks if the page will redirect to home page. If the login is not successful it checks if an error message is shown with the exact error message.
- **Home Page Tests**: The test checks if all headers are both in the document and visible at the home page, if the main title has the correct font-size, if the button "Explore" is visible and if it redirects successfully to auctions catalog page.
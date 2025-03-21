export const validateCreateEditAuctions = (values) => {
    const imageRegex = /^https?:\/\/.+/;

    if (values.auctionName.length < 2 || values.auctionName.length > 30) {
        return 'Auction Name must be between 2 and 30 characters long!'
    }
    if (values.category.length < 2 || values.category.length > 20) {
        return 'Category must be between 2 and 20 characters long!'
    }
    if (+values.price < 1) {
        return 'Start Price must be minimum 1!'
    }
    if (+values.price > 999999999999) {
        return 'Start Price is too high!'
    }
    if (!imageRegex.test(values.imageUrl)) {
        return 'Please upload a valid image starting with https://'
    }
    if (values.description.length < 10) {
        return 'Description must be at least 10 characters long!'
    }
    if (values.description.length > 3000) {
        return 'Description is too long!';
    }

    return true;
}

export const validateRegisterForm = ({ email, password, rePassword }) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
        return 'Invalid email format!';
    }

    if (password.length < 6) {
        return 'Password must be at least 6 characters long!';
    }

    if (password !== rePassword) {
        return 'Passwords do not match!';
    }

    return true;
}

export const validateBidPrice = (bidPrice, auction) => {

    if (+bidPrice <= 0) {
        return 'The bid price must be positive number!';
    }
    if (+bidPrice <= +auction.bidPrice) {
        return 'The bid price must be higher than the current highest bid!';
    }
    if (+bidPrice < +auction.price) {
        return 'The bid price must be greater than or equal to the starting price!';
    }
    if (+bidPrice > 999999999999) {
        return 'The bid price is too high!';
    }

    return true;
}

export const validateComment = (values) => {

    if (values.comment.length < 1) {
        return 'Comment cannot be empty!';
    }
    if (values.comment.length > 1000) {
        return 'Comment is too long!';
    }

    return true;
}
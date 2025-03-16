export default function validateCreateEditAuctions(values) {
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
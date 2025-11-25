const formatPrice = (price) => {
    if (!price || price === '' || price === null || price === undefined) {
        return 'Out of Stock';
    }
    // Remove any existing $ and spaces, then add $
    const cleanPrice = String(price).replace(/[$\s]/g, '').trim();
    const number = parseFloat(cleanPrice) || 0;
    return `$${number.toFixed(2)}`;
}

module.exports = formatPrice
export const calculateReferencePriceForUser = (products: any) => {
    let min = products[0].price,
        max = products[0].price;

    for (let i = 1; i < products.length; i++) {
        if (products[i].price < products[i - 1].price) {
            min = products[i]?.price;
        }
    }

    for (let i = 1; i < products.length; i++) {
        if (products[i].price < products[i - 1].price) {
            max = products[i - 1]?.price;
        }
    }

    return (min + max) / 2;
};

export const calculatePriceSimilarity = (userPrice: number, productPrice: number) => {
    const similarity = Math.max(0, 1 - Math.abs(userPrice - productPrice) / userPrice);
    return similarity;
};

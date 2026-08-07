const productsDatabase = [

    {
        code: "3250812",
        description: "Σφιγκτήρας 8-12",
        category: "Σφιγκτήρες",
        price: 0.42,
        discount: 0
    },

    {
        code: "32501016",
        description: "Σφιγκτήρας 10-16",
        category: "Σφιγκτήρες",
        price: 0.43,
        discount: 0
    }

];


let customersDatabase =
    JSON.parse(
        localStorage.getItem("customersDatabase")
    ) || [];

function getAllProducts() {

    let savedProducts =
        JSON.parse(
            localStorage.getItem("savedProducts")
        ) || [];


    let allProducts = [
        ...productsDatabase,
        ...savedProducts
    ];


    let uniqueProducts = [];


    allProducts.forEach(product => {

        let exists =
            uniqueProducts.some(item =>
                item.code === product.code
            );


        if (!exists) {

            uniqueProducts.push(product);

        }

    });


    return uniqueProducts;

}

// Easy Order - Products Management


// Αναζήτηση με κωδικό

function findProduct(element) {

    let code = element.value.trim();

    let product = productsDatabase.find(
        item => item.code === code
    );


    if (product) {

        let row = element.closest("tr");


        row.querySelector(".description").value =
            product.description;


        row.querySelector(".price").value =
            Number(product.price).toFixed(2);


        row.querySelector(".discount").value =
            product.discount || "";


        calculateRow(row);

    }

}





// Αναζήτηση με περιγραφή

function searchDescription(element) {

    let text = element.value.toLowerCase();


    let box =
        element.parentElement.querySelector(".suggestions");


    box.innerHTML = "";


    if (text.length < 2) {
        return;
    }



    let results =
        productsDatabase.filter(product =>
            product.description
            .toLowerCase()
            .includes(text)
        );



    results.forEach(product => {


        let option =
            document.createElement("div");


        option.innerText =
            product.description;



        option.onclick = function () {


            let row =
                element.closest("tr");



            element.value =
                product.description;



            row.querySelector(".code").value =
                product.code;



            row.querySelector(".price").value =
                Number(product.price).toFixed(2);


            row.querySelector(".discount").value =
                product.discount || "";



            box.innerHTML = "";


            calculateRow(row);

        };


        box.appendChild(option);


    });

}







// Υπολογισμός γραμμής προϊόντος

function calculateRow(row) {


    let quantity =
        Number(row.querySelector(".quantity").value) || 0;


    let price =
        Number(row.querySelector(".price").value) || 0;


    let discount =
        Number(row.querySelector(".discount").value) || 0;



    let final =
        quantity * price * (1 - discount / 100);



    row.querySelector(".finalPrice").value =
        final.toFixed(2);



    calculateTotal();

}







// Υπολογισμός συνολικού ποσού

function calculateTotal() {


    let total = 0;


    document.querySelectorAll("#products tr")
    .forEach(row => {


        total += Number(
            row.querySelector(".finalPrice").value
        ) || 0;


    });



    document.getElementById("total").innerText =
        total.toFixed(2) + " €";

}







// Προσθήκη νέας γραμμής προϊόντος

function addProduct() {


    let table =
        document.getElementById("products");


    let row =
        table.insertRow();



    row.innerHTML = `

<td>

<input 
type="text"
class="code"
placeholder="Κωδικός"
onblur="findProduct(this)">

</td>


<td>

<input 
type="text"
class="description"
placeholder="Περιγραφή"
oninput="searchDescription(this)">

<div class="suggestions"></div>

</td>


<td>

<input 
type="number"
class="quantity"
value="1"
oninput="calculateRow(this.closest('tr'))">

</td>


<td>

<input 
type="number"
class="price"
placeholder="0.00"
oninput="calculateRow(this.closest('tr'))">

</td>


<td>

<input 
type="number"
class="discount"
placeholder="%"
oninput="calculateRow(this.closest('tr'))">

</td>


<td>

<input 
type="number"
class="finalPrice"
readonly>

</td>

`;

}

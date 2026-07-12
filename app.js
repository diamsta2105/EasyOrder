// Αυτόματη ημερομηνία

window.onload = function () {

    let today = new Date();

    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, "0");
    let day = String(today.getDate()).padStart(2, "0");

    document.getElementById("date").value =
        year + "-" + month + "-" + day;

};




// Αναζήτηση προϊόντος

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
            product.price;


        row.querySelector(".discount").value =
            product.discount;


        calculateRow(row);

    }

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





// Συνολικό ποσό

function calculateTotal() {


    let total = 0;


    let rows =
        document.querySelectorAll("#products tr");



    rows.forEach(function(row) {


        let value =
            Number(
                row.querySelector(".finalPrice").value
            ) || 0;


        total += value;


    });



    document.getElementById("total").innerText =
        total.toFixed(2) + " €";

}





// Προσθήκη προϊόντος

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
placeholder="Περιγραφή">
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

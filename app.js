let currentOrderNumber =
    Number(localStorage.getItem("currentOrderNumber")) || 1;
// Δημιουργία κωδικού παραγγελίας
function createOrderId(customer) {
let today = new Date();

let year = today.getFullYear();

let day = String(today.getDate()).padStart(2, "0");

let month = String(today.getMonth() + 1).padStart(2, "0");


let name = customer
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "-");


return year + "-" + day + month + "-" + name;

}
// Ημερομηνία
window.onload = function () {
let today = new Date();

let year = today.getFullYear();
let month = String(today.getMonth() + 1).padStart(2, "0");
let day = String(today.getDate()).padStart(2, "0");

document.getElementById("date").value =
    year + "-" + month + "-" + day;

};
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


// Υπολογισμός γραμμής

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







// Σύνολο παραγγελίας

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








// Αποθήκευση πρόχειρης παραγγελίας

function saveDraft() {


    let customer =
        document.getElementById("customer").value;



    let order = {


        id:
        createOrderId(customer),


        number:
        currentOrderNumber++,


        date:
        document.getElementById("date").value,


        area:
        document.getElementById("area").value,


        customer:
        customer,


        total:
        document.getElementById("total").innerText,


        status:
        "Πρόχειρη",


        locked:
        false,


        products: []

    };



    document.querySelectorAll("#products tr")
    .forEach(row => {


        order.products.push({

            code:
            row.querySelector(".code").value,


            description:
            row.querySelector(".description").value,


            quantity:
            row.querySelector(".quantity").value,


            price:
            row.querySelector(".price").value,


            discount:
            row.querySelector(".discount").value,


            finalPrice:
            row.querySelector(".finalPrice").value


        });


    });



    let drafts =
        JSON.parse(
            localStorage.getItem("draftOrders")
        ) || [];



    drafts.push(order);



    localStorage.setItem(
        "draftOrders",
        JSON.stringify(drafts)
    );


    localStorage.setItem(
        "currentOrderNumber",
        currentOrderNumber
    );



    alert(
        "Η πρόχειρη παραγγελία αποθηκεύτηκε"
    );

}


// Εμφάνιση παραγγελιών

function showDrafts() {


    let box =
        document.getElementById("draftList");


    let drafts =
        JSON.parse(
            localStorage.getItem("draftOrders")
        ) || [];



    box.innerHTML = "";



    drafts.forEach((order, index) => {


        let item =
        document.createElement("div");


        item.style.border = "1px solid #ccc";
        item.style.padding = "10px";
        item.style.marginTop = "10px";
        item.style.borderRadius = "8px";


        item.innerHTML = `

<b>${order.id}</b><br>

Πελάτης:
${order.customer}<br>

Σύνολο:
${order.total}<br>

Κατάσταση:
${order.status}<br><br>


<button onclick="openOrder(${index})">
✏️ Άνοιγμα
</button>


<button onclick="deleteOrder(${index})">
🗑 Διαγραφή
</button>

`;



        box.appendChild(item);


    });


}







// Άνοιγμα αποθηκευμένης παραγγελίας

function openOrder(index) {


    let drafts =
        JSON.parse(
            localStorage.getItem("draftOrders")
        ) || [];



    let order =
        drafts[index];



    if (!order) {
        return;
    }



    document.getElementById("date").value =
        order.date;



    document.getElementById("area").value =
        order.area;



    document.getElementById("customer").value =
        order.customer;



    let table =
        document.getElementById("products");


    table.innerHTML = "";



    order.products.forEach(product => {


        let row =
            table.insertRow();



        row.innerHTML = `

<td>

<input 
type="text"
class="code"
value="${product.code}"
onblur="findProduct(this)">

</td>


<td>

<input
type="text"
class="description"
value="${product.description}"
oninput="searchDescription(this)">

<div class="suggestions"></div>

</td>


<td>

<input
type="number"
class="quantity"
value="${product.quantity}"
oninput="calculateRow(this.closest('tr'))">

</td>


<td>

<input
type="number"
class="price"
value="${product.price}"
oninput="calculateRow(this.closest('tr'))">

</td>


<td>

<input
type="number"
class="discount"
value="${product.discount}"
oninput="calculateRow(this.closest('tr'))">

</td>


<td>

<input
type="number"
class="finalPrice"
value="${product.finalPrice}"
readonly>

</td>

`;



    });



    calculateTotal();



}







// Διαγραφή παραγγελίας

function deleteOrder(index) {


    let drafts =
        JSON.parse(
            localStorage.getItem("draftOrders")
        ) || [];



    drafts.splice(index, 1);



    localStorage.setItem(
        "draftOrders",
        JSON.stringify(drafts)
    );



    showDrafts();


}

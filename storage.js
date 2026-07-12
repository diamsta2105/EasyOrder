// Easy Order - Storage Management


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

// Easy Order - Storage Management


let editingOrderIndex = null;





// Αποθήκευση πρόχειρης ή αλλαγών

function saveDraft() {


    let customer =
        document.getElementById("customer").value;



    let order = {


        id:
        createOrderId(customer),


        number:
        currentOrderNumber,


        date:
        document.getElementById("date").value,


        area:
        document.getElementById("area").value,


        customer:
        customer,

        notes:
document.getElementById("notes").value,
    

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



    if (editingOrderIndex !== null) {


        order.number =
            drafts[editingOrderIndex].number;


        order.id =
            drafts[editingOrderIndex].id;


        order.status =
            drafts[editingOrderIndex].status;


        order.locked =
            drafts[editingOrderIndex].locked;


        drafts[editingOrderIndex] =
            order;


        alert(
            "Οι αλλαγές αποθηκεύτηκαν"
        );


    } else {


        order.number =
            currentOrderNumber++;


        drafts.push(order);



        localStorage.setItem(
            "currentOrderNumber",
            currentOrderNumber
        );


        alert(
            "Η πρόχειρη παραγγελία αποθηκεύτηκε"
        );

    }



    localStorage.setItem(
        "draftOrders",
        JSON.stringify(drafts)
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



        let lockText =
            order.locked
            ? "🔒 Κλειδωμένη"
            : "🔓 Ξεκλείδωτη";



        item.innerHTML = `

<b>${order.id}</b><br>

Πελάτης:
${order.customer}<br>

Σύνολο:
${order.total}<br>

Κατάσταση:
${order.status}<br>

${lockText}

<br><br>


<button onclick="openOrder(${index})">
✏️ Άνοιγμα
</button>


<button onclick="finalizeOrder(${index})">
✅ Οριστικοποίηση
</button>


<button onclick="lockOrder(${index})">
🔒 Κλείδωμα
</button>


<button onclick="unlockOrder(${index})">
🔓 Ξεκλείδωμα
</button>


<button onclick="downloadPDFFromIndex(${index})">
📄 Δημιουργία PDF
</button>


<button onclick="deleteOrder(${index})">
🗑 Διαγραφή
</button>

`;



        box.appendChild(item);


    });


}







// Άνοιγμα παραγγελίας

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



    editingOrderIndex = index;



    document.getElementById("date").value =
        order.date;



    document.getElementById("area").value =
        order.area;



    document.getElementById("customer").value =
        order.customer;

    document.getElementById("notes").value =
    order.notes || "";



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

// Easy Order - Storage Management


let editingOrderIndex = null;

let viewOnlyOrder = false;





// Κλείδωμα / ξεκλείδωμα φόρμας

function setFormLocked(state) {


    let fields =
    document.querySelectorAll(
        "#date, #area, #customer, #notes, #products input"
    );



    fields.forEach(field => {

        field.readOnly = state;

    });



    // Κλείδωμα κουμπιού προσθήκης προϊόντος

    let addButton =
    document.querySelector(
        'button[onclick="addProduct()"]'
    );



    if (addButton) {

        addButton.disabled = state;

    }


}







// Αποθήκευση πρόχειρης ή αλλαγών

function saveDraft() {


    let customer =
    document.getElementById("customer").value.trim();



    let drafts =
    JSON.parse(
        localStorage.getItem("draftOrders")
    ) || [];





    if (editingOrderIndex !== null) {


        let oldOrder =
        drafts[editingOrderIndex];



        if (oldOrder && oldOrder.locked) {


            alert(
                "Η παραγγελία είναι κλειδωμένη και δεν μπορεί να αλλάξει."
            );


         

            return;

        }


    }





    let order = {


        id:
        createOrderId(customer),


        number:
        currentOrderNumber,


        date:
        document.getElementById("date").value,


        area:
        document.getElementById("area").value.trim(),


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


        let code =
        row.querySelector(".code")?.value || "";


        let description =
        row.querySelector(".description")?.value || "";



        if (
            code.trim() !== "" ||
            description.trim() !== ""
        ) {


            order.products.push({

                code:
                code,


                description:
                description,


                quantity:
                row.querySelector(".quantity")?.value || "0",


                price:
                row.querySelector(".price")?.value || "0",


                discount:
                row.querySelector(".discount")?.value || "",


                finalPrice:
                row.querySelector(".finalPrice")?.value || "0"

            });


        }


    });





    if (editingOrderIndex !== null) {


        let oldOrder =
        drafts[editingOrderIndex];



        if (!oldOrder) {


            alert(
                "Δεν βρέθηκε η παραγγελία."
            );


            editingOrderIndex = null;


            return;

        }



        order.number =
        oldOrder.number;



        order.id =
        oldOrder.id;



        order.status =
        oldOrder.status;



        order.locked =
        oldOrder.locked;



        drafts[editingOrderIndex] =
        order;



        localStorage.setItem(
            "draftOrders",
            JSON.stringify(drafts)
        );



        alert(
            "Οι αλλαγές αποθηκεύτηκαν."
        );



        return;


    }





    order.number =
    currentOrderNumber++;



    drafts.push(order);



    localStorage.setItem(
        "currentOrderNumber",
        currentOrderNumber
    );



    localStorage.setItem(
        "draftOrders",
        JSON.stringify(drafts)
    );



    alert(
        "Η πρόχειρη παραγγελία αποθηκεύτηκε."
    );


}







// Εμφάνιση παραγγελιών

function showDrafts() {


    let box =
    document.getElementById("draftList");



    if (!box) {

        return;

    }



    let drafts =
    JSON.parse(
        localStorage.getItem("draftOrders")
    ) || [];



    box.innerHTML = "";



    drafts.forEach((order, index) => {


        let item =
        document.createElement("div");



        item.style.border =
        "1px solid #ccc";


        item.style.padding =
        "10px";


        item.style.marginTop =
        "10px";


        item.style.borderRadius =
        "8px";



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



    editingOrderIndex =
    index;



    // Πρώτα ξεκλειδώνουμε τη φόρμα
    // ώστε να μην μείνει από προηγούμενη παραγγελία

    setFormLocked(false);



    viewOnlyOrder =
    order.locked || false;



    document.getElementById("date").value =
    order.date || "";



    document.getElementById("area").value =
    order.area || "";



    document.getElementById("customer").value =
    order.customer || "";



    document.getElementById("notes").value =
    order.notes || "";



    let table =
    document.getElementById("products");



    table.innerHTML = "";



    if (order.products) {


        order.products.forEach(product => {


            let row =
            table.insertRow();



            row.innerHTML = `

<td>

<input 
type="text"
class="code"
value="${product.code || ""}"
onblur="findProduct(this)">

</td>


<td>

<input
type="text"
class="description"
value="${product.description || ""}"
oninput="searchDescription(this)">

<div class="suggestions"></div>

</td>


<td>

<input
type="number"
class="quantity"
value="${product.quantity || 1}"
oninput="calculateRow(this.closest('tr'))">

</td>


<td>

<input
type="number"
class="price"
value="${product.price || ""}"
oninput="calculateRow(this.closest('tr'))">

</td>


<td>

<input
type="number"
class="discount"
value="${product.discount ?? ""}"
oninput="calculateRow(this.closest('tr'))">

</td>


<td>

<input
type="number"
class="finalPrice"
value="${product.finalPrice || "0"}"
readonly>

</td>

`;



        });


    }



    calculateTotal();



    // Εφαρμογή τελικού κλειδώματος αν χρειάζεται

    setFormLocked(viewOnlyOrder);



    if (viewOnlyOrder) {


        alert(
            "Η παραγγελία είναι κλειδωμένη. Προβολή μόνο."
        );


    }


}







// Δημιουργία PDF από αποθηκευμένη παραγγελία

function downloadPDFFromIndex(index) {


    let drafts =
    JSON.parse(
        localStorage.getItem("draftOrders")
    ) || [];



    let order =
    drafts[index];



    if (!order) {


        alert(
            "Δεν βρέθηκε η παραγγελία."
        );


        return;

    }



    downloadPDF(order);


}







// Διαγραφή παραγγελίας

function deleteOrder(index) {


    let drafts =
    JSON.parse(
        localStorage.getItem("draftOrders")
    ) || [];



    let order =
    drafts[index];



    if (!order) {

        return;

    }



    if (order.locked) {


        alert(
            "Η παραγγελία είναι κλειδωμένη και δεν μπορεί να διαγραφεί."
        );


        return;

    }



    if (
        !confirm(
            "Θέλετε σίγουρα να διαγράψετε την παραγγελία;"
        )
    ) {


        return;

    }



    drafts.splice(index, 1);



    localStorage.setItem(
        "draftOrders",
        JSON.stringify(drafts)
    );



    showDrafts();


}

function saveProductIfNew(product) {

    let savedProducts =
        JSON.parse(
            localStorage.getItem("savedProducts")
        ) || [];


    let exists =
        savedProducts.some(item =>
            item.code === product.code
        );


    if (!exists) {

        savedProducts.push({

            code: product.code,

            description: product.description,

            price: Number(product.price) || 0

        });


        localStorage.setItem(
            "savedProducts",
            JSON.stringify(savedProducts)
        );

    }

}

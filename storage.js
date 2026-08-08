// Easy Order - Storage Management


let editingOrderIndex = null;

let viewOnlyOrder = false;

let todaySeller =
    localStorage.getItem("todaySeller") || "";

let sellerDate =
    localStorage.getItem("sellerDate") || "";



// Κλείδωμα / ξεκλείδωμα φόρμας

function setFormLocked(state) {


    let fields =
document.querySelectorAll(
    "#date, #area, #customer, #customerCode, #profession, #address, #phone, #mobile, #vatNumber, #taxOffice, #email, #notes, #products input"
);


    fields.forEach(field => {

        field.readOnly = state;

    });

let newCustomerCheckbox =
    document.getElementById("newCustomer");

if (newCustomerCheckbox) {

    newCustomerCheckbox.disabled = state;

}
    
let sellerSelect =
    document.getElementById("seller");

if (sellerSelect) {

    sellerSelect.disabled = state;

}

    let removeButtons =
    document.querySelectorAll(
        ".removeProduct"
    );

removeButtons.forEach(button => {

    button.disabled = state;

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

// Αποθήκευση νέου πελάτη

let customerCode =
    document.getElementById("customerCode").value.trim();

    newCustomer:
document.getElementById("newCustomer")?.checked || false,

profession:
document.getElementById("profession")?.value.trim() || "",

address:
document.getElementById("address")?.value.trim() || "",

phone:
document.getElementById("phone")?.value.trim() || "",

mobile:
document.getElementById("mobile")?.value.trim() || "",

vatNumber:
document.getElementById("vatNumber")?.value.trim() || "",

taxOffice:
document.getElementById("taxOffice")?.value.trim() || "",

email:
document.getElementById("email")?.value.trim() || "",

let customerArea =
    document.getElementById("area").value.trim();


if (
    document.getElementById("newCustomer")?.checked &&
    customerCode !== "" &&
    customer !== ""
) {

    let existingCustomer =
    customersDatabase.find(
        item => item.code === customerCode
    );


let customerData = {

    code: customerCode,

    name: customer,

    area: customerArea,

    profession:
        document.getElementById("profession")?.value.trim() || "",

    address:
        document.getElementById("address")?.value.trim() || "",

    phone:
        document.getElementById("phone")?.value.trim() || "",

    mobile:
        document.getElementById("mobile")?.value.trim() || "",

    vatNumber:
        document.getElementById("vatNumber")?.value.trim() || "",

    taxOffice:
        document.getElementById("taxOffice")?.value.trim() || "",

    email:
        document.getElementById("email")?.value.trim() || ""

};


if (existingCustomer) {

    Object.assign(
        existingCustomer,
        customerData
    );

} else {

    customersDatabase.push(
        customerData
    );

}


localStorage.setItem(
    "customersDatabase",
    JSON.stringify(customersDatabase)
);

}

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


        id: "",

number: null,


        date:
        document.getElementById("date").value,


        area:
        document.getElementById("area").value.trim(),


        customer:
        customer,

        seller:
document.getElementById("seller").value,
        
        customerCode:
        document.getElementById("customerCode").value.trim(),

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

            saveProductIfNew({

    code: code,

    description: description,

    price: row.querySelector(".price")?.value || "0"

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
    currentOrderNumber;

order.id =
    createOrderId(
        customer,
        currentOrderNumber
    );

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

    editingOrderIndex =
    drafts.length - 1;


}






// ==========================================
// Εμφάνιση πρόχειρων και ολοκληρωμένων
// ==========================================

let currentOrdersTab = "draft";


// Εμφάνιση της επιλεγμένης κατηγορίας

function showOrders(type) {

    // Αν πατήσουμε ξανά την ίδια καρτέλα,
// κλείνουμε και τις δύο λίστες

if (currentOrdersTab === type) {

    let draftBox =
        document.getElementById(
            "draftList"
        );

    let completedBox =
        document.getElementById(
            "completedList"
        );


    if (draftBox) {

        draftBox.style.display =
            "none";

    }


    if (completedBox) {

        completedBox.style.display =
            "none";

    }


    currentOrdersTab = "";


    document
        .querySelectorAll(
            ".orderTab"
        )
        .forEach(button => {

            button.classList.remove(
                "active"
            );

        });


    return;

}


// Επιλέγουμε την καρτέλα

currentOrdersTab = type;


    let draftBox =
        document.getElementById("draftList");


    let completedBox =
        document.getElementById("completedList");


    if (!draftBox || !completedBox) {

        return;

    }


    // Εμφανίζουμε μόνο τη λίστα που επιλέχθηκε

    if (type === "draft") {

        draftBox.style.display = "block";

        completedBox.style.display = "none";

    } else {

        draftBox.style.display = "none";

        completedBox.style.display = "block";

    }


    // Αλλάζουμε την εμφάνιση των δύο κουμπιών

    document
        .querySelectorAll(".orderTab")
        .forEach(button => {

            button.classList.remove("active");

        });


    let activeButton =
        document.querySelector(
            `.orderTab[onclick="showOrders('${type}')"]`
        );


    if (activeButton) {

        activeButton.classList.add("active");

    }


    showDrafts();

}


// Δημιουργία των λιστών

function showDrafts() {


    let draftBox =
        document.getElementById("draftList");


    let completedBox =
        document.getElementById("completedList");


    if (!draftBox || !completedBox) {

        return;

    }


    let orders =
        JSON.parse(
            localStorage.getItem("draftOrders")
        ) || [];


    // Καθαρισμός λιστών

    draftBox.innerHTML = "";

    completedBox.innerHTML = "";


    // Χωρισμός παραγγελιών

    let draftOrders =
        orders.filter(
            order =>
                order.status !==
                "Οριστικοποιημένη"
        );


    let completedOrders =
        orders.filter(
            order =>
                order.status ===
                "Οριστικοποιημένη"
        );


    // Νεότερη ημερομηνία πρώτη

    draftOrders.sort(
        (a, b) =>
            new Date(b.date) -
            new Date(a.date)
    );


    completedOrders.sort(
        (a, b) =>
            new Date(b.date) -
            new Date(a.date)
    );


    // Ενημέρωση αριθμών

    let draftCount =
        document.getElementById(
            "draftCount"
        );


    let completedCount =
        document.getElementById(
            "completedCount"
        );


    if (draftCount) {

        draftCount.innerText =
            draftOrders.length;

    }


    if (completedCount) {

        completedCount.innerText =
            completedOrders.length;

    }


    // ==================================
    // ΠΡΟΧΕΙΡΕΣ ΠΑΡΑΓΓΕΛΙΕΣ
    // ==================================

    if (draftOrders.length === 0) {

        draftBox.innerHTML = `
        
<p class="emptyOrders">
Δεν υπάρχουν πρόχειρες παραγγελίες.
</p>

`;

    } else {

        draftOrders.forEach(order => {


            let index =
                orders.indexOf(order);


            let item =
                document.createElement("div");


            item.className =
                "orderRow";


            item.innerHTML = `

<div class="orderInfo">

<input
type="checkbox"
class="orderSelectCheckbox"
data-order-index="${index}"
onchange="updateSelectedOrders()">

<span class="orderDate">
${order.date || "-"}
</span>

<span class="orderCustomer">
${order.customer || "-"}
</span>

<span class="orderTotal">
${order.total || "0.00 €"}
</span>

</div>


<div class="orderActions">

<button
type="button"
class="openOrderButton"
onclick="openOrder(${index})">

✏️

</button>


<button
type="button"
class="moreOrderButton"
onclick="toggleOrderMenu(this)">

⋮

</button>

</div>


<div class="orderMenu">

<button
onclick="finalizeOrder(${index})">

✅ Οριστικοποίηση

</button>





<button
onclick="downloadPDFFromIndex(${index})">

📄 Δημιουργία PDF

</button>


<button
onclick="deleteOrder(${index})">

🗑 Διαγραφή

</button>

</div>

`;


            draftBox.appendChild(item);


        });

    }


    // ==================================
    // ΟΛΟΚΛΗΡΩΜΕΝΕΣ ΠΑΡΑΓΓΕΛΙΕΣ
    // ==================================

    if (completedOrders.length === 0) {

        completedBox.innerHTML = `

<p class="emptyOrders">
Δεν υπάρχουν ολοκληρωμένες παραγγελίες.
</p>

`;

    } else {

        completedOrders.forEach(order => {


            let index =
                orders.indexOf(order);


            let item =
                document.createElement("div");


            item.className =
                "orderRow";


            item.innerHTML = `

<div class="orderInfo">

<span class="orderDate">
${order.date || "-"}
</span>

<span class="orderCustomer">
${order.customer || "-"}
</span>

<span class="orderTotal">
${order.total || "0.00 €"}
</span>

</div>


<div class="orderActions">

<button
type="button"
class="openOrderButton"
onclick="openOrder(${index})">

👁

</button>


<button
type="button"
class="deleteOrderButton"
onclick="deleteOrder(${index})">

🗑

</button>

</div>

`;


            completedBox.appendChild(item);


        });

    }


    // Διατηρούμε ανοιχτή την καρτέλα
    // που είχε επιλεγεί

    if (currentOrdersTab === "draft") {

        draftBox.style.display =
            "block";

        completedBox.style.display =
            "none";

    } else {

        draftBox.style.display =
            "none";

        completedBox.style.display =
            "block";

    }

}


// Άνοιγμα / κλείσιμο μενού ⋮

function toggleOrderMenu(button) {


    let row =
        button.closest(".orderRow");


    if (!row) {

        return;

    }


    let menu =
        row.querySelector(
            ".orderMenu"
        );


    if (!menu) {

        return;

    }


    // Κλείνουμε τα υπόλοιπα μενού

    document
        .querySelectorAll(
            ".orderMenu"
        )
        .forEach(otherMenu => {

            if (
                otherMenu !== menu
            ) {

                otherMenu.style.display =
                    "none";

            }

        });


    // Ανοίγουμε ή κλείνουμε
    // το μενού της συγκεκριμένης παραγγελίας

    if (
        menu.style.display ===
        "block"
    ) {

        menu.style.display =
            "none";

    } else {

        menu.style.display =
            "block";

    }

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

    document.getElementById("customerCode").value =
    order.customerCode || "";

document.getElementById("seller").value =
    order.seller || "";

    const newCustomerCheckbox =
    document.getElementById("newCustomer");

if (newCustomerCheckbox) {

    newCustomerCheckbox.checked =
        order.newCustomer || false;

}


document.getElementById("profession").value =
    order.profession || "";

document.getElementById("address").value =
    order.address || "";

document.getElementById("phone").value =
    order.phone || "";

document.getElementById("mobile").value =
    order.mobile || "";

document.getElementById("vatNumber").value =
    order.vatNumber || "";

document.getElementById("taxOffice").value =
    order.taxOffice || "";

document.getElementById("email").value =
    order.email || "";


toggleNewCustomerFields();

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

<td>

<button
type="button"
class="removeProduct"
onclick="removeProduct(this)">

✕</button>

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







// ==========================================
// Διαγραφή παραγγελίας
// ==========================================

function deleteOrder(index) {


    let orders =
    JSON.parse(
        localStorage.getItem("draftOrders")
    ) || [];


    let order =
    orders[index];


    if (!order) {

        alert(
            "Η παραγγελία δεν βρέθηκε."
        );

        return;

    }


    let confirmed =
    confirm(
        "Θέλετε σίγουρα να διαγράψετε την παραγγελία;\n\n" +
        "Πελάτης: " +
        (order.customer || "-") +
        "\n" +
        "Ημερομηνία: " +
        (order.date || "-")
    );


    if (!confirmed) {

        return;

    }


    orders.splice(
        index,
        1
    );


    localStorage.setItem(
        "draftOrders",
        JSON.stringify(orders)
    );


    showDrafts();


    alert(
        "Η παραγγελία διαγράφηκε."
    );


}

// Δημιουργία νέας παραγγελίας

function newOrder() {

    // Βγαίνουμε από την επεξεργασία
    // της προηγούμενης παραγγελίας

    editingOrderIndex = null;

    viewOnlyOrder = false;


    // Ξεκλειδώνουμε τη φόρμα

    setFormLocked(false);


    // Βάζουμε τη σημερινή ημερομηνία

    document.getElementById("date").value =
        getTodayDate();


    // Καθαρίζουμε τα στοιχεία πελάτη

    document.getElementById("area").value = "";

    document.getElementById("customer").value = "";

    document.getElementById("customerCode").value = "";

const newCustomerCheckbox =
    document.getElementById("newCustomer");

if (newCustomerCheckbox) {

    newCustomerCheckbox.checked = false;

}


document.getElementById("profession").value = "";
document.getElementById("address").value = "";
document.getElementById("phone").value = "";
document.getElementById("mobile").value = "";
document.getElementById("vatNumber").value = "";
document.getElementById("taxOffice").value = "";
document.getElementById("email").value = "";


toggleNewCustomerFields();
    
    // Καθαρίζουμε τις παρατηρήσεις

    document.getElementById("notes").value = "";


    // Αφαιρούμε όλες τις γραμμές προϊόντων

    let table =
        document.getElementById("products");

    table.innerHTML = "";


    // Δημιουργούμε μία νέα κενή γραμμή

    addProduct();


    // Μηδενίζουμε το σύνολο

    document.getElementById("total").innerText =
        "0.00 €";

}

function saveProductIfNew(product) {

if (
    !product.code ||
    product.code.trim() === "" ||
    !product.description ||
    product.description.trim() === ""
) {

    return;

}
    
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

            description: product.description.trim().toUpperCase(),

            price: Number(product.price) || 0

        });


        localStorage.setItem(
            "savedProducts",
            JSON.stringify(savedProducts)
        );

    }

}

// Ενημέρωση επιλεγμένων παραγγελιών

function updateSelectedOrders() {

    const selectedCheckboxes =
        document.querySelectorAll(
            ".orderSelectCheckbox:checked"
        );


    const count =
        selectedCheckboxes.length;


    const countElement =
        document.getElementById(
            "selectedOrdersCount"
        );


    const previewButton =
        document.getElementById(
            "previewSelectedOrdersButton"
        );


    if (countElement) {

        countElement.innerText =
            count;

    }


    if (previewButton) {

        // Το κουμπί εμφανίζεται όταν έχουν
        // επιλεγεί τουλάχιστον 2 παραγγελίες

        if (count >= 2) {

            previewButton.style.display =
                "block";

        } else {

            previewButton.style.display =
                "none";

        }

    }

}

function convertSavedProductDescriptionsToUppercase() {

    let savedProducts =
        JSON.parse(
            localStorage.getItem("savedProducts")
        ) || [];


    savedProducts.forEach(product => {

        if (product.description) {

            product.description =
                product.description
                .trim()
                .toUpperCase();

        }

    });


    localStorage.setItem(
        "savedProducts",
        JSON.stringify(savedProducts)
    );

}


convertSavedProductDescriptionsToUppercase();

function cleanInvalidSavedProducts() {

    let savedProducts =
        JSON.parse(
            localStorage.getItem("savedProducts")
        ) || [];


    savedProducts =
        savedProducts.filter(product =>

            product.code &&
            product.code.trim() !== "" &&

            product.description &&
            product.description.trim() !== ""

        );


    localStorage.setItem(
        "savedProducts",
        JSON.stringify(savedProducts)
    );

}


cleanInvalidSavedProducts();

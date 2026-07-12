let currentOrderNumber = 1;



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
            product.price;


        row.querySelector(".discount").value =
            product.discount;



        calculateRow(row);

    }

}






// Αναζήτηση περιγραφής

function searchDescription(element) {


    let text = element.value.toLowerCase();


    let box =
        element.parentElement.querySelector(".suggestions");


    box.innerHTML = "";


    if (text.length < 2) return;



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
                product.price;



            row.querySelector(".discount").value =
                product.discount;



            box.innerHTML = "";



            calculateRow(row);

        };



        box.appendChild(option);


    });

}







// Υπολογισμός προϊόντος

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






// Σύνολο

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
class="code"
placeholder="Κωδικός"
onblur="findProduct(this)">

</td>


<td>

<input 
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
class="finalPrice"
readonly>

</td>


`;

}








// Αποθήκευση πρόχειρης παραγγελίας

function saveDraft() {


    let order = {


        number:
        currentOrderNumber++,


        date:
        document.getElementById("date").value,


        area:
        document.getElementById("area").value,


        customer:
        document.getElementById("customer").value,


        total:
        document.getElementById("total").innerText,


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
            row.querySelector(".discount").value


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



    alert(
        "Η πρόχειρη παραγγελία αποθηκεύτηκε"
    );


}








// Εμφάνιση πρόχειρων

function showDrafts() {


    let box =
        document.getElementById("draftList");


    let drafts =
        JSON.parse(
            localStorage.getItem("draftOrders")
        ) || [];



    box.innerHTML = "";



    drafts.forEach(order => {


        let item =
        document.createElement("div");


        item.innerText =
        "Νο " + order.number +
        " - " +
        order.customer +
        " - " +
        order.total;



        box.appendChild(item);


    });


}

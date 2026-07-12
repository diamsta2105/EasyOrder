// Αυτόματη ημερομηνία
window.onload = function() {

    let today = new Date();

    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let day = String(today.getDate()).padStart(2, '0');

    document.getElementById("date").value =
        year + "-" + month + "-" + day;

};


// Προσθήκη νέας γραμμής προϊόντος
function addProduct() {

    let table = document.getElementById("products");

    let row = table.insertRow();

    row.innerHTML = `
        <td><input type="text"></td>
        <td><input type="text"></td>
        <td><input type="number" value="1"></td>
        <td><input type="number"></td>
        <td><input type="number"></td>
        <td><input type="number"></td>
    `;

}


// Υπολογισμός συνόλου
function calculateTotal() {

    let total = 0;

    let rows = document.querySelectorAll("#products tr");


    rows.forEach(function(row) {

        let quantity = row.cells[2]?.querySelector("input")?.value || 0;
        let price = row.cells[3]?.querySelector("input")?.value || 0;
        let discount = row.cells[4]?.querySelector("input")?.value || 0;


        let finalPrice =
            quantity * price * (1 - discount / 100);


        total += finalPrice;

    });


    document.getElementById("total").innerText =
        total.toFixed(2) + " €";

}

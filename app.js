// Easy Order - Main App


// Ημερομηνία εκκίνησης

window.onload = function () {


    let today = new Date();


    let year =
        today.getFullYear();


    let month =
        String(today.getMonth() + 1)
        .padStart(2, "0");


    let day =
        String(today.getDate())
        .padStart(2, "0");



    document.getElementById("date").value =
        year + "-" + month + "-" + day;


};

// ==========================================
// Συνάρτηση Συλλογής Δεδομένων & Κλήσης PDF
// ==========================================
function generatePDF() {
    // 1. Συλλογή βασικών στοιχείων
    let date = document.getElementById("date").value;
    let area = document.getElementById("area").value;
    let customer = document.getElementById("customer").value;
    let notes = document.getElementById("notes").value;
    let totalText = document.getElementById("total").innerText;

    // 2. Συλλογή προϊόντων από τον πίνακα
    let products = [];
    let rows = document.querySelectorAll("#products tr");

    rows.forEach(row => {
        let code = row.querySelector(".code")?.value || "";
        let description = row.querySelector(".description")?.value || "";
        let quantity = row.querySelector(".quantity")?.value || "0";
        let price = row.querySelector(".price")?.value || "0";
        let discount = row.querySelector(".discount")?.value || "0";
        let finalPrice = row.querySelector(".finalPrice")?.value || "0";

        // Προσθέτουμε μόνο αν έχει γραφτεί κωδικός ή περιγραφή
        if (code.trim() !== "" || description.trim() !== "") {
            products.push({
                code: code,
                description: description,
                quantity: quantity,
                price: price,
                discount: discount,
                finalPrice: finalPrice
            });
        }
    });

    if (products.length === 0) {
        alert("Παρακαλώ συμπληρώστε τουλάχιστον ένα προϊόν πριν την εκτύπωση.");
        return;
    }

    // 3. Δημιουργία αντικειμένου παραγγελίας
    let order = {
        number: "ORD-" + Math.floor(1000 + Math.random() * 9000), // Τυχαίος αριθμός παραγγελίας
        date: date,
        area: area,
        customer: customer,
        products: products,
        total: totalText,
        notes: notes
    };

    // 4. Κλήση της συνάρτησης δημιουργίας PDF
    downloadPDF(order);
}


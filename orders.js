// Easy Order - Orders Management


let currentOrderNumber =
    Number(localStorage.getItem("currentOrderNumber")) || 1;





// Δημιουργία κωδικού παραγγελίας

function createOrderId(customer) {


    let today = new Date();


    let year =
        today.getFullYear();


    let day =
        String(today.getDate())
        .padStart(2, "0");


    let month =
        String(today.getMonth() + 1)
        .padStart(2, "0");



    let name =
        customer
        .trim()
        .toUpperCase()
        .replace(/\s+/g, "-");



    if (!name) {
        name = "ΧΩΡΙΣ-ΠΕΛΑΤΗ";
    }



    return (
        year +
        "-" +
        day +
        month +
        "-" +
        name
    );

}





// Οριστικοποίηση παραγγελίας
// Θα ενεργοποιηθεί στο επόμενο στάδιο

function finalizeOrder(index) {


    let drafts =
        JSON.parse(
            localStorage.getItem("draftOrders")
        ) || [];



    if (!drafts[index]) {
        return;
    }



    drafts[index].status =
        "Οριστικοποιημένη";



    localStorage.setItem(
        "draftOrders",
        JSON.stringify(drafts)
    );



    showDrafts();

}





// Κλείδωμα παραγγελίας

function lockOrder(index) {


    let drafts =
        JSON.parse(
            localStorage.getItem("draftOrders")
        ) || [];



    if (!drafts[index]) {
        return;
    }



    drafts[index].locked = true;



    localStorage.setItem(
        "draftOrders",
        JSON.stringify(drafts)
    );



    showDrafts();

}





// Ξεκλείδωμα παραγγελίας

function unlockOrder(index) {


    let drafts =
        JSON.parse(
            localStorage.getItem("draftOrders")
        ) || [];



    if (!drafts[index]) {
        return;
    }



    drafts[index].locked = false;



    localStorage.setItem(
        "draftOrders",
        JSON.stringify(drafts)
    );



    showDrafts();

}

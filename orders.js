// ==========================================
// Easy Order - Orders Management
// ==========================================

// Τρέχων αύξων αριθμός παραγγελίας
let currentOrderNumber =
Number(
localStorage.getItem(
"currentOrderNumber"
)
) || 1;

// ==========================================
// Δημιουργία μοναδικού κωδικού παραγγελίας
// ==========================================

function createOrderId(customer, orderNumber) {

const today = new Date();

const year =
    today.getFullYear();

const month =
    String(
        today.getMonth() + 1
    ).padStart(2, "0");

const day =
    String(
        today.getDate()
    ).padStart(2, "0");


// Καθαρισμός ονόματος πελάτη
let customerName =
    String(customer || "")
    .trim()
    .toUpperCase()
    .replace(
        /[^A-ZΑ-ΩΆΈΉΊΌΎΏΪΫ0-9\s-]/g,
        ""
    )
    .replace(
        /\s+/g,
        "-"
    )
    .replace(
        /-+/g,
        "-"
    );


if (!customerName) {

    customerName =
        "ΧΩΡΙΣ-ΠΕΛΑΤΗ";

}


// Μορφή:
// EO-2026-08-02-0001-ΠΕΛΑΤΗΣ

const formattedNumber =
    String(
        orderNumber || currentOrderNumber
    ).padStart(4, "0");


return (
    "EO-" +
    year +
    "-" +
    month +
    "-" +
    day +
    "-" +
    formattedNumber +
    "-" +
    customerName
);

}

// ==========================================
// Οριστικοποίηση παραγγελίας
// ==========================================

function finalizeOrder(index) {

const drafts =
    JSON.parse(
        localStorage.getItem(
            "draftOrders"
        )
    ) || [];


if (!drafts[index]) {

    alert(
        "Η παραγγελία δεν βρέθηκε."
    );

    return;

}


const confirmed =
    confirm(
        "Θέλετε να οριστικοποιήσετε την παραγγελία; " +
        "Μετά την οριστικοποίηση θα κλειδωθεί."
    );


if (!confirmed) {

    return;

}


drafts[index].status =
    "Οριστικοποιημένη";


// Η οριστικοποίηση κλειδώνει αυτόματα
drafts[index].locked =
    true;


localStorage.setItem(
    "draftOrders",
    JSON.stringify(drafts)
);


showDrafts();


alert(
    "Η παραγγελία οριστικοποιήθηκε και κλειδώθηκε."
);

}

// ==========================================
// Κλείδωμα παραγγελίας
// ==========================================

function lockOrder(index) {

const drafts =
    JSON.parse(
        localStorage.getItem(
            "draftOrders"
        )
    ) || [];


if (!drafts[index]) {

    return;

}


drafts[index].locked =
    true;


localStorage.setItem(
    "draftOrders",
    JSON.stringify(drafts)
);


showDrafts();


alert(
    "Η παραγγελία κλειδώθηκε."
);

}

// ==========================================
// Ξεκλείδωμα παραγγελίας
// ==========================================

function unlockOrder(index) {

const drafts =
    JSON.parse(
        localStorage.getItem(
            "draftOrders"
        )
    ) || [];


if (!drafts[index]) {

    return;

}


const confirmed =
    confirm(
        "Θέλετε να ξεκλειδώσετε την παραγγελία;"
    );


if (!confirmed) {

    return;

}


drafts[index].locked =
    false;


// Αν ξεκλειδωθεί, επιστρέφει σε πρόχειρη
drafts[index].status =
    "Πρόχειρη";


localStorage.setItem(
    "draftOrders",
    JSON.stringify(drafts)
);


showDrafts();


alert(
    "Η παραγγελία ξεκλειδώθηκε."
);

}

// ==========================================
// Easy Order - Main App
// ==========================================

// Επιστρέφει τη σημερινή ημερομηνία
// στη μορφή YYYY-MM-DD
function getTodayDate() {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(
        today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        today.getDate()
    ).padStart(2, "0");

    return year + "-" + month + "-" + day;
}


// Ορίζει τη σημερινή ημερομηνία
function setTodayDate() {
    const dateInput =
        document.getElementById("date");

    if (dateInput) {
        dateInput.value =
            getTodayDate();
    }
}


// Εκτελείται όταν φορτώσει η σελίδα
window.addEventListener(
    "DOMContentLoaded",
    function () {

        setTodayDate();


        const today =
            getTodayDate();


        const savedDate =
            localStorage.getItem("sellerDate");


        const seller =
            localStorage.getItem("todaySeller") || "";


        const sellerSelect =
            document.getElementById("seller");


        if (savedDate === today && sellerSelect) {

            sellerSelect.value = seller;

        } else {

            localStorage.removeItem("todaySeller");
            localStorage.setItem(
                "sellerDate",
                today
            );

        }


        if (sellerSelect) {

            sellerSelect.addEventListener(
                "change",
                function () {

                    localStorage.setItem(
                        "todaySeller",
                        this.value
                    );

                }
            );

        }
                if (
            typeof showDrafts ===
            "function"
        ) {

            showDrafts();

        }


        const orderToOpenIndex =
            localStorage.getItem(
                "orderToOpenIndex"
            );


        if (
            orderToOpenIndex !== null
        ) {

            localStorage.removeItem(
                "orderToOpenIndex"
            );


            const orderIndex =
                Number(orderToOpenIndex);


            if (
                Number.isInteger(orderIndex) &&
                typeof openOrder ===
                    "function"
            ) {

                openOrder(orderIndex);

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }

        }

    }
);

// ==========================================
// Ενημέρωση ημερήσιας σύνοψης
// ==========================================

function updateDailySummary() {

    const orders =
        JSON.parse(
            localStorage.getItem("draftOrders")
        ) || [];


    const today =
        getTodayDate();


    const todayDraftOrders =
        orders.filter(order =>

            order.date === today &&

            order.status !==
                "Οριστικοποιημένη"

        );


    let liveTurnover = 0;


    todayDraftOrders.forEach(order => {

        const orderTotal =
            parseFloat(
                String(order.total || "0")
                    .replace("€", "")
                    .replace(",", ".")
                    .trim()
            ) || 0;


        liveTurnover += orderTotal;

    });


    const ordersElement =
        document.getElementById(
            "todayDraftOrders"
        );


    const turnoverElement =
        document.getElementById(
            "todayLiveTurnover"
        );


    if (ordersElement) {

        ordersElement.innerText =
            todayDraftOrders.length;

    }


    if (turnoverElement) {

        turnoverElement.innerText =
            liveTurnover.toFixed(2) + " €";

    }

}

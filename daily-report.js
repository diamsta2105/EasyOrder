// ==========================================
// Easy Order - Ημερήσια κατάσταση
// ==========================================


// Σημερινή ημερομηνία σε μορφή YYYY-MM-DD

function getDailyTodayDate() {

    const today =
        new Date();


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


    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


// Εμφάνιση ελληνικής ημέρας

function updateDailyDayName() {

    const dateInput =
        document.getElementById(
            "dailyDate"
        );


    const dayInput =
        document.getElementById(
            "dailyDayName"
        );


    if (
        !dateInput ||
        !dayInput ||
        !dateInput.value
    ) {

        return;

    }


    const dayNames = [

        "Κυριακή",
        "Δευτέρα",
        "Τρίτη",
        "Τετάρτη",
        "Πέμπτη",
        "Παρασκευή",
        "Σάββατο"

    ];


    const selectedDate =
        new Date(
            dateInput.value +
            "T12:00:00"
        );


    dayInput.value =
        dayNames[
            selectedDate.getDay()
        ];

}

// Επαναρίθμηση επισκέψεων

function renumberDailyVisits() {

    document
        .querySelectorAll(
            "#dailyVisitsTableBody tr"
        )
        .forEach((row, index) => {

            const numberCell =
                row.querySelector(
                    ".dailyVisitNumber"
                );


            if (numberCell) {

                numberCell.textContent =
                    index + 1;

            }

        });

        if (
        typeof calculateDailyTotals ===
        "function"
    ) {

        calculateDailyTotals();

        }
    
}


// Προσθήκη γραμμής επίσκεψης

function addDailyVisitRow(data = {}) {

    const tableBody =
        document.getElementById(
            "dailyVisitsTableBody"
        );


    if (!tableBody) {

        return;

    }


    const currentRows =
        tableBody.querySelectorAll("tr");


    if (currentRows.length >= 22) {

        alert(
            "Μπορείτε να καταχωρίσετε μέχρι 22 επισκέψεις."
        );

        return;

    }


    const row =
        document.createElement("tr");


    row.innerHTML = `

<td class="dailyVisitNumber"></td>

<td>
    <input
    type="text"
    class="dailyCustomerCode"
    placeholder="Κωδικός">
</td>

<td>
    <input
    type="text"
    class="dailyCustomerName"
    placeholder="Πελάτης">
</td>

<td>
    <input
    type="number"
    class="dailyOrderCount"
    min="0"
    placeholder="">
</td>

<td>
    <input
    type="number"
    class="dailyProductCount"
    min="0"
    placeholder="">
</td>

<td>
    <input
    type="number"
    class="dailySalesValue"
    min="0"
    step="0.01"
    placeholder="">
</td>

<td>
    <input
    type="number"
    class="dailyCollectionValue"
    min="0"
    step="0.01"
    placeholder="">
</td>

<td>
    <input
    type="checkbox"
    class="dailyNewCustomer">
</td>

<td>
    <input
    type="text"
    class="dailyVisitNote"
    placeholder="Προαιρετική σημείωση">
</td>

<td>
    <button
    type="button"
    class="removeDailyVisitButton"
    title="Αφαίρεση επίσκεψης">

    ✕

    </button>
</td>

`;

        row.querySelector(
        ".dailyCustomerCode"
    ).value =
        data.customerCode || "";


    row.querySelector(
        ".dailyCustomerName"
    ).value =
        data.customerName || "";


    row.querySelector(
        ".dailyOrderCount"
    ).value =
        data.orderCount || "";


    row.querySelector(
        ".dailyProductCount"
    ).value =
        data.productCount || "";


    row.querySelector(
        ".dailySalesValue"
    ).value =
        data.salesValue || "";


    row.querySelector(
        ".dailyCollectionValue"
    ).value =
        data.collectionValue || "";


    row.querySelector(
        ".dailyNewCustomer"
    ).checked =
        data.newCustomer || false;


    row.querySelector(
        ".dailyVisitNote"
    ).value =
        data.note || "";

    const removeButton =
        row.querySelector(
            ".removeDailyVisitButton"
        );


    removeButton.addEventListener(
        "click",
        function () {

            row.remove();

            renumberDailyVisits();

        }
    );


    tableBody.appendChild(row);

    renumberDailyVisits();

}

// Μετατροπή συνόλου παραγγελίας σε αριθμό

function parseDailyOrderTotal(value) {

    const number =
        parseFloat(
            String(value || "0")
            .replace("€", "")
            .replace(",", ".")
            .trim()
        );


    return number || 0;

}


// Μεταφορά παραγγελιών στην ημερήσια

function loadOrdersIntoDailyReport() {

    const tableBody =
        document.getElementById(
            "dailyVisitsTableBody"
        );


    const date =
        document.getElementById(
            "dailyDate"
        )?.value || "";


    const seller =
        document.getElementById(
            "dailySeller"
        )?.value || "";


    if (!tableBody) {

        return;

    }


    const allOrders =
        JSON.parse(
            localStorage.getItem(
                "draftOrders"
            )
        ) || [];


    const selectedOrders =
        allOrders.filter(order => {

            if (order.date !== date) {

                return false;

            }


            if (
                seller &&
                order.seller !== seller
            ) {

                return false;

            }


            return true;

        });


    tableBody.innerHTML = "";


    if (selectedOrders.length > 22) {

        alert(
            "Βρέθηκαν περισσότερες από 22 παραγγελίες. " +
            "Θα εμφανιστούν οι πρώτες 22."
        );

    }


    selectedOrders
        .slice(0, 22)
        .forEach(order => {

            const products =
                Array.isArray(order.products)
                    ? order.products
                    : [];


            const productCount =
                products.filter(product =>

                    String(
                        product.code || ""
                    ).trim() !== "" ||

                    String(
                        product.description || ""
                    ).trim() !== ""

                ).length;


            const salesValue =
                parseDailyOrderTotal(
                    order.total
                );


            addDailyVisitRow({

                customerCode:
                    order.customerCode || "",

                customerName:
                    order.customer || "",

                orderCount: 1,

                productCount:
                    productCount || "",

                salesValue:
                    salesValue > 0
                        ? salesValue.toFixed(2)
                        : "",

                collectionValue: "",

                newCustomer:
                    order.newCustomer || false,

                note: ""

            });

        });


    if (selectedOrders.length === 0) {

        addDailyVisitRow();

    }

}

// Υπολογισμός συνόλων ημερήσιας

function calculateDailyTotals() {

    let visits = 0;
    let orders = 0;
    let products = 0;
    let sales = 0;
    let collections = 0;
    let newCustomers = 0;


    document
        .querySelectorAll(
            "#dailyVisitsTableBody tr"
        )
        .forEach(row => {

            const customerCode =
                row.querySelector(
                    ".dailyCustomerCode"
                )?.value.trim() || "";


            const customerName =
                row.querySelector(
                    ".dailyCustomerName"
                )?.value.trim() || "";


            const note =
                row.querySelector(
                    ".dailyVisitNote"
                )?.value.trim() || "";


            const orderCount =
                Number(
                    row.querySelector(
                        ".dailyOrderCount"
                    )?.value
                ) || 0;


            const productCount =
                Number(
                    row.querySelector(
                        ".dailyProductCount"
                    )?.value
                ) || 0;


            const salesValue =
                Number(
                    row.querySelector(
                        ".dailySalesValue"
                    )?.value
                ) || 0;


            const collectionValue =
                Number(
                    row.querySelector(
                        ".dailyCollectionValue"
                    )?.value
                ) || 0;


            const isNewCustomer =
                row.querySelector(
                    ".dailyNewCustomer"
                )?.checked || false;


            const hasVisit =
                customerCode !== "" ||
                customerName !== "" ||
                note !== "" ||
                orderCount > 0 ||
                productCount > 0 ||
                salesValue > 0 ||
                collectionValue > 0 ||
                isNewCustomer;


            if (hasVisit) {

                visits++;

            }


            orders += orderCount;
            products += productCount;
            sales += salesValue;
            collections += collectionValue;


            if (isNewCustomer) {

                newCustomers++;

            }

        });


    const carriedVisits =
        Number(
            document.getElementById(
                "carriedVisits"
            )?.value
        ) || 0;


    const carriedOrders =
        Number(
            document.getElementById(
                "carriedOrders"
            )?.value
        ) || 0;


    const carriedProducts =
        Number(
            document.getElementById(
                "carriedProducts"
            )?.value
        ) || 0;


    const carriedSales =
        Number(
            document.getElementById(
                "carriedSales"
            )?.value
        ) || 0;


    const carriedCollections =
        Number(
            document.getElementById(
                "carriedCollections"
            )?.value
        ) || 0;


    const carriedNewCustomers =
        Number(
            document.getElementById(
                "carriedNewCustomers"
            )?.value
        ) || 0;


    function setTotalText(
        id,
        value,
        isMoney = false
    ) {

        const element =
            document.getElementById(id);


        if (!element) {

            return;

        }


        element.textContent =
            isMoney

                ? value
                    .toFixed(2)
                    .replace(".", ",")

                : value;

    }


    setTotalText(
        "dailyTotalVisits",
        visits
    );

    setTotalText(
        "dailyTotalOrders",
        orders
    );

    setTotalText(
        "dailyTotalProducts",
        products
    );

    setTotalText(
        "dailyTotalSales",
        sales,
        true
    );

    setTotalText(
        "dailyTotalCollections",
        collections,
        true
    );

    setTotalText(
        "dailyTotalNewCustomers",
        newCustomers
    );


    setTotalText(
        "generalTotalVisits",
        visits + carriedVisits
    );

    setTotalText(
        "generalTotalOrders",
        orders + carriedOrders
    );

    setTotalText(
        "generalTotalProducts",
        products + carriedProducts
    );

    setTotalText(
        "generalTotalSales",
        sales + carriedSales,
        true
    );

    setTotalText(
        "generalTotalCollections",
        collections + carriedCollections,
        true
    );

    setTotalText(
        "generalTotalNewCustomers",
        newCustomers +
        carriedNewCustomers
    );

}

// Εκκίνηση σελίδας ημερήσιας

window.addEventListener(
    "DOMContentLoaded",
    function () {

        const dateInput =
            document.getElementById(
                "dailyDate"
            );


        const sellerInput =
            document.getElementById(
                "dailySeller"
            );


        if (dateInput) {

            dateInput.value =
                getDailyTodayDate();


                        dateInput.addEventListener(
                "change",
                function () {

                    updateDailyDayName();

                    loadOrdersIntoDailyReport();

                }
            );

        }


                if (sellerInput) {

            sellerInput.value =
                localStorage.getItem(
                    "todaySeller"
                ) || "";


            sellerInput.addEventListener(
                "change",
                loadOrdersIntoDailyReport
            );

                }

                const addVisitButton =
            document.getElementById(
                "addDailyVisitButton"
            );


        if (addVisitButton) {

            addVisitButton.addEventListener(
                "click",
                addDailyVisitRow
            );

        }

                const visitsTableBody =
            document.getElementById(
                "dailyVisitsTableBody"
            );


        if (visitsTableBody) {

            visitsTableBody.addEventListener(
                "input",
                calculateDailyTotals
            );


            visitsTableBody.addEventListener(
                "change",
                calculateDailyTotals
            );

        }


        const carriedFieldIds = [

            "carriedVisits",
            "carriedOrders",
            "carriedProducts",
            "carriedSales",
            "carriedCollections",
            "carriedNewCustomers"

        ];


        carriedFieldIds.forEach(id => {

            const field =
                document.getElementById(id);


            if (field) {

                field.addEventListener(
                    "input",
                    calculateDailyTotals
                );

            }

        });

        loadOrdersIntoDailyReport();

        updateDailyDayName();

    }
);

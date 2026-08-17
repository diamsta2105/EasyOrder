// ==========================================
// Easy Order - Αρχείο ολοκληρωμένων
// ==========================================

const COMPLETED_ORDERS_PER_PAGE = 50;

let currentCompletedPage = 1;


// Μετατροπή αποθηκευμένου συνόλου σε αριθμό

function parseCompletedTotal(value) {

    let text =
        String(value || "0")
        .replace("€", "")
        .replace(/\s/g, "")
        .replace(",", ".");


    return Number(text) || 0;

}

// Μορφοποίηση ημερομηνίας

function formatArchiveDate(value) {

    const parts =
        String(value || "")
        .split("-");


    if (parts.length !== 3) {

        return value || "-";

    }


    return (
        parts[2] +
        "/" +
        parts[1] +
        "/" +
        parts[0].slice(-2)
    );

}

// Ασφαλής εμφάνιση κειμένου

function createOrderTextElement(
    className,
    value
) {

    const element =
        document.createElement("span");


    element.className =
        className;


    element.textContent =
        value || "-";


    return element;

}

// Κατάταξη πελατών βάσει ολοκληρωμένου τζίρου

function renderCustomerTurnoverRanking() {

    const rankingBox =
        document.getElementById(
            "customerTurnoverRanking"
        );


    if (!rankingBox) {

        return;

    }


    const allOrders =
        JSON.parse(
            localStorage.getItem(
                "draftOrders"
            )
        ) || [];


    const dateFrom =
        document.getElementById(
            "completedDateFrom"
        )?.value || "";


    const dateTo =
        document.getElementById(
            "completedDateTo"
        )?.value || "";


    const customerSearch =
        document.getElementById(
            "completedCustomerSearch"
        )?.value
        .trim()
        .toLocaleLowerCase("el") || "";


    const areaSearch =
        document.getElementById(
            "completedAreaSearch"
        )?.value
        .trim()
        .toLocaleLowerCase("el") || "";


    const sellerFilter =
        document.getElementById(
            "completedSellerFilter"
        )?.value || "";


    const rankingMap =
        new Map();


    allOrders
        .filter(order =>

            order.status ===
                "Οριστικοποιημένη"

        )
        .filter(order => {

            const orderDate =
                order.date || "";


            const customerText =
                (
                    (order.customer || "") +
                    " " +
                    (order.customerCode || "")
                )
                .toLocaleLowerCase("el");


            const areaText =
                String(order.area || "")
                .toLocaleLowerCase("el");


            if (
                dateFrom &&
                orderDate < dateFrom
            ) {

                return false;

            }


            if (
                dateTo &&
                orderDate > dateTo
            ) {

                return false;

            }


            if (
                customerSearch &&
                !customerText.includes(
                    customerSearch
                )
            ) {

                return false;

            }


            if (
                areaSearch &&
                !areaText.includes(
                    areaSearch
                )
            ) {

                return false;

            }


            if (
                sellerFilter &&
                order.seller !== sellerFilter
            ) {

                return false;

            }


            return true;

        })
        .forEach(order => {

            const customerCode =
                String(
                    order.customerCode || ""
                ).trim();


            const customerName =
                String(
                    order.customer ||
                    "Χωρίς όνομα"
                ).trim();


            const customerArea =
                String(
                    order.area || "-"
                ).trim();


            const normalizedCode =
                customerCode
                .toLocaleLowerCase("el");


            const normalizedName =
                customerName
                .toLocaleLowerCase("el");


            const normalizedArea =
                customerArea
                .toLocaleLowerCase("el");


            const customerKey =
                normalizedCode !== ""

                    ? "code|" +
                      normalizedCode

                    : "name|" +
                      normalizedName +
                      "|area|" +
                      normalizedArea;


            if (
                !rankingMap.has(
                    customerKey
                )
            ) {

                rankingMap.set(
                    customerKey,
                    {

                        customerCode:
                            customerCode,

                        customerName:
                            customerName,

                        areas:
                            new Set(),

                        orderCount: 0,

                        turnover: 0

                    }
                );

            }


            const customerData =
                rankingMap.get(
                    customerKey
                );


            if (
                customerArea &&
                customerArea !== "-"
            ) {

                customerData.areas.add(
                    customerArea
                );

            }


            customerData.orderCount++;


            customerData.turnover +=
                parseCompletedTotal(
                    order.total
                );

        });


    const sortMode =
        document.getElementById(
            "customerTurnoverSort"
        )?.value || "highest";


    const rankedCustomers =
        Array.from(
            rankingMap.values()
        );


    rankedCustomers.sort((a, b) => {

        if (sortMode === "lowest") {

            return (
                a.turnover -
                b.turnover
            );

        }


        return (
            b.turnover -
            a.turnover
        );

    });


    const countElement =
        document.getElementById(
            "rankedCustomerCount"
        );


    if (countElement) {

        countElement.textContent =
            rankedCustomers.length;

    }


    rankingBox.innerHTML = "";


    if (
        rankedCustomers.length === 0
    ) {

        const emptyMessage =
            document.createElement("p");


        emptyMessage.className =
            "emptyOrders";


        emptyMessage.textContent =
            "Δεν υπάρχουν στοιχεία πελατών για τα επιλεγμένα φίλτρα.";


        rankingBox.appendChild(
            emptyMessage
        );


        return;

    }


    rankedCustomers.forEach(
        (customer, index) => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "customerRankingRow";


            const position =
                document.createElement(
                    "span"
                );


            position.className =
                "customerRankingPosition";


            position.textContent =
                index + 1;


            const information =
                document.createElement(
                    "div"
                );


            information.className =
                "customerRankingInformation";


            const name =
                document.createElement(
                    "strong"
                );


            name.textContent =
                customer.customerName;


            const details =
                document.createElement(
                    "span"
                );


            const areas =
                Array.from(
                    customer.areas
                ).join(", ") || "-";


            details.textContent =
                (
                    customer.customerCode ||
                    "-"
                ) +
                " • " +
                areas +
                " • " +
                customer.orderCount +
                " παραγγ.";


            information.appendChild(
                name
            );


            information.appendChild(
                details
            );


            const turnover =
                document.createElement(
                    "strong"
                );


            turnover.className =
                "customerRankingTurnover";


            turnover.textContent =
                customer.turnover
                .toLocaleString(
                    "el-GR",
                    {

                        minimumFractionDigits: 2,

                        maximumFractionDigits: 2

                    }
                ) +
                " €";


            row.appendChild(
                position
            );


            row.appendChild(
                information
            );


            row.appendChild(
                turnover
            );


            rankingBox.appendChild(
                row
            );

        }
    );

}

// Εμφάνιση ολοκληρωμένων παραγγελιών

function renderCompletedOrdersArchive() {

    const archive =
        document.getElementById(
            "completedOrdersArchive"
        );


    if (!archive) {

        return;

    }


    const allOrders =
        JSON.parse(
            localStorage.getItem("draftOrders")
        ) || [];


    let completedOrders =
        allOrders.filter(order =>

            order.status ===
                "Οριστικοποιημένη"

        );


    const dateFrom =
        document.getElementById(
            "completedDateFrom"
        )?.value || "";


    const dateTo =
        document.getElementById(
            "completedDateTo"
        )?.value || "";


    const customerSearch =
        document.getElementById(
            "completedCustomerSearch"
        )?.value
        .trim()
        .toLocaleLowerCase("el") || "";


    const areaSearch =
        document.getElementById(
            "completedAreaSearch"
        )?.value
        .trim()
        .toLocaleLowerCase("el") || "";


    const sellerFilter =
        document.getElementById(
            "completedSellerFilter"
        )?.value || "";


    completedOrders =
        completedOrders.filter(order => {

            const orderDate =
                order.date || "";


            const customerText =
                (
                    (order.customer || "") +
                    " " +
                    (order.customerCode || "")
                )
                .toLocaleLowerCase("el");


            const areaText =
                String(order.area || "")
                .toLocaleLowerCase("el");


            if (
                dateFrom &&
                orderDate < dateFrom
            ) {

                return false;

            }


            if (
                dateTo &&
                orderDate > dateTo
            ) {

                return false;

            }


            if (
                customerSearch &&
                !customerText.includes(
                    customerSearch
                )
            ) {

                return false;

            }


            if (
                areaSearch &&
                !areaText.includes(
                    areaSearch
                )
            ) {

                return false;

            }


            if (
                sellerFilter &&
                order.seller !== sellerFilter
            ) {

                return false;

            }


            return true;

        });


        completedOrders.sort(
        (a, b) =>

            String(b.date || "")
            .localeCompare(
                String(a.date || "")
            )

    );


    const totalPages =
        Math.max(
            1,
            Math.ceil(
                completedOrders.length /
                COMPLETED_ORDERS_PER_PAGE
            )
        );


    if (
        currentCompletedPage >
        totalPages
    ) {

        currentCompletedPage =
            totalPages;

    }


    const firstOrderIndex =
        (
            currentCompletedPage - 1
        ) *
        COMPLETED_ORDERS_PER_PAGE;


    const visibleCompletedOrders =
        completedOrders.slice(
            firstOrderIndex,
            firstOrderIndex +
            COMPLETED_ORDERS_PER_PAGE
        );


    const pagination =
        document.getElementById(
            "completedPagination"
        );


    const pageInformation =
        document.getElementById(
            "completedPageInformation"
        );


    const previousButton =
        document.getElementById(
            "previousCompletedPage"
        );


    const nextButton =
        document.getElementById(
            "nextCompletedPage"
        );


    if (pagination) {

        pagination.style.display =
            completedOrders.length >
            COMPLETED_ORDERS_PER_PAGE

                ? "flex"

                : "none";

    }


    if (pageInformation) {

        pageInformation.textContent =
            "Σελίδα " +
            currentCompletedPage +
            " από " +
            totalPages;

    }


    if (previousButton) {

        previousButton.disabled =
            currentCompletedPage === 1;

    }


    if (nextButton) {

        nextButton.disabled =
            currentCompletedPage ===
            totalPages;

    }


    let totalTurnover = 0;


    completedOrders.forEach(order => {

        totalTurnover +=
            parseCompletedTotal(
                order.total
            );

    });


    const countElement =
        document.getElementById(
            "filteredCompletedCount"
        );


    const turnoverElement =
        document.getElementById(
            "filteredCompletedTurnover"
        );


    if (countElement) {

        countElement.textContent =
            completedOrders.length;

    }


    if (turnoverElement) {

        turnoverElement.textContent =
            totalTurnover.toFixed(2) +
            " €";

    }

    renderCustomerTurnoverRanking();

    archive.innerHTML = "";


    if (completedOrders.length === 0) {

        const emptyMessage =
            document.createElement("p");


        emptyMessage.className =
            "emptyOrders";


        emptyMessage.textContent =
            "Δεν υπάρχουν ολοκληρωμένες παραγγελίες.";


        archive.appendChild(
            emptyMessage
        );


        return;

    }


            visibleCompletedOrders.forEach(order => {

        const orderIndex =
            allOrders.indexOf(order);


        const row =
            document.createElement("div");


        row.className =
            "archiveOrderRow";


        const mainInfo =
            document.createElement("div");


        mainInfo.className =
            "archiveOrderMain";


        mainInfo.appendChild(
            createOrderTextElement(
                "archiveOrderDate",
                formatArchiveDate(order.date)
            )
        );


        mainInfo.appendChild(
            createOrderTextElement(
                "archiveOrderCustomer",
                order.customer
            )
        );


        mainInfo.appendChild(
            createOrderTextElement(
                "archiveOrderTotal",
                order.total || "0,00 €"
            )
        );


        const extraInfo =
            document.createElement("div");


        extraInfo.className =
            "archiveOrderExtra";


        extraInfo.textContent =
            (order.customerCode || "-") +
            " • " +
            (order.area || "-") +
            " • " +
            (order.seller || "-");


                const actions =
            document.createElement("div");


        actions.className =
            "archiveOrderActions";


        const viewButton =
            document.createElement("button");


        viewButton.type =
            "button";


        viewButton.className =
            "archiveViewButton";


        viewButton.textContent =
            "👁";


        viewButton.title =
            "Προβολή παραγγελίας";


        viewButton.addEventListener(
            "click",
            function () {

                localStorage.setItem(
                    "orderToOpenIndex",
                    String(orderIndex)
                );


                window.location.href =
                    "Test.html";

            }
        );


        const deleteButton =
            document.createElement("button");


        deleteButton.type =
            "button";


        deleteButton.className =
            "archiveDeleteButton";


        deleteButton.textContent =
            "🗑";


        deleteButton.title =
            "Διαγραφή παραγγελίας";


        deleteButton.addEventListener(
            "click",
            function () {

                const confirmed =
                    confirm(
                        "Θέλετε σίγουρα να διαγράψετε την παραγγελία;\n\n" +
                        "Πελάτης: " +
                        (order.customer || "-") +
                        "\nΗμερομηνία: " +
                        (order.date || "-")
                    );


                if (!confirmed) {

                    return;

                }


                allOrders.splice(
                    orderIndex,
                    1
                );


                localStorage.setItem(
                    "draftOrders",
                    JSON.stringify(allOrders)
                );


                renderCompletedOrdersArchive();

            }
        );


        actions.appendChild(
            viewButton
        );


        actions.appendChild(
            deleteButton
        );


        row.appendChild(mainInfo);

        row.appendChild(extraInfo);

        row.appendChild(actions);

        archive.appendChild(row);

    });

}


// Καθαρισμός όλων των φίλτρων

function clearCompletedOrdersFilters() {

    document.getElementById(
        "completedDateFrom"
    ).value = "";


    document.getElementById(
        "completedDateTo"
    ).value = "";


    document.getElementById(
        "completedCustomerSearch"
    ).value = "";


    document.getElementById(
        "completedAreaSearch"
    ).value = "";


    document.getElementById(
        "completedSellerFilter"
    ).value = "";


    renderCompletedOrdersArchive();

}


// Εκκίνηση σελίδας

window.addEventListener(
    "DOMContentLoaded",
    function () {

        const filterIds = [

            "completedDateFrom",
            "completedDateTo",
            "completedCustomerSearch",
            "completedAreaSearch",
            "completedSellerFilter"

        ];


        filterIds.forEach(id => {

            const field =
                document.getElementById(id);


            if (field) {

                                field.addEventListener(
                    "input",
                    function () {

                        currentCompletedPage = 1;

                        renderCompletedOrdersArchive();

                    }
                );


                field.addEventListener(
                    "change",
                    function () {

                        currentCompletedPage = 1;

                        renderCompletedOrdersArchive();

                    }
                );

            }

        });


        const clearButton =
            document.getElementById(
                "clearCompletedFilters"
            );


        if (clearButton) {

            clearButton.addEventListener(
                "click",
                clearCompletedOrdersFilters
            );

        }

                const previousButton =
            document.getElementById(
                "previousCompletedPage"
            );


        const nextButton =
            document.getElementById(
                "nextCompletedPage"
            );


        if (previousButton) {

            previousButton.addEventListener(
                "click",
                function () {

                    if (
                        currentCompletedPage > 1
                    ) {

                        currentCompletedPage--;

                        renderCompletedOrdersArchive();

                        window.scrollTo({
                            top: 0,
                            behavior: "smooth"
                        });

                    }

                }
            );

        }


        if (nextButton) {

            nextButton.addEventListener(
                "click",
                function () {

                    currentCompletedPage++;

                    renderCompletedOrdersArchive();

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                }
            );

        }

        renderCompletedOrdersArchive();

    }
);

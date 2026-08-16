// ==========================================
// Easy Order - Προεπισκόπηση και PDF ημερήσιας
// ==========================================


// Ασφαλής εμφάνιση κειμένου

function escapeDailyPdfText(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// Μορφοποίηση ημερομηνίας

function formatDailyPdfDate(value) {

    const parts =
        String(value || "")
        .split("-");


    if (parts.length !== 3) {

        return value || "";

    }


    return (
        parts[2] +
        "/" +
        parts[1] +
        "/" +
        parts[0].slice(-2)
    );

}


// Μορφοποίηση προαιρετικού ποσού

function formatOptionalDailyMoney(value) {

    if (
        value === "" ||
        value === null ||
        value === undefined
    ) {

        return "";

    }


    const number =
        Number(value);


    if (!Number.isFinite(number)) {

        return "";

    }


    return number
        .toFixed(2)
        .replace(".", ",");

}


// Συλλογή όλων των στοιχείων

function collectDailyPdfData() {

    const visits = [];


    document
        .querySelectorAll(
            "#dailyVisitsTableBody tr"
        )
        .forEach(row => {

            const visit = {

                customerCode:
                    row.querySelector(
                        ".dailyCustomerCode"
                    )?.value.trim() || "",

                customerName:
                    row.querySelector(
                        ".dailyCustomerName"
                    )?.value.trim() || "",

                orderCount:
                    row.querySelector(
                        ".dailyOrderCount"
                    )?.value || "",

                productCount:
                    row.querySelector(
                        ".dailyProductCount"
                    )?.value || "",

                salesValue:
                    row.querySelector(
                        ".dailySalesValue"
                    )?.value || "",

                collectionValue:
                    row.querySelector(
                        ".dailyCollectionValue"
                    )?.value || "",

                newCustomer:
                    row.querySelector(
                        ".dailyNewCustomer"
                    )?.checked || false,

                note:
                    row.querySelector(
                        ".dailyVisitNote"
                    )?.value.trim() || ""

            };


            const hasData =
                visit.customerCode !== "" ||
                visit.customerName !== "" ||
                visit.orderCount !== "" ||
                visit.productCount !== "" ||
                visit.salesValue !== "" ||
                visit.collectionValue !== "" ||
                visit.newCustomer ||
                visit.note !== "";


            if (hasData) {

                visits.push(visit);

            }

        });


    return {

        day:
            document.getElementById(
                "dailyDayName"
            )?.value || "",

        date:
            document.getElementById(
                "dailyDate"
            )?.value || "",

        seller:
            document.getElementById(
                "dailySeller"
            )?.value || "",

        areaNumber:
            document.getElementById(
                "dailyAreaNumber"
            )?.value || "",

        areaName:
            document.getElementById(
                "dailyAreaName"
            )?.value.trim() || "",

        visits: visits.slice(0, 22),

        totals: {

            visits:
                document.getElementById(
                    "dailyTotalVisits"
                )?.textContent || "0",

            orders:
                document.getElementById(
                    "dailyTotalOrders"
                )?.textContent || "0",

            products:
                document.getElementById(
                    "dailyTotalProducts"
                )?.textContent || "0",

            sales:
                document.getElementById(
                    "dailyTotalSales"
                )?.textContent || "0,00",

            collections:
                document.getElementById(
                    "dailyTotalCollections"
                )?.textContent || "0,00",

            newCustomers:
                document.getElementById(
                    "dailyTotalNewCustomers"
                )?.textContent || "0"

        },

        carried: {

            visits:
                document.getElementById(
                    "carriedVisits"
                )?.value || "",

            orders:
                document.getElementById(
                    "carriedOrders"
                )?.value || "",

            products:
                document.getElementById(
                    "carriedProducts"
                )?.value || "",

            sales:
                document.getElementById(
                    "carriedSales"
                )?.value || "",

            collections:
                document.getElementById(
                    "carriedCollections"
                )?.value || "",

            newCustomers:
                document.getElementById(
                    "carriedNewCustomers"
                )?.value || ""

        },

        general: {

            visits:
                document.getElementById(
                    "generalTotalVisits"
                )?.textContent || "0",

            orders:
                document.getElementById(
                    "generalTotalOrders"
                )?.textContent || "0",

            products:
                document.getElementById(
                    "generalTotalProducts"
                )?.textContent || "0",

            sales:
                document.getElementById(
                    "generalTotalSales"
                )?.textContent || "0,00",

            collections:
                document.getElementById(
                    "generalTotalCollections"
                )?.textContent || "0,00",

            newCustomers:
                document.getElementById(
                    "generalTotalNewCustomers"
                )?.textContent || "0"

        },

        startTime:
            document.getElementById(
                "dailyStartTime"
            )?.value || "",

        endTime:
            document.getElementById(
                "dailyEndTime"
            )?.value || "",

        kilometersFrom:
            document.getElementById(
                "dailyKilometersFrom"
            )?.value || "",

        kilometersTo:
            document.getElementById(
                "dailyKilometersTo"
            )?.value || "",

        totalKilometers:
            document.getElementById(
                "dailyTotalKilometers"
            )?.textContent || "0",

        fuel:
            document.getElementById(
                "dailyFuelExpense"
            )?.value || "",

        tolls:
            document.getElementById(
                "dailyTollsExpense"
            )?.value || "",

        food:
            document.getElementById(
                "dailyFoodExpense"
            )?.value || "",

        hotel:
            document.getElementById(
                "dailyHotelExpense"
            )?.value || "",

        totalExpenses:
            document.getElementById(
                "dailyTotalExpenses"
            )?.textContent || "0,00 €"

    };

}

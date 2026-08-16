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

// Δημιουργία του κάθετου εντύπου Α4

function createDailyPreviewHTML(data) {

    const rows = [];


    for (let index = 0; index < 22; index++) {

        const visit =
            data.visits[index] || {};


        rows.push(`

<tr>

<td>${index + 1}</td>

<td>
${escapeDailyPdfText(
    visit.customerCode || ""
)}
</td>

<td class="dailyPrintCustomer">
${escapeDailyPdfText(
    visit.customerName || ""
)}
</td>

<td>
${escapeDailyPdfText(
    visit.orderCount || ""
)}
</td>

<td>
${escapeDailyPdfText(
    visit.productCount || ""
)}
</td>

<td>
${escapeDailyPdfText(
    formatOptionalDailyMoney(
        visit.salesValue
    )
)}
</td>

<td>
${escapeDailyPdfText(
    formatOptionalDailyMoney(
        visit.collectionValue
    )
)}
</td>

<td>
${visit.newCustomer ? "1" : ""}
</td>

<td class="dailyPrintNote">
${escapeDailyPdfText(
    visit.note || ""
)}
</td>

</tr>

`);

    }


    const areaText =
        (
            data.areaNumber

                ? data.areaNumber + " - "

                : ""
        ) +
        (data.areaName || "");


    return `

<div class="dailyPrintPage">

    <div class="dailyPrintTitle">

        ΚΑΤΑΣΤΑΣΗ ΗΜΕΡΗΣΙΑΣ ΚΙΝΗΣΗΣ ΠΩΛΗΤΗ

    </div>


    <div class="dailyPrintHeaderFields">

        <div>
            <strong>ΗΜΕΡΑ</strong>
            <span>
                ${escapeDailyPdfText(
                    data.day
                )}
            </span>
        </div>

        <div>
            <strong>ΗΜΕΡΟΜΗΝΙΑ</strong>
            <span>
                ${escapeDailyPdfText(
                    formatDailyPdfDate(
                        data.date
                    )
                )}
            </span>
        </div>

        <div>
            <strong>ΠΩΛΗΤΗΣ</strong>
            <span>
                ${escapeDailyPdfText(
                    data.seller
                )}
            </span>
        </div>

        <div>
            <strong>ΠΕΡΙΟΧΗ</strong>
            <span>
                ${escapeDailyPdfText(
                    areaText
                )}
            </span>
        </div>

    </div>


    <table class="dailyPrintVisits">

        <thead>

            <tr>

                <th>Α/Α</th>
                <th>ΚΩΔ. ΠΕΛ.</th>
                <th>ΟΝΟΜΑ ΠΕΛΑΤΗ</th>
                <th>ΠΑΡ.</th>
                <th>ΑΡ. ΚΩΔ.</th>
                <th>ΑΞΙΑ ΠΩΛ.</th>
                <th>ΑΞΙΑ ΕΙΣΠΡ.</th>
                <th>ΝΕΟΙ</th>
                <th>ΣΗΜΕΙΩΣΗ</th>

            </tr>

        </thead>


        <tbody>

            ${rows.join("")}

        </tbody>

    </table>


    <table class="dailyPrintTotals">

        <tbody>

            <tr>

                <th>ΣΥΝΟΛΑ ΗΜΕΡΑΣ</th>
                <td>${escapeDailyPdfText(data.totals.visits)}</td>
                <td>${escapeDailyPdfText(data.totals.orders)}</td>
                <td>${escapeDailyPdfText(data.totals.products)}</td>
                <td>${escapeDailyPdfText(data.totals.sales)}</td>
                <td>${escapeDailyPdfText(data.totals.collections)}</td>
                <td>${escapeDailyPdfText(data.totals.newCustomers)}</td>

            </tr>


            <tr>

                <th>ΣΥΝΟΛΑ ΕΚ ΜΕΤΑΦΟΡΑΣ</th>
                <td>${escapeDailyPdfText(data.carried.visits)}</td>
                <td>${escapeDailyPdfText(data.carried.orders)}</td>
                <td>${escapeDailyPdfText(data.carried.products)}</td>
                <td>${escapeDailyPdfText(formatOptionalDailyMoney(data.carried.sales))}</td>
                <td>${escapeDailyPdfText(formatOptionalDailyMoney(data.carried.collections))}</td>
                <td>${escapeDailyPdfText(data.carried.newCustomers)}</td>

            </tr>


            <tr>

                <th>ΓΕΝΙΚΟ ΣΥΝΟΛΟ</th>
                <td>${escapeDailyPdfText(data.general.visits)}</td>
                <td>${escapeDailyPdfText(data.general.orders)}</td>
                <td>${escapeDailyPdfText(data.general.products)}</td>
                <td>${escapeDailyPdfText(data.general.sales)}</td>
                <td>${escapeDailyPdfText(data.general.collections)}</td>
                <td>${escapeDailyPdfText(data.general.newCustomers)}</td>

            </tr>

        </tbody>

    </table>


    <table class="dailyPrintTravel">

        <tbody>

            <tr>

                <th>ΕΝΑΡΞΗ ΩΡΑΡΙΟΥ</th>
                <td>${escapeDailyPdfText(data.startTime)}</td>

                <th>ΛΗΞΗ ΩΡΑΡΙΟΥ</th>
                <td>${escapeDailyPdfText(data.endTime)}</td>

            </tr>


            <tr>

                <th>ΧΙΛΙΟΜΕΤΡΑ ΑΠΟ</th>
                <td>${escapeDailyPdfText(data.kilometersFrom)}</td>

                <th>ΕΩΣ</th>
                <td>${escapeDailyPdfText(data.kilometersTo)}</td>

                <th>ΣΥΝΟΛΟ</th>
                <td>${escapeDailyPdfText(data.totalKilometers)}</td>

            </tr>

        </tbody>

    </table>


    <table class="dailyPrintExpenses">

        <tbody>

            <tr>

                <th>ΚΑΥΣΙΜΑ</th>
                <td>${escapeDailyPdfText(formatOptionalDailyMoney(data.fuel))}</td>

                <th>ΔΙΟΔΙΑ / FERRY</th>
                <td>${escapeDailyPdfText(formatOptionalDailyMoney(data.tolls))}</td>

            </tr>


            <tr>

                <th>ΦΑΓΗΤΑ</th>
                <td>${escapeDailyPdfText(formatOptionalDailyMoney(data.food))}</td>

                <th>ΞΕΝΟΔΟΧΕΙΑ</th>
                <td>${escapeDailyPdfText(formatOptionalDailyMoney(data.hotel))}</td>

            </tr>


            <tr>

                <th colspan="3">
                    ΣΥΝΟΛΟ ΕΞΟΔΩΝ
                </th>

                <td>
                    ${escapeDailyPdfText(
                        data.totalExpenses
                    )}
                </td>

            </tr>

        </tbody>

    </table>

</div>

`;

}


// Άνοιγμα προεπισκόπησης

function previewDailyReport() {

    calculateDailyTotals();

    calculateDailyTravelAndExpenses();


    const data =
        collectDailyPdfData();


    closeDailyReportPreview();


    const overlay =
        document.createElement("div");


    overlay.id =
        "dailyReportPreviewOverlay";


    overlay.innerHTML = `

<div class="dailyReportPreviewWindow">

    ${createDailyPreviewHTML(data)}


    <div class="dailyReportPreviewButtons">

        <button
        type="button"
        onclick="createDailyReportPDF()">

        📄 Δημιουργία PDF

        </button>


        <button
        type="button"
        class="closeDailyPreviewButton"
        onclick="closeDailyReportPreview()">

        Κλείσιμο

        </button>

    </div>

</div>

`;


    document.body.appendChild(overlay);

    document.body.style.overflow =
        "hidden";


    addDailyPreviewStyles();

}


// Κλείσιμο προεπισκόπησης

function closeDailyReportPreview() {

    const overlay =
        document.getElementById(
            "dailyReportPreviewOverlay"
        );


    if (overlay) {

        overlay.remove();

    }


    document.body.style.overflow =
        "";

}

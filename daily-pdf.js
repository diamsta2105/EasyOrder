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
    (data.seller || "").toUpperCase()
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

        <colgroup>

            <col style="width: 5%;">
            <col style="width: 11%;">
            <col style="width: 22%;">
            <col style="width: 6%;">
            <col style="width: 8%;">
            <col style="width: 10%;">
            <col style="width: 11%;">
            <col style="width: 6%;">
            <col style="width: 21%;">

        </colgroup>


        <thead>

            <tr class="dailyPrintVisitsHeading">

                <th colspan="2"></th>

                <th>ΕΠΙΣΚΕΨΕΙΣ</th>

                <th colspan="6"></th>

            </tr>

        </thead>


        <tbody>

            <tr>

                <th colspan="2">
                    ΣΥΝΟΛΑ ΗΜΕΡΑΣ
                </th>

                <td>
                    ${escapeDailyPdfText(
                        data.totals.visits
                    )}
                </td>

                <td>
                    ${escapeDailyPdfText(
                        data.totals.orders
                    )}
                </td>

                <td>
                    ${escapeDailyPdfText(
                        data.totals.products
                    )}
                </td>

                <td>
                    ${escapeDailyPdfText(
                        data.totals.sales
                    )}
                </td>

                <td>
                    ${escapeDailyPdfText(
                        data.totals.collections
                    )}
                </td>

                <td>
                    ${escapeDailyPdfText(
                        data.totals.newCustomers
                    )}
                </td>

                <td></td>

            </tr>


            <tr>

                <th colspan="2">
                    ΣΥΝΟΛΑ ΕΚ ΜΕΤΑΦΟΡΑΣ
                </th>

                <td>
                    ${escapeDailyPdfText(
                        data.carried.visits
                    )}
                </td>

                <td>
                    ${escapeDailyPdfText(
                        data.carried.orders
                    )}
                </td>

                <td>
                    ${escapeDailyPdfText(
                        data.carried.products
                    )}
                </td>

                <td>
                    ${escapeDailyPdfText(
                        formatOptionalDailyMoney(
                            data.carried.sales
                        )
                    )}
                </td>

                <td>
                    ${escapeDailyPdfText(
                        formatOptionalDailyMoney(
                            data.carried.collections
                        )
                    )}
                </td>

                <td>
                    ${escapeDailyPdfText(
                        data.carried.newCustomers
                    )}
                </td>

                <td></td>

            </tr>


            <tr>

                <th colspan="2">
                    ΓΕΝΙΚΟ ΣΥΝΟΛΟ
                </th>

                <td>
                    ${escapeDailyPdfText(
                        data.general.visits
                    )}
                </td>

                <td>
                    ${escapeDailyPdfText(
                        data.general.orders
                    )}
                </td>

                <td>
                    ${escapeDailyPdfText(
                        data.general.products
                    )}
                </td>

                <td>
                    ${escapeDailyPdfText(
                        data.general.sales
                    )}
                </td>

                <td>
                    ${escapeDailyPdfText(
                        data.general.collections
                    )}
                </td>

                <td>
                    ${escapeDailyPdfText(
                        data.general.newCustomers
                    )}
                </td>

                <td></td>

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

// Προσθήκη εμφάνισης προεπισκόπησης

function addDailyPreviewStyles() {

    if (
        document.getElementById(
            "dailyPreviewStyles"
        )
    ) {

        return;

    }


    const style =
        document.createElement("style");


    style.id =
        "dailyPreviewStyles";


    style.textContent = `

#dailyReportPreviewOverlay {
    position: fixed;
    inset: 0;
    z-index: 99999;
    padding: 15px;
    box-sizing: border-box;
    background: rgba(0, 0, 0, 0.78);
    overflow: auto;
}

.dailyReportPreviewWindow {
    width: 100%;
    max-width: 850px;
    margin: auto;
}

.dailyPrintPage {
    width: 794px;
    min-height: 1123px;
    margin: auto;
    padding: 18px;
    box-sizing: border-box;
    background: white;
    color: #111;
    font-family: Arial, sans-serif;
}

.dailyPrintTitle {
    padding: 5px 0 9px;
    text-align: center;
    font-size: 21px;
    font-weight: bold;
}

.dailyPrintHeaderFields {
    display: grid;
    grid-template-columns: 1fr 1.2fr 1fr 1.4fr;
    gap: 7px;
    margin-bottom: 8px;
}

.dailyPrintHeaderFields > div {
    display: grid;
    grid-template-columns: auto 1fr;
    border: 1px solid #777;
    font-size: 11px;
}

.dailyPrintHeaderFields strong {
    padding: 5px;
    background: #003b70;
    color: white;
}

.dailyPrintHeaderFields span {
    padding: 5px;
    text-align: center;
}

.dailyPrintPage table {
    width: 100%;
    margin: 0;
    border-collapse: collapse;
    table-layout: fixed;
}

.dailyPrintVisits {
    font-size: 11px;
    font-weight: 600;
}

.dailyPrintVisits th {
    height: 28px;
    padding: 4px 2px;
    background: #003b70;
    color: white;
    border: 1px solid #555;
    white-space: nowrap;
}

.dailyPrintVisits td {
    height: 31px;
    padding: 3px;
    border: 1px solid #888;
    box-sizing: border-box;
    text-align: center;
    overflow: hidden;
}

.dailyPrintVisits th:nth-child(1),
.dailyPrintVisits td:nth-child(1) {
    width: 5%;
}

.dailyPrintVisits th:nth-child(2),
.dailyPrintVisits td:nth-child(2) {
    width: 11%;
}

.dailyPrintVisits th:nth-child(3),
.dailyPrintVisits td:nth-child(3) {
    width: 22%;
}

.dailyPrintVisits th:nth-child(4),
.dailyPrintVisits td:nth-child(4) {
    width: 6%;
}

.dailyPrintVisits th:nth-child(5),
.dailyPrintVisits td:nth-child(5) {
    width: 8%;
}

.dailyPrintVisits th:nth-child(6),
.dailyPrintVisits td:nth-child(6) {
    width: 10%;
}

.dailyPrintVisits th:nth-child(7),
.dailyPrintVisits td:nth-child(7) {
    width: 11%;
}

.dailyPrintVisits th:nth-child(8),
.dailyPrintVisits td:nth-child(8) {
    width: 6%;
}

.dailyPrintVisits th:nth-child(9),
.dailyPrintVisits td:nth-child(9) {
    width: 21%;
}

.dailyPrintCustomer,
.dailyPrintNote {
    text-align: left !important;
}

.dailyPrintTotals,
.dailyPrintTravel,
.dailyPrintExpenses {
    margin-top: 9px !important;
    font-size: 11px;
    font-weight: 600;
}

.dailyPrintTotals th,
.dailyPrintTravel th,
.dailyPrintExpenses th {
    padding: 6px;
    background: #f3f3f3;
    color: #111;
    border: 1px solid #777;
    text-align: left;
}

.dailyPrintTotals td,
.dailyPrintTravel td,
.dailyPrintExpenses td {
    padding: 6px;
    border: 1px solid #777;
    text-align: center;
}

.dailyPrintTotals th {
    width: auto;
}

.dailyPrintVisitsHeading th {
    padding: 2px;
    background: white;
    border: none;
    text-align: center;
    font-size: 9px;
    font-weight: bold;
}

.dailyPrintVisitsHeading th:nth-child(2) {
    border: 1px solid #777;
    background: #f3f3f3;
}

.dailyPrintTotals tbody th {
    padding: 4px 2px;
    font-size: 10px;
    font-weight: 600;
    white-space: nowrap;
}

.dailyPrintTotals tbody td {
    padding: 4px 2px;
    font-size: 11px;
    font-weight: 600;
    text-align: center;
}

.dailyPrintTravel th,
.dailyPrintExpenses th {
    width: 18%;
}

.dailyPrintExpenses tr:last-child th,
.dailyPrintExpenses tr:last-child td {
    font-weight: bold;
}

.dailyPrintExpenses {
    width: 60% !important;
    margin-left: 0 !important;
    margin-right: auto !important;
}

.dailyPrintExpenses th {
    width: 22%;
}

.dailyPrintExpenses td {
    width: 28%;
}

.dailyReportPreviewButtons {
    display: flex;
    gap: 10px;
    max-width: 794px;
    margin: 15px auto;
}

.dailyReportPreviewButtons button {
    flex: 1;
}

.closeDailyPreviewButton {
    background: #666;
}

@media (max-width: 850px) {

    .dailyPrintPage {
        width: 100%;
        min-height: auto;
        padding: 7px;
    }

    .dailyPrintTitle {
        padding: 2px 0 4px;
        font-size: 9px;
    }

    .dailyPrintHeaderFields {
        gap: 2px;
        margin-bottom: 3px;
    }

    .dailyPrintHeaderFields > div {
        font-size: 4.5px;
    }

    .dailyPrintHeaderFields strong,
    .dailyPrintHeaderFields span {
        padding: 2px;
    }

    .dailyPrintVisits {
        font-size: 4px;
    }

    .dailyPrintVisits th {
        height: 12px;
        padding: 1px;
    }

    .dailyPrintVisits td {
        height: 13px;
        padding: 1px;
    }

    .dailyPrintTotals,
    .dailyPrintTravel,
    .dailyPrintExpenses {
        margin-top: 3px !important;
        font-size: 4.5px;
    }

    .dailyPrintTotals th,
    .dailyPrintTotals td,
    .dailyPrintTravel th,
    .dailyPrintTravel td,
    .dailyPrintExpenses th,
    .dailyPrintExpenses td {
        padding: 2px;
    }

}

`;


    document.head.appendChild(style);

}

// Δημιουργία PDF ημερήσιας

async function createDailyReportPDF() {

    if (
        typeof html2canvas !==
        "function"
    ) {

        alert(
            "Δεν έχει φορτωθεί το html2canvas."
        );

        return;

    }


    if (
        !window.jspdf ||
        !window.jspdf.jsPDF
    ) {

        alert(
            "Δεν έχει φορτωθεί το jsPDF."
        );

        return;

    }


    let previewPage =
        document.querySelector(
            ".dailyPrintPage"
        );


    if (!previewPage) {

        previewDailyReport();


        await new Promise(resolve =>
            requestAnimationFrame(resolve)
        );


        previewPage =
            document.querySelector(
                ".dailyPrintPage"
            );

    }


    if (!previewPage) {

        alert(
            "Δεν βρέθηκε η προεπισκόπηση."
        );

        return;

    }


    const pdfButtons =
        document.querySelectorAll(
            "#createDailyPdfButton, " +
            ".dailyReportPreviewButtons button:first-child"
        );


    pdfButtons.forEach(button => {

        button.disabled = true;

    });


    let printContainer = null;


    try {

        printContainer =
            document.createElement("div");


        printContainer.style.position =
            "fixed";

        printContainer.style.left =
            "-10000px";

        printContainer.style.top =
            "0";

        printContainer.style.width =
            "794px";

        printContainer.style.background =
            "white";

        printContainer.style.zIndex =
            "-1";


        const printPage =
            previewPage.cloneNode(true);


        printPage.style.width =
            "794px";

        printPage.style.minHeight =
            "1123px";

        printPage.style.margin =
            "0";

        printPage.style.padding =
            "18px";

        printPage.style.boxSizing =
            "border-box";


        printContainer.appendChild(
            printPage
        );


        document.body.appendChild(
            printContainer
        );


        await new Promise(resolve =>
            requestAnimationFrame(resolve)
        );


        const canvas =
            await html2canvas(
                printPage,
                {

                    scale: 2,

                    backgroundColor:
                        "#ffffff",

                    useCORS: true,

                    logging: false,

                    windowWidth: 1200

                }
            );


        const { jsPDF } =
            window.jspdf;


        const pdf =
            new jsPDF({

                orientation: "portrait",

                unit: "mm",

                format: "a4"

            });


        const pdfWidth =
            pdf.internal
            .pageSize
            .getWidth();


        const pdfHeight =
            pdf.internal
            .pageSize
            .getHeight();


        const imageData =
    canvas.toDataURL(
        "image/png"
    );


        let imageWidth =
            pdfWidth;


        let imageHeight =
            canvas.height *
            imageWidth /
            canvas.width;


        if (imageHeight > pdfHeight) {

            imageHeight =
                pdfHeight;


            imageWidth =
                canvas.width *
                imageHeight /
                canvas.height;

        }


        const imageX =
            (
                pdfWidth -
                imageWidth
            ) / 2;


        pdf.addImage(
            imageData,
            "PNG",
            imageX,
            0,
            imageWidth,
            imageHeight
        );


        const date =
            document.getElementById(
                "dailyDate"
            )?.value ||
            getDailyTodayDate();


        const seller =
            document.getElementById(
                "dailySeller"
            )?.value ||
            "Πωλητής";


        const safeSeller =
            seller.replace(
                /[^A-Za-zΑ-Ωα-ωΆ-ώ0-9_-]/g,
                "-"
            );


        pdf.save(
            "Ημερήσια-" +
            date +
            "-" +
            safeSeller +
            ".pdf"
        );


    } catch (error) {

        console.error(
            "Σφάλμα ημερήσιου PDF:",
            error
        );


        alert(
            "Δεν δημιουργήθηκε το PDF: " +
            error.message
        );


    } finally {

        if (printContainer) {

            printContainer.remove();

        }


        pdfButtons.forEach(button => {

            button.disabled = false;

        });

    }

}


// Σύνδεση κουμπιών

window.addEventListener(
    "DOMContentLoaded",
    function () {

        const previewButton =
            document.getElementById(
                "previewDailyReportButton"
            );


        const pdfButton =
            document.getElementById(
                "createDailyPdfButton"
            );


        if (previewButton) {

            previewButton.addEventListener(
                "click",
                previewDailyReport
            );

        }


        if (pdfButton) {

            pdfButton.addEventListener(
                "click",
                createDailyReportPDF
            );

        }

    }
);

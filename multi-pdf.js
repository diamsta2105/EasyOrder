// ==========================================
// Easy Order - Προεπισκόπηση πολλών παραγγελιών
// ==========================================


// Παίρνει τις επιλεγμένες παραγγελίες
function getSelectedOrdersForPreview() {

    const selectedBoxes =
        document.querySelectorAll(
            ".orderSelectCheckbox:checked"
        );


    const allOrders =
        JSON.parse(
            localStorage.getItem("draftOrders")
        ) || [];


    const selectedOrders = [];


    selectedBoxes.forEach(box => {

        const index =
            Number(box.dataset.orderIndex);


        if (allOrders[index]) {

            selectedOrders.push(
                allOrders[index]
            );

        }

    });


    return selectedOrders;

}


// Ανοίγει την προεπισκόπηση
function previewSelectedOrders() {

    const selectedOrders =
        getSelectedOrdersForPreview();


    if (
    selectedOrders.length < 2 ||
    selectedOrders.length > 5
) {

    alert(
        "Επίλεξε από 2 έως 5 παραγγελίες."
    );

    return;

    }


    closeSelectedOrdersPreview();


    const overlay =
        document.createElement("div");


    overlay.id =
        "selectedOrdersPreviewOverlay";


    const ordersHTML =
    selectedOrders
    .map((order, index) =>
        createPreviewOrderHTML(
            order,
            index === 0
        )
    )
    .join("");


    overlay.innerHTML = `

<div class="selectedOrdersPreviewWindow">

    <div class="selectedOrdersPreviewPage">

        ${ordersHTML}

    </div>


    <div class="selectedPreviewButtons">

    <button
        type="button"
        class="createSelectedPdfButton"
        onclick="createSelectedOrdersPDF()">

        📄 Δημιουργία PDF

    </button>

    <button
        type="button"
        class="closeSelectedOrdersPreview"
        onclick="closeSelectedOrdersPreview()">

        Κλείσιμο προεπισκόπησης

    </button>

</div>

</div>

`;


    document.body.appendChild(
        overlay
    );


    addSelectedOrdersPreviewStyles();


    document.body.style.overflow =
        "hidden";

}


// Δημιουργεί την εμφάνιση μίας παραγγελίας
function createPreviewOrderHTML(
    order,
    showMainHeader
) {
    const products =
        Array.isArray(order.products)
            ? order.products
            : [];


    const productsHTML =
        products.length > 0

            ? products.map(product => `

<tr>

    <td>
        ${escapePreviewText(
            product.code || ""
        )}
    </td>

    <td>
        ${escapePreviewText(
            product.description || ""
        )}
    </td>

    <td>
        ${escapePreviewText(
            product.quantity || "0"
        )}
    </td>

    <td>
        ${formatPreviewNumber(
            product.price
        )}
    </td>

    <td>
        ${
            product.discount !== "" &&
            product.discount !== null &&
            product.discount !== undefined

                ? escapePreviewText(
                    product.discount
                ) + "%"

                : "-"
        }
    </td>

    <td>
        ${formatPreviewNumber(
            product.finalPrice
        )}
    </td>

</tr>

`).join("")

            : `

<tr>

    <td colspan="6">
        Δεν υπάρχουν προϊόντα.
    </td>

</tr>

`;


    return `

<div class="selectedPreviewOrder">

    ${
        showMainHeader
            ? `

    <div class="selectedPreviewHeader">

        <strong>FÖRCH</strong>

        <span>Easy Order</span>

    </div>


    <div class="selectedPreviewTitle">

        ΔΕΛΤΙΟ ΠΑΡΑΓΓΕΛΙΑΣ

    </div>

`
            : ""
    }


    <div class="selectedPreviewInfo">

    ${
        showMainHeader
            ? `

    <div>
        <strong>ΗΜΕΡΟΜΗΝΙΑ:</strong>
        ${escapePreviewText(
            order.date || "-"
        )}
    </div>


    <div>
        <strong>ΚΩΔ. ΠΩΛΗΤΗ:</strong>
        ${escapePreviewText(
            order.seller || "-"
        )}
    </div>

`
            : ""
    }


    <div>
        <strong>ΚΩΔΙΚΟΣ ΠΕΛΑΤΗ:</strong>
        ${escapePreviewText(
            order.customerCode || "-"
        )}
    </div>


    <div>
        <strong>ΕΠΩΝΥΜΙΑ:</strong>
        ${escapePreviewText(
            order.customer || "-"
        )}
    </div>


    <div>
        <strong>ΠΕΡΙΟΧΗ:</strong>
        ${escapePreviewText(
            order.area || "-"
        )}
    </div>

</div>


    <table class="selectedPreviewProducts">

        <thead>

            <tr>

                <th>Κωδικός</th>
                <th>Περιγραφή</th>
                <th>Ποσ.</th>
                <th>Τιμή</th>
                <th>Έκπτ.</th>
                <th>Σύνολο</th>

            </tr>

        </thead>


        <tbody>

            ${productsHTML}

        </tbody>

    </table>


    <div class="selectedPreviewFooter">

        <div class="selectedPreviewNotes">

            ${
                order.notes &&
                order.notes.trim() !== ""

                    ? "<strong>Παρατηρήσεις:</strong> " +
                      escapePreviewText(
                          order.notes
                      )

                    : ""
            }

        </div>


        <div class="selectedPreviewTotal">

            <strong>Γενικό Σύνολο:</strong>

            ${escapePreviewText(
                order.total || "0,00 €"
            )}

        </div>

    </div>

</div>

`;

}


// Κλείνει την προεπισκόπηση
function closeSelectedOrdersPreview() {

    const overlay =
        document.getElementById(
            "selectedOrdersPreviewOverlay"
        );


    if (overlay) {

        overlay.remove();

    }



    document.body.style.overflow =
        "";

}

// ==========================================
// Δημιουργία PDF από την προεπισκόπηση
// ==========================================

async function createSelectedOrdersPDF() {

    const previewPage =
        document.querySelector(
            ".selectedOrdersPreviewPage"
        );


    if (!previewPage) {

        alert(
            "Δεν βρέθηκε η προεπισκόπηση."
        );

        return;

    }


    if (typeof html2canvas !== "function") {

        alert(
            "Δεν έχει φορτωθεί η βιβλιοθήκη html2canvas."
        );

        return;

    }


    if (
        !window.jspdf ||
        !window.jspdf.jsPDF
    ) {

        alert(
            "Δεν έχει φορτωθεί η βιβλιοθήκη jsPDF."
        );

        return;

    }


    const createButton =
        document.querySelector(
            ".createSelectedPdfButton"
        );


    const originalButtonText =
        createButton
            ? createButton.innerHTML
            : "";


    try {

        if (createButton) {

            createButton.disabled =
                true;

            createButton.innerHTML =
                "Δημιουργία PDF...";

        }


        /*
         * Δημιουργούμε αντίγραφο της σελίδας
         * εκτός οθόνης, ώστε το PDF να μην
         * επηρεάζεται από το μικρό πλάτος
         * της οθόνης του κινητού.
         */

        const printContainer =
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

        printPage.style.height =
            "auto";

        printPage.style.margin =
            "0";

        printPage.style.padding =
            "24px";

        printPage.style.boxSizing =
            "border-box";

        printPage.style.aspectRatio =
            "auto";


        /*
         * Επαναφέρουμε τις κανονικές
         * διαστάσεις εκτύπωσης, ώστε να
         * μην εφαρμοστούν τα πολύ μικρά
         * γράμματα του mobile CSS.
         */

        printPage
            .querySelectorAll(
                ".selectedPreviewOrder"
            )
            .forEach(order => {

                order.style.padding =
                    "8px 0 14px 0";

                order.style.marginBottom =
                    "50px";

            });


        printPage
            .querySelectorAll(
                ".selectedPreviewHeader"
            )
            .forEach(element => {

                element.style.fontSize =
                    "16px";

            });


        printPage
            .querySelectorAll(
                ".selectedPreviewTitle"
            )
            .forEach(element => {

                element.style.fontSize =
                    "14px";

                element.style.padding =
                    "4px 0";

                element.style.marginBottom =
                    "5px";

            });


        printPage
            .querySelectorAll(
                ".selectedPreviewInfo"
            )
            .forEach(element => {

                element.style.fontSize =
                    "10px";

                element.style.gap =
                    "3px 12px";

                element.style.marginBottom =
                    "6px";

            });


        printPage
            .querySelectorAll(
                ".selectedPreviewProducts"
            )
            .forEach(element => {

                element.style.fontSize =
                    "11px";

            });


        printPage
            .querySelectorAll(
                ".selectedPreviewProducts th"
            )
            .forEach(element => {

                element.style.padding =
                    "4px 2px";

            });


        printPage
            .querySelectorAll(
                ".selectedPreviewProducts td"
            )
            .forEach(element => {

                element.style.padding =
                    "3px 2px";

            });


        printPage
    .querySelectorAll(
        ".selectedPreviewFooter"
    )
    .forEach(element => {

        element.style.fontSize =
            "11px";

        element.style.fontWeight =
            "bold";

        element.style.marginTop =
            "16px";

    });


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


        printContainer.remove();


        const { jsPDF } =
            window.jspdf;


        const pdf =
            new jsPDF({

                orientation:
                    "portrait",

                unit:
                    "mm",

                format:
                    "a4"

            });


        const pdfWidth =
            pdf.internal.pageSize.getWidth();


        const pdfHeight =
            pdf.internal.pageSize.getHeight();


        const imageData =
    canvas.toDataURL(
        "image/png"
    );


        /*
         * Υπολογίζουμε το ύψος της εικόνας
         * χωρίς να παραμορφώνεται.
         */

        const imageHeight =
            canvas.height *
            pdfWidth /
            canvas.width;


        /*
         * Αν όλο το περιεχόμενο χωράει
         * σε μία Α4, το τοποθετούμε κανονικά.
         */

        if (imageHeight <= pdfHeight) {

            pdf.addImage(
                imageData,
                "PNG",
                0,
                0,
                pdfWidth,
                imageHeight
            );

        } else {

            /*
             * Αν το περιεχόμενο είναι ψηλότερο
             * από μία Α4, το συνεχίζουμε σε
             * επόμενες σελίδες.
             */

            let remainingHeight =
                imageHeight;


            let position =
                0;


            pdf.addImage(
                imageData,
                "PNG",
                0,
                position,
                pdfWidth,
                imageHeight
            );


            remainingHeight -=
                pdfHeight;


            while (remainingHeight > 0) {

                position =
                    remainingHeight -
                    imageHeight;


                pdf.addPage();


                pdf.addImage(
                    imageData,
                    "PNG",
                    0,
                    position,
                    pdfWidth,
                    imageHeight
                );


                remainingHeight -=
                    pdfHeight;

            }

        }


        const selectedOrders =
            getSelectedOrdersForPreview();


        const orderDate =
            selectedOrders[0]?.date ||
            (
                typeof getTodayDate ===
                "function"

                    ? getTodayDate()

                    : new Date()
                        .toISOString()
                        .slice(0, 10)
            );


        pdf.save(
            "Παραγγελίες-" +
            orderDate +
            ".pdf"
        );


    } catch (error) {

        console.error(
            "Σφάλμα δημιουργίας PDF:",
            error
        );


        alert(
            "Δεν δημιουργήθηκε το PDF: " +
            error.message
        );


        const printContainer =
            document.querySelector(
                'div[style*="-10000px"]'
            );


        if (printContainer) {

            printContainer.remove();

        }

    } finally {

        if (createButton) {

            createButton.disabled =
                false;

            createButton.innerHTML =
                originalButtonText;

        }

    }

            }

// Μορφοποίηση αριθμών
function formatPreviewNumber(value) {

    const number =
        Number(value) || 0;


    return number.toFixed(2);

}


// Ασφαλής εμφάνιση κειμένου
function escapePreviewText(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// Προσθήκη CSS της προεπισκόπησης
function addSelectedOrdersPreviewStyles() {

    if (
        document.getElementById(
            "selectedOrdersPreviewStyles"
        )
    ) {

        return;

    }


    const style =
        document.createElement("style");


    style.id =
        "selectedOrdersPreviewStyles";


    style.textContent = `

#selectedOrdersPreviewOverlay {

    position: fixed;

    inset: 0;

    z-index: 99999;

    background: rgba(0, 0, 0, 0.75);

    overflow: auto;

    padding: 15px;

    box-sizing: border-box;

}


.selectedOrdersPreviewWindow {

    width: 100%;

    max-width: 850px;

    margin: auto;

}


.selectedOrdersPreviewPage {

    width: 794px;

    min-height: 1123px;

    margin: auto;

    padding: 24px;

    box-sizing: border-box;

    background: white;

}


.selectedPreviewOrder {

    padding: 8px 0 14px 0;

    margin-bottom: 50px;

    color: #111;

    font-family: Arial, sans-serif;

}

.selectedPreviewHeader {

    display: flex;

    justify-content: space-between;

    font-size: 16px;

}


.selectedPreviewTitle {

    text-align: center;

    font-size: 14px;

    font-weight: bold;

    padding: 4px 0;

    margin-bottom: 5px;

    border-bottom: 1px solid #ccc;

}


.selectedPreviewInfo {

    display: grid;

    grid-template-columns: 1fr 1fr;

    gap: 3px 12px;

    margin-bottom: 6px;

    font-size: 10px;

}


.selectedPreviewProducts {

    width: 100%;

    border-collapse: collapse;

    margin: 0;

    font-size: 9px;

}


.selectedPreviewProducts th {

    background: #003b70;

    color: white;

    padding: 4px 2px;

}


.selectedPreviewProducts td {

    padding: 3px 2px;

    border-bottom: 1px solid #ddd;

    text-align: center;

}


.selectedPreviewProducts td:nth-child(2) {

    text-align: left;

}


.selectedPreviewFooter {

    display: flex;

    justify-content: space-between;

    gap: 10px;

    margin-top: 16px;

    font-size: 11px;

    font-weight: bold;

}


.selectedPreviewNotes {

    flex: 1;

}


.selectedPreviewTotal {

    white-space: nowrap;

}


.closeSelectedOrdersPreview {

    margin: 15px auto;

    display: block;

    max-width: 794px;

    background: #666;

}


@media (max-width: 850px) {

    .selectedOrdersPreviewPage {

        width: 100%;

        min-height: auto;

        aspect-ratio: 210 / 297;

        padding: 8px;

        gap: 5px;

    }


    .selectedPreviewOrder {

        padding: 4px;

    }


    .selectedPreviewHeader {

        font-size: 9px;

    }


    .selectedPreviewTitle {

        font-size: 7px;

        padding: 2px 0;

        margin-bottom: 2px;

    }


    .selectedPreviewInfo {

        font-size: 5px;

        gap: 1px 4px;

        margin-bottom: 2px;

    }


    .selectedPreviewProducts {

        font-size: 4.5px;

    }


    .selectedPreviewProducts th,
    .selectedPreviewProducts td {

        padding: 1px;

    }


    .selectedPreviewFooter {

        font-size: 5px;

        margin-top: 2px;

    }

}

.selectedPreviewButtons {

    display: flex;

    gap: 10px;

    max-width: 794px;

    margin: 15px auto;

}

.selectedPreviewButtons button {

    flex: 1;

}

.createSelectedPdfButton {

    background: #0b7a3b;

}

`;


    document.head.appendChild(
        style
    );

}

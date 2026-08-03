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
        selectedOrders.length > 3
    ) {

        alert(
            "Επίλεξε 2 ή 3 παραγγελίες."
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
        <strong>Ημερομηνία:</strong>
        ${escapePreviewText(
            order.date || "-"
        )}
    </div>


    <div>
        <strong>Κωδ. Πωλητή:</strong>
        ${escapePreviewText(
            order.seller || "-"
        )}
    </div>

`
            : ""
    }


    <div>
        <strong>Κωδικός πελάτη:</strong>
        ${escapePreviewText(
            order.customerCode || "-"
        )}
    </div>


    <div>
        <strong>Επωνυμία:</strong>
        ${escapePreviewText(
            order.customer || "-"
        )}
    </div>


    <div>
        <strong>Περιοχή:</strong>
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

    margin-bottom: 36px;

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

    font-size: 8px;

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

    margin-top: 6px;

    font-size: 9px;

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

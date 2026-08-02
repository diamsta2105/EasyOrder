// ==========================================
// Test-pdf.js - Διορθωμένος Κώδικας PDF
// ==========================================

// 1. Συνάρτηση που καλείται από το κουμπί στο HTML
function generatePDF() {
    try {
        // Συλλογή βασικών στοιχείων παραγγελίας
        const dateVal = document.getElementById("date")?.value || "";
        const customerVal = document.getElementById("customer")?.value || "";
        const areaVal = document.getElementById("area")?.value || "";
        const notesVal = document.getElementById("notes")?.value || "";
        const totalVal = document.getElementById("total")?.innerText || "0,00 €";

        // Συλλογή προϊόντων από τον πίνακα
        const productRows = document.querySelectorAll("#products tr");
        const productsList = [];

        productRows.forEach(row => {
            const code = row.querySelector(".code")?.value || "";
            const description = row.querySelector(".description")?.value || "";
            const quantity = row.querySelector(".quantity")?.value || "0";
            const price = row.querySelector(".price")?.value || "0";
            const discount = row.querySelector(".discount")?.value || "";
            const finalPrice = row.querySelector(".finalPrice")?.value || "0";

            // Προσθήκη μόνο αν υπάρχει κωδικός ή περιγραφή
            if (code.trim() !== "" || description.trim() !== "") {
                productsList.push({
                    code: code,
                    description: description,
                    quantity: quantity,
                    price: price,
                    discount: discount,
                    finalPrice: finalPrice
                });
            }
        });

        // Δημιουργία αντικειμένου παραγγελίας
        const orderData = {
            number:
    document.getElementById("orderNumber")?.value || "-"
            date: dateVal,
            customer: customerVal,
            area: areaVal,
            products: productsList,
            total: totalVal,
            notes: notesVal
        };

        // Κλήση της συνάρτησης δημιουργίας PDF
        downloadPDF(orderData);

    } catch (err) {
        console.error(err);
        alert("Σφάλμα κατά τη συλλογή των στοιχείων: " + err.message);
    }
}


// 2. Κύρια συνάρτηση κατασκευής του PDF
function downloadPDF(order) {
    try {
        if (!window.jspdf || !window.jspdf.jsPDF) {
            alert("Σφάλμα: Η βιβλιοθήκη jsPDF δεν έχει φορτωθεί ακόμα στο HTML σας!");
            return;
        }

        const { jsPDF } = window.jspdf;

        if (!order) {
            alert("Σφάλμα: Δεν βρέθηκαν δεδομένα για αυτή την παραγγελία.");
            return;
        }

        let doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });

        // Ασφαλής εφαρμογή της ελληνικής γραμματοσειράς
        function applyGreekFont(style = "normal") {
            try {
                doc.setFont("CustomGreek", style);
            } catch (e) {
                throw new Error("Βεβαιωθείτε ότι το αρχείο fonts.js έχει φορτωθεί σωστά.");
            }
        }

        let pageWidth = doc.internal.pageSize.getWidth();

        // Σχεδίαση κεφαλίδας πίνακα
        function drawTableHeader(currentY) {
            doc.setFillColor(44, 62, 80); // Σκούρο μπλε
            doc.rect(15, currentY, pageWidth - 30, 8, "F");
            doc.setTextColor(255, 255, 255);
            applyGreekFont("normal");
            doc.setFontSize(10);
            
            doc.text("Κωδικός", 17, currentY + 5.5);
            doc.text("Περιγραφή", 45, currentY + 5.5);
            doc.text("Ποσ.", 125, currentY + 5.5, { align: "right" });
            doc.text("Τιμή", 145, currentY + 5.5, { align: "right" });
            doc.text("Έκπτ.", 165, currentY + 5.5, { align: "right" });
            doc.text("Σύνολο", 192, currentY + 5.5, { align: "right" });
            
            doc.setTextColor(0, 0, 0); // Επαναφορά σε μαύρο
        }

        applyGreekFont("normal");
        let y = 15;

        // =====================
        // ΚΕΦΑΛΙΔΑ ΕΓΓΡΑΦΟΥ
        // =====================
        // Χρήση CustomGreek αντί Helvetica για αποφυγή σφάλματος με το "Ö"
        applyGreekFont("normal");
        doc.setFontSize(16);
        doc.text("FÖRCH", 15, y);
        
        doc.setFontSize(10);
        doc.text("Easy Order", pageWidth - 15, y, { align: "right" });

        y += 10;
        doc.setFontSize(15);
        doc.text("ΔΕΛΤΙΟ ΠΑΡΑΓΓΕΛΙΑΣ", pageWidth / 2, y, { align: "center" });

        // Διαχωριστική γραμμή
        y += 4;
        doc.setDrawColor(200, 200, 200);
        doc.line(15, y, pageWidth - 15, y);
        
        y += 8;

        // =====================
        // ΣТОΙΧΕΙΑ ΠΑΡΑΓΓΕΛΙΑΣ
        // =====================
        doc.setFontSize(10);
        doc.text("Αριθμός Παραγ.:  " + (order.number || "-"), 15, y);
        doc.text("Ημερομηνία:         " + (order.date || "-"), 15, y + 6);

        doc.text("Πελάτης:  " + (order.customer || "-"), 105, y);
        doc.text("Περιοχή:  " + (order.area || "-"), 105, y + 6);

        y += 18;

        // =====================
        // ΠΙΝΑΚΑΣ ΠΡΟΪΟΝΤΩΝ
        // =====================
        drawTableHeader(y);
        y += 8;

        if (order.products && Array.isArray(order.products) && order.products.length > 0) {
            order.products.forEach(product => {
                if (y > 270) {
                    doc.addPage();
                    applyGreekFont("normal");
                    y = 20;
                    drawTableHeader(y);
                    y += 8;
                }

                let qty = product.quantity ? Number(product.quantity).toString() : "0";
                let price = product.price ? Number(product.price).toFixed(2) + " €" : "0.00 €";
                let discount =
    product.discount !== "" &&
    product.discount !== null &&
    product.discount !== undefined
        ? product.discount + "%"
        : "-";
                let finalPrice = product.finalPrice ? Number(product.finalPrice).toFixed(2) + " €" : "0.00 €";

                doc.text(product.code || "", 17, y + 5);
                
                let desc = product.description || "";
                let truncatedDesc = doc.splitTextToSize(desc, 70)[0] || ""; 
                if (desc !== truncatedDesc && truncatedDesc.length > 3) {
                    truncatedDesc = truncatedDesc.substring(0, truncatedDesc.length - 3) + "...";
                }
                doc.text(truncatedDesc, 45, y + 5);

                doc.text(qty, 125, y + 5, { align: "right" });
                doc.text(price, 145, y + 5, { align: "right" });
                doc.text(discount, 165, y + 5, { align: "right" });
                doc.text(finalPrice, 192, y + 5, { align: "right" });

                doc.setDrawColor(240, 240, 240);
                doc.line(15, y + 7, pageWidth - 15, y + 7);

                y += 7;
            });
        } else {
            // Αν δεν καταχωρήθηκε κανένα προϊόν
            doc.text("Δεν έχουν προστεθεί προϊόντα στην παραγγελία.", 15, y + 5);
            y += 7;
        }

        y += 5;

        // =====================
        // ΣΥΝΟΛΟ & ΠΑΡΑΤΗΡΗΣΕΙΣ
        // =====================
        if (y > 270) { 
            doc.addPage(); 
            applyGreekFont("normal");
            y = 20; 
        }

        doc.setFontSize(11);
        let formattedTotal = order.total || "0,00 €";
        if (!formattedTotal.includes("€")) formattedTotal += " €";

        doc.text("Γενικό Σύνολο:", pageWidth - 70, y);
        doc.text(formattedTotal, pageWidth - 15, y, { align: "right" });

        y += 12;

        if (order.notes && order.notes.trim() !== "") {
            let notesLines = doc.splitTextToSize(order.notes, pageWidth - 30);
            let requiredSpace = 5 + (notesLines.length * 5);

            if (y + requiredSpace > 285) { 
                doc.addPage(); 
                applyGreekFont("normal");
                y = 20; 
            }

            doc.setFontSize(10);
            doc.text("Παρατηρήσεις:", 15, y);
            
            y += 5;
            doc.setFontSize(9);
            doc.setTextColor(80, 80, 80);
            doc.text(notesLines, 15, y);
        }

        // =====================
        // ΑΠΟΘΗΚΕΥΣΗ PDF
        // =====================
        let fileName = "Παραγγελία-" + (order.customer || "FÖRCH") + ".pdf";
        doc.save(fileName);

    } catch (error) {
        alert("Κάτι πήγε στραβά κατά τη δημιουργία του PDF: " + error.message);
    }
}

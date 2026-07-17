// Test-pdf.js

function downloadPDF(order) {
    try {
        // Ειδοποίηση για να ξέρουμε ότι το κουμπί ακούει
        alert("Η δημιουργία του PDF ξεκίνησε!");

        // 1. Έλεγχος αν έχει φορτώσει η βιβλιοθήκη jsPDF
        if (!window.jspdf || !window.jspdf.jsPDF) {
            alert("Σφάλμα: Η βιβλιοθήκη jsPDF δεν έχει φορτωθεί ακόμα στο HTML σας!");
            return;
        }

        const { jsPDF } = window.jspdf;

        // 2. Έλεγχος αν μας στάλθηκαν δεδομένα παραγγελίας
        if (!order) {
            alert("Σφάλμα: Δεν βρέθηκαν δεδομένα για αυτή την παραγγελία (order is undefined).");
            return;
        }

        let doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });

        // 3. Ενεργοποίηση της ελληνικής γραμματοσειράς CustomGreek (από το fonts.js)
        try {
            doc.setFont("CustomGreek", "normal");
        } catch (e) {
            alert("Σφάλμα: Δεν βρέθηκε η γραμματοσειρά CustomGreek. Βεβαιωθείτε ότι το αρχείο fonts.js έχει φορτωθεί σωστά.");
            return;
        }

        let pageWidth = doc.internal.pageSize.getWidth();
        let y = 15;

        // =====================
        // ΚΕΦΑΛΙΔΑ
        // =====================
        
        // Χρησιμοποιούμε Helvetica για το "FÖRCH" (είναι bold και λατινικά)
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(16);
        doc.text("FÖRCH", 15, y);
        
        // Επιστροφή στη CustomGreek για τα ελληνικά
        doc.setFont("CustomGreek", "normal");
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
        // ΣΤΟΙΧΕΙΑ ΠΑΡΑΓΓΕΛΙΑΣ
        // =====================
        doc.setFontSize(10);

        // Αριστερή στήλη
        doc.text("Αριθμός Παραγ.:  " + (order.number || "-"), 15, y);
        doc.text("Ημερομηνία:         " + (order.date || "-"), 15, y + 6);

        // Δεξιά στήλη
        doc.text("Πελάτης:  " + (order.customer || "-"), 105, y);
        doc.text("Περιοχή:  " + (order.area || "-"), 105, y + 6);

        y += 16;

        // =====================
        // ΠΙΝΑΚΑΣ ΠΡΟΪΟΝΤΩΝ
        // =====================
        let rows = [];

        if (order.products && Array.isArray(order.products)) {
            order.products.forEach(product => {
                let qty = product.quantity ? Number(product.quantity).toString() : "0";
                let price = product.price ? Number(product.price).toFixed(2) + " €" : "0.00 €";
                let discount = product.discount ? product.discount + "%" : "-";
                let finalPrice = product.finalPrice ? Number(product.finalPrice).toFixed(2) + " €" : "0.00 €";

                rows.push([
                    product.code || "",
                    product.description || "",
                    qty,
                    price,
                    discount,
                    finalPrice
                ]);
            });
        }

        doc.autoTable({
            startY: y,
            margin: { left: 15, right: 15 },
            head: [[
                "Κωδικός",
                "Περιγραφή",
                "Ποσ.",
                "Τιμή",
                "Έκπτωση",
                "Σύνολο"
            ]],
            body: rows,
            styles: {
                font: "CustomGreek", 
                fontSize: 9,
                cellPadding: 3,
                valign: 'middle'
            },
            headStyles: {
                font: "CustomGreek", 
                fontSize: 9,
                fillColor: [44, 62, 80],
                textColor: [255, 255, 255]
            },
            columnStyles: {
                0: { cellWidth: 25 },
                2: { cellWidth: 15, halign: 'right' },
                3: { cellWidth: 25, halign: 'right' },
                4: { cellWidth: 20, halign: 'center' },
                5: { cellWidth: 25, halign: 'right' }
            }
        });

        y = doc.lastAutoTable.finalY + 10;

        // =====================
        // ΣΥΝΟΛΟ & ΠΑΡΑΤΗΡΗΣΕΙΣ
        // =====================
        
        doc.setFontSize(11);
        let totalLabel = "Γενικό Σύνολο:";
        let formattedTotal = order.total || "0,00 €";
        
        if (!formattedTotal.includes("€")) {
            formattedTotal += " €";
        }

        doc.text(totalLabel, pageWidth - 70, y);
        doc.text(formattedTotal, pageWidth - 15, y, { align: "right" });

        y += 12;

        if (order.notes && order.notes.trim() !== "") {
            if (y > doc.internal.pageSize.getHeight() - 30) {
                doc.addPage();
                y = 20;
            }

            doc.setFontSize(10);
            doc.text("Παρατηρήσεις:", 15, y);
            
            y += 5;
            doc.setFontSize(9);
            doc.setTextColor(80, 80, 80);
            
            let notes = doc.splitTextToSize(order.notes, pageWidth - 30);
            doc.text(notes, 15, y);
        }

        // =====================
        // ΑΠΟΘΗΚΕΥΣΗ PDF
        // =====================
        let fileName = "Παραγγελία-" + (order.number || "Draft") + ".pdf";
        doc.save(fileName);

    } catch (error) {
        alert("Κάτι πήγε στραβά κατά τη δημιουργία του PDF: " + error.message);
        console.error(error);
    }
}

function downloadPDFFromIndex(index) {
    try {
        let drafts = JSON.parse(localStorage.getItem("draftOrders")) || [];
        let order = drafts[index];

        if (!order) {
            alert("Δεν βρέθηκε η παραγγελία στη μνήμη (index: " + index + ").");
            return;
        }

        downloadPDF(order);
    } catch (error) {
        alert("Σφάλμα κατά την ανάκτηση από τις πρόχειρες: " + error.message);
    }
}

/**
 * 🛠️ ΣΥΝΑΡΤΗΣΗ ΓΕΦΥΡΑΣ
 */
function generatePDF() {
    try {
        let order = {
            number: "Draft-" + Math.floor(1000 + Math.random() * 9000),
            date: document.getElementById('date').value || "-",
            customer: document.getElementById('customer').value || "Ανώνυμος Πελάτης",
            area: document.getElementById('area').value || "-",
            notes: document.getElementById('notes').value || "",
            total: document.getElementById('total').textContent || "0,00 €",
            products: []
        };

        let rows = document.querySelectorAll("#products tr");
        rows.forEach(row => {
            let code = row.querySelector(".code")?.value || "";
            let description = row.querySelector(".description")?.value || "";
            let quantity = row.querySelector(".quantity")?.value || 0;
            let price = row.querySelector(".price")?.value || 0;
            let discount = row.querySelector(".discount")?.value || 0;
            let finalPrice = row.querySelector(".finalPrice")?.value || 0;

            if (code.trim() !== "" || description.trim() !== "") {
                order.products.push({
                    code: code,
                    description: description,
                    quantity: quantity,
                    price: price,
                    discount: discount,
                    finalPrice: finalPrice
                });
            }
        });

        if (order.products.length === 0) {
            alert("Παρακαλώ προσθέστε τουλάχιστον ένα προϊόν με κωδικό ή περιγραφή πριν την εξαγωγή.");
            return;
        }

        downloadPDF(order);
    } catch (e) {
        alert("Σφάλμα κατά τη συλλογή των στοιχείων της φόρμας: " + e.message);
    }
}

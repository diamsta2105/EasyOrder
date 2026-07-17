// Test-pdf.js

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

        // Ενεργοποίηση της ελληνικής γραμματοσειράς CustomGreek
        try {
            doc.setFont("CustomGreek", "normal");
        } catch (e) {
            alert("Σφάλμα γραμματοσειράς: Βεβαιωθείτε ότι το αρχείο fonts.js έχει φορτωθεί.");
            return;
        }

        let pageWidth = doc.internal.pageSize.getWidth();
        let y = 15;

        // =====================
        // ΚΕΦΑΛΙΔΑ
        // =====================
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(16);
        doc.text("FÖRCH", 15, y);
        
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
        doc.text("Αριθμός Παραγ.:  " + (order.number || "-"), 15, y);
        doc.text("Ημερομηνία:         " + (order.date || "-"), 15, y + 6);

        doc.text("Πελάτης:  " + (order.customer || "-"), 105, y);
        doc.text("Περιοχή:  " + (order.area || "-"), 105, y + 6);

        y += 18;

        // =====================
        // ΠΙΝΑΚΑΣ ΠΡΟΪΟΝΤΩΝ (Χειροκίνητη σχεδίαση χωρίς autoTable)
        // =====================
        doc.setFontSize(10);
        doc.setFillColor(44, 62, 80); // Σκούρο μπλε φόντο για την κεφαλίδα
        doc.rect(15, y, pageWidth - 30, 8, "F");

        doc.setTextColor(255, 255, 255); // Άσπρα γράμματα για τους τίτλους
        doc.text("Κωδικός", 17, y + 5.5);
        doc.text("Περιγραφή", 45, y + 5.5);
        doc.text("Ποσ.", 125, y + 5.5, { align: "right" });
        doc.text("Τιμή", 145, y + 5.5, { align: "right" });
        doc.text("Έκπτ.", 165, y + 5.5, { align: "right" });
        doc.text("Σύνολο", 192, y + 5.5, { align: "right" });

        y += 8;
        doc.setTextColor(0, 0, 0); // Επαναφορά σε μαύρα γράμματα

        if (order.products && Array.isArray(order.products)) {
            order.products.forEach(product => {
                // Έλεγχος αλλαγής σελίδας αν γεμίσει
                if (y > 270) {
                    doc.addPage();
                    y = 20;
                }

                let qty = product.quantity ? Number(product.quantity).toString() : "0";
                let price = product.price ? Number(product.price).toFixed(2) + " €" : "0.00 €";
                let discount = product.discount ? product.discount + "%" : "-";
                let finalPrice = product.finalPrice ? Number(product.finalPrice).toFixed(2) + " €" : "0.00 €";

                // Σχεδίαση των κειμένων στις σωστές συντεταγμένες/στήλες
                doc.text(product.code || "", 17, y + 5);
                
                // Μικρό κόψιμο στην περιγραφή αν είναι τεράστια για να μην καβαλάει την ποσότητα
                let desc = product.description || "";
                if (desc.length > 32) desc = desc.substring(0, 30) + "..";
                doc.text(desc, 45, y + 5);

                doc.text(qty, 125, y + 5, { align: "right" });
                doc.text(price, 145, y + 5, { align: "right" });
                doc.text(discount, 165, y + 5, { align: "right" });
                doc.text(finalPrice, 192, y + 5, { align: "right" });

                // Μια πολύ απαλή διαχωριστική γραμμή κάτω από κάθε προϊόν
                doc.setDrawColor(240, 240, 240);
                doc.line(15, y + 7, pageWidth - 15, y + 7);

                y += 7;
            });
        }

        y += 5;

        // =====================
        // ΣΥΝΟΛΟ & ΠΑΡΑΤΗΡΗΣΕΙΣ
        // =====================
        if (y > 270) { doc.addPage(); y = 20; }

        doc.setFontSize(11);
        let formattedTotal = order.total || "0,00 €";
        if (!formattedTotal.includes("€")) formattedTotal += " €";

        doc.text("Γενικό Σύνολο:", pageWidth - 70, y);
        doc.text(formattedTotal, pageWidth - 15, y, { align: "right" });

        y += 12;

        if (order.notes && order.notes.trim() !== "") {
            if (y > 260) { doc.addPage(); y = 20; }

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
    }
}

function downloadPDFFromIndex(index) {
    try {
        let drafts = JSON.parse(localStorage.getItem("draftOrders")) || [];
        let order = drafts[index];

        if (!order) {
            alert("Δεν βρέθηκε η παραγγελία στη μνήμη.");
            return;
        }

        downloadPDF(order);
    } catch (error) {
        alert("Σφάλμα κατά την ανάκτηση: " + error.message);
    }
}

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

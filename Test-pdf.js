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

        // Συνάρτηση για την ασφαλή εφαρμογή της ελληνικής γραμματοσειράς
        function applyGreekFont(style = "normal") {
            try {
                doc.setFont("CustomGreek", style);
            } catch (e) {
                throw new Error("Βεβαιωθείτε ότι το αρχείο fonts.js έχει φορτωθεί σωστά.");
            }
        }

        // Συνάρτηση σχεδίασης της κεφαλίδας του πίνακα (για επαναχρησιμοποίηση σε αλλαγή σελίδας)
        function drawTableHeader(currentY) {
            doc.setFillColor(44, 62, 80); // Σκούρο μπλε
            doc.rect(15, currentY, pageWidth - 30, 8, "F");
            doc.setTextColor(255, 255, 255); // Άσπρα γράμματα
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
        let pageWidth = doc.internal.pageSize.getWidth();
        let y = 15;

        // =====================
        // ΚΕΦΑΛΙΔΑ ΕΓΓΡΑΦΟΥ
        // =====================
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(16);
        doc.text("FÖRCH", 15, y);
        
        applyGreekFont("normal");
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
        // ΠΙΝΑΚΑΣ ΠΡΟΪΟΝΤΩΝ
        // =====================
        drawTableHeader(y);
        y += 8;

        if (order.products && Array.isArray(order.products)) {
            order.products.forEach(product => {
                // Έλεγχος αλλαγής σελίδας (πριν τυπωθεί η γραμμή)
                if (y > 270) {
                    doc.addPage();
                    applyGreekFont("normal"); // Επανεπιβολή γραμματοσειράς στη νέα σελίδα
                    y = 20;
                    drawTableHeader(y);
                    y += 8;
                }

                let qty = product.quantity ? Number(product.quantity).toString() : "0";
                let price = product.price ? Number(product.price).toFixed(2) + " €" : "0.00 €";
                let discount = product.discount ? product.discount + "%" : "-";
                let finalPrice = product.finalPrice ? Number(product.finalPrice).toFixed(2) + " €" : "0.00 €";

                doc.text(product.code || "", 17, y + 5);
                
                // Δυναμικό κόψιμο περιγραφής με βάση το διαθέσιμο πλάτος της στήλης (70mm διαθέσιμα)
                let desc = product.description || "";
                let truncatedDesc = doc.splitTextToSize(desc, 70)[0]; 
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
            // Υπολογισμός των γραμμών των παρατηρήσεων για ακριβή έλεγχο υπερχείλισης
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
        let fileName = "Παραγγελία-" + (order.number || "Draft") + ".pdf";
        doc.save(fileName);

    } catch (error) {
        alert("Κάτι πήγε στραβά κατά τη δημιουργία του PDF: " + error.message);
    }
}

// Οι υπόλοιπες συναρτήσεις (downloadPDFFromIndex, generatePDF) παραμένουν ως έχουν...

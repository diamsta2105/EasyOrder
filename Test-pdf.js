// Test-pdf.js

// Αυτόματη φόρτωση της ελληνικής γραμματοσειράς DejaVuSans αν δεν υπάρχει ήδη
if (!document.querySelector('script[src*="DejaVuSans-normal.js"]')) {
    let script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/jspdf-fontcustom@1.0.0/fonts/DejaVuSans-normal.js";
    document.head.appendChild(script);
}

function downloadPDF(order) {
    try {
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

        // 3. Έλεγχος αν η εξωτερική γραμματοσειρά DejaVuSans έχει φορτωθεί στο global scope
        // Τα CDNs συνήθως την κάνουν register στο global API του jsPDF (jsPDF.API.events).
        // Αν δεν έχει φορτωθεί ακόμα στο παράθυρο, περιμένουμε 300ms.
        if (typeof window.DejaVuSans === 'undefined' && (!jsPDF.API || !jsPDF.API.events)) {
            console.log("Η γραμματοσειρά DejaVuSans φορτώνει... Επανάληψη σε 300ms.");
            setTimeout(() => downloadPDF(order), 300);
            return;
        }

        let doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });

        // Προσπάθεια ενεργοποίησης της DejaVuSans
        try {
            doc.setFont("DejaVuSans", "normal");
        } catch (e) {
            // Αν η setFont αποτύχει επειδή δεν έχει γίνει register στο doc, 
            // περιμένουμε λίγο ακόμα για να ολοκληρωθεί η εγγραφή της από το script.
            console.log("Αναμονή εγγραφής γραμματοσειράς στο instance... Επανάληψη σε 300ms.");
            setTimeout(() => downloadPDF(order), 300);
            return;
        }

        let pageWidth = doc.internal.pageSize.getWidth();
        let y = 15;

        // =====================
        // ΚΕΦΑΛΙΔΑ
        // =====================
        doc.setFontSize(14);
        doc.setFont("DejaVuSans", "bold"); // Αν υποστηρίζεται, αλλιώς "normal"
        doc.text("FÖRCH", 15, y);
        
        doc.setFont("DejaVuSans", "normal");
        doc.setFontSize(10);
        doc.text("Easy Order", pageWidth - 15, y, { align: "right" });

        y += 10;

        doc.setFontSize(16);
        doc.text("ΔΕΛΤΙΟ ΠΑΡΑΓΓΕΛΙΑΣ", pageWidth / 2, y, { align: "center" });

        // Διαχωριστική γραμμή κάτω από τον τίτλο
        y += 4;
        doc.setDrawColor(200, 200, 200);
        doc.line(15, y, pageWidth - 15, y);
        
        y += 8;

        // =====================
        // ΣΤΟΙΧΕΙΑ ΠΑΡΑΓΓΕΛΙΑΣ
        // =====================
        doc.setFontSize(10);

        // Αριστερή στήλη στοιχείων
        doc.text(`Αριθμός Παραγ.:  ${order.number || "-"}`, 15, y);
        doc.text(`Ημερομηνία:         ${order.date || "-"}`, 15, y + 6);

        // Δεξιά στήλη στοιχείων
        doc.text(`Πελάτης:  ${order.customer || "-"}`, 105, y);
        doc.text(`Περιοχή:  ${order.area || "-"}`, 105, y + 6);

        y += 16;

        // =====================
        // ΠΙΝΑΚΑΣ ΠΡΟΪΟΝΤΩΝ
        // =====================
        let rows = [];

        if (order.products && Array.isArray(order.products)) {
            order.products.forEach(product => {
                // Εξασφάλιση σωστής μορφοποίησης αριθμών
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
                font: "DejaVuSans", 
                fontSize: 9,
                cellPadding: 3,
                valign: 'middle'
            },
            headStyles: {
                font: "DejaVuSans", 
                fontSize: 9,
                fillColor: [44, 62, 80], // Επαγγελματικό σκούρο μπλε/γκρι χρώμα κεφαλίδας
                textColor: [255, 255, 255]
            },
            columnStyles: {
                0: { cellWidth: 25 },                         // Κωδικός
                1: { cellWidth: 'auto' },                     // Περιγραφή
                2: { cellWidth: 15, halign: 'right' },        // Ποσότητα
                3: { cellWidth: 25, halign: 'right' },        // Αρχική Τιμή
                4: { cellWidth: 20, halign: 'center' },       // Έκπτωση
                5: { cellWidth: 25, halign: 'right' }         // Τελική Τιμή
            }
        });

        y = doc.lastAutoTable.finalY + 10;

        // =====================
        // ΣΥΝΟΛΟ & ΠΑΡΑΤΗΡΗΣΕΙΣ (Δίπλα-δίπλα αν χωράνε)
        // =====================
        
        // 1. Σύνολο (Στοιχισμένο δεξιά στο κάτω μέρος του πίνακα)
        doc.setFontSize(11);
        let totalLabel = "Γενικό Σύνολο:";
        let formattedTotal = order.total || "0,00 €";
        
        // Αν το total δεν έχει ήδη το σύμβολο του ευρώ, το προσθέτουμε
        if (!formattedTotal.includes("€")) {
            formattedTotal += " €";
        }

        doc.text(totalLabel, pageWidth - 70, y);
        doc.text(formattedTotal, pageWidth - 15, y, { align: "right" });

        y += 12;

        // 2. Παρατηρήσεις
        if (order.notes && order.notes.trim() !== "") {
            // Έλεγχος αν οι παρατηρήσεις χωράνε στη σελίδα, αλλιώς δημιουργία νέας
            if (y > doc.internal.pageSize.getHeight() - 30) {
                doc.addPage();
                y = 20;
            }

            doc.setFontSize(10);
            doc.text("Παρατηρήσεις:", 15, y);
            
            y += 5;
            doc.setFontSize(9);
            doc.setTextColor(80, 80, 80); // Πιο απαλό γκρι για τις παρατηρήσεις
            
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

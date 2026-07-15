// Test-pdf.js

// Αυτόματη φόρτωση της ελληνικής γραμματοσειράς DejaVuSans αν δεν υπάρχει ήδη
if (!document.querySelector('script[src*="DejaVuSans-normal.js"]')) {
    let script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/jspdf-fontcustom@1.0.0/fonts/DejaVuSans-normal.js";
    document.head.appendChild(script);
}

// Μεταβλητή για την αποφυγή ατέρμονου βρόχου (infinite loop)
let pdfGenerationAttempts = 0;

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

        // 3. Ασφαλής έλεγχος φόρτωσης γραμματοσειράς (Μέγιστο 10 προσπάθειες / 3 δευτερόλεπτα)
        if (typeof window.DejaVuSans === 'undefined' && (!jsPDF.API || !jsPDF.API.events)) {
            pdfGenerationAttempts++;
            if (pdfGenerationAttempts > 10) {
                pdfGenerationAttempts = 0; // reset
                alert("Σφάλμα: Δεν ήταν δυνατή η λήψη της ελληνικής γραμματοσειράς DejaVuSans από το δίκτυο. Παρακαλώ ελέγξτε τη σύνδεσή σας.");
                return;
            }
            console.log(`Η γραμματοσειρά DejaVuSans φορτώνει... Προσπάθεια ${pdfGenerationAttempts}/10 σε 300ms.`);
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
            pdfGenerationAttempts++;
            if (pdfGenerationAttempts > 10) {
                pdfGenerationAttempts = 0; // reset
                alert("Σφάλμα: Η γραμματοσειρά κατέβηκε αλλά απέτυχε η εγκατάστασή της στο έγγραφο PDF.");
                return;
            }
            console.log("Αναμονή εγγραφής γραμματοσειράς στο instance... Επανάληψη σε 300ms.");
            setTimeout(() => downloadPDF(order), 300);
            return;
        }

        // Επιτυχής φόρτωση, κάνουμε reset τον μετρητή
        pdfGenerationAttempts = 0;

        let pageWidth = doc.internal.pageSize.getWidth();
        let y = 15;

        // =====================
        // ΚΕΦΑΛΙΔΑ
        // =====================
        
        // Χρησιμοποιούμε Helvetica για το "FÖRCH" επειδή υποστηρίζει Bold εξ ορισμού και είναι λατινικά
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(16);
        doc.text("FÖRCH", 15, y);
        
        // Γυρνάμε σε DejaVuSans για τα ελληνικά
        doc.setFont("DejaVuSans", "normal");
        doc.setFontSize(10);
        doc.text("Easy Order", pageWidth - 15, y, { align: "right" });

        y += 10;

        doc.setFontSize(15);
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
 * 🛠️ ΣΥΝΑΡΤΗΣΗ ΓΕΦΥΡΑΣ (Για το κουμπί απευθείας εκτύπωσης από την οθόνη)
 * Αυτή η συνάρτηση διαβάζει τα τρέχοντα στοιχεία από το UI 
 * και δημιουργεί το PDF χωρίς να χρειάζεται να αποθηκευτεί πρώτα στα drafts.
 */
function generatePDF() {
    try {
        let order = {
            number: "Draft-" + Math.floor(1000 + Math.random() * 9000), // Τυχαίος αριθμός για το πρόχειρο
            date: document.getElementById('date').value || "-",
            customer: document.getElementById('customer').value || "Ανώνυμος Πελάτης",
            area: document.getElementById('area').value || "-",
            notes: document.getElementById('notes').value || "",
            total: document.getElementById('total').textContent || "0,00 €",
            products: []
        };

        // Διάβασμα των γραμμών του πίνακα προϊόντων
        let rows = document.querySelectorAll("#products tr");
        rows.forEach(row => {
            let code = row.querySelector(".code")?.value || "";
            let description = row.querySelector(".description")?.value || "";
            let quantity = row.querySelector(".quantity")?.value || 0;
            let price = row.querySelector(".price")?.value || 0;
            let discount = row.querySelector(".discount")?.value || 0;
            let finalPrice = row.querySelector(".finalPrice")?.value || 0;

            // Προσθέτουμε το προϊόν μόνο αν έχει κωδικό ή περιγραφή
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

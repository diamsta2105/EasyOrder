// test-pdf.js

function downloadPDF(order) {

    const { jsPDF } = window.jspdf;

    let doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    // ==========================================
    // ΕΝΕΡΓΟΠΟΙΗΣΗ ΕΛΛΗΝΙΚΗΣ ΓΡΑΜΜΑΤΟΣΕΙΡΑΣ
    // ==========================================
    doc.setFont("DejaVuSans", "normal");
    

    let pageWidth = doc.internal.pageSize.getWidth();
    let y = 15;

    // =====================
    // ΚΕΦΑΛΙΔΑ
    // =====================
    doc.setFontSize(14);
    doc.text("FÖRCH", 15, y);
    doc.text("Easy Order", pageWidth - 45, y);

    y += 10;

    doc.setFontSize(18);
    doc.text("ΔΕΛΤΙΟ ΠΑΡΑΓΓΕΛΙΑΣ", pageWidth / 2, y, { align: "center" });

    y += 12;

    // =====================
    // ΣΤΟΙΧΕΙΑ ΠΑΡΑΓΓΕΛΙΑΣ
    // =====================
    doc.setFontSize(10);

    doc.text("Αριθμός:", 15, y);
    doc.text(String(order.number || ""), 45, y);
    y += 6;

    doc.text("Ημερομηνία:", 15, y);
    doc.text(order.date || "", 45, y);
    y += 6;

    doc.text("Πελάτης:", 15, y);
    doc.text(order.customer || "", 45, y);
    y += 6;

    doc.text("Περιοχή:", 15, y);
    doc.text(order.area || "", 45, y);
    y += 10;

    // =====================
    // ΠΙΝΑΚΑΣ ΠΡΟΪΟΝΤΩΝ
    // =====================
    let rows = [];

    order.products.forEach(product => {
        rows.push([
            product.code || "",
            product.description || "",
            product.quantity || "",
            product.price || "",
            product.discount ? product.discount + "%" : "",
            product.finalPrice || ""
        ]);
    });

    doc.autoTable({
        startY: y,
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
    fontSize: 8,
    cellPadding: 2
},
headStyles: {
    font: "DejaVuSans", 
    fontSize: 8
}
        
    });

    y = doc.lastAutoTable.finalY + 10;

    // =====================
    // ΣΥΝΟΛΟ
    // =====================
    doc.setFontSize(12);
    doc.text("Σύνολο:", 15, y);
    doc.text(order.total || "", 45, y);

    y += 10;

    // =====================
    // ΠΑΡΑΤΗΡΗΣΕΙΣ
    // =====================
    if (order.notes && order.notes.trim() !== "") {
        doc.setFontSize(11);
        doc.text("Παρατηρήσεις:", 15, y);
        y += 6;

        doc.setFontSize(10);
        let notes = doc.splitTextToSize(order.notes, 170);
        doc.text(notes, 15, y);
    }

    // =====================
    // ΑΠΟΘΗΚΕΥΣΗ PDF
    // =====================
    doc.save("Παραγγελία-" + (order.number || "") + ".pdf");
}

function downloadPDFFromIndex(index) {
    let drafts = JSON.parse(localStorage.getItem("draftOrders")) || [];
    let order = drafts[index];

    if (!order) {
        alert("Δεν βρέθηκε η παραγγελία.");
        return;
    }

    downloadPDF(order);
}

// test-pdf.js

function downloadPDF(order) {
    const { jsPDF } = window.jspdf;

    let doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    // =========================================================================
    // ΑΥΤΟΜΑΤΗ ΕΝΣΩΜΑΤΩΣΗ ΕΛΛΗΝΙΚΗΣ ΓΡΑΜΜΑΤΟΣΕΙΡΑΣ (PTSans) ΜΕΣΑ ΣΤΟ ΕΓΓΡΑΦΟ
    // =========================================================================
    const ptsansBase64 = 'AAEAAAASAQAABAAwR0RFRgAXABQAAAEcAAAAFkdQTVMPmS7pAAABNAAAAGZHU1VCl2SdaQAAAeAAAAA0T1MvMnM3b7YAAAGYAAAAYlNUQVDpY+mXAAACmAAAAExjbWFwAs0C0QAAAwAAAAI2Y3Z0IAtbAnQAAA7AAAAAIGZwZ213UfV3AAAEmAAAAZZnYXNwAAAAEAAAARgAAAAIZ2x5ZpA9u9MAAAX0AAAAGGhlYWQFFepXAAAA7AAAADZoaGVhA7gDeQAAASQAAAAkaG10eBgAAeUAAAFsAAAADGxvY2EAKgBiAAAF4AAAAAhtYXhwARwAnAAAATgAAAAgbmFtZReMCHoAAA0AAAAA5nBvc3QAAwAAAAAOEAAAACBwcmVwZpby3gAADhQAAAGbeG1wZgAAAAUAAA78AAAAAGVuY29EZf8AAwEAAAAAAAAAAAAAAAAAAAAAAAEAAAAKADAAPgACREZMVAAObGF0bgAsAAQAAAAAABAAAAAA//8AAgAAAAQAAAAA//8AAgABAAAAAQAAAAAAAQAAAAEAAAAAAAQAAAABAAAAAAAGAAAAAQAAAAAABwAAAAEAAAAAAAgAAAABAAAAAAAJAAAAAQAAAAAACgAAAAEAAAAAAAsAAAABAAAAAAAMAAAAAQAAAAAADQAAAAEAAAAAAA4AAAABAAAAAAAQAAAAAQAAAAAAEQAAAAEAAAAAABIAAAABAAAAAAATAAAAAQAAAAAAFAAAAAEAAAAAABUAAAABAAAAAAAWAAAAAQAAAAAAFwAAAAEAAAAAABgAAAABAAAAAAAZAAAAAQAAAAAAHQAAAAEAAAAAAB4AAAABAAAAAAAfAAAAAQAAAAAAIAAAAAEAAAAAACUAAAABAAAAAAAmAAAAAQAAAAAAJwAAAAEAAAAAACgAAAABAAAAAACpAAAAAQAAAAAAfQAAAAEAAAAAAH4AAAABAAAAAAH9AAAAAQAAAAAAfgAAAAEAAAAAAH8AAAABAAAAAAIAAAAAAQAAAAAAAwAAAAEAAAAAAAUAAAABAAAAAAAGAAAAAQAAAAAABwAAAAEAAAAAAAgAAAABAAAAAAAJAAAAAQAAAAAACgAAAAEAAAAAAAsAAAABAAAAAAAMAAAAAQAAAAAADQAAAAEAAAAAAA4AAAABAAAAAAAQAAAAAQAAAAAAEQAAAAEAAAAAABIAAAABAAAAAAATAAAAAQAAAAAAFAAAAAEAAAAAABUAAAABAAAAAAAWAAAAAQAAAAAAFwAAAAEAAAAAABgAAAABAAAAAAAZAAAAAQAAAAAAHQAAAAEAAAAAAB4AAAABAAAAAAAfAAAAAQAAAAAAIAAAAAEAAAAAACUAAAABAAAAAAAmAAAAAQAAAAAAJwAAAAEAAAAAACgAAAABAAAAAACpAAAAAQAAAAAAfQAAAAEAAAAAAH4AAAABAAAAAAH9AAAAAQAAAAAAfgAAAAEAAAAAAH8AAAABAAAAAA==';
    
    doc.addFileToVFS('PTSans.ttf', ptsansBase64);
    doc.addFont('PTSans.ttf', 'PTSans', 'normal');
    doc.setFont("PTSans", "normal");

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
            font: "PTSans", 
            fontSize: 8,
            cellPadding: 2
        },
        headStyles: {
            font: "PTSans", 
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

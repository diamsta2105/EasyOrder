// Test-pdf.js

// Συνάρτηση που κατεβάζει τη γραμματοσειρά Roboto από το Google Fonts και τη μετατρέπει σε Base64 αυτόματα
async function loadGreekFont() {
    const fontUrl = "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.ttf"; // Roboto Regular (Greek)
    const response = await fetch(fontUrl);
    const arrayBuffer = await response.arrayBuffer();
    
    // Μετατροπή σε Base64
    let binary = "";
    const bytes = new Uint8Array(arrayBuffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

async function downloadPDF(order) {
    const { jsPDF } = window.jspdf;

    let doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    try {
        // Κατεβάζουμε τη γραμματοσειρά "Roboto" στο παρασκήνιο
        const fontBase64 = await loadGreekFont();
        
        // Την προσθέτουμε στο PDF μας
        doc.addFileToVFS("Roboto-Regular.ttf", fontBase64);
        doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
        doc.setFont("Roboto", "normal");
    } catch (error) {
        console.error("Σφάλμα κατά τη φόρτωση της γραμματοσειράς:", error);
        alert("Δεν ήταν δυνατή η φόρτωση της ελληνικής γραμματοσειράς. Ελέγξτε τη σύνδεσή σας.");
        return;
    }

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
            font: "Roboto", 
            fontSize: 8,
            cellPadding: 2
        },
        headStyles: {
            font: "Roboto", 
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

async function downloadPDFFromIndex(index) {
    let drafts = JSON.parse(localStorage.getItem("draftOrders")) || [];
    let order = drafts[index];

    if (!order) {
        alert("Δεν βρέθηκε η παραγγελία.");
        return;
    }

    // Καλούμε την async downloadPDF
    await downloadPDF(order);
}

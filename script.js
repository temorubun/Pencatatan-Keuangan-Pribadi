let totalIncome = 0;
let totalExpense = 0;
let allTransactions = []; // Menyimpan semua transaksi

function addTransaction() {
    const title = document.getElementById('title').value;
    const amount = parseFloat(document.getElementById('amount').value) || 0;
    const type = document.getElementById('type').value;
    const description = document.getElementById('description').value;
    const transactionTime = new Date().toLocaleString(); // Waktu transaksi

    // Tambahkan ke total pendapatan atau pengeluaran
    if (type === "income") {
        totalIncome += amount;
    } else if (type === "expense") {
        totalExpense += amount;
    }

    // Update tampilan hasil
    document.getElementById('total-income').innerText = `Rp ${totalIncome.toLocaleString()}`;
    document.getElementById('total-expense').innerText = `Rp ${totalExpense.toLocaleString()}`;
    document.getElementById('total-balance').innerText = `Rp ${(totalIncome - totalExpense).toLocaleString()}`;

    // Tambahkan transaksi ke daftar transaksi
    const transactionList = document.getElementById('transaction-list');
    const listItem = document.createElement('tr');
    let formattedAmount = amount.toLocaleString();
    if (type === "expense") {
        formattedAmount = `Rp. - ${formattedAmount}`;
    } else {
        formattedAmount = `Rp. + ${formattedAmount}`;
    }
    listItem.className = type === "income" ? "income" : "expense";

    listItem.innerHTML = `
        <td>${title}</td>
        <td>${formattedAmount}</td>
        <td>${type === "income" ? "Pendapatan" : "Pengeluaran"}</td>
        <td>${transactionTime}</td>
        <td>${description}</td>
    `;
    transactionList.appendChild(listItem);

    // Simpan transaksi untuk filter dan download
    allTransactions.push({ title, amount, type, transactionTime, description });

    // Reset input setelah transaksi dicatat
    document.getElementById('title').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('description').value = '';
}

function filterTransactions(type) {
    const transactionList = document.getElementById('transaction-list');
    transactionList.innerHTML = ''; // Bersihkan daftar transaksi

    let filteredTransactions = [];

    // Filter transaksi berdasarkan tipe
    if (type === 'all') {
        filteredTransactions = allTransactions; // Tampilkan semua transaksi
    } else {
        filteredTransactions = allTransactions.filter(transaction => transaction.type === type);
    }

    // Tampilkan hasil yang telah difilter
    filteredTransactions.forEach(transaction => {
        const listItem = document.createElement('tr');
        let formattedAmount = transaction.amount.toLocaleString();
        if (transaction.type === "expense") {
            formattedAmount = `Rp. - ${formattedAmount}`;
        } else {
            formattedAmount = `Rp. + ${formattedAmount}`;
        }
        listItem.className = transaction.type === "income" ? "income" : "expense";

        listItem.innerHTML = `
            <td>${transaction.title}</td>
            <td>${formattedAmount}</td>
            <td>${transaction.type === "income" ? "Pendapatan" : "Pengeluaran"}</td>
            <td>${transaction.transactionTime}</td>
            <td>${transaction.description}</td>
        `;
        transactionList.appendChild(listItem);
    });
}

function downloadTransactions() {
    const wb = XLSX.utils.book_new(); // Membuat workbook baru

    // Menambahkan sheet
    const ws = XLSX.utils.aoa_to_sheet([
        ['Judul', 'Jumlah', 'Tipe', 'Waktu', 'Deskripsi'], // Header
        ...allTransactions.map(transaction => [
            transaction.title, 
            transaction.amount.toLocaleString(), 
            transaction.type === "income" ? "Pendapatan" : "Pengeluaran", 
            new Date(transaction.transactionTime).toLocaleString(), 
            transaction.description
        ]),
        [], // Baris kosong untuk memisahkan total
        ["Total Pendapatan", totalIncome.toLocaleString()],
        ["Total Pengeluaran", totalExpense.toLocaleString()],
        ["Total Sisa", (totalIncome - totalExpense).toLocaleString()]
    ]);

    XLSX.utils.book_append_sheet(wb, ws, "Transaksi"); // Tambahkan sheet ke workbook

    // Simpan file Excel
    XLSX.writeFile(wb, 'transaksi_keuangan.xlsx');
}
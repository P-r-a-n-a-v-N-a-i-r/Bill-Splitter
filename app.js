let people = [];

document.getElementById("expenseForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const name = document.getElementById("name").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);

    if (name && !isNaN(amount) && amount > 0) {
        people.push({ name, amount });
        document.getElementById("expenseForm").reset();
        updatePeopleList();
    } else {
        alert("Please enter a valid name and amount.");
    }
});

document.getElementById("splitBill").addEventListener("click", function () {
    if (people.length === 0) {
        showToast("Add people first!");
        return;
    }

    let totalAmount = people.reduce((sum, person) => sum + person.amount, 0);
    let perPersonShare = totalAmount / people.length;

    let balances = people.map(person => ({
        name: person.name,
        balance: person.amount - perPersonShare
    }));

    let resultText = calculateTransactions(balances);
    displayResult(resultText);
});

// Debt Simplification Function
function calculateTransactions(balances) {
    let creditors = balances.filter(p => p.balance > 0).sort((a, b) => b.balance - a.balance);
    let debtors = balances.filter(p => p.balance < 0).sort((a, b) => a.balance - b.balance);
    let transactions = [];

    while (debtors.length > 0 && creditors.length > 0) {
        let debtor = debtors[0];
        let creditor = creditors[0];

        let amount = Math.min(-debtor.balance, creditor.balance);
        transactions.push(`${debtor.name} pays ₹${amount.toFixed(2)} to ${creditor.name}`);

        debtor.balance += amount;
        creditor.balance -= amount;

        if (debtor.balance === 0) debtors.shift();
        if (creditor.balance === 0) creditors.shift();
    }

    return transactions.length > 0 ? transactions.join("<br>") : "All amounts are settled!";
}

// Display Result Function
function displayResult(resultText) {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = resultText;
}


document.getElementById("copyResult").addEventListener("click", function() {
    const resultText = document.getElementById("result").innerText;
    if (!resultText.trim()) {
        showToast("No result to copy!");
        return;
    }

    navigator.clipboard.writeText(resultText).then(() => {
        // Show Bootstrap Toast
        let toast = new bootstrap.Toast(document.getElementById("copyToast"));
        toast.show();
    });
});


function updatePeopleList() {
    const peopleList = document.getElementById("peopleList");
    peopleList.innerHTML = "";

    people.forEach((person, index) => {
        const listItem = document.createElement("div");
        listItem.className = "list-group-item d-flex justify-content-between align-items-center";
        listItem.innerHTML = `
            <span>${person.name} - ₹${person.amount}</span>
            <div>
                <button class="btn btn-sm btn-warning" onclick="editPerson(${index})"><i class="fa-solid fa-edit"></i></button>
                <button class="btn btn-sm btn-danger" onclick="deletePerson(${index})"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        peopleList.appendChild(listItem);
    });
}

function deletePerson(index) {
    people.splice(index, 1);
    updatePeopleList();
}

function editPerson(index) {
    const person = people[index];
    document.getElementById("name").value = person.name;
    document.getElementById("amount").value = person.amount;
    people.splice(index, 1);
    updatePeopleList();
}

document.getElementById("splitBill").addEventListener("click", function() {
    document.getElementById("splitBill").addEventListener("click", function() {
        people.length ? startCelebration() : showToast("Add people first, you bloody beggar! 🤡");
    });
    
});

// Toast Function
function showToast(message) {
    const toastEl = document.getElementById("copyToast");
    toastEl.querySelector(".toast-body").textContent = message;
    new bootstrap.Toast(toastEl).show();
}

function startCelebration() {
    // Confetti effect
    confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.6 }
    });

    // Create balloons
    for (let i = 0; i < 10; i++) {
        let balloon = document.createElement("div");
        balloon.className = "balloon";
        balloon.style.left = Math.random() * 100 + "vw"; // Random horizontal position
        document.body.appendChild(balloon);

        // Remove balloon after animation
        setTimeout(() => balloon.remove(), 4000);
    }
}

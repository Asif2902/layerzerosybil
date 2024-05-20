document.getElementById('checkButton').addEventListener('click', function() {
    const addressesInput = document.getElementById('addressInput').value.trim();
    if (!addressesInput) {
        alert('Please enter addresses.');
        return;
    }

    const addresses = addressesInput.split(/[, ]+/).slice(0, 100); // Split addresses by comma or space, limit to 100
    const promises = addresses.map(address => fetchAndCheckAddress(address));

    Promise.all(promises)
        .then(results => displayResults(results))
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to fetch or process the data.');
        });
});

function fetchAndCheckAddress(address) {
    return fetch('https://raw.githubusercontent.com/LayerZero-Labs/sybil-report/main/initialList.txt')
        .then(response => response.text())
        .then(data => {
            const addressesList = data.split('\n').map(line => line.trim());
            const isSybil = addressesList.includes(address);
            return { address: formatAddress(address), isSybil };
        });
}

function checkEligibility(address) {
    return fetch('Result.xlsx')
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            const headers = sheetData[0];
            const addressIndex = headers.indexOf('UserAddress');

            for (let i = 1; i < sheetData.length; i++) {
                const row = sheetData[i];
                if (row[addressIndex] && row[addressIndex].toLowerCase() === address.toLowerCase()) {
                    return { address: formatAddress(address), isEligible: true };
                }
            }

            return { address: formatAddress(address), isEligible: false };
        })
        .catch(error => {
            console.error('Error reading XLSX:', error);
            return { address: formatAddress(address), isEligible: false, error: true };
        });
}

function formatAddress(address) {
    return address.replace(/^(0x\w{4}).*(\w{2})$/, '$1****$2');
}

function displayResults(results) {
    const resultPopup = document.getElementById('resultPopup');
    resultPopup.style.display = 'block';
    resultPopup.innerHTML = ''; // Clear previous results

    results.forEach(result => {
        const { address, isSybil } = result;
        const formattedAddress = formatAddress(address);
        const addressResult = document.createElement('div');
        addressResult.classList.add('address-result');

        if (isSybil) {
            addressResult.innerHTML = `<span>${formattedAddress}</span><span><a href="https://docs.google.com/forms/d/e/1FAIpQLSfdnxQvdt8QTjGODVCSnckk_f1dv_IFeaeUVXRfF__euyIZbw/viewform">Sybil. Fill the Form</a></span>`;
        } else {
            const checkEligibilityButton = document.createElement('button');
            checkEligibilityButton.innerText = 'Check Eligibility';
            checkEligibilityButton.onclick = () => {
                checkEligibility(address).then(eligibilityResult => {
                    displayEligibilityResult(eligibilityResult);
                });
            };
            addressResult.innerHTML = `<span>${formattedAddress}</span><span>Not in Sybil</span>`;
            addressResult.appendChild(checkEligibilityButton);
        }

        resultPopup.appendChild(addressResult);
    });
}

function displayEligibilityResult(result) {
    const eligibilityPopup = document.getElementById('eligibilityPopup');
    eligibilityPopup.style.display = 'block';
    const { address, isEligible, error } = result;
    const message = error ?
        `Failed to check eligibility for ${address}.` :
        isEligible ?
            `${address} You may be eligible for the $ZRO Airdrop.` :
            `${address} You may not be eligible for the $ZRO Airdrop.`;
    eligibilityPopup.innerHTML = `<span>${message}</span>`;
}

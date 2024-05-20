document.getElementById('checkButton').addEventListener('click', function() {
    const addressesInput = document.getElementById('addressInput').value.trim();
    if (!addressesInput) {
        alert('Please enter addresses.');
        return;
    }

    const addresses = addressesInput.split(/[, ]+/).slice(0, 100); // Split addresses by comma or space, limit to 100
    const promises = addresses.map(address => {
        return fetchAndCheckAddress(address);
    });

    Promise.all(promises)
        .then(results => {
            displayResults(results);
        })
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
        addressResult.innerHTML = `<span>${formattedAddress}</span><span>${isSybil ? '<a href="https://docs.google.com/forms/d/e/1FAIpQLSfdnxQvdt8QTjGODVCSnckk_f1dv_IFeaeUVXRfF__euyIZbw/viewform">   Sybil . Fill the Form </a>' : 'Not in Sybil'}</span>`;
        resultPopup.appendChild(addressResult);
    });
}

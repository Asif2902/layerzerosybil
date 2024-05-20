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

document.getElementById('donateButton').addEventListener('click', function() {
    const donatePopup = document.getElementById('donatePopup');
    donatePopup.style.display = 'block';
});

document.getElementById('copyButton').addEventListener('click', function() {
    const donateAddress = document.getElementById('donateAddress').innerText;
    navigator.clipboard.writeText(donateAddress).then(() => {
        alert('Address copied to clipboard');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
});

document.getElementById('closeDonatePopup').addEventListener('click', function() {
    const donatePopup = document.getElementById('donatePopup');
    donatePopup.style.display = 'none';
});

function fetchAndCheckAddress(address) {
    return fetch('https://raw.githubusercontent.com/LayerZero-Labs/sybil-report/main/initialList.txt')
        .then(response => response.text())
        .then(data => {
            const addressesList = data.split('\n').map(line => line.trim());
            const isSybil = addressesList.includes(address.toLowerCase());
            return { address: formatAddress(address), isSybil };
        });
}

function checkEligibility(address) {
    return fetch('https://raw.githubusercontent.com/Asif2902/layerzerosybil/main/Result.txt')
        .then(response => response.text())
        .then(data => {
            const regex = /0x[a-fA-F0-9]{40}/g;
            const addressesList = data.match(regex) || [];
            const isEligible = addressesList.includes(address.toLowerCase());
            return { address: formatAddress(address), isEligible };
        })
        .catch(error => {
            console.error('Error reading Result.txt:', error);
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
            checkEligibilityButton.onclick = function() {
                checkEligibility(address).then(eligibilityResult => {
                    displayEligibilityResult(eligibilityResult);
                    checkEligibilityButton.style.display = 'none'; // Hide button after click
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
            `${address} Service is under maintenance . Try Again later` :
            `${address} Service is under maintenance . Try Again later.`;
    eligibilityPopup.innerHTML = `<span>${message}</span>`;
}

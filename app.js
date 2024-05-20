document.getElementById('checkButton').addEventListener('click', function() {
    const address = document.getElementById('addressInput').value.trim();
    if (!address) {
        alert('Please enter an address.');
        return;
    }

    fetch('sybil.zip')  
        .then(response => response.blob())
        .then(blob => {
            return JSZip.loadAsync(blob);
        })
        .then(zip => {
            return zip.file('sybil.txt').async('string');
        })
        .then(data => {
            const addresses = data.split('\n').map(line => line.trim());
            const isSybil = addresses.includes(address);
            const resultPopup = document.getElementById('resultPopup');
            const popupMessage = document.getElementById('popupMessage');
            const fillUpButton = document.getElementById('fillUpButton');
            const twitterButton = document.getElementById('twitterButton');

            resultPopup.style.display = 'block';

            if (isSybil) {
                popupMessage.textContent = 'Your address is in Sybil. Please fill up the form for a investigation by LayerZero Team.';
                fillUpButton.classList.remove('hidden');
                twitterButton.classList.remove('hidden');
                twitterButton.classList.add('small');
            } else {
                popupMessage.textContent = 'Hurray, you are not in Sybil!';
                fillUpButton.classList.add('hidden');
                twitterButton.classList.add('hidden');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to fetch or process the ZIP file.');
        });
});

document.getElementById('fillUpButton').addEventListener('click', function() {
    window.location.href = 'https://docs.google.com/forms/d/e/1FAIpQLSfdnxQvdt8QTjGODVCSnckk_f1dv_IFeaeUVXRfF__euyIZbw/viewform';
});

document.getElementById('twitterButton').addEventListener('click', function() {
    window.location.href = 'https://twitter.com/XponentialEarns';
});

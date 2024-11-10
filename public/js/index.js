// Toggle the visibility of the wallet modal
function toggleWalletModal() {
    const walletModal = document.getElementById("walletModal");
    walletModal.classList.toggle("hidden");
}
window.addEventListener('DOMContentLoaded', async () => {
    const connectWalletButton = document.querySelector('.connect-wallet');
    const walletModal = document.getElementById("walletModal");
    const connectedWalletAddress = document.getElementById("connectedWalletAddress");
    const hospitalDetailsSection = document.getElementById("hospitalDetailsSection"); // Section for hospital details
    const addHospitalButton = document.getElementById("addHospitalButton"); // Add Hospital button
    const disconnectWalletButton = document.getElementById("disconnectWalletButton");
    const goToRequestedPageButton = document.getElementById("goToRequestedPageButton");
    const addOrgansButton = document.getElementById("addOrgansButton");

    let isOwner = false;
    let contract;

    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is detected.');
    } else {
        alert('MetaMask is not installed. Please install it to connect.');
        return;
    }

    // Connect Wallet Button Click Event
    connectWalletButton.addEventListener('click', async () => {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            console.log('Connected account:', account);

            const web3 = new Web3(window.ethereum);
            await loadContract(web3);  // Load contract and check for owner

            const shortAddress = `${account.slice(0, 6)}...${account.slice(-4)}`;
            connectWalletButton.textContent = shortAddress;

            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            if (chainId !== '0xaa36a7') {
                await switchToSepolia();
            }

            displayWalletOptions(account); // Display wallet options, including Add Hospital button if owner
            toggleWalletModal();
            await displayHospitalDetails(account); // Fetch and display hospital details

        } catch (error) {
            console.error('Error during connection:', error);
            alert('Failed to connect to MetaMask. Check console for details.');
        }
    });

    // Display wallet options in the modal, including Add Hospital button if the user is the contract owner
    function displayWalletOptions(address) {
        connectedWalletAddress.textContent = address;
        addHospitalButton.classList.toggle("hidden", !isOwner);  // Show Add Hospital button only if isOwner is true
        disconnectWalletButton.onclick = disconnectWallet;
        addOrgansButton.onclick = () => window.location.href = 'addOrgans.html';
        goToRequestedPageButton.onclick = () => window.location.href = 'requests.html';
        addHospitalButton.onclick = () => window.location.href = 'addHospital.html';
        
    }

    // Fetch and display hospital details if the account is a registered hospital
    async function displayHospitalDetails(account) {
        try {
            const hospitalDetails = await contract.methods.hospitals(account).call();
            if (hospitalDetails.exists) {
                hospitalDetailsSection.innerHTML = `
                    <p><strong>Name:</strong> ${hospitalDetails.name}</p>
                    <p><strong>Location:</strong> ${hospitalDetails.location}</p>
                    <p><strong>Contact Info:</strong> ${hospitalDetails.contactInfo}</p>
                    <p><strong>Organs Listed:</strong> ${hospitalDetails.organsListed}</p>
                    <p><strong>Organs Donated:</strong> ${hospitalDetails.organsDonated}</p>
                `;
            } else {
                hospitalDetailsSection.innerHTML = "<p>This address is not registered as a hospital.</p>";
            }
        } catch (error) {
            console.error("Error fetching hospital details:", error);
            hospitalDetailsSection.innerHTML = "<p>Unable to fetch hospital details. Please try again later.</p>";
        }
    }


    // Disconnect wallet and clear wallet-related details
    function disconnectWallet() {
        connectWalletButton.textContent = "Connect Wallet";
        connectedWalletAddress.textContent = "";
        hospitalDetailsSection.innerHTML = ""; // Clear hospital details on disconnect
        isOwner = false; // Reset owner status
        addHospitalButton.classList.add("hidden"); // Hide Add Hospital button on disconnect
        toggleWalletModal(); // Close the modal
    }

    // Load Contract and Check if the Connected Wallet is the Contract Owner
    async function loadContract(web3) {
        //const response = await fetch('/findNowABI.json');
        const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"hospitalAddress","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"location","type":"string"},{"internalType":"string","name":"contactInfo","type":"string"}],"name":"addHospital","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"organName","type":"string"},{"internalType":"string","name":"organDetails","type":"string"}],"name":"addOrgan","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"organId","type":"uint256"}],"name":"confirmOrganRequest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getAllAvailableOrgans","outputs":[{"components":[{"internalType":"uint256","name":"organId","type":"uint256"},{"internalType":"address","name":"hospitalAddress","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"details","type":"string"},{"internalType":"bool","name":"isAvailable","type":"bool"},{"internalType":"address","name":"requestedBy","type":"address"},{"internalType":"bool","name":"confirmed","type":"bool"},{"internalType":"bool","name":"delivered","type":"bool"}],"internalType":"struct FindNow.Organ[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAllConfirmedOrgans","outputs":[{"components":[{"internalType":"uint256","name":"organId","type":"uint256"},{"internalType":"address","name":"hospitalAddress","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"details","type":"string"},{"internalType":"bool","name":"isAvailable","type":"bool"},{"internalType":"address","name":"requestedBy","type":"address"},{"internalType":"bool","name":"confirmed","type":"bool"},{"internalType":"bool","name":"delivered","type":"bool"}],"internalType":"struct FindNow.Organ[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAllDeliveredOrgans","outputs":[{"components":[{"internalType":"uint256","name":"organId","type":"uint256"},{"internalType":"address","name":"hospitalAddress","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"details","type":"string"},{"internalType":"bool","name":"isAvailable","type":"bool"},{"internalType":"address","name":"requestedBy","type":"address"},{"internalType":"bool","name":"confirmed","type":"bool"},{"internalType":"bool","name":"delivered","type":"bool"}],"internalType":"struct FindNow.Organ[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAllRequestedOrgans","outputs":[{"components":[{"internalType":"uint256","name":"organId","type":"uint256"},{"internalType":"address","name":"hospitalAddress","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"details","type":"string"},{"internalType":"bool","name":"isAvailable","type":"bool"},{"internalType":"address","name":"requestedBy","type":"address"},{"internalType":"bool","name":"confirmed","type":"bool"},{"internalType":"bool","name":"delivered","type":"bool"}],"internalType":"struct FindNow.Organ[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"hospitals","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"location","type":"string"},{"internalType":"string","name":"contactInfo","type":"string"},{"internalType":"uint256","name":"organsListed","type":"uint256"},{"internalType":"uint256","name":"organsDonated","type":"uint256"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"organId","type":"uint256"}],"name":"markOrganAsReceived","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"organCounter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"organs","outputs":[{"internalType":"uint256","name":"organId","type":"uint256"},{"internalType":"address","name":"hospitalAddress","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"details","type":"string"},{"internalType":"bool","name":"isAvailable","type":"bool"},{"internalType":"address","name":"requestedBy","type":"address"},{"internalType":"bool","name":"confirmed","type":"bool"},{"internalType":"bool","name":"delivered","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"hospitalAddress","type":"address"}],"name":"removeHospital","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"organId","type":"uint256"}],"name":"requestOrgan","outputs":[],"stateMutability":"nonpayable","type":"function"}];
        contract = new web3.eth.Contract(abi, '0x90D72514a1dd3E7061566a3aecCa64FB4d94c07B');
        const ownerAddress = await contract.methods.owner().call();
        console.log(ownerAddress);
        const accounts = await web3.eth.getAccounts();
        isOwner = accounts[0] === ownerAddress;
    }

    async function switchToSepolia() {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0xaa36a7' }],
            });
            console.log('Switched to Sepolia network');
        } catch (switchError) {
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: '0xaa36a7',
                            chainName: 'Sepolia Testnet',
                            nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 },
                            rpcUrls: ['https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID'],
                            blockExplorerUrls: ['https://sepolia.etherscan.io']
                        }],
                    });
                    console.log('Sepolia network added');
                } catch (addError) {
                    console.error('Failed to add Sepolia network:', addError);
                    alert('Failed to add Sepolia network. Check console for details.');
                }
            } else {
                console.error('Error switching network:', switchError);
                alert('Failed to switch network. Check console for details.');
            }
        }
    }
});


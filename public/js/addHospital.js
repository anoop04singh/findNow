// Load Web3 and Contract
let web3;
let contract;
const contractAddress = "0x90D72514a1dd3E7061566a3aecCa64FB4d94c07B"; // Replace with your actual contract address
const walletButton = document.getElementById("walletButton");

async function initializeWeb3() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        await loadContract();
        await checkIfOwner();
    } else {
        alert("Please install MetaMask to use this feature!");
    }
}

// Load ABI and initialize contract
async function loadContract() {
    try {
        const response = await fetch('../contract/findNowABI.json'); // Path to ABI file
        const abi = await response.json();
        contract = new web3.eth.Contract(abi, contractAddress);
    } catch (error) {
        console.error("Failed to load contract ABI:", error);
    }
}

// Check if the connected wallet is the contract owner
async function checkIfOwner() {
    const accounts = await web3.eth.getAccounts();
    const ownerAddress = await contract.methods.owner().call();

    if (accounts[0] === ownerAddress) {
        document.getElementById("addHospitalForm").classList.remove("hidden"); // Show form if owner
    } else {
        document.getElementById("notOwnerMessage").classList.remove("hidden"); // Show error if not owner
    }
    displayShortAddress(accounts[0]);
}

// Display shortened wallet address on the connect button
function displayShortAddress(address) {
    const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
    walletButton.innerText = shortAddress;
}

// Form submission handler for adding a hospital
document.getElementById("addHospitalForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const hospitalAddress = document.getElementById("hospitalAddress").value;
    const hospitalName = document.getElementById("hospitalName").value;
    const hospitalLocation = document.getElementById("hospitalLocation").value;
    const contactInfo = document.getElementById("contactInfo").value;
    const statusMessage = document.getElementById("statusMessage");
    statusMessage.textContent = "Adding hospital...";

    try {
        const accounts = await web3.eth.getAccounts();
        await contract.methods.addHospital(hospitalAddress, hospitalName, hospitalLocation, contactInfo).send({ from: accounts[0] });
        statusMessage.textContent = "Hospital added successfully!";
        statusMessage.classList.remove("text-danger");
        statusMessage.classList.add("text-success");
    } catch (error) {
        console.error("Error adding hospital:", error);
        statusMessage.textContent = "Failed to add hospital. Please try again.";
        statusMessage.classList.remove("text-success");
        statusMessage.classList.add("text-danger");
    }
});

// Initialize Web3 on page load
window.addEventListener("load", initializeWeb3);

// Load Web3 and Contract
let web3;
let contract;

const contractAddress = "0x90D72514a1dd3E7061566a3aecCa64FB4d94c07B"; // Replace with actual contract address
const walletButton = document.getElementById("walletButton");

async function initializeWeb3() {
    console.log("Initializing Web3...");
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        console.log("Web3 initialized.");
        await window.ethereum.enable();
        await loadContract();
        await checkWalletConnection();
    } else {
        alert("Please install MetaMask to use this feature!");
    }
}

// Load ABI from external JSON and initialize contract
async function loadContract() {
    console.log("Loading contract ABI...");
    try {
        const response = await fetch('../contract/findNowABI.json');
        const abi = await response.json();
        contract = new web3.eth.Contract(abi, contractAddress);
        console.log("Contract loaded with address:", contractAddress);
    } catch (error) {
        console.error("Failed to load contract ABI:", error);
    }
}

// Check wallet connection and update wallet button
async function checkWalletConnection() {
    console.log("Checking wallet connection...");
    try {
        const accounts = await web3.eth.getAccounts();
        console.log("Accounts found:", accounts);
        if (accounts.length > 0) {
            displayShortAddress(accounts[0]);
        } else {
            walletButton.innerText = "Connect Wallet";
            walletButton.addEventListener("click", connectWallet);
            console.log("Wallet not connected.");
        }
    } catch (error) {
        console.error("Error checking wallet connection:", error);
    }
}

// Display shortened wallet address
function displayShortAddress(address) {
    const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
    walletButton.innerText = shortAddress;
    console.log("Wallet connected with address:", shortAddress);
}

// Connect wallet on button click
async function connectWallet() {
    console.log("Connecting wallet...");
    try {
        const accounts = await web3.eth.requestAccounts();
        if (accounts.length > 0) {
            displayShortAddress(accounts[0]);
        }
    } catch (error) {
        console.error("Error connecting wallet:", error);
    }
}

// Add organ through the contract
async function addOrgan(organName, organDetails) {
    const statusMessage = document.getElementById("statusMessage");
    statusMessage.textContent = "Adding organ...";

    try {
        const accounts = await web3.eth.getAccounts();
        await contract.methods.addOrgan(organName, organDetails).send({ from: accounts[0] });
        statusMessage.textContent = "Organ added successfully!";
        statusMessage.classList.remove("text-danger");
        statusMessage.classList.add("text-success");
    } catch (error) {
        console.error("Error adding organ:", error);
        statusMessage.textContent = "Failed to add organ. Please try again.";
        statusMessage.classList.remove("text-success");
        statusMessage.classList.add("text-danger");
    }
}

// Handle form submission
document.getElementById("addOrganForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const organName = document.getElementById("organName").value;
    const organDetails = document.getElementById("organDetails").value;
    await addOrgan(organName, organDetails);
});

// Initialize Web3 on page load
window.addEventListener("load", initializeWeb3);
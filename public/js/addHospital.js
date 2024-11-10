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
        //const response = await fetch('../contract/findNowABI.json'); // Path to ABI file
        const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"hospitalAddress","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"location","type":"string"},{"internalType":"string","name":"contactInfo","type":"string"}],"name":"addHospital","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"organName","type":"string"},{"internalType":"string","name":"organDetails","type":"string"}],"name":"addOrgan","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"organId","type":"uint256"}],"name":"confirmOrganRequest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getAllAvailableOrgans","outputs":[{"components":[{"internalType":"uint256","name":"organId","type":"uint256"},{"internalType":"address","name":"hospitalAddress","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"details","type":"string"},{"internalType":"bool","name":"isAvailable","type":"bool"},{"internalType":"address","name":"requestedBy","type":"address"},{"internalType":"bool","name":"confirmed","type":"bool"},{"internalType":"bool","name":"delivered","type":"bool"}],"internalType":"struct FindNow.Organ[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAllConfirmedOrgans","outputs":[{"components":[{"internalType":"uint256","name":"organId","type":"uint256"},{"internalType":"address","name":"hospitalAddress","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"details","type":"string"},{"internalType":"bool","name":"isAvailable","type":"bool"},{"internalType":"address","name":"requestedBy","type":"address"},{"internalType":"bool","name":"confirmed","type":"bool"},{"internalType":"bool","name":"delivered","type":"bool"}],"internalType":"struct FindNow.Organ[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAllDeliveredOrgans","outputs":[{"components":[{"internalType":"uint256","name":"organId","type":"uint256"},{"internalType":"address","name":"hospitalAddress","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"details","type":"string"},{"internalType":"bool","name":"isAvailable","type":"bool"},{"internalType":"address","name":"requestedBy","type":"address"},{"internalType":"bool","name":"confirmed","type":"bool"},{"internalType":"bool","name":"delivered","type":"bool"}],"internalType":"struct FindNow.Organ[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAllRequestedOrgans","outputs":[{"components":[{"internalType":"uint256","name":"organId","type":"uint256"},{"internalType":"address","name":"hospitalAddress","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"details","type":"string"},{"internalType":"bool","name":"isAvailable","type":"bool"},{"internalType":"address","name":"requestedBy","type":"address"},{"internalType":"bool","name":"confirmed","type":"bool"},{"internalType":"bool","name":"delivered","type":"bool"}],"internalType":"struct FindNow.Organ[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"hospitals","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"location","type":"string"},{"internalType":"string","name":"contactInfo","type":"string"},{"internalType":"uint256","name":"organsListed","type":"uint256"},{"internalType":"uint256","name":"organsDonated","type":"uint256"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"organId","type":"uint256"}],"name":"markOrganAsReceived","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"organCounter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"organs","outputs":[{"internalType":"uint256","name":"organId","type":"uint256"},{"internalType":"address","name":"hospitalAddress","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"details","type":"string"},{"internalType":"bool","name":"isAvailable","type":"bool"},{"internalType":"address","name":"requestedBy","type":"address"},{"internalType":"bool","name":"confirmed","type":"bool"},{"internalType":"bool","name":"delivered","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"hospitalAddress","type":"address"}],"name":"removeHospital","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"organId","type":"uint256"}],"name":"requestOrgan","outputs":[],"stateMutability":"nonpayable","type":"function"}];
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

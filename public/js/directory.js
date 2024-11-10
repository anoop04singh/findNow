// Load Web3 and Contract
let web3;
let contract;

const contractAddress = "0x90D72514a1dd3E7061566a3aecCa64FB4d94c07B"; // Replace with your deployed contract address
const walletButton = document.getElementById("walletButton");
// Toggle the visibility of the wallet modal
function toggleWalletModal() {
    const walletModal = document.getElementById("walletModal");
    walletModal.classList.toggle("hidden");
}

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
        //const response = await fetch('../contract/findNowABI.json');
        const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"hospitalAddress","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"location","type":"string"},{"internalType":"string","name":"contactInfo","type":"string"}],"name":"addHospital","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"organName","type":"string"},{"internalType":"string","name":"organDetails","type":"string"}],"name":"addOrgan","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"organId","type":"uint256"}],"name":"confirmOrganRequest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getAllAvailableOrgans","outputs":[{"components":[{"internalType":"uint256","name":"organId","type":"uint256"},{"internalType":"address","name":"hospitalAddress","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"details","type":"string"},{"internalType":"bool","name":"isAvailable","type":"bool"},{"internalType":"address","name":"requestedBy","type":"address"},{"internalType":"bool","name":"confirmed","type":"bool"},{"internalType":"bool","name":"delivered","type":"bool"}],"internalType":"struct FindNow.Organ[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAllConfirmedOrgans","outputs":[{"components":[{"internalType":"uint256","name":"organId","type":"uint256"},{"internalType":"address","name":"hospitalAddress","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"details","type":"string"},{"internalType":"bool","name":"isAvailable","type":"bool"},{"internalType":"address","name":"requestedBy","type":"address"},{"internalType":"bool","name":"confirmed","type":"bool"},{"internalType":"bool","name":"delivered","type":"bool"}],"internalType":"struct FindNow.Organ[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAllDeliveredOrgans","outputs":[{"components":[{"internalType":"uint256","name":"organId","type":"uint256"},{"internalType":"address","name":"hospitalAddress","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"details","type":"string"},{"internalType":"bool","name":"isAvailable","type":"bool"},{"internalType":"address","name":"requestedBy","type":"address"},{"internalType":"bool","name":"confirmed","type":"bool"},{"internalType":"bool","name":"delivered","type":"bool"}],"internalType":"struct FindNow.Organ[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAllRequestedOrgans","outputs":[{"components":[{"internalType":"uint256","name":"organId","type":"uint256"},{"internalType":"address","name":"hospitalAddress","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"details","type":"string"},{"internalType":"bool","name":"isAvailable","type":"bool"},{"internalType":"address","name":"requestedBy","type":"address"},{"internalType":"bool","name":"confirmed","type":"bool"},{"internalType":"bool","name":"delivered","type":"bool"}],"internalType":"struct FindNow.Organ[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"hospitals","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"location","type":"string"},{"internalType":"string","name":"contactInfo","type":"string"},{"internalType":"uint256","name":"organsListed","type":"uint256"},{"internalType":"uint256","name":"organsDonated","type":"uint256"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"organId","type":"uint256"}],"name":"markOrganAsReceived","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"organCounter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"organs","outputs":[{"internalType":"uint256","name":"organId","type":"uint256"},{"internalType":"address","name":"hospitalAddress","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"details","type":"string"},{"internalType":"bool","name":"isAvailable","type":"bool"},{"internalType":"address","name":"requestedBy","type":"address"},{"internalType":"bool","name":"confirmed","type":"bool"},{"internalType":"bool","name":"delivered","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"hospitalAddress","type":"address"}],"name":"removeHospital","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"organId","type":"uint256"}],"name":"requestOrgan","outputs":[],"stateMutability":"nonpayable","type":"function"}];
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
            loadOrgans();
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
            loadOrgans();
        }
    } catch (error) {
        console.error("Error connecting wallet:", error);
    }
}

// Load all available organs from contract
async function loadOrgans() {
    console.log("Loading available organs from contract...");
    try {
        const organs = await contract.methods.getAllAvailableOrgans().call();
        console.log("Available organs:", organs);
        
        organs.forEach(organ => {
            displayOrganCard(organ);
        });
    } catch (error) {
        console.error("Error loading organs:", error);
    }
}


// Display each organ as a card with additional spacing between cards and buttons
function displayOrganCard(organ) {
    const directoryContainer = document.getElementById("directory-container");

    const organCard = document.createElement("div");
    organCard.classList.add("p-6", "bg-gray-100", "rounded-lg", "shadow-lg", "dark:bg-gray-800", "mb-4"); // mb-4 for spacing between cards

    organCard.innerHTML = `
        <h2 class="text-xl font-bold text-purple-700 dark:text-white">${organ.name}</h2>
        <p class="mt-2 text-gray-700 dark:text-gray-400"><strong>Hospital:</strong> ${organ.hospitalAddress}</p>
        <p class="mt-2 text-gray-700 dark:text-gray-400"><strong>Details:</strong> ${organ.details}</p>
        <p class="mt-2 text-gray-700 dark:text-gray-400"><strong>ID:</strong> ${organ.organId}</p>
        <p class="mt-2 text-gray-700 dark:text-gray-400"><strong>Available:</strong> ${organ.isAvailable ? "Yes" : "No"}</p>
        <div class="mt-4 d-flex gap-3"> <!-- gap-3 for spacing between buttons -->
            <button onclick="getHospitalDetails('${organ.hospitalAddress}')" class="text-white bg-purple-700 hover:bg-purple-800 font-medium rounded-lg text-sm px-4 py-2 dark:bg-purple-600 dark:hover:bg-purple-700">Hospital Details</button>
            <button onclick="requestOrgan(${organ.organId})" class="text-white bg-purple-700 hover:bg-purple-800 font-medium rounded-lg text-sm px-4 py-2 dark:bg-purple-600 dark:hover:bg-purple-700">Request Organ</button>
        </div>
    `;

    directoryContainer.appendChild(organCard);
}



// Fetch and display hospital details
async function getHospitalDetails(hospitalAddress) {
    console.log("Fetching hospital details for:", hospitalAddress);
    try {
        const hospital = await contract.methods.hospitals(hospitalAddress).call();
        alert(`Hospital Name: ${hospital.name}\nLocation: ${hospital.location}\nContact Info: ${hospital.contactInfo}\nOrgans Listed: ${hospital.organsListed}\nOrgans Donated: ${hospital.organsDonated}`);
    } catch (error) {
        console.error("Error fetching hospital details:", error);
        alert("Failed to fetch hospital details.");
    }
}

// Request organ
async function requestOrgan(organId) {
    console.log("Requesting organ with ID:", organId);
    try {
        const accounts = await web3.eth.getAccounts();
        await contract.methods.requestOrgan(organId).send({ from: accounts[0] });
        alert("Organ requested successfully!");
        // Optionally, reload the organs to update status
        loadOrgans();
    } catch (error) {
        console.error("Error requesting organ:", error);
        alert("Failed to request organ.");
    }
}

// Initialize Web3 when page loads
window.addEventListener("load", initializeWeb3);

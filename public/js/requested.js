// Load Web3 and Contract
let web3;
let contract;

const contractAddress = "0x90D72514a1dd3E7061566a3aecCa64FB4d94c07B"; // Replace with your deployed contract address
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
            loadRequestedOrgans(accounts[0]);
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
            loadRequestedOrgans(accounts[0]);
        }
    } catch (error) {
        console.error("Error connecting wallet:", error);
    }
}

// Load requested and confirmed organs for the connected wallet
async function loadRequestedOrgans(walletAddress) {
    console.log("Loading requested organs...");
    try {
        const allRequestedOrgans = await contract.methods.getAllRequestedOrgans().call();
        const confirmedOrgans = await contract.methods.getAllConfirmedOrgans().call();

        // Create a set of confirmed organ IDs to filter them out from requests
        const confirmedOrganIds = new Set(confirmedOrgans.map(organ => organ.organId));

        // Organs requested by the connected wallet
        const requestedByYou = allRequestedOrgans.filter(organ => organ.requestedBy === walletAddress && organ.confirmed === false);
        requestedByYou.forEach(organ => {
            displayRequestedOrganCard(organ, "requestedByYouContainer");
        });

        // Organs published by the connected wallet that have been requested but are not yet confirmed
        const organsPublishedByYou = allRequestedOrgans.filter(
            organ => organ.hospitalAddress === walletAddress && organ.confirmed === false
        );
        organsPublishedByYou.forEach(organ => {
            displayRequestedOrganCardWithConfirm(organ, "requestsOnYourOrgansContainer");
        });

        // Display confirmed organs requested by the connected wallet
        const confirmedRequestedByYou = confirmedOrgans.filter(organ => organ.requestedBy === walletAddress && organ.delivered === false);
        confirmedRequestedByYou.forEach(organ => {
            displayConfirmedOrganCard(organ);
        });
    } catch (error) {
        console.error("Error loading requested organs:", error);
    }
}

// Display a requested organ as a card without a confirm button
function displayRequestedOrganCard(organ, containerId) {
    const container = document.getElementById(containerId);

    const organCard = document.createElement("div");
    organCard.classList.add("p-6", "bg-gray-100", "rounded-lg", "shadow-lg", "dark:bg-gray-800", "mb-4");

    organCard.innerHTML = `
        <h2 class="text-xl font-bold text-purple-700 dark:text-white">${organ.name}</h2>
        <p class="mt-2 text-gray-700 dark:text-gray-400"><strong>Hospital:</strong> ${organ.hospitalAddress}</p>
        <p class="mt-2 text-gray-700 dark:text-gray-400"><strong>Details:</strong> ${organ.details}</p>
        <p class="mt-2 text-gray-700 dark:text-gray-400"><strong>ID:</strong> ${organ.organId}</p>
    `;

    container.appendChild(organCard);
}

// Display a requested organ with a confirm button
function displayRequestedOrganCardWithConfirm(organ, containerId) {
    const container = document.getElementById(containerId);

    const organCard = document.createElement("div");
    organCard.classList.add("p-6", "bg-gray-100", "rounded-lg", "shadow-lg", "dark:bg-gray-800", "mb-4");

    organCard.innerHTML = `
        <h2 class="text-xl font-bold text-purple-700 dark:text-white">${organ.name}</h2>
        <p class="mt-2 text-gray-700 dark:text-gray-400"><strong>Hospital:</strong> ${organ.hospitalAddress}</p>
        <p class="mt-2 text-gray-700 dark:text-gray-400"><strong>Details:</strong> ${organ.details}</p>
        <p class="mt-2 text-gray-700 dark:text-gray-400"><strong>ID:</strong> ${organ.organId}</p>
        <button onclick="confirmOrganRequest(${organ.organId})" 
                class="text-white bg-purple-700 hover:bg-purple-800 font-medium rounded-lg text-sm px-4 py-2 lg:px-5 lg:py-2.5 dark:bg-purple-600 dark:hover:bg-purple-700 mt-4">
            Confirm Request
        </button>
    `;

    container.appendChild(organCard);
}

// Display confirmed organ in the Confirmed Organs section with "Mark as Received" button
function displayConfirmedOrganCard(organ) {
    const container = document.getElementById("confirmedOrgansContainer");

    const organCard = document.createElement("div");
    organCard.classList.add("p-6", "bg-gray-100", "rounded-lg", "shadow-lg", "dark:bg-gray-800", "mb-4");

    organCard.innerHTML = `
        <h2 class="text-xl font-bold text-purple-700 dark:text-white">${organ.name}</h2>
        <p class="mt-2 text-gray-700 dark:text-gray-400"><strong>Hospital:</strong> ${organ.hospitalAddress}</p>
        <p class="mt-2 text-gray-700 dark:text-gray-400"><strong>Details:</strong> ${organ.details}</p>
        <p class="mt-2 text-gray-700 dark:text-gray-400"><strong>ID:</strong> ${organ.organId}</p>
        <button onclick="markOrganAsReceived(${organ.organId})" 
                class="text-white bg-purple-700 hover:bg-purple-800 font-medium rounded-lg text-sm px-4 py-2 lg:px-5 lg:py-2.5 dark:bg-purple-600 dark:hover:bg-purple-700 mt-4">
            Mark as Received
        </button>
    `;

    container.appendChild(organCard);
}

// Confirm organ request
async function confirmOrganRequest(organId) {
    console.log("Confirming organ request with ID:", organId);
    try {
        const accounts = await web3.eth.getAccounts();
        await contract.methods.confirmOrganRequest(organId).send({ from: accounts[0] });
        alert("Organ request confirmed successfully!");
        loadRequestedOrgans(accounts[0]); // Refresh to update lists
    } catch (error) {
        console.error("Error confirming organ request:", error);
        alert("Failed to confirm organ request.");
    }
}

// Mark organ as received
async function markOrganAsReceived(organId) {
    console.log("Marking organ as received with ID:", organId);
    try {
        const accounts = await web3.eth.getAccounts();
        await contract.methods.markOrganAsReceived(organId).send({ from: accounts[0] });
        alert("Organ marked as received successfully!");
        loadRequestedOrgans(accounts[0]); // Refresh to update lists
    } catch (error) {
        console.error("Error marking organ as received:", error);
        alert("Failed to mark organ as received.");
    }
}

// Initialize Web3 when page loads
window.addEventListener("load", initializeWeb3);

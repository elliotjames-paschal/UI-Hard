// Example of minimal logic using ethers.js
let provider, signer, contract;
const contractAddress = "YOUR_CONTRACT_ADDRESS_HERE";

// Fetch ABI from the JSON file (or you can inline it directly here)
fetch('stablecoinABI.json')
    .then(response => response.json())
    .then(abi => {
        // Setup event listeners after loading the ABI
        document.getElementById('connectWallet').addEventListener('click', async () => {
            if (window.ethereum) {
                provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                signer = provider.getSigner();
                contract = new ethers.Contract(contractAddress, abi, signer);
                notify("Wallet connected");
            } else {
                notify("Please install MetaMask!");
            }
        });

        document.getElementById('mintBtn').addEventListener('click', async () => {
            const amount = document.getElementById('mintAmount').value;
            if (contract && amount) {
                try {
                    const tx = await contract.mint(ethers.utils.parseUnits(amount, 18)); // assuming 18 decimals
                    notify("Minting in progress...");
                    await tx.wait();
                    notify("Mint successful!");
                } catch (err) {
                    notify("Mint failed: " + err.message);
                }
            }
        });

        document.getElementById('burnBtn').addEventListener('click', async () => {
            const amount = document.getElementById('burnAmount').value;
            if (contract && amount) {
                try {
                    const tx = await contract.burn(ethers.utils.parseUnits(amount, 18)); // assuming 18 decimals
                    notify("Burning in progress...");
                    await tx.wait();
                    notify("Burn successful!");
                } catch (err) {
                    notify("Burn failed: " + err.message);
                }
            }
        });
    })
    .catch(err => {
        console.error("Failed to load ABI:", err);
    });

function notify(message) {
    document.getElementById('notification').innerText = message;
}

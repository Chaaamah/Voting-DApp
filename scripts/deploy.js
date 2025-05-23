const { ethers } = require("hardhat");
async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const Voting = await ethers.getContractFactory("Voting");
    const contract = await Voting.deploy();
    await contract.waitForDeployment();
    
    const address = await contract.getAddress();
    console.log("Contract deployed to:", address);

    //? Add condidates
    const addCandidateTx1 = await contract.addCandidate("Alice", "QmUjaQfkXtqnWSvtWs2CSPJf9r4AiZfLG3oamv2J4twZZP");
    await addCandidateTx1.wait();

    const addCandidateTx2 = await contract.addCandidate("Bob", "QmYpqEod7na94o4GtdWN4iSUFJ6bWLAKCgHiEAoF7Z5RRD");
    await addCandidateTx2.wait();

    console.log('====================================');
    console.log("Condidates added successfully!");
    console.log('====================================');
}   

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
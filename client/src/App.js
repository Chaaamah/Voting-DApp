import { useState, useEffect } from "react";
import { ethers } from "ethers";
import VotingAbi from "./Voting.json";

const CONTRACT_ADRESS = "";

function App() {
  const [account, setAccount] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [votedId, setVotedId] = useState(0);
  const [newCandidate, setNewCandidate] = useState("");

  const getContract = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(
      CONTRACT_ADRESS, VotingAbi.abi, signer
    )
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      return alert("Please install MetaMask!");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    setAccount(address);

    const contract = await getContract();
    const owner = await contract.owner();
    setIsOwner(address.toLowerCase() === owner.toLowerCase());
  };

  const loadCandidates = async () => {
    const contract = await getContract();
    const count = await contract.numberOfCondidates();
    const candidatesList = [];

    for (let i = 1; i <= count; i++) {
      const candidate = await contract.candidates(i);
      candidatesList.push({
        id: i,
        name: candidate.name,
        voteCount: candidate.voteCount.toString(),
      });
    }
    setCandidates(candidatesList);
  }

  const vote = async () => {
    const contract = await getContract();
    const tx = await contract.vote(votedId);
    await tx.wait();
    loadCandidates();
  };

  const addCondidate = async () => {
    if (!newCandidate.trim()) return;
    const contract = await getContract();
    const tx = await contract.addCandidate(newCandidate);
    await tx.wait();
    setNewCandidate("");
    loadCandidates();
  };

  useEffect(() => {
    connectWallet();
    loadCandidates();    
  }, []);

  return (
    <div className="App" style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Voting DApp</h1>
      <p>Account: <strong>{account}</strong></p>

      {isOwner && (
        <div style={{ marginTop: "20px" }}>
          <h2>Add Candidate</h2>
          <input
            type="text"
            value={newCandidate}
            onChange={(e) => setNewCandidate(e.target.value)}
            placeholder="Candidate Name"
          />
          <button onClick={addCondidate}>Add</button>
        </div>
      )}

      <h3>Candidates</h3>
      <select
        onChange={(e) => setVotedId(e.target.value)}
        style={{ marginBottom: "20px" }}>
        <option value="">--Select Candidate--</option>
        {candidates.map((candidate) => (
          <option key={candidate.id} value={candidate.id}>
            {candidate.name} ({candidate.voteCount} votes {candidate.voteCount !== 1 ? "votes" : "vote"})
          </option>
        ))}
        </select>

      <button onClick={vote} disabled={!votedId}>Vote</button>

      <h3 style={{ marginTop: "20px" }}>Results</h3>
      <ul>
        {candidates.map((candidate) => (
          <li key={candidate.id}>
            {candidate.name}: {candidate.voteCount} votes
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App;
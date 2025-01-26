import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Pg2 from './Pg2';

const contractABI = [
  "function mint(address to, uint256 amount) public",
  "function burn(uint256 amount) public",
  "function balanceOf(address account) public view returns (uint256)"
];

const contractAddress = "0x1291Be112d480055DaFd8a610b7d1e203891C274";

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (account) {
      async function connectWallet() {
        try {
          const provider = new ethers.providers.JsonRpcProvider('http://mrrobot.home.ro:8545');
          const signer = provider.getSigner();
          const contract = new ethers.Contract(contractAddress, contractABI, signer);
          setProvider(provider);
          setContract(contract);
          await getBalance(contract, account);
        } catch (error) {
          console.error("Error connecting to wallet:", error);
        }
      }

      connectWallet();
    }
  }, [account]);

  const connectWallet = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider('http://mrrobot.home.ro:8545');
      const accounts = await provider.listAccounts();
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setContract(null);
    setBalance(null);
  };

  const mintTokens = async () => {
    if (contract) {
      try {
        const tx = await contract.mint(account, ethers.utils.parseEther("1"));
        await tx.wait();
        console.log("Minted 1 token");
        await getBalance(contract, account);
      } catch (error) {
        console.error("Error minting tokens:", error);
      }
    }
  };

  const burnTokens = async () => {
    if (contract) {
      try {
        const tx = await contract.burn(ethers.utils.parseEther("1"));
        await tx.wait();
        console.log("Burned 1 token");
        await getBalance(contract, account);
      } catch (error) {
        console.error("Error burning tokens:", error);
      }
    }
  };

  const getBalance = async (contract, account) => {
    try {
      const balance = await contract.balanceOf(account);
      setBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error("Error getting balance:", error);
    }
  };

  return (
    <Router>
      <div className="App">
        <div className="sidebar">
          {account ? (
            <>
              <p>Connected: {account}</p>
              <p>Balance: {balance} Tokens</p>
              <button className="mint-button" onClick={mintTokens}>Mint </button>
              <button className="burn-button" onClick={burnTokens}>Burn </button>
              <button className="disconnect-button" onClick={disconnectWallet}>Disconnect </button>
            </>
          ) : (
            <>
              <p>Not connected</p>
              <button className="connect-button" onClick={connectWallet}>ETH Wallet</button>
              <Link to="/pg2">
                <button className="green-button">Change</button>
              </Link>
            </>
          )}
        </div>
        <div className="main-content">
          <Routes>
            <Route path="/" element={<h1>ITB</h1>} />
            <Route path="/pg2" element={<Pg2 />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

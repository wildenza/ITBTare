import React, { useEffect, useState } from 'react'; // Importă React și hook-urile useEffect și useState
import { ethers } from 'ethers'; // Importă biblioteca ethers pentru interacțiunea cu Ethereum
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Importă componentele necesare pentru rutarea în aplicație
import './App.css'; // Importă stilurile CSS pentru aplicație
import Urm from './Pg2'; // Importă componenta Urm pentru a fi folosită în rutele aplicației

const contractABI = [
  "function mint(address to, uint256 amount) public", // ABI pentru funcția mint
  "function burn(uint256 amount) public", // ABI pentru funcția burn
  "function balanceOf(address account) public view returns (uint256)" // ABI pentru funcția balanceOf
];

const contractAddress = "0x1291Be112d480055DaFd8a610b7d1e203891C274"; // Adresa contractului Ethereum

function App() {
  const [account, setAccount] = useState(null); // Stochează adresa contului conectat
  const [provider, setProvider] = useState(null); // Stochează provider-ul Ethereum pentru interacțiuni
  const [contract, setContract] = useState(null); // Stochează instanța contractului
  const [balance, setBalance] = useState(null); // Stochează balansul contului

  useEffect(() => {
    if (account) { // Dacă există un cont conectat
      async function connectWallet() { // Funcție pentru a conecta wallet-ul
        try {
          const provider = new ethers.providers.JsonRpcProvider('http://mrrobot.home.ro:8545'); // Creează un provider pentru conexiunea RPC
          const signer = provider.getSigner(); // Obține semnatarul (semnătura tranzacțiilor)
          const contract = new ethers.Contract(contractAddress, contractABI, signer); // Creează instanța contractului folosind ABI și semnatar
          setProvider(provider); // Setează provider-ul
          setContract(contract); // Setează contractul
          await getBalance(contract, account); // Obține balansul contului
        } catch (error) {
          console.error("Error connecting to wallet:", error); // Afișează eroare dacă se întâmplă ceva
        }
      }

      connectWallet(); // Apelează funcția pentru a conecta wallet-ul
    }
  }, [account]); // Această funcție se va executa atunci când contul se schimbă

  const connectWallet = async () => { // Funcție pentru a conecta wallet-ul
    try {
      const provider = new ethers.providers.JsonRpcProvider('http://mrrobot.home.ro:8545'); // Creează un provider pentru conexiunea RPC
      const accounts = await provider.listAccounts(); // Listează conturile disponibile
      setAccount(accounts[0]); // Setează primul cont din listă ca fiind contul activ
    } catch (error) {
      console.error("Error connecting to wallet:", error); // Afișează eroare în caz de problemă
    }
  };

  const disconnectWallet = () => { // Funcție pentru a deconecta wallet-ul
    setAccount(null); // Resetează contul
    setProvider(null); // Resetează provider-ul
    setContract(null); // Resetează contractul
    setBalance(null); // Resetează balansul
  };

  const mintTokens = async () => { // Funcție pentru a crea noi tokenuri (mint)
    if (contract) { // Verifică dacă contractul este disponibil
      try {
        const tx = await contract.mint(account, ethers.utils.parseEther("1")); // Apelează funcția mint a contractului cu 1 token
        await tx.wait(); // Așteaptă confirmarea tranzacției
        console.log("Minted 1 token"); // Afișează mesaj de succes
        await getBalance(contract, account); // Obține balansul actualizat
      } catch (error) {
        console.error("Error minting tokens:", error); // Afișează eroare în cazul unei probleme
      }
    }
  };

  const burnTokens = async () => { // Funcție pentru a arde tokenuri (burn)
    if (contract) { // Verifică dacă contractul este disponibil
      try {
        const tx = await contract.burn(ethers.utils.parseEther("1")); // Apelează funcția burn a contractului cu 1 token
        await tx.wait(); // Așteaptă confirmarea tranzacției
        console.log("Burned 1 token"); // Afișează mesaj de succes
        await getBalance(contract, account); // Obține balansul actualizat
      } catch (error) {
        console.error("Error burning tokens:", error); // Afișează eroare în cazul unei probleme
      }
    }
  };

  const getBalance = async (contract, account) => { // Funcție pentru a obține balansul contului
    try {
      const balance = await contract.balanceOf(account); // Apelează funcția balanceOf din contract pentru contul dat
      setBalance(ethers.utils.formatEther(balance)); // Setează balansul în format ether
    } catch (error) {
      console.error("Error getting balance:", error); // Afișează eroare dacă nu se poate obține balansul
    }
  };

  return (
    <Router>
      <div className="App">
        <div className="sidebar">
          {account ? ( // Dacă există un cont conectat
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
              <Link to="/Urm">
                <button className="green-button">Change</button> 
              </Link>
            </>
          )}
        </div>
        <div className="main-content">
          <Routes>
            <Route path="/" element={<h1>ITB</h1>} /> 
            <Route path="/Urm" element={<Urm />} /> 
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

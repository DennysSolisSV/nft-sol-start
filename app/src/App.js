import React, { useEffect, useState } from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';

// import buildQuery from 'arweave';
import {  arweave } from './lib/api';

import TestWeave from 'testweave-sdk';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;




const App = () => {
  // State
  const [walletAddress, setWalletAddress] = useState(null);
  const [winnerTransactionId, setWinnerTransactionId ] = useState('');

  let st = '';

  //   ARWEAVE
  

  const getPostInfos = async() => {
    const testWeave = await TestWeave.init(arweave);
    arweave.network.getInfo().then(console.log);

    const data = `sapoberdetuyu`
      const transaction = await arweave.createTransaction({
        data,
      }, testWeave.rootJWK)

      transaction.addTag('Content-Type', 'text/plain');
      transaction.addTag('key', 'sabadito');

      await arweave.transactions.sign(transaction, testWeave.rootJWK)
      const statusBeforePost = await arweave.transactions.getStatus(transaction.id)
      console.log(statusBeforePost); // this will return 404
      await arweave.transactions.post(transaction)
      const statusAfterPost = await arweave.transactions.getStatus(transaction.id)
      console.log(statusAfterPost); // this will return 202

      await testWeave.mine();
      const statusAfterMine = await arweave.transactions.getStatus(transaction.id)
      console.log(statusAfterMine); // this will return 200

      let ss = arweave.transactions.search('key', 'sabadito').then(function(result){
        // console.log(result);
        // transactionid_winner = result[0];
        // console.log(transactionid_winner);
        st = result[0]
        setWinnerTransactionId(st)
        GetData(st);
        console.log(st)
        console.log(result[0])
        // console.log(winnerTransactionId)
      })

      const GetData = (st) => {
        arweave.transactions.getData(st, {decode: true, string: true}).then(data => {
          console.log(data);
          // <!DOCTYPE HTML>...
        });

        arweave.transactions.get(st).then(transaction => {

          transaction.get('tags').forEach(tag => {
            let key = tag.get('name', {decode: true, string: true});
            let value = tag.get('value', {decode: true, string: true});
            console.log(`${key} : ${value}`);
          });
          // Content-Type : text/html
          // User-Agent : ArweaveDeploy/1.1.0
        });


      }
       
  }


  
   

  // ARWEAVE

  // Actions
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString()
          );

          /*
           * Set the user's publicKey in state to be used later!
           */
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;
  
    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    const onLoad = async () => {
      // await checkIfWalletIsConnected();
      await getPostInfos();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🍭 Candy Drop</p>
          <p className="sub-text">NFT drop machine with fair mint</p>
          {/* Add the condition to show this only if we don't have a wallet address */}
          {!walletAddress && renderNotConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
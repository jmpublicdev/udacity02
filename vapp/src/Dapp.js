
import Web3 from 'web3';
import StarNotary from './contracts/StarNotary.json';

//Strongly inspired from https://dappsdev.org/blog/2020-10-05-how-to-init-a-dapp-with-web3-js-using-metamask-8/

 let DApp = {
    web3: null,
     loaded:false,
     contracts: {},
     balance: "",
    accounts: [],
     delegateEvents: null,

    init: function() {
        return DApp.initWeb3();
    },

    initWeb3: async function () {
        if (typeof window.ethereum !== 'undefined') {
            // New web3 provider
            // As per EIP1102 and EIP1193
            // Ref: https://eips.ethereum.org/EIPS/eip-1102
            // Ref: https://eips.ethereum.org/EIPS/eip-1193
            try {
                // Request account access if needed
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts',
                });
                // Accounts now exposed, use them

                // Opt out of refresh page on network change
                // Ref: https://docs.metamask.io/guide/ethereum-provider.html#properties
                window.ethereum.autoRefreshOnNetworkChange = false;

                // When user changes to another account,
                // trigger necessary updates within DApp
                window.ethereum.on('accountsChanged', DApp.updateAccounts);
                await DApp.updateAccounts(accounts);
            } catch (error) {
                // User denied account access
                console.error('User denied web3 access');
                return;
            }
            DApp.web3 = new Web3(window.ethereum);
            await DApp.updateBalance();
        }
        else if (window.web3) {
            // Deprecated web3 provider
            DApp.web3 = new Web3(window.web3.currentProvider);
            // no need to ask for permission
        }
        // No web3 provider
        else {
            console.error('No web3 provider detected');
            return;
        }
        return DApp.initContract();
    },

    updateAccounts: async function(accounts) {
        //const firstUpdate = !(DApp.accounts && DApp.accounts[0]);
        DApp.accounts = accounts || await DApp.web3.eth.getAccounts();
        console.log('updateAccounts', accounts[0]);

        await DApp.updateBalance();
    },

    initContract: async function() {
        let networkId = await DApp.web3.eth.net.getId();
        console.log('networkId', networkId);

        let deployedNetwork = StarNotary.networks[networkId];
        if (!deployedNetwork) {
            console.error('No contract deployed on the network that you are connected. Please switch networks.');
            return;
        }
        console.log('deployedNetwork', deployedNetwork);

        DApp.contracts.StarNotary = new DApp.web3.eth.Contract(
            StarNotary.abi,
            deployedNetwork.address,
        );
        console.log('Election', DApp.contracts.StarNotary);

        DApp.loaded = true;

        return DApp;
    },

     updateBalance : async function() {
        console.log('inside getAccount Blanace');
        if (DApp.web3) {
            let wei = await DApp.web3.eth.getBalance(DApp.accounts[0]);
            let value =  await DApp.web3.utils.fromWei(wei, 'ether');
            DApp.balance = value;
        }
     },

     checkStarName : async function() {
         console.log(DApp.contracts.StarNotary);
         let result = await DApp.contracts.StarNotary.methods.starName().call();

         console.log(result);
         return result;
     },

     checkStarOwner : async function() {
        let result = await DApp.contracts.StarNotary.methods.starOwner().call();
        return result;
     },

     claimStar : async function() {
        let result = await DApp.contracts.StarNotary.methods.claimStar().send({from: DApp.accounts[0].toString()});
        console.log(result);
     },

     changeName : async function(starName) {
         let result = await DApp.contracts.StarNotary.methods
             .changeName(starName)
             .send({from: DApp.accounts[0].toString()});
         console.log(result);
     },

     createStar: async function(starName,tokenID) {
         let result = await DApp.contracts.StarNotary.methods
             .createStar(starName,tokenID)
             //.send({from: DApp.accounts[0].toString(),gasPrice:5000000});
         // error 32603 frommetamaks//MetaMask - RPC Error: Error: [ethjs-query] while formatting outputs from RPC '{"value":{"code":-32603,"data":{"message":"VM Exception while processing transaction: revert","code":-32000,"data":{"0x1dc26e2f3722b2751c8632c38d74d7cb98551270c9dfc1b3f96e45097bcb8096":{"error":"revert","program_counter":97,"return":"0x"},"stack":"RuntimeError: VM Exception while processing transaction: revert\n
             .send({from: DApp.accounts[0].toString(),gasLimit:5000000})
         console.log(result);
         return result;
     },

     checkStarInfo: async function(tokenID) {
        console.log('will try to execute checkStarInfo');
        console.log(tokenID);
         let result = await DApp.contracts.StarNotary.methods
             .lookUptokenIdToStarInfo(tokenID)
             .call()
         console.log(result);
         return result;
     }



};

 export default DApp;

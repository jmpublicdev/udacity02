// Importing the StartNotary Smart Contract ABI (JSON representation of the Smart Contract)
const StarNotary = artifacts.require("StarNotary");
const chai = require('chai');

var accounts; // List of development accounts provided by Truffle
var owner; // Global variable use it in the tests cases

// This called the StartNotary Smart contract and initialize it
contract('StarNotary', (accs) => {
    accounts = accs; // Assigning test accounts
    owner = accounts[0]; // Assigning the owner test account
});

// Example test case, it will test if the contract is able to return the starName property
// initialized in the contract constructor

it ('can create a star', async() => {
    let instance = await StarNotary.deployed();
    await instance.createStar('Pollux',12341245);

    let  ownerLocal = await instance.ownerOf(12341245);
    chai.expect(ownerLocal).to.equal(owner);

})

//create a star // lookup a star.

it ('should have name + symbos', async() => {
    let instance = await StarNotary.deployed();
    let symbol = await instance.symbol();
    chai.expect(symbol).to.equals('STX')

    let name = await instance.name();
    chai.expect(name).to.equals('StarNotary')

})


it ('can put a star for sale', async() => {
    let instance = await StarNotary.deployed();
    console.log(instance);


    let result = await instance.balanceOf(owner);
    chai.expect(parseInt(result)).to.equal(1);

    await instance.createStar('Pollux',123412457);

    await instance.putStarForSale(123412457,150);

    result = await instance.balanceOf(owner);
    chai.expect(parseInt(result)).to.equal(2);


    let temp = await instance.starsForSale.call(123412457);
    chai.expect(parseInt(temp)).to.equals(150)
    console.log(temp);

})

it ('can put a star for sale', async() => {

    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 5;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");

    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarForSale(starId, starPrice, {from: user1});

    //let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);

    await instance.approve(user2, starId, {from: user1, gasPrice: 0})

    await instance.buyStar(starId, {from: user2, value: balance, gasPrice:0});

    const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
    let value = Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar);
    assert.equal(value, starPrice);

});

it ('can look out for for star name', async() => {
    let instance = await StarNotary.deployed();
    let name = await instance.lookUptokenIdToStarInfo(5);
    chai.expect(name).to.equals('awesome star');

})


it ('should be able to exchange stars', async() => {
    let instance = await StarNotary.deployed();

    let alfred = accounts[1];
    let batman = accounts[2];

    let jokerStar = 1;
    let mysteryStar = 2;

    await instance.createStar('mystery star', mysteryStar, {from: alfred});
    await instance.createStar('joker star', jokerStar, {from: batman});

    let ownerOfMystery = await instance.ownerOf(mysteryStar);
    let ownerOfJoker = await instance.ownerOf(jokerStar);

    chai.expect(ownerOfMystery.toString()).to.equals(alfred);
    chai.expect(ownerOfJoker.toString()).to.equals(batman);


    let res = await instance.approve(batman, mysteryStar, {from: alfred, gasPrice: 1000000})
    await instance.approve(alfred, jokerStar, {from: batman, gasPrice: 1000000})


    await instance.exchangeStars(jokerStar,mysteryStar,{from: batman});

    ownerOfMystery = await instance.ownerOf(mysteryStar);
    ownerOfJoker = await instance.ownerOf(jokerStar);

    chai.expect(ownerOfMystery.toString()).to.equals(batman);
    chai.expect(ownerOfJoker.toString()).to.equals(alfred);


})

it ('should be able to transfer a star to someone', async() => {
    let instance = await StarNotary.deployed();

    let alfred = accounts[1];
    let batman = accounts[2];

    let robinStar = 150;
    await instance.createStar('robin star', robinStar, {from: alfred});

    let robinOwner = await instance.ownerOf(robinStar);
    chai.expect(robinOwner.toString()).to.equals(alfred);

    await instance.transferStar(robinStar,batman,{from:alfred});

    robinOwner = await instance.ownerOf(robinStar);
    chai.expect(robinOwner.toString()).to.equals(batman);

    let name = await instance.lookUptokenIdToStarInfo(robinStar);
    chai.expect(name.toString()).to.equals('robin star');
});

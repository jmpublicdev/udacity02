//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.0 <=0.8.0;

//import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

//https://review.udacity.com/#!/rubrics/2297/view

contract StarNotary is ERC721 {

    //using Counters for Counters.Counter;
    //Counters.Counter private _tokenIds;

    struct Star {
        string name;
    }

    mapping(uint256 => Star) public tokenIdToStarInfo;
    mapping(uint256 => uint256) public starsForSale;

    constructor() ERC721("StarNotary", "STX") {}


    function createStar(string memory name, uint256 tokenId) payable public {
//        bool doesNotExists = ! _exists(tokenId);
//        require(doesNotExists);
        Star memory newStar = Star(name);
        tokenIdToStarInfo[tokenId] = newStar;
        _safeMint(msg.sender, tokenId);
    }

    function buyStar() pure public returns (uint8){
        return 1;
    }

    function putStarForSale(uint256 _tokenId, uint256 _price)  public {
        require(ownerOf(_tokenId) == msg.sender, "You can't sale the Star you don't owned");
        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public  payable {
                require(starsForSale[_tokenId] > 0, "The Star should be up for sale");
        uint256 starCost = starsForSale[_tokenId];
        address ownerAddress = ownerOf(_tokenId);
        require(msg.value > starCost, "You need to have enough Ether");
        safeTransferFrom(ownerAddress, msg.sender, _tokenId); // We can't use _addTokenTo or_removeTokenFrom functions, now we have to use _transferFrom

        address payable payableOwner = payable (address(ownerAddress));
        payableOwner.transfer(starCost);
        if(msg.value > starCost) {
            address payable payableSender = payable(address(msg.sender));
            payableSender.transfer(msg.value - starCost);
        }
    }


    //Add a function lookUptokenIdToStarInfo, that looks up the stars using the Token ID, and then returns the name of the star.
    function lookUptokenIdToStarInfo(uint256 _tokenID) public view returns (string memory) {
        Star memory star  = tokenIdToStarInfo[_tokenID];
        return star.name;
    }

    //Add a function called exchangeStars, so 2 users can exchange their star tokens...
    //Do not worry about the price, just write code to exchange stars between users.
    function exchangeStars(uint256 callerToken, uint256 friendToken) public {
        //trouver la fonction ERC 721 pour pouvoir changer l'ownershop
        //transfer
//        Star memory starUser1 =  tokenIdToStarInfo[callerToken];
//        Star memory starUser2 =  tokenIdToStarInfo[_tokenID2];

        address caller = ownerOf(callerToken);
        address friend = ownerOf(friendToken);

        safeTransferFrom(caller, friend,callerToken);
        safeTransferFrom(friend, caller,friendToken);

    }



    //Write a function to Transfer a Star. The function should transfer a star from the //address of the caller.
    //The function should accept 2 arguments, the address to transfer the star to, and the token ID of the star.
    function transferStar(uint8 starToken,address to) public {
        address starOwner = ownerOf(starToken);
        require (starOwner == msg.sender);
        safeTransferFrom(starOwner,to,starToken);
    }



}

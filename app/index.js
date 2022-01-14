import One from './demo-1'
import Web3 from 'web3';
import Moralis from 'moralis';


const serverUrl = "https://oqwxgtkiflrz.usemoralis.com:2053/server";
const appId = "nsRkwNGljvOddDMGUmg4x5g60DX94d54XxLrifkf";
Moralis.start({ serverUrl, appId });


const demo = document.body.getAttribute('data-id')

document.documentElement.classList.remove('no-js')
document.documentElement.classList.add('js')

// const images = document.querySelectorAll('img:not([src*="https://tympanus.net/codrops/wp-content/banners/"])')
let imagesIndex = 0
let url = 'https://illuminati.mypinata.cloud/ipfs/QmSnTNBFv8bK8q5t3Gi3TJkZeXbotu9YJSVQ5XTFFbGbhD/'
let thumb_url = 'https://images.raritysniffer.com/800/800/ipfs/'



// add from here down
async function login() {
  let user = Moralis.User.current();
  if (!user) {
    user = await Moralis.authenticate();
    connected(user);
  }
  
}

async function logOut() {
  await Moralis.User.logOut();
  console.log("logged out");
  window.location.reload()
}

document.querySelector('#connect').onclick = login
document.querySelector('#disconnect').onclick = logOut

async function init(){
  let user = Moralis.User.current();
  if(user){
    connected(user)
  }else{
    start() 
  }}
  
init()

async function connected(user){
  document.querySelector('#connect_wallet').style.display = 'none'
  document.querySelector('#wallet_address').style.display = 'block'
  document.querySelector('#wallet').innerHTML = user.get("ethAddress")
  let ens = await Moralis.Web3API.resolve.resolveAddress();
  if(ens && ens.name){
    
    document.querySelector('#wallet').innerHTML = ens.name
    document.querySelector('.demo-1__title').innerHTML = ens.name
  }
  getNFTs(user)
}

async function getNFTs(user){
  const userEthNFTs = await Moralis.Web3.getNFTs();
  window.connectedNFTs = userEthNFTs.filter(nft => nft.token_address === '0x26badf693f2b103b021c670c852262b379bbbe8a')
  console.log('found these pyramids', window.connectedNFTs)
  start() 
}

async function start(){
  let requests = []
  let images = []
  if(window.connectedNFTs && window.connectedNFTs.length){
     requests = window.connectedNFTs.map(nft => {return fetch(nft.token_uri)})
  }else{
    let randomNumbers = [];
    for(let i = 0; i < 12; i++){
      randomNumbers.push(Math.floor(Math.random() * 8127))
    }

    //for all random numbers, get the image from IPFS url and add to array 
    for(let i = 0; i < randomNumbers.length; i++){
      requests.push(fetch(url + randomNumbers[i]))
    }
  }

  try {
    let promises = await Promise.all(requests)
    for(let i = 0; i < promises.length; i++){
      let response = await promises[i]
      let json = await response.json()
      images.push(json)
    }  
  } catch (error) {
    console.error('Something went terribly wrong') 
  }
  //if there are less than 12 images, add up to 12 from array and randomize
  
  if(images.length < 12){
    let randomNumbers = [];
    for(let i = 0; i < 11; i++){
      randomNumbers.push(Math.floor(Math.random() * images.length))
    }
    for(let i = 0; i < randomNumbers.length; i++){
      images.push(images[randomNumbers[i]])
    }
  }

    

  
  
  images.forEach(res => {
    const img = new Image()

    img.src = `${thumb_url}${res.image.split('ipfs/')[1]}`
    img.crossOrigin = 'anonymous'

    let figure = document.createElement('figure')
    figure.classList.add('demo-1__gallery__figure')
    img.classList.add('demo-1__gallery__figure__image')
    figure.appendChild(img)
    document.querySelector('.demo-1__gallery').appendChild(figure)
    
    
    img.onerror = _ => {
      //remove image from gallery
      console.log(this)
      figure.remove()
      imagesIndex -= 1
    }
    img.onload = _ => {
      imagesIndex += 1
    }
  })
  
  document.documentElement.classList.remove('loading')
  document.documentElement.classList.add('loaded')
  
  window.app = new One()
}


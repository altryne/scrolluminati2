import One from './demo-1'

const demo = document.body.getAttribute('data-id')

document.documentElement.classList.remove('no-js')
document.documentElement.classList.add('js')

// const images = document.querySelectorAll('img:not([src*="https://tympanus.net/codrops/wp-content/banners/"])')
let imagesIndex = 0
let url = 'https://illuminati.mypinata.cloud/ipfs/QmSnTNBFv8bK8q5t3Gi3TJkZeXbotu9YJSVQ5XTFFbGbhD/'
let thumb_url = 'https://images.raritysniffer.com/500/500/ipfs/'



window.start = async function (){

  //randomize 100 numbers between 0 and 8127
  let randomNumbers = []
  for(let i = 0; i < 12; i++){
    randomNumbers.push(Math.floor(Math.random() * 8127))
  }
  //for all random numbers, get the image from IPFS url and add to array 
  let images = []
  let requests = []
  for(let i = 0; i < randomNumbers.length; i++){
    requests.push(fetch(url + randomNumbers[i]))
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

start() 

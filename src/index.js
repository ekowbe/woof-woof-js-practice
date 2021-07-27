
const URL_PREFIX='http://localhost:3000/';

console.log("time to get pups")

// adapted from https://attacomsian.com/blog/javascript-dom-remove-all-children-of-an-element
const removeChildren = (parent) => {
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
};



function showMoreInfo(pupObj) {
    const dogInfoDiv = document.querySelector('#dog-info')
    // remove previous pup being shown 
    removeChildren(dogInfoDiv)
    
    // create elements
    let pupImg = document.createElement('img')
    let pupNameHeading = document.createElement('h2')
    let isGoodDogButton = document.createElement('button')

    // populate elements
    pupImg.src = pupObj.image
    pupNameHeading.innerHTML = `${pupObj.name}`
    isGoodDogButton.innerText = pupObj.isGoodDog? "Good Dog!" : "Bad Dog!"

    // add populated elements to dog-info div
    dogInfoDiv.appendChild(pupImg)
    dogInfoDiv.appendChild(pupNameHeading)
    dogInfoDiv.appendChild(isGoodDogButton)

}

// return dog object corresponding to name given
function findDog(dogs, dogName) {
    return dogs.find( ({name}) => name === dogName )
}

window.onload = function fetchPups() {
    fetch(URL_PREFIX + "pups")
        .then(rsp => rsp.json())
        .then(pups => {
            console.log(pups)
            let dogBar = document.querySelector('#dog-bar')
            dogBar.innerHTML = ''

            // populate with all the pup info
            for (let i = 0; i < pups.length; i++) {
                const pup = pups[i]
                let pupNameSpan = document.createElement('span')
                pupNameSpan.innerText = `${pup.name}`
                pupNameSpan.id = pup.id
                dogBar.appendChild(pupNameSpan)

            }



            // show more info when span is clicked
            document.addEventListener('click', event => {
                if (event.target.matches('span')) {
                    let pupNameSpan = event.target.closest('span')
                    //console.log(pupNameSpan.innerText)
                    let pup = findDog(pups, pupNameSpan.innerText)
                    //console.log(pup)
                    showMoreInfo(pup)
                }

                // toggle good dog
                if (event.target.matches('#dog-info button')){
                    const isGoodDogButton = document.querySelector('#dog-info button')

                    // console.log('button clicked')
                    // console.log(isGoodDogButton)

                    // get the pup to which this button is tied
                    let pupInfo = event.target.closest('div')
                    let pupName = pupInfo.querySelector('h2').innerText
                    let pup = findDog(pups, pupName)
                    console.log(pup)
                    
                    if (pup.isGoodDog) {
                        console.log(" this pup is a good dog. now it has to be bad")
                        
                    } else {
                        console.log("wow. this bad dog is about to become a good dog.")
                    }
                    
                    let newIsGoodDog = !pup.isGoodDog

                    
                    fetch(URL_PREFIX + `pups/${pup.id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({isGoodDog: newIsGoodDog})
                    })
                    .then(rsp => rsp.json())
                    .then(pup => {
                        console.log(pup)
                        showMoreInfo(pup)
                    })
                }
                

                }
            )






        })
    

    
    

}





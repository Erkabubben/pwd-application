/**
 * The memory-state web component module.
 *
 * @author Erik Lindholm <elimk06@student.lnu.se>
 * @version 1.0.0
 */
const pathToModule = import.meta.url
const componentsOfParentPath = new URL('../', pathToModule)
const imagesPath = new URL('./components/flipping-tile/images/', pathToModule)
import './components/flipping-tile/index.js'
import './components/countdown-timer/index.js'

/**
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
    #memory-state {
      background-color: white;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    #game-area {
      position: absolute;
      width: 80%;
      height: 100%;
      left: 0px;
      top: 0px;
    }
    #cards-area {
      width: max-content;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    #ui-area {
      position: absolute;
      background-color: #222222;
      width: 20%;
      height: 100%;
      right: 0px;
      top: 0px;
      border: 4px outset #222222;
    }
    h1 {
      color: white;
      font-size: 1.25rem;
      text-align: center;
    }
  </style>
  <div id="memory-state">
    <div id="game-area">
      <div id="cards-area"></div>
    </div>
    <div id="ui-area">
      <h1 id="pairsfoundtext">Pairs found:</h1>
      <h1 id="pairsfoundcounter"></h1>
      <h1 id="mistakestext">Mistakes:</h1>
      <h1 id="mistakescounter"></h1>
      <h1 id="timertext">Time:</h1>
      <h1 id="timercounter"><countdown-timer></h1>
    </div>
  </div>
`
//    <flipping-tile><img src="` + imagesPath + `1.png"></flipping-tile>
//    <flipping-tile><img src="` + imagesPath + `2.png"></flipping-tile>
/**
 * Define custom element.
 */
customElements.define('memory-state',
  /**
   *
   */
  class extends HTMLElement {
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      /* Memory state properties */
      this._memoryState = this.shadowRoot.querySelector('#memory-state')
      this._gameArea = this.shadowRoot.querySelector('#game-area')
      this._cardsArea = this.shadowRoot.querySelector('#cards-area')
      this._pairsFoundCounter = this.shadowRoot.querySelector('#pairsfoundcounter')
      this._mistakesCounter = this.shadowRoot.querySelector('#mistakescounter')
      this._timerCounter = this.shadowRoot.querySelector('#timercounter')

      this._cardMotifs = ['0','1','2','3','4','5','6','7','8','9',
        '10','11','12','13','14','15','16','17','18']

      this.cardSizes = {
        '2x2': 256,
        '4x2': 128,
        '4x4': 128,
        '6x6': 90
      }

      this._startingCardsAmount = 0
      this._lineLength = 0
      this._linesAmount = 0

      this._selectedCard = 0
      this._selectedCardRow = 0
      this._selectedCardColumn = 0

      this._activeCards = []
      this._cardsColumnRowToID = {}
      this._cardsIDToColumnRow = {}
    
      this._amountOfCardsOfPairFlipped = 0
      this._cardsOfPair1 = -1
      this._cardsOfPair2 = -1
      this._cardsPairTimeout = 0

      this._pairsFound = 0
      this._mistakes = 0

      this.cardSize = 96

    }

    InheritStyle (styleElement) {
      const style = document.createElement('style')
      style.id = 'inherited'
      style.innerHTML = styleElement.innerHTML
      this.shadowRoot.appendChild(style)
    }



    InitiateGame (gridSize) {

      this._lineLength = gridSize.charAt(0)
      this._linesAmount = gridSize.charAt(2)

      this._startingCardsAmount = this._lineLength * this._linesAmount

      this._pairsFoundCounter.textContent = this._pairsFound + ' / ' + (this._startingCardsAmount / 2)
      this._mistakesCounter.textContent = this._mistakes

      let cardMotifs = this._cardMotifs.slice()
      
      cardMotifs = this.Shuffle(cardMotifs)
      console.log(cardMotifs)

      let cards = []

      for (let i = 0; i < (this._startingCardsAmount / 2); i++) {
        const element = cardMotifs[i];
        cards.push(element)
        cards.push(element)
      }

      cards = this.Shuffle(cards)


      let k = 0
      for (let i = 0; i < this._linesAmount; i++) {
        const line = i
        const newCardLine = document.createElement('div')
        for (let j = 0; j < this._lineLength; j++) {
          const newCard = document.createElement('flipping-tile')
          const newCardImg = document.createElement('img')
          newCard.setAttribute('backsideColor', 'yellow')
          newCard.setAttribute('backsideImage', 'backside')
          newCard.SetSize(this.cardSizes[gridSize], this.cardSizes[gridSize])
          newCard.motif = cards.pop()
          newCardImg.setAttribute('src', imagesPath + newCard.motif + '.jpg')
          newCard.appendChild(newCardImg)
          newCard.flipTile()
          newCard.row = i
          newCard.column = j
          newCard.cardID = k
          newCard.addEventListener('click', event => {
            if (event.button === 0) {
              this._selectedCardColumn = newCard.column
              this._selectedCardRow = newCard.row
              this._selectedCard = newCard.cardID
              this.UpdateCardFocus()
              this.FlipCard()
            }
          })
          newCardLine.appendChild(newCard)
          this._activeCards.push(newCard)
          this._cardsColumnRowToID[j + ',' + i] = k
          this._cardsIDToColumnRow[k] = j + ',' + i
          k++
        }
        this._cardsArea.appendChild(newCardLine)
      }

      this.UpdateCardFocus() 

      this.keyDownFunction = (event) => {
        if (event.keyCode === 39 || event.keyCode === 68) {  // Right arrowkey
          event.preventDefault()
          this._selectedCardColumn = (this._selectedCardColumn + 1) % this._lineLength
        } else if (event.keyCode === 37 || event.keyCode === 65) {  // Left arrowkey
          event.preventDefault()
          this._selectedCardColumn = (this._selectedCardColumn - 1)
          if (this._selectedCardColumn < 0) {
            this._selectedCardColumn = this._lineLength - 1
          }
        } else if (event.keyCode === 40 || event.keyCode === 83) {  // Down arrowkey
          event.preventDefault()
          this._selectedCardRow = (this._selectedCardRow + 1) % this._linesAmount
        } else if (event.keyCode === 38 || event.keyCode === 87) {  // Up arrowkey
          event.preventDefault()
          this._selectedCardRow = (this._selectedCardRow - 1)
          if (this._selectedCardRow < 0) {
            this._selectedCardRow = this._linesAmount - 1
          }
        }

        this._selectedCard = this._cardsColumnRowToID[this._selectedCardColumn + ',' + this._selectedCardRow]
        this.UpdateCardFocus()
        if (event.keyCode === 13) {
          event.preventDefault()
          this.UpdateCardFocus()
          this.FlipCard()
        }
        document.removeEventListener('keydown', this.keyDownFunction )
      }

      this.keyUpFunction = (event) => {
        document.addEventListener('keydown', this.keyDownFunction)
      }

      document.addEventListener('keydown', this.keyDownFunction)
      document.addEventListener('keyup', this.keyUpFunction)
      

    }

    UpdateCardFocus () {
      for (let i = 0; i < this._activeCards.length; i++) {
        const card = this._activeCards[i];
        if (card.cardID == this._selectedCard) {
          card._div.setAttribute('part', 'focus')
        } else {
          card._div.removeAttribute('part')
        }
      }
    }

    FlipCard () {
      let card = this._activeCards[this._selectedCard]
      if (this._amountOfCardsOfPairFlipped === 0 && card.hasAttribute('flipped')) {
        this._amountOfCardsOfPairFlipped++
        this._cardsOfPair1 = card.cardID
        card.flipTile()
      } else if (this._amountOfCardsOfPairFlipped === 1 && card.hasAttribute('flipped')) {
        this._amountOfCardsOfPairFlipped++
        this._cardsOfPair2 = card.cardID
        card.flipTile()
        let card1 = this._activeCards[this._cardsOfPair1]
        let card2 = this._activeCards[this._cardsOfPair2]
        if (card1.motif !== card2.motif) {  // Cards do not match
          this._cardsPairTimeout = setTimeout(() => {
            card1.flipTile()
            card2.flipTile()
            this._amountOfCardsOfPairFlipped = 0
            this._mistakes++
            this._mistakesCounter.textContent = this._mistakes
            clearTimeout(this._cardsPairTimeout)
          }, 1500)
        } else {  // Cards are a valid pair
          this._amountOfCardsOfPairFlipped = 0
          card1.HideAndInactivate()
          card2.HideAndInactivate()
          this._pairsFound++
          this._pairsFoundCounter.textContent = this._pairsFound + ' / ' + (this._startingCardsAmount / 2)
          if (this._pairsFound === (this._startingCardsAmount / 2)) {
            this.dispatchEvent(new window.CustomEvent('allpairsfound', { detail: '' }))
          }
        }
      }
    }

    /**
     * Shuffles the array of playing cards in place.
     *
     * @param {PlayingCard[]} playingCards - The array of PlayingCard objects to shuffle.
     * @returns {PlayingCard[]} The shuffled array of PlayingCard objects.
     */
    Shuffle (playingCards) {
      let i = playingCards.length
      let j
      let x

      while (i) {
        j = (Math.random() * i) | 0 // using bitwise OR 0 to floor a number
        x = playingCards[--i]
        playingCards[i] = playingCards[j]
        playingCards[j] = x
      }

      return playingCards
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['nickname']
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {*} oldValue - The old value.
     * @param {*} newValue - The new value.
     */
    attributeChangedCallback (name, oldValue, newValue) {

    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      document.removeEventListener('keydown', this.keyDownFunction)
      document.removeEventListener('keyup', this.keyUpFunction)
    }

    /**
     * Run the specified instance property
     * through the class setter.
     *
     * @param {string} prop - The property's name.
     */
    _upgradeProperty (prop) {
      if (Object.hasOwnProperty.call(this, prop)) {
        const value = this[prop]
        delete this[prop]
        this[prop] = value
      }
    }
  }
)

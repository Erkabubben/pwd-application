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
  </style>
  <div id="memory-state">

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
      this._cardMotifs = [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8'
      ]
      this._startingCardsAmount = 0
      this._lineLength = 0
      this._linesAmount = 0
      this._selectedCard = 0
      this._selectedCardRow = 0
      this._selectedCardColumn = 0
      this._activeCards = []
      this._cardsColumnRowToID = {}
      this._cardsIDToColumnRow = {}

      this.InitiateGame('4x4')
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

      console.log(this._lineLength, this._linesAmount, this._startingCardsAmount)

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
          newCardImg.setAttribute('src', imagesPath + cards.pop() + '.png')
          newCard.appendChild(newCardImg)
          newCard.flipTile()
          newCard.row = i
          newCard.column = j
          newCard.cardID = k
          newCard.addEventListener('click', event => {
            if (event.button === 0) {
              newCard.flipTile()
              //this._selectedCard = newCard.cardID
              this._selectedCardColumn = newCard.column
              this._selectedCardRow = newCard.row
              this.UpdateCardFocus() 
            }
          })
          newCardLine.appendChild(newCard)
          this._activeCards.push(newCard)
          this._cardsColumnRowToID[j + ',' + i] = k
          this._cardsIDToColumnRow[k] = j + ',' + i
          k++
        }
        this._memoryState.appendChild(newCardLine)
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
          this._selectedCardRow = (this._selectedCardRow - 1)
          if (this._selectedCardRow < 0) {
            this._selectedCardRow = this._linesAmount - 1
          }
        }
        
        this.UpdateCardFocus()
        if (event.keyCode === 13) {

        }
        document.removeEventListener('keydown', this.keyDownFunction )
      }

      document.addEventListener('keydown', this.keyDownFunction)
      document.addEventListener('keyup', () => { document.addEventListener('keydown', this.keyDownFunction) } )
      
    }

    UpdateCardFocus () {
      this._selectedCard = this._cardsColumnRowToID[this._selectedCardColumn + ',' + this._selectedCardRow]
      for (let i = 0; i < this._activeCards.length; i++) {
        const card = this._activeCards[i];
        if (card.cardID == this._selectedCard) {
          card._div.setAttribute('part', 'focus')
        } else {
          card._div.removeAttribute('part')
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
      document.removeEventListener('keydown', this.keyDownFunction )
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

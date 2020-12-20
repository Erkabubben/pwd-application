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
    <flipping-tile><img src="` + imagesPath + `1.png"></flipping-tile>
    <flipping-tile><img src="` + imagesPath + `2.png"></flipping-tile>
  </div>
`

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

      this.InitiateGame('4x4')
    }

    InheritStyle (styleElement) {
      const style = document.createElement('style')
      style.id = 'inherited'
      style.innerHTML = styleElement.innerHTML
      this.shadowRoot.appendChild(style)
    }

    InitiateGame (gridSize) {
      if (gridSize === '2x2') {
        this._startingCardsAmount = 4
      } else if (gridSize === '4x2') {
        this._startingCardsAmount = 8
      } else if (gridSize === '4x4') {
        this._startingCardsAmount = 16
      }

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

      console.log(cards)
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
    disconnectedCallback () {}

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

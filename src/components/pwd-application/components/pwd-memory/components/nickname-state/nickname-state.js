/**
 * The nickname-state web component module.
 *
 * @author Erik Lindholm <elimk06@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
    #nickname-state {
      background-color: white;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    h1 {
      color: orange;
      font-weight: bold;
      font-size: 96px;
      text-align: center;
    }

    form {
      margin: auto;
      font-family: Verdana;
      color: white;
      width: 50%;
    }

    form input {
      display: block;
      margin: auto;
    }

    form p {
      display: block;
      text-align: center;
    }

    form button {
      display: block;
      margin-left: auto;
      margin-right: auto;
      font-size: 1.15em;
      font-family: Verdana;
      color: white;
      font-weight: bold;
      background-color: #444444;
      border: 2px outset #444444;
    }

    form button:hover {
      background-color: #999999;
      border-color: #999999;
    }

    ::part(selected) {
      box-shadow: 0px 0px 1px 4px yellow;
    }
  </style>
  <div id="nickname-state">
    <h1>MEMORY</h1>
    <form>
      <br>
      <p>Enter a nickname: </p>
      <input type="text" id="nickname" class="selectable" autocomplete="off">
      <br><br>
      <div id="alternatives"></div><br>
    </form>
  </div>
`

/**
 * Define custom element.
 */
customElements.define('nickname-state',
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

      /* Nickname screen properties */
      this._nicknameState = this.shadowRoot.querySelector('#nickname-state')
      this._button = this.shadowRoot.querySelector('button')
      this._input = this.shadowRoot.querySelector('input')
      this._alternatives = this.shadowRoot.querySelector('#alternatives')

      let gameTypes = ['2x2', '4x2', '4x4']

      gameTypes.forEach(element => {
        const newAlternative = document.createElement('button')
        newAlternative.setAttribute('value', element)
        newAlternative.textContent = element
        newAlternative.classList.add('selectable')
        this._alternatives.appendChild(newAlternative)
        newAlternative.addEventListener('click', (event) => { // Checks if the mouse has been clicked
          event.preventDefault()
          if (this._input.value.length > 2) this.dispatchEvent(new window.CustomEvent('nicknameSet', { detail: { nickname: this._input.value, game: newAlternative.value }}))
        })
        this._alternatives.appendChild(document.createElement('br'))
        /*const newAlternative = document.createElement('input')
        newAlternative.setAttribute('type', 'radio')
        newAlternative.setAttribute('name', 'alternatives')
        newAlternative.setAttribute('id', element)
        newAlternative.setAttribute('value', element)
        const newAlternativeLabel = document.createElement('label')
        newAlternativeLabel.textContent = element
        this._alternatives.appendChild(newAlternative)
        this._alternatives.appendChild(newAlternativeLabel)
        this._alternatives.appendChild(document.createElement('br'))*/
      })

      this._selectedElement = 0
      this._selectables = this._nicknameState.querySelectorAll('.selectable')
      this._selectables[this._selectedElement].setAttribute('part', 'selected')

      this.keyDownFunction = (event) => {
        let selectedBefore = this._selectedElement
        if (event.keyCode === 40 || (event.keyCode === 13 && this._selectedElement === 0)) {  // Down arrowkey
          event.preventDefault()
          this._selectables[this._selectedElement].removeAttribute('part')
          this._selectedElement++
          if (this._selectedElement >= this._selectables.length) {
            this._selectedElement = 0
          } else if (this._selectedElement < 0 ) {
            this._selectedElement = (this._selectables.length - 1)
          }
          this._selectables[this._selectedElement].setAttribute('part', 'selected')
        } else if (event.keyCode === 38) {  // Up arrowkey
          event.preventDefault()
          this._selectables[this._selectedElement].removeAttribute('part')
          this._selectedElement--
          if (this._selectedElement >= this._selectables.length) {
            this._selectedElement = 0
          } else if (this._selectedElement < 0 ) {
            this._selectedElement = (this._selectables.length - 1)
          }
          this._selectables[this._selectedElement].setAttribute('part', 'selected')
        } else if (event.keyCode === 13 && this._selectedElement !== 0) { // Enter when button is selected...
          event.preventDefault()
          if (this._input.value.length > 2) { // ...and a valid nickname is set.
            this.dispatchEvent(new window.CustomEvent('nicknameSet', { detail: { nickname: this._input.value, game: this._selectables[this._selectedElement].value }}))
          }
        }
        // Focus or blur text input field depending on wether it is selected
        if (this._selectedElement === 0) {
          this._selectables[0].focus()
        } else {
          this._selectables[0].blur()
        }
      }

      this.keyUpFunction = (event) => {
        document.addEventListener('keydown', this.keyDownFunction)
      }

      document.addEventListener('keydown', this.keyDownFunction)
      document.addEventListener('keyup', this.keyUpFunction)

      /* Event listeners for determining when a nickname has been submitted */
      /*this._input.addEventListener('keydown', (event) => { // Checks if the Enter button has been pressed
        if (event.keyCode === 13) {
          event.preventDefault()
          this.dispatchEvent(new window.CustomEvent('nicknameSet', { detail: this._input.value }))
        }
      })*/
      //this._button.addEventListener('click', () => { // Checks if the mouse has been clicked
      //  if (this._input.value.length > 2) this.dispatchEvent(new window.CustomEvent('nicknameSet', { detail: this._input.value }))
      //})
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['nickname']
    }

    InheritStyle (styleElement) {
      const style = document.createElement('style')
      style.id = 'inherited'
      style.innerHTML = styleElement.innerHTML
      this.shadowRoot.appendChild(style)
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this._input.focus() // Sets the text input to have focus from the start
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {*} oldValue - The old value.
     * @param {*} newValue - The new value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      /* Sets the previous nickname as the default value when returning from the memory */
      if (name === 'nickname') {
        this._input.setAttribute('value', this.getAttribute('nickname'))
      }
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

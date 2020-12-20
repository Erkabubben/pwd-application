/**
 * The memory-nickname web component module.
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
    #memory-nickname {
      background-color: white;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  </style>
  <div id="memory-nickname">
    <h1>MEMORY<br></h1>
    <h2>Please enter your nickname.</h2>
    <form>
      <input type="text" id="nickname">
      <br><br>
      <button type="button">Start!</button> 
    </form>
  </div>
`

/**
 * Define custom element.
 */
customElements.define('memory-nickname',
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
      this._memoryNickname = this.shadowRoot.querySelector('#memory-nickname')
      this._button = this.shadowRoot.querySelector('button')
      this._input = this.shadowRoot.querySelector('input')

      /* Event listeners for determining when a nickname has been submitted */
      this._input.addEventListener('keydown', (event) => { // Checks if the Enter button has been pressed
        if (event.keyCode === 13) {
          event.preventDefault()
          this.dispatchEvent(new window.CustomEvent('nicknameSet', { detail: this._input.value }))
        }
      })
      this._button.addEventListener('click', () => { // Checks if the mouse has been clicked
        if (this._input.value.length > 2) this.dispatchEvent(new window.CustomEvent('nicknameSet', { detail: this._input.value }))
      })
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['style', 'nickname']
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
      /* Inherit style from parent element */
      if (name === 'style') {
        const style = document.createElement('style')
        style.innerHTML = newValue
        this.shadowRoot.appendChild(style)
      }
      /* Sets the previous nickname as the default value when returning from the memory */
      if (name === 'nickname') {
        this._input.setAttribute('value', this.getAttribute('nickname'))
      }
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

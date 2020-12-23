/**
 * The chat-state web component module.
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
    #chat-state {
      background-color: grey;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    ::part(selected) {
      box-shadow: 0px 0px 2px 8px grey;
    }
  </style>
  <div id="chat-state">
    <h1>Welcome to the CHAT!<br></h1>
    <form>
      <input type="text" id="nickname" class="selectable" autocomplete="off">
      <br><br>
      <br><br>
      <button type="button">Send</button> 
    </form>
  </div>
`

/**
 * Define custom element.
 */
customElements.define('chat-state',
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
      this._chatState = this.shadowRoot.querySelector('#chat-state')
      this._button = this.shadowRoot.querySelector('button')
      this._input = this.shadowRoot.querySelector('input')

      //this._selectedElement = 0
      //this._selectables = this._chatNicknameState.querySelectorAll('.selectable')
      //this._selectables[this._selectedElement].setAttribute('part', 'selected')

      /* Event listeners for determining when a nickname has been submitted */
      /*this._input.addEventListener('keydown', (event) => { // Checks if the Enter button has been pressed
        if (event.keyCode === 13) {
          event.preventDefault()
          this.dispatchEvent(new window.CustomEvent('nicknameSet', { detail: this._input.value }))
        }
      })*/
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

/**
 * The pwd-chat web component module.
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
    #pwd-chat {
      position: absolute;
      width: 640px;
      height: 456px;
      background-color: red;
    }
  </style>
  <style id="size"></style>
  <div id="pwd-chat">
    <h1>THE LINNAEUS CHAT</h1>
  </div>
`

/**
 * Define custom element.
 */
customElements.define('pwd-chat',
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

      /* Set up properties */
      this._pwdChat = this.shadowRoot.querySelector('#pwd-chat')
      this.width = 800
      this.height = 600
      this._styleSize = this.shadowRoot.querySelector('style#size')
      this.SetSize(this.width, this.height)
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return []
    }

    SetSize (width, height) {
      this.width = width
      this.height = height
      this._styleSize.textContent = `#pwd-chat {
        width: ` + this.width + `px;
        height: ` + this.height + `px;
      }`
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

    }
  }
)

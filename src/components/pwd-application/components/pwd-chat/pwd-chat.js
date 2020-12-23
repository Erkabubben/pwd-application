/**
 * The pwd-chat web component module.
 *
 * @author Erik Lindholm <elimk06@student.lnu.se>
 * @version 1.0.0
 */

import './components/chat-nickname-state/index.js'
import './components/chat-state/index.js'
/**
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
    #pwd-app {
      position: absolute;
      width: 640px;
      height: 456px;
      background-color: red;
    }
    #chat-state {
      background-color: blue;
      padding: 16px;
      width: 100%;
      height: 100%;
    }
  </style>
  <style id="size"></style>
  <div id="pwd-app">
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
      this._pwdApp = this.shadowRoot.querySelector('#pwd-app')
      this.name = 'Chat'
      this._styleSize = this.shadowRoot.querySelector('style#size')
      this.width = 800
      this.height = 600

      this.SetSize(this.width, this.height)

      /* Set up app-specific properties */
      this.currentScreen = null
      this.userNickname = ''

      /* Initiates the nickname screen */
      this.DisplayNicknameState()
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return []
    }

    /**
     * Displays the start screen where the user is asked to input a nickname.
     */
    DisplayNicknameState () {
      /* Resets the user's total time and removes any previously displayed screen or message */
      this.totalTime = 0
      if (this.currentScreen !== null) {
        this._pwdApp.removeChild(this.currentScreen)
      }
      /* Creates a new nickname screen with inherited CSS style */
      const nicknameState = document.createElement('chat-nickname-state')
      nicknameState.InheritStyle(this.shadowRoot.querySelector('style'))
      nicknameState.setAttribute('nickname', this.userNickname)
      this.currentScreen = this._pwdApp.appendChild(nicknameState)
      /* Starts the game when a valid nickname has been submitted */
      this.currentScreen.addEventListener('nicknameSet', (e) => {
        this.userNickname = e.detail.nickname
        this.totalTime = 0
        this.DisplayChatState()
      })
    }

    DisplayChatState() {
      if (this.currentScreen !== null) {
        this._pwdApp.removeChild(this.currentScreen)
      }
      /* Creates a new Chat state with inherited CSS style */
      const chatState = document.createElement('chat-state')
      chatState.InheritStyle(this.shadowRoot.querySelector('style'))
      this.currentScreen = this._pwdApp.appendChild(chatState)
    }

    /**
     * Sets the size of the app, ensuring that the width/height properties and
     * the width/height set in the CSS element are always the same.
     *
     * @param {number} width - The app's width in pixels.
     * @param {number} height - The app's height in pixels.
     */
    SetSize (width, height) {
      this.width = width
      this.height = height
      this._styleSize.textContent = `#pwd-app {
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

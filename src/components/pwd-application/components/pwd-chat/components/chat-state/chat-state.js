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

    #messages {
      height: 75%;
      width: 100%;
      overflow: auto;
    }

    #messages div {
      background-color: white;
      border: 3px outset grey;
      border-radius: 6px;
      padding: 0.5rem;
      margin: 0.5rem;
      opacity: 0.85;
    }

    #messages div p#username {
      font-weight: bold;
      opacity: 1;
    }

    #messages div p#messagetext {
      font-size: 0.75rem;
      opacity: 1;
    }

    #messages div p {
      margin-top: 0.2rem;
      margin-bottom: 0.2rem;
    }

    #user-ui {
      height: 25%;
      width: 100%;
      background-color: black;
    }

    #messageinput {
      width: 100%;
      height: auto;
    }

    #sendbutton {
      position: absolute;
      width: 48px;
      height: 24px;
      right: 0px;
    }

    #user-ui-top {
      width: 100%;
      height: 24px;
      position: relative;
    }

    #user-ui-top p {
      position: absolute;
      height: 100%;
      width: auto;
      display: inline;
      color: white;
      font-style: Verdana;
      padding: auto 0.5rem;
    }

    button#emojis {
      position: absolute;
      height: 100%;
      padding: 0;
      width: min-content;
      right: 0px;
    }

    #emojicollection {
      position: absolute;
      right: 0px;
      top: 24px;
      height: 80px;
      width: 256px;
      background: white;
      border: 1px black solid;
      z-index: 1;
    }

    #logoutbutton {
      height: 100%;
      width: 64px;
    }

    #user-ui-bottom {
      width: 100%;
      height: 24px;
      position: relative;
    }

    form {
      height: auto;
      width: 100%;
      margin: 0;
    }

    textarea {
      resize: none;
      background-color: white;
      border: 3px outset grey;
      border-radius: 6px;
      padding: 0.5rem;
      margin: 0;
      width: 100%;
      opacity: 0.85;
    }

    ::part(selected) {
      box-shadow: 0px 0px 2px 8px grey;
    }
  </style>
  <div id="chat-state">
    <div id="messages"></div>
    <div id="user-ui">
      <div id="user-ui-top">
        <p id="username">USER</p>
        <button type="button" id="emojis">&#x1F642</button>
        <div id="emojicollection">
          
        </div>
      </div>
      <textarea rows="3" autofocus id="messageinput" class="selectable" autocomplete="off"></textarea>
      <div id="user-ui-bottom">
        <button type="button" id="logoutbutton">Log out</button>
        <button type="button" id="sendbutton">Send</button>
      </div>
    </div>
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

      /* Chat screen properties */
      this._chatState = this.shadowRoot.querySelector('#chat-state')
      this._messages = this.shadowRoot.querySelector('#messages')
      this._sendbutton = this.shadowRoot.querySelector('#sendbutton')
      this._messageInput = this.shadowRoot.querySelector('#messageinput')
      
      this.messageAPIKey = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
      this.userNickname = ''

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

      this._messageInput.addEventListener('keydown', (event) => { // Checks if the Enter button has been pressed
        if (event.keyCode === 13) {
          event.preventDefault()
        }
      })


      this.serverURL = 'wss://cscloud6-127.lnu.se/socket/'
      this.webSocket = 0


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

      this.shadowRoot.querySelector('#username').textContent = this.userNickname

      this._messageInput.focus() // Sets the text input to have focus from the start

      this.webSocket = new WebSocket(this.serverURL);

      this._sendbutton.addEventListener('click', () => { // Checks if the Send button has been clicked
        if (this._messageInput.value.length > 0) {
          let newMessageJSON = {
            type: 'message',
            username: this.userNickname,
            data: this._messageInput.value,
            channel: 'my, not so secret, channel',
            key: this.messageAPIKey
          }
          let newMessageString = JSON.stringify(newMessageJSON)
          this.webSocket.send(newMessageString)
          this._messageInput.value = ''
        }
      })
      
      this.webSocket.onopen = (event) => {
        console.log('WEBSOCKET IS OPEN')
        console.log(this.webSocket.readyState)
      }

      this.webSocket.onclose = (event) => {
        console.log('WEBSOCKET IS CLOSED')
        console.log(this.webSocket.readyState)
      }

      this.webSocket.onmessage = (event) => {
        let received_msg = event.data
        let msgJSON = JSON.parse(received_msg)
        console.log(msgJSON)
        let newMessageDiv = document.createElement('div')
        newMessageDiv.setAttribute('id', 'message')
        let newMessageHeader = document.createElement('p')
        let date = new Date()
        newMessageHeader.setAttribute('id', 'username')
        newMessageHeader.textContent = msgJSON.username + ' (' +
          date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' +
          date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ')'
        let newMessageText = document.createElement('p')
        newMessageText.setAttribute('id', 'messagetext')
        newMessageText.textContent = msgJSON.data
        newMessageDiv.appendChild(newMessageHeader)
        newMessageDiv.appendChild(newMessageText)
        this._messages.appendChild(newMessageDiv)
      }
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
      this.webSocket.close()
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

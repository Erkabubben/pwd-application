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

    form {
      height: 25%;
    }
    ::part(selected) {
      box-shadow: 0px 0px 2px 8px grey;
    }
  </style>
  <div id="chat-state">
    <div id="messages"></div><p></p>
    <form>
      <input type="textarea" Rows="5" id="messageinput" class="selectable" autocomplete="off">
      <br>
      <button type="button" id="sendbutton">Send</button> 
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

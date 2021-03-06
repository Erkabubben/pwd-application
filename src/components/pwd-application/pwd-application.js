/**
 * The pwd-application web component module.
 *
 * @author Erik Lindholm <elimk06@student.lnu.se>
 * @version 1.0.0
 */
import './components/pwd-window/index.js'
import { pwdApps } from './pwd-app-list.js'

const pathToModule = import.meta.url
const imagesPath = new URL('./img/', pathToModule)
const componentsPath = new URL('./components/', pathToModule)

/**
 * Define template.
 */
const template = document.createElement('template')

/* The application uses style inheritance, so any CSS rules defined
   below will be passed to the sub-components. */
template.innerHTML = `
  <style>
    h1, h2 {
      font-family: Verdana;
      text-align: center;
      color: black;
      margin: 16px;
      user-select: none;
    }
    #memory-question, #nickname-state, #memory-message, #memory-highscore {
      border-radius: 32px;
      background-color: #3399FF;
      border: 16px outset #336699;
      padding: 16px;
      width: min-width(480px);
      height: min-content;
    }
    #pwd-application {
      background-image: url("` + imagesPath + `mosaic.jpg");
      position: relative;
      display: block;
      overflow: hidden;
    }
    div#alternatives {
      text-align: left;
    }
    button {
      background-color: rgba(0, 0, 0, 0);
      border: 6px outset #333333;
      font-family: Verdana;
      font-size: 1.25em;
      padding: 0.25em;
      margin: 12px;
      box-shadow: 1px 1px 1px black;
    }
    button:active {
      border: 6px outset #333333;
      transform: translate(1px, 1px);
      box-shadow: 0px 0px 0px black;
    }
    button:hover {
      background-color: #999999;
      border-color: #999999;
    }
    #pwd-application {
      position: relative;
    }
    #pwd-window-container {
      position: relative;
      height: 100%;
      width: 100%;
      overflow: hidden;
    }
    #pwd-dock {
      height: 48px;
      width: 100%;
      background-color: #333333;
      background-opacity: 50%;
      position: absolute;
      bottom: 0%;
      overflow: hidden;
      z-index: 10000
    }
    #pwd-dock button {
      height: 100%;
      margin: 0px;
      padding: 0;
      box-shadow: none;
      background-color: none;
      border: 0px outset #333333;
    }
    #pwd-dock button img {
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
    }
    #pwd-dock button#resetbutton {
      position: absolute;
      right: 6px;
      font-family: Verdana;
      font-size: 75%;
      color: white;
      background-color: #444444;
      border: 2px outset #333333;
      padding: 8px;
      margin: auto;
      height: 75%;
      top: 50%;
      transform: translate(0, -50%);
      border-radius: 6px;
    }

    #clock {
      position: absolute;
      top: 50%;
      right: 48px;
      transform: translate(0, -50%);
      text-align: center;
      width: 48px;
      font-family: Verdana;
      font-size: 75%;
      color: white;
      background-color: #444444;
      border: 2px outset #333333;
      border-radius: 6px;
      padding: 8px;
      margin: auto;
      user-select: none;
    }

    #pwd-dock #resetbutton:hover {
      background-color: #999999;
      border-color: #999999;
    }
  </style>
  <style id="size"></style>
  <div id="pwd-application">
  </div>
`

/**
 * Define custom element.
 */
customElements.define('pwd-application',
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

      /* PWD application properties */
      this._pwd = this.shadowRoot.querySelector('#pwd-application')
      this._windowContainer = ''
      this._dock = ''
      this._applications = pwdApps

      this._styleSize = this.shadowRoot.querySelector('style#size')
      this.width = 0
      this.height = 0
      this.SetSize(1280, 800)

      /* Create clock */
      this.clock = document.createElement('p')
      this.clock.setAttribute('id', 'clock')
      /**
       * Adds leading zeroes to any number passed as an argument,
       * as long as the number is shorter than ten digits.
       *
       * @param {number} num - The number you wish to pad with leading zeroes.
       * @param {number} size - The number of leading zeroes you wish to add.
       * @returns {string} The argument number padded with leading zeroes.
       */
      this.pad = (num, size) => { return ('000000000' + num).substr(-size) }
      this._clockUpdateInterval = setInterval(() => {
        const date = new Date()
        this.clock.textContent = this.pad(date.getHours(), 2) + ':' + this.pad(date.getMinutes(), 2)
      }, 100)

      /* Initiates the dock */
      this.InitiateWindowContainer()
      this.InitiateDock()
    }

    /**
     * Initiates the Window Container. Called when initiating the pwd-application,
     * and when clicking the reset button.
     */
    InitiateWindowContainer () {
      this._windowContainer = document.createElement('div')
      this._windowContainer.setAttribute('id', '#pwd-window-container')
      this._pwd.appendChild(this._windowContainer)
    }

    /**
     * Initiates the dock. Called when initiating the pwd-application,
     * and when clicking the reset button.
     */
    InitiateDock () {
      /* Create dock div */
      this._dock = document.createElement('div')
      this._dock.setAttribute('id', 'pwd-dock')
      /* Create reset button */
      const resetButton = document.createElement('button')
      resetButton.setAttribute('id', 'resetbutton')
      const resetButtonImg = document.createElement('img')
      resetButtonImg.setAttribute('src', imagesPath + 'reset.png')
      resetButton.appendChild(resetButtonImg)
      resetButton.addEventListener('click', event => {
        this._pwd.removeChild(this._dock)
        this._pwd.removeChild(this._windowContainer)
        this.InitiateDock()
        this.InitiateWindowContainer()
      })
      this._dock.appendChild(resetButton)
      /* Append clock */
      this._dock.appendChild(this.clock)
      /* Create app icons */
      this._applications.forEach(app => {
        /* Creates an icon for each app listed in pwd-app-list */
        const newAppIcon = document.createElement('button')
        const newAppIconImg = document.createElement('img')
        newAppIconImg.setAttribute('src', componentsPath + app + '/img/icon.png')
        newAppIcon.appendChild(newAppIconImg)
        newAppIcon.setAttribute('value', app)
        /* Adds an Event Listener that sets up a pwd-window containing the app when
           the icon is clicked */
        newAppIcon.addEventListener('click', event => {
          if (event.button === 0) {
            const newWindow = document.createElement('pwd-window')
            if (this._windowContainer.childElementCount === 0) {
              newWindow.SetZIndex(0)
            } else {
              this.BringWindowToTop(newWindow)
            }
            this.dragElement(newWindow) // Sets the pwd-window to be draggable
            this._windowContainer.appendChild(newWindow)
            newWindow.SetApp(app) // Set the app to be contained in the window
            newWindow.SetPosition((this.width / 2) - (newWindow.width / 2), (this.height / 2) - (newWindow.height / 2))
            newWindow.addEventListener('mousedown', event => {
              this.BringWindowToTop(newWindow)
            })
          }
        })
        this._dock.appendChild(newAppIcon)
      })
      this._pwd.appendChild(this._dock)
    }

    /**
     * Determines the highest z-index of all current pwd-windows, then sets the
     * z-index of the given pwd-window to be even higher, placing it on top visually.
     *
     * @param {HTMLElement} w - The pwd-window to be brought to the top.
     */
    BringWindowToTop (w) {
      let highestZIndex = -10000
      this._windowContainer.childNodes.forEach(window => {
        if (window.zIndex > highestZIndex) {
          highestZIndex = window.zIndex
        }
      })
      w.SetZIndex(highestZIndex + 1000)
    }

    /**
     * Sets the size of the application, ensuring that the width/height
     * properties and the width/height set in the CSS element are always the same.
     *
     * @param {number} width - The application's width in pixels.
     * @param {number} height - The application's height in pixels.
     */
    SetSize (width, height) {
      this.width = width
      this.height = height
      this._styleSize.textContent =
      `#pwd-application {
        width: ` + width + `px;
        height: ` + height + `px;
      }`
    }

    /**
     * Allows for a HTML element to be dragged by the mouse, within the boundaries of
     * the parent element. Modified version of code found at:
     * https://www.w3schools.com/howto/howto_js_draggable.asp.
     *
     * @param {HTMLElement} elmnt - The element that should have drag functionality.
     */
    dragElement (elmnt) {
      let mouseDiffX = 0
      let mouseDiffY = 0
      const applicationWidth = this.width
      const applicationHeight = this.height

      if (elmnt.header != null) {
        // If present, the header is where you move the DIV from:
        elmnt.header.onmousedown = dragMouseDown
      } else {
        // Otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown
      }

      /**
       * Called when initiating the drag motion by clicking the element.
       * Sets up Event Listeners for the elementDrag and closeDragElement functions.
       *
       * @param {event} e - The 'mousedown' event.
       */
      function dragMouseDown (e) {
        e = e || window.event
        e.preventDefault()
        // Get the mouse cursor position at startup:
        mouseDiffX = e.clientX - elmnt.x
        mouseDiffY = e.clientY - elmnt.y
        document.onmouseup = closeDragElement
        // Call a function whenever the cursor moves:
        document.onmousemove = elementDrag
      }

      /**
       * Called whenever the mouse is moved while the element is set to being dragged.
       * The element will change position in relation to the mouse pointer, but will
       * not be moved outside the boundaries of its parent.
       *
       * @param {event} e - The 'mousemove' event.
       */
      function elementDrag (e) {
        e = e || window.event
        e.preventDefault()
        // Adjust to parent boundaries
        let x = e.clientX - mouseDiffX
        let y = e.clientY - mouseDiffY
        if (x + elmnt.width >= applicationWidth) {
          x = applicationWidth - elmnt.width
        }
        if (x < 0) {
          x = 0
        }
        if (y + elmnt.height >= applicationHeight) {
          y = applicationHeight - elmnt.height
        }
        if (y < 0) {
          y = 0
        }
        // Set the element's new position:
        elmnt.SetPosition(x, y)
      }

      /**
       * Removes the registered Event Listeners when the mouse button is released.
       */
      function closeDragElement () {
        // Stop moving when mouse button is released:
        document.onmouseup = null
        document.onmousemove = null
      }
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['size']
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {}

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {*} oldValue - The old value.
     * @param {*} newValue - The new value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'size') {
        const xy = newValue.split(',')
        this.SetSize(xy[0], xy[1])
      }
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      /* Clears any remaining event listeners when element is removed from DOM */
      clearInterval(this._clockUpdateInterval)
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

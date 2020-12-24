/**
 * The pwd-application web component module.
 *
 * @author Erik Lindholm <elimk06@student.lnu.se>
 * @version 1.0.0
 */
const pathToModule = import.meta.url
const imagesPath = new URL('./img/', pathToModule)
const componentsPath = new URL('./components/', pathToModule)

import './components/pwd-window/index.js'
import './components/pwd-chat/index.js'
import './components/pwd-memory/index.js'
import './components/pwd-unity/index.js'

/**
 * Define template.
 */
const template = document.createElement('template')

/* The application uses style inheritance, so any CSS rules defined
   below will be passed to the sub-components. */
template.innerHTML = `
  <style>

    h1#quizheader {
      margin: 48px;
      font-size: 48px;
      text-shadow: 0 0 3px #3399FF, 0 0 5px #3399FF;
      user-select: none;
    }

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
      max-width: 1280px;
      height: 800px;
      background-image: url("` + imagesPath + `mosaic.jpg");
      position: relative;
      display: block;
      border: 0px outset red;
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
      height: 48px;
      width: 48px;
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
  </style>
  <div id="pwd-application">
    <div id="pwd-window-container"></div>
    <div id="pwd-dock"></div>
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
      this._windowContainer = this.shadowRoot.querySelector('#pwd-window-container')
      this._dock = this.shadowRoot.querySelector('#pwd-dock')
      this._applications = [
        'pwd-chat',
        'pwd-memory',
        'pwd-unity'
      ]

      /* Initiates the dock */
      this._applications.forEach(app => {
        const newAppIcon = document.createElement('button')
        const newAppIconImg = document.createElement('img')
        newAppIconImg.setAttribute('src', componentsPath + app + '/img/icon.png')
        newAppIcon.appendChild(newAppIconImg)
        newAppIcon.setAttribute('value', app)
        newAppIcon.addEventListener('click', event => {
          if (event.button === 0) {
            const newWindow = document.createElement('pwd-window')
            newWindow.SetPosition(320, 200)
            if (this._windowContainer.childElementCount === 0) {
              newWindow.SetZIndex(0)
            } else {
              this.BringWindowToTop(newWindow)
            }
            this.dragElement(newWindow)
            this._windowContainer.appendChild(newWindow)
            newWindow.SetApp(app)
            newWindow.addEventListener('mousedown', event => {
              this.BringWindowToTop(newWindow)
            })
          }
        })
        this._dock.appendChild(newAppIcon)
      })
    }

    BringWindowToTop (w) {
      let highestZIndex = -10000
      this._windowContainer.childNodes.forEach(window => {
        if (window.zIndex > highestZIndex) {
          highestZIndex = window.zIndex
        }
      })
      w.SetZIndex(highestZIndex + 1)
    }

    dragElement(elmnt) {
      var mouseDiffX = 0, mouseDiffY = 0
      if (elmnt.header != null) {
        // if present, the header is where you move the DIV from:
        elmnt.header.onmousedown = dragMouseDown;
      } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
      }
    
      function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        mouseDiffX = e.clientX - elmnt.x
        mouseDiffY = e.clientY - elmnt.y
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
      }
    
      function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // set the element's new position:
        elmnt.SetPosition(e.clientX - mouseDiffX, e.clientY - mouseDiffY)
      }
    
      function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
      }
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
    attributeChangedCallback (name, oldValue, newValue) {}

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

/**
 * The pwd-window web component module.
 *
 * @author Erik Lindholm <elimk06@student.lnu.se>
 * @version 1.0.0
 */
const pathToModule = import.meta.url
const imagesPath = new URL('./images/', pathToModule)
const componentsOfParentPath = new URL('../', pathToModule)

/**
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      margin: 0px;
    }
    #pwd-window {
      position: absolute;
      background-color: #333333;
      border: 2px outset #333333;
    }
    div#header {
      position: absolute;
      width: 100%;
      height: 24px;
      background-color: #333333;
    }
    div#header img {
      height: 100%;
    }
    div#header p {
      margin: 0px;
      padding-left: 4px;
      display: inline;
      user-select: none;
      position: absolute;
      top: 50%;
      transform: translate(0, -50%);
      font-family: Verdana;
      font-weight: bold;
      color: white;
    }
    div#app {
      position: absolute;
      top: 24px;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    #closebutton {
      position: absolute;
      right: 0px;
      font-family: Verdana;
      font-weight: bold;
      color: white;
      width: 24px;
      height: 100%;
      background-color: #444444;
      border: 2px outset #444444;
      padding: 0px;
    }

    #closebutton:hover {
      background-color: #999999;
      border-color: #999999;
    }

    #closebutton:active {
      transform: translate(1px, 1px);
      box-shadow: none;
      border-style: inset;
    }
  </style>
  <style id="pos"></style>
  <style id="size"></style>
  <div id="pwd-window">
    <div id="header">
      <img>
      <p id="headertitle"></p>
      <button id="closebutton">X</button>
    </div>
    <div id="app"><slot name="app"></slot></div>
    
  </div>
`

/**
 * Define custom element.
 */
customElements.define('pwd-window',
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
      this.header = this.shadowRoot.querySelector('div#header')
      this.icon = this.shadowRoot.querySelector('div#header img')
      this._stylePos = this.shadowRoot.querySelector('style#pos')
      this._styleSize = this.shadowRoot.querySelector('style#size')
      this._closeButton = this.shadowRoot.querySelector('#closebutton')
      this._appSlot = this.shadowRoot.querySelector('slot')
      this._headerTitle = this.shadowRoot.querySelector('p#headertitle')

      this._closeButton.addEventListener('click', event => {
        this.parentElement.removeChild(this)
      })

      this.x = 0
      this.y = 0

      this.width = 0
      this.height = 0
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return []
    }

    SetPosition (x, y) {
      this._stylePos.textContent =
      `#pwd-window {
        left: ` + x + `px;
        top: ` + y + `px;
      }`

      this.x = x
      this.y = y
    }

    /**
     * Sets the size of the window and its contained app, ensuring that the width/height
     * properties and the width/height set in the CSS element are always the same.
     *
     * @param {number} width - The app's width in pixels.
     * @param {number} height - The app's height in pixels.
     */
    SetSize (width, height) {
      this.width = width
      this.height = height
      this._styleSize.textContent =
      `#pwd-window {
        width: ` + width + `px;
        height: ` + (height + 24) + `px;
      }
      div#app {
        width: ` + width + `px;
        height: ` + height + `px;
      }`
    }

    SetApp (app) {
      const newAppElement = document.createElement(app)
      this._appSlot.appendChild(newAppElement)
      this.icon.setAttribute('src', componentsOfParentPath + '/' + app + '/img/icon.png')
      this._headerTitle.textContent = newAppElement.name
      console.log(componentsOfParentPath + '/' + app + '/img/icon.png')
      this.SetSize(newAppElement.width, newAppElement.height)
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
      /*if (name === 'isDragged') {
        console.log('GRAAAH!')
        this.addEventListener('mousemove', (event) => {
          console.log('ISDRAGGED!')
        })
      }*/
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {

    }
  }
)

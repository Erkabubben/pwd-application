/**
 * The pwd-window web component module.
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
    :host {
      margin: 0px;
    }
    #pwd-window {
      position: absolute;
      width: 640px;
      height: 480px;
      background-color: grey;
      border: 2px outset black;
    }
    div#header {
      position: absolute;
      width: 100%;
      height: 24px;
      background-color: darkgrey;
    }
  </style>
  <style id="pos">
  </style>
  <div id="pwd-window">
    <div id="header">
    </div>
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
      this._isDragged = false;
      this._mouseBeginDragX = 0
      this._mouseBeginDragY = 0
      this._header = this.shadowRoot.querySelector('div#header')
      this._stylePos = this.shadowRoot.querySelector('style#pos')

      this.x = 0
      this.y = 0



      /*this._header.addEventListener('click', event => {
        if (event.button === 0) {
          this._isDragged = true
          this._mouseBeginDragX = event.clientX
          this._mouseBeginDragY = event.clientY
        }
      })
      this.addEventListener('mousemove', event => {
        console.log('!!!')
        if (this._isDragged === true) {
          console.log('???')
          const newPosStyle = document.createElement('style')
          const mouseX = this._mouseBeginDragX - event.clientX
          const mouseY = this._mouseBeginDragY - event.clientY
          this._mouseBeginDragX = event.clientX
          this._mouseBeginDragY = event.clientY
          newPosStyle.setAttribute('id', 'pos')
          newPosStyle.textContent = `#pwd-window {
                                        left: ` + mouseX + `px;
                                        top: ` + mouseY + `px;
                                      }`
          this.shadowRoot.removeChild(this._posStyle)
          this._posStyle = this.shadowRoot.appendChild(newPosStyle)
        }
      })*/
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['isDragged']
    }

    SetPosition (x, y) {
      this._stylePos.textContent = `#pwd-window {
        left: ` + (x) + `px;
        top: ` + (y) + `px;
      }`
      this.x = x
      this.y = y
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

/**
 * The emoji-collection web component module.
 *
 * @author Erik Lindholm <elimk06@student.lnu.se>
 * @version 1.0.0
 */
const pathToModule = import.meta.url

import {emojis} from './emojis.js'

/**
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
    #emoji-collection {
      position: absolute;
      background-color: white;
      right: 0px;
      top: 0px;
      overflow-y: scroll;
      border: solid 1px black
    }
    p {
      font-style: Verdana;
      font-size: 12px;
      font-weight: bold;
      display: block;
      background-color: #99CCFF;
      margin: 0px;
      padding: 2px;
      user-select: none;
    }
    td {
      user-select: none;
    }
    td:hover {
      background-color: grey;
    }
    emoji-collection::part(hide) {
      display: none;
    }
  </style>
  <style id="pos"></style>
  <style id="size"></style>
  <style id="z-index"></style>
  <div id="emoji-collection" part="hide">
  </div>
`

/**
 * Define custom element.
 */
customElements.define('emoji-collection',
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

      /* Properties */
      this._emojiCollection = this.shadowRoot.querySelector('#emoji-collection')
      this._stylePos = this.shadowRoot.querySelector('style#pos')
      this._styleSize = this.shadowRoot.querySelector('style#size')
      this._styleZIndex = this.shadowRoot.querySelector('style#z-index')

      this.x = 0
      this.y = 0

      this.columns = 8

      this.width = 0
      this.height = 0

      this.SetSize(256, 48)

      console.log(emojis)

      this._emojiCollection.addEventListener('click', (event) => {
        const isTD = event.target.nodeName === 'TD';
        if (!isTD) {
          return;
        } else {
          console.log(event.target.textContent)
          this.dispatchEvent(new window.CustomEvent('emoji', { detail: event.target.textContent}))
        }
      })

      emojis.forEach(element => {
        let newHeader = document.createElement('p')
        newHeader.textContent = element.name
        this._emojiCollection.appendChild(newHeader)
        let newTable = document.createElement('table')
        let newTableRow = document.createElement('tr')
        let i = 0
        element.content.forEach(emoji => {
          if (i === this.columns) {
            newTable.appendChild(newTableRow)
            newTableRow = document.createElement('tr')
            i = 0
          }
          let newEmojiButton = document.createElement('td')
          newEmojiButton.innerHTML = '&#x' + emoji + ';'
          //newEmojiButton.addEventListener('click', (event) => {
          //  console.log(newEmojiButton.nodeName)
          //})
          newTableRow.appendChild(newEmojiButton)
          i++
        })
        newTable.appendChild(newTableRow)
        this._emojiCollection.appendChild(newTable)
      })
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return []
    }

    ToggleDisplay () {
      if (this._emojiCollection.hasAttribute('part')) {
        this._emojiCollection.removeAttribute('part')
      } else {
        this._emojiCollection.setAttribute('part', 'hide')
      }
    }

    InheritStyle (styleElement) {
      const style = document.createElement('style')
      style.id = 'inherited'
      style.innerHTML = styleElement.innerHTML
      this.shadowRoot.appendChild(style)
    }

    SetPosition (x, y) {
      this._stylePos.textContent =
      `#emoji-collection {
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
      `#emoji-collection {
        width: ` + width + `px;
        height: ` + height + `px;
      }`
    }

    SetZIndex (z) {
      this._styleZIndex.textContent =
      `#pwd-window {
        z-index: ` + z + `;
      }`

      this.zIndex = z
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

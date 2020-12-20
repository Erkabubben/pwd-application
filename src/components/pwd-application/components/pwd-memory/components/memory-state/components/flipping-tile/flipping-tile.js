/**
 * The flipped-tile web component module.
 *
 * @author Erik Lindholm <elimk06@student.lnu.se>
 * @version 2.0.0
 */
const pathToModule = import.meta.url
const imagesPath = new URL('./images/', pathToModule)

/**
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      margin: 6px;
      display: inline-block;
    }
    div {
      width: 128px;
      height: 128px;
      background-color: white;
      border-radius: 8px;
      border: solid black 3px;
      transition: box-shadow 0.5s;
      position: relative;
    }
    div:focus  {      
      box-shadow: 0px 0px 8px 8px grey;
    }
    div.hidden, div.inactive.hidden {      
      border: dashed grey 3px;
      background-color: white;
      user-select: none;
    }

    div.inactive {
      border: dotted grey 3px;
    }

    div.hidden img, div.hidden ::slotted(img) {
      display: none;
      user-select: none;
    }

    img, ::slotted(img) {
      max-width: 90%;
      max-height: 90%;
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      user-select: none;
    }
    flipping-tile::part(show) {
      display: block;
    }
    flipping-tile::part(hide) {
      display: none;
    }
  </style>
  <style id="backsideStyle">
    flipping-tile::part(flipped) {
      background-color: yellow;
    }
  </style>
  <div id="content">
    <slot>
    </slot>
    <img id="backside" src="` + imagesPath + `lnu-symbol.png">
  </div>
  `

/**
 * Define custom element.
 */
customElements.define('flipping-tile',
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

      this._div = this.shadowRoot.querySelector('div')
      this._slot = this._div.querySelector('slot')
      this._backside = this._div.querySelector('img#backside')
      this._backsideStyle = this.shadowRoot.querySelector('#backsideStyle')

      this._div.setAttribute('tabindex', 0)
      this.updateImageSrcAttribute()
    }

    /**
     * Watches the listed attributes for changes on the element.
     *
     * @returns {string[]} observedAttributes array
     */
    static get observedAttributes () {
      return ['flipped']
    }

    /**
     * Called by the browser engine when an attribute changes.
     *
     * @param {string} name of the attribute.
     * @param {any} oldValue the old attribute value.
     * @param {any} newValue the new attribute value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      this.updateImageSrcAttribute()
    }

    /**
     * Updates the tile to show either the front or the backside.
     */
    updateImageSrcAttribute () {
      // Set tile to show backside
      if (this.hasAttribute('flipped')) {
        this._div.setAttribute('part', 'flipped')
        this._slot.setAttribute('part', 'hide')
        this._backside.setAttribute('part', 'show')
      // Set tile to show front
      } else {
        this._div.removeAttribute('part')
        this._backside.setAttribute('part', 'hide')
        this._slot.setAttribute('part', 'show')
      }
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      // Flips the tile upon being clicked
      this.addEventListener('click', event => {
        if (event.button === 0 && !this._div.classList.contains('inactive')) {
          this.flipTile()
        }
      })
      this.addEventListener('keydown', event => {
        // Flips the tile if Enter is pressed while it has focus and is active
        if (event.keyCode === 13 && !this._div.classList.contains('inactive')) this.flipTile()
        // Activates/deactivates the tile that has focus if the user presses 'i'
        else if (event.keyCode === 73) {
          if (this._div.classList.contains('inactive')) {
            this._div.classList.remove('inactive')
          } else {
            this._div.classList.add('inactive')
          }
        // Hides/shows the tile that has focus if the user presses 'h'
        } else if (event.keyCode === 72) {
          if (this._div.classList.contains('hidden')) {
            this._div.classList.remove('hidden')
          } else {
            this._div.classList.add('hidden')
          }
        }
      })
      // Change backside color if backsideColor attribute has been set
      if (this.hasAttribute('backsideColor')) {
        this._backsideStyle.textContent = `flipping-tile::part(flipped) {
                                              background-color: ` + this.getAttribute('backsideColor') + `;
                                            }`
      }
      // Change backside image if backsideImage attribute has been set
      if (this.hasAttribute('backsideImage')) {
        this._backside.setAttribute('src', imagesPath + this.getAttribute('backsideImage') + '.png')
      }
    }

    /**
     * Flips the tile and dispatches a 'tileflip' event with the tile's innerHTML value.
     */
    flipTile () {
      if (this.hasAttribute('flipped')) {
        this.removeAttribute('flipped')
      } else {
        this.setAttribute('flipped', true)
      }
      let printMessage = 'Front side is now up. ' + this.shadowRoot.innerHTML
      if (this.hasAttribute('flipped')) {
        printMessage = 'Back side is now up. ' + this.shadowRoot.innerHTML
      }
      this.dispatchEvent(new window.CustomEvent('tileflip', { detail: printMessage }))
      this.updateImageSrcAttribute()
    }
  })
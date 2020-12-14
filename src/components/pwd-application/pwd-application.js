/**
 * The pwd-application web component module.
 *
 * @author Erik Lindholm <elimk06@student.lnu.se>
 * @version 1.0.0
 */

import './components/countdown-timer/index.js'
import './components/pwd-app/index.js'

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

    #quiz-question, #quiz-nickname, #quiz-message, #quiz-highscore {
      border-radius: 32px;
      background-color: #3399FF;
      border: 16px outset #336699;
      padding: 16px;
      width: min-width(480px);
      height: min-content;
    }

    #pwd-application {
      width: 100%;
      height: 800px;
      background-color: grey;
      position: relative;
      display: block;
      border: 0px outset red;
    }

    form {
      text-align: center;
      font-family: Verdana;
      user-select: none;
    }

    form input {
      font-size: 1.5em;
      background-color: #336699;
      border: 6px inset #336699;
      border-radius: 8px;
      margin: 8px;
    }

    form input:focus, form input:hover {
      background-color: #6699CC;
      border-color: #6699CC;
    }

    div#alternatives {
      text-align: left;
    }

    button {
      background-color: #336699;
      border: 6px outset #336699;
      font-family: Verdana;
      font-size: 1.25em;
      border-radius: 16px;
      padding: 0.25em;
      margin: 12px;
      box-shadow: 2px 2px 2px black;
    }

    button:active {
      border: 6px outset #336699;
      transform: translate(2px, 2px);
      box-shadow: 0px 0px 0px black;
    }

    button:hover {
      background-color: #6699CC;
      border-color: #6699CC;
    }

    #pwd-application {
      position: relative;
    }

    #pwd-dock {
      height: 48px;
      width: 100%;
      background-color: yellow;
      position: absolute;
      bottom: 0%;
    }
  </style>
  <div id="pwd-application">
    <div id="pwd-dock">
    </div>
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
      this._pwd = this.shadowRoot.querySelector('#pwd-app')
      this._pwdDock = this.shadowRoot.querySelector('#pwd-dock')

      /* Initiates the nickname screen */
      
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

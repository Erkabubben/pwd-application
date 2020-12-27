/* Add pwd-apps to the main pwd-application by copying the pwd-app's folder
   into the 'components' folder of the main application, then updating the
   import statements and the array below. */

import './components/pwd-chat/index.js'
import './components/pwd-memory/index.js'
import './components/pwd-unity/index.js'

export const pwdApps = [
    'pwd-chat',
    'pwd-memory',
    'pwd-unity'
]

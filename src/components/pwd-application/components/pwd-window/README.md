# <pwd-window>
The pwd-window component represents a pwd-app window within the main pwd-application. A pwd-window is initiated by clicking one of the pwd-app icons in the dock of the main pwd-application.
The window will immediately receive focus and run the selected pwd-app. The size of the window will be automatically adjusted to the size of the contained pwd-app.
Windows can be moved around within the pwd-application, and multiple windows can be open simultaneously. To close a window, click the 'X' button in the top right corner.

## Public methods

### `SetApp(app)`
Intended to be called by the main pwd-application upon creating a new instance of pwd-window. Will set the contained app of the window to an installed pwd-app with a folder name equivalent to the parameter string.

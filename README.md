# Solar-Mode VS Code Extension

Solar-Mode automatically switches between light and dark themes in VS Code based on your local sunrise and sunset times.

## Features


* Auto-switches between light and dark themes using your location's sunrise/sunset.
* Status bar integration shows current mode (day/night) and lets you toggle themes manually.
* Manual override: toggling the theme suspends automatic switching until the next sunrise/sunset event.
* Uses SunCalc to calculate sunrise and sunset times based on your configured location.

## Requirements


* Node.js and npm
* Visual Studio Code (latest recommended)

## Installation

1. Clone this repository:
	```sh
	git clone https://github.com/DanielTavares33/solar-mode.git
	cd solar-mode
	```
2. Install dependencies:
	```sh
	npm install
	```
3. Open the folder in VS Code and press `F5` to launch the extension in a new Extension Development Host window.

## Extension Settings

You can configure the extension under the `sunsetTheme` namespace in your VS Code settings:

- `sunsetTheme.enabled`: Enable/disable automatic theme switching (default: true)
- `sunsetTheme.lightTheme`: Theme used during daytime (default: "Default Light+")
- `sunsetTheme.darkTheme`: Theme used during nighttime (default: "Default Dark+")
- `sunsetTheme.latitude`: Latitude for sunrise/sunset calculation
- `sunsetTheme.longitude`: Longitude for sunrise/sunset calculation
## Usage

- The extension will automatically switch your theme based on sunrise and sunset times for your configured location.
- Use the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and run `Toggle Sunset Theme` to manually switch between day and night themes. This will temporarily suspend automatic switching until the next event.

## Known Issues


## Configuration

The extension works out of the box, but for accurate sunrise/sunset times, set your latitude and longitude in the settings.

## Release Notes


## Testing

<!-- No unit tests are included in this version. -->

## Troubleshooting

- Ensure you have the latest version of VS Code and Node.js.
- If you encounter issues, check the output panel for extension logs.
- For test failures, ensure all dependencies are installed and your environment matches the requirements.

## Contributing

- Fork the repository and submit pull requests.
- Run tests before submitting changes.

## License
MIT

## Following extension guidelines


## References
* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown


## For more information
* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**

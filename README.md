# Click Test

A compact browser app for testing real screen click coordinates with sequential targets.

## Features

- 9 round buttons arranged across 3 rows
- Randomized button positions inside each row
- Test area positioned at the top-left of the page
- Sequential clicking from button 1 through button 9
- Floating top-left latest-click log showing:
  - `screenX`
  - `screenY`
  - timestamp
- Only the latest click log entry is shown
- Total attempt counter
- Completion state showing `Task Complete`, elapsed time, and total attempts
- Restart button that randomizes the layout again

## Hosted demo

```text
https://raw.githack.com/ecooxai/click-test/main/index.html
```

## How to run locally

Open `index.html` directly in a browser, or serve the folder with any static file server.

Example:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## How it works

The app uses the browser `MouseEvent.screenX` and `MouseEvent.screenY` values. These coordinates are relative to the user's physical screen, not the browser viewport. The latest click log also records a local timestamp for each click.

Attempts are counted for clicks inside the game board. The floating log records the latest page click so you can compare screen coordinates even when clicking outside the targets.

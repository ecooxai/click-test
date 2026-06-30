# Click Test

A small browser app for testing real screen click coordinates with sequential targets.

## Features

- 9 round buttons arranged across 3 rows
- Randomized button positions inside each row
- Sequential clicking from button 1 through button 9
- Top-left click log showing:
  - `screenX`
  - `screenY`
  - timestamp
- Total attempt counter
- Completion state showing `Task Complete`, elapsed time, and total attempts
- Restart button that randomizes the layout again

## How to run

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

The app uses the browser `MouseEvent.screenX` and `MouseEvent.screenY` values. These coordinates are relative to the user's physical screen, not the browser viewport. The log also records a local timestamp for each click.

Attempts are counted for clicks inside the game board. The click log records all page clicks so you can compare screen coordinates even when clicking outside the targets.

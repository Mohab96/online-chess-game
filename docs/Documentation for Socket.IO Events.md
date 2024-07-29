# Events

## `message`
- **Description**: Emitted (to the player's channel) when a message is sent to the user.
- **Payload**:
  - `sender_id` (string): Identifier of the sender.
  - `message` (string): Content of the message.

## `move`
- **Description**: Emitted (to the player's channel) when a move is made in the game.
- **Payload**:
  - `move_notation` (string): Notation of the move.
  - `board` (object): State of the board after the move.

## `draw`
- **Description**: Emitted (to the game room) when the game ends in a draw.

## `checkmate`
- **Description**: Emitted (to the game room) when a checkmate occurs.
- **Payload**:
  - `winner_id` (string): Identifier of the winner.

## `won`
- **Description**: Emitted (to the player's channel) when a player wins the game.

## `lost`
- **Description**: Emitted (to the player's channel) when a player loses the game.

## `gameStarted`
- **Description**: Emitted (to the player's channel) when a game starts.
- **Payload**:
  - `game_id` (string): Identifier of the game.
  - `game_room` (string): Room where the game is played.

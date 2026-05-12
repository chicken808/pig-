# 🏀 Web-Based Basketball Game

A fun, interactive basketball game built with HTML5 Canvas and JavaScript. Play against an opponent in a 5-minute match!

## Features

✅ **2-Player Gameplay** - Control your player and compete against an opponent  
✅ **Physics Engine** - Realistic ball physics with gravity, velocity, and friction  
✅ **Score Tracking** - Real-time scoring and field goal percentage statistics  
✅ **5-Minute Games** - Timed matches with automatic game end  
✅ **Responsive Design** - Works on desktop and mobile devices  
✅ **Visual Feedback** - Clear animations and scoring notifications  

## How to Play

### Getting Started
1. Open `index.html` in your web browser
2. Click the **"Start Game"** button
3. Begin playing!

### Controls

**Home Team (Blue Player)**
- `↑` `↓` `←` `→` - Move around the court
- `SPACE` - Shoot the ball

**Away Team (Orange Player)**
- `W` `A` `S` `D` - Move around the court
- `X` - Shoot the ball

### Gameplay Mechanics

1. **Starting Position** - The home player (blue) begins with possession of the ball
2. **Ball Possession** - Players automatically catch the ball when they get close enough
3. **Shooting** - Press your shoot key to launch the ball toward the opponent's basket
4. **Scoring** - Successfully shoot the ball through the opponent's basket to score 2 points
5. **Winning** - After 5 minutes, the team with the most points wins!

## Game Statistics

The scoreboard displays:
- **Team Score** - Total points accumulated
- **FG** - Field Goals (Made/Attempted)
- **%** - Field Goal Percentage (accuracy)

## Files

- `index.html` - Main game interface and HTML structure
- `styles.css` - Game styling and responsive design
- `game.js` - Game engine, physics, and game logic
- `README.md` - Documentation (this file)

## Technical Details

### Physics System
- **Gravity** - Ball falls naturally with 0.3 acceleration
- **Friction** - Ball slows down over time (0.98 friction multiplier)
- **Collision Detection** - Ball bounces off walls and court boundaries
- **Player Detection** - Automatic ball catching within player radius

### Game Loop
- Runs at 60 FPS using `requestAnimationFrame`
- Updates player positions, ball physics, and game state
- Renders court, players, and ball to canvas

## Customization Ideas

- Add AI opponent to play solo
- Implement different difficulty levels
- Add power-ups and special abilities
- Create multiple court themes
- Add sound effects and music
- Implement online multiplayer
- Add different shot types (3-pointer, dunk, etc.)

## Browser Compatibility

Works on all modern browsers that support:
- HTML5 Canvas
- JavaScript ES6
- requestAnimationFrame API

## License

Free to use and modify!

---

**Enjoy the game! 🏀**
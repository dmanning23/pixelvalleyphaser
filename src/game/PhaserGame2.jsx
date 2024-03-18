import PropTypes from 'prop-types';
import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import { EventBus } from './EventBus';
import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import Phaser from 'phaser';
import { Preloader } from './scenes/Preloader';

export const PhaserGame2 = forwardRef(function PhaserGame ({ currentActiveScene }, ref)
{
    // Find out more information about the Game Config at:
    // https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
    const config = {
        type: Phaser.AUTO,
        width: 1024,
        height: 768,
        parent: 'game-container',
        backgroundColor: '#028af8',
        scene: [
            Game,
            GameOver
        ]
    };

    const StartGame = (parent) => {

        return new Phaser.Game({ ...config, parent });

    }

    const game = useRef();

    // Create the game inside a useLayoutEffect hook to avoid the game being created outside the DOM
    useLayoutEffect(() => {
        
        if (game.current === undefined)
        {
            game.current = StartGame("game-container");
            
            if (ref !== null)
            {
                ref.current = { game: game.current, scene: null };
            }
        }

        return () => {

            if (game.current)
            {
                game.current.destroy(true);
                game.current = undefined;
            }

        }
    }, [ref]);

    useEffect(() => {

        EventBus.on('current-scene-ready', (currentScene) => {

            if (currentActiveScene instanceof Function)
            {
                currentActiveScene(currentScene);
                ref.current.scene = currentScene;
            }

        });

        return () => {

            EventBus.removeListener('current-scene-ready');

        }
        
    }, [currentActiveScene, ref])

    return (
        <div id="game-container"></div>
    );

});

// Props definitions
PhaserGame2.propTypes = {
    currentActiveScene: PropTypes.func 
}

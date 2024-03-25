import { useRef, useState } from 'react';
import Phaser from 'phaser';
import { PhaserGame } from './game/PhaserGame';
import { PhaserGame2 } from './game/PhaserGame2';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { EventBus } from './game/EventBus';



function App ()
{
    // The sprite can only be moved in the MainMenu Scene
    const [canMoveSprite, setCanMoveSprite] = useState(true);
    
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef();
    const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });

    const changeScene = () => {

        const scene = phaserRef.current.scene;

        if (scene)
        {
            scene.changeScene();
        }
    }

    const moveSprite = () => {

        const scene = phaserRef.current.scene;

        if (scene && scene.scene.key === 'MainMenu')
        {
            // Get the update logo position
            scene.moveLogo(({ x, y }) => {

                setSpritePosition({ x, y });

            });
        }
    }

    const addSprite = () => {

        const scene = phaserRef.current.scene;

        if (scene)
        {
            // Add more stars
            const x = Phaser.Math.Between(64, scene.scale.width - 64);
            const y = Phaser.Math.Between(64, scene.scale.height - 64);

            //  `add.sprite` is a Phaser GameObjectFactory method and it returns a Sprite Game Object instance
            const star = scene.add.sprite(x, y, 'star');

            //  ... which you can then act upon. Here we create a Phaser Tween to fade the star sprite in and out.
            //  You could, of course, do this from within the Phaser Scene code, but this is just an example
            //  showing that Phaser objects and systems can be acted upon from outside of Phaser itself.
            scene.add.tween({
                targets: star,
                duration: 500 + Math.random() * 1000,
                alpha: 0,
                yoyo: true,
                repeat: -1
            });
        }
    }

    // Event emitted from the PhaserGame component
    const currentScene = (scene) => {

        setCanMoveSprite(scene.scene.key !== 'MainMenu');
        
    }

    const handleClick = ev => {
        const navigate = useNavigate();
        navigate(`/location/`);
    };

    EventBus.on('navigateLocation', (data) => {
        //handleClick(data);
    });

    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={
                    <div id="app">
                        <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
                        <div>
                            <div>
                                <button className="button" onClick={changeScene}>Change Scene</button>
                            </div>
                            <div>
                                <button disabled={canMoveSprite} className="button" onClick={moveSprite}>Toggle Movement</button>
                            </div>
                            <div className="spritePosition">Sprite Position:
                                <pre>{`{\n  x: ${spritePosition.x}\n  y: ${spritePosition.y}\n}`}</pre>
                            </div>
                            <div>
                                <button className="button" onClick={addSprite}>Add New Sprite</button>
                            </div>
                        </div>
                    </div>
                }/>
                <Route path="/location/" element={
                    <div id="app">
                    <PhaserGame2 ref={phaserRef} currentActiveScene={currentScene} />
                    <div>
                        <div>
                            <button className="button" onClick={changeScene}>Change Scene</button>
                        </div>
                        <div>
                            <button disabled={canMoveSprite} className="button" onClick={moveSprite}>Toggle Movement</button>
                        </div>
                        <div className="spritePosition">Sprite Position:
                            <pre>{`{\n  x: ${spritePosition.x}\n  y: ${spritePosition.y}\n}`}</pre>
                        </div>
                        <div>
                            <button className="button" onClick={addSprite}>Add New Sprite</button>
                        </div>
                    </div>
                </div>
            }/>
            </Routes>
        </BrowserRouter>

        
    )
}

export default App

import { Application, Graphics } from "pixi.js";
import { LogicCube } from "../logic-cube";
import { MagicCube } from "../magic-cube";
import { TextButton } from "./text-button";

export class MainUI {
    pixiApp: Application<HTMLCanvasElement>;
    context: any;
    expandedView: Graphics;

    constructor(context: any) {
        this.pixiApp = new Application<HTMLCanvasElement>({
            resizeTo: window,
            backgroundAlpha: 0.0,
        });
        this.pixiApp.renderer.view.style.position = "absolute";
        this.pixiApp.renderer.view.style.left = "0px";
        this.pixiApp.renderer.view.style.top = "0px";
        this.expandedView = new Graphics();
        this.expandedView.eventMode = 'static';
        this.expandedView.cursor = 'pointer';
        this.expandedView.on('pointerdown', function() {
            
        });
        this.pixiApp.stage.addChild(this.expandedView);

        const shuffleButton = new TextButton({
            text: 'Shuffle',
            textColor: '#000000',
            action: _ => {
                context.shuffle();
            }
        });
        shuffleButton.view.x = 43;
        shuffleButton.view.y = 350;
        this.pixiApp.stage.addChild(shuffleButton.view);

        const button = new TextButton({
            text: 'Solve',
            textColor: '#000000',
            action: _ => {
                context.solve(context.logicCube);
            }
        });
        button.view.x = 143;
        button.view.y = 350;
        this.pixiApp.stage.addChild(button.view);

        this.context = context;
    }

    drawExpandedView(logicCube: LogicCube) {
    
        let data = logicCube.ToArray();
    
        let gridSize = 22;
        let o = [20, 85];
        let space = 2;
        this.expandedView.clear();
        for (let i = 0; i < 3; ++i) {
            for (let j = 0; j < 3; ++j) {
                let color = MagicCube.colors[data[0][j][i]];
                this.expandedView.lineStyle(1, MagicCube.black, 1);
                this.expandedView.beginFill(color, 1);
                this.expandedView.drawRect(o[0] + (i + 3) * (gridSize + space), o[1] + (j + 1) * (gridSize + space), gridSize, gridSize);
                this.expandedView.endFill();
            }
        }
        for (let i = 0; i < 12; ++i) {
            for (let j = 3; j < 6; ++j) {
                let color = MagicCube.colors[data[Math.floor(i/3) + 1][j - 3][i % 3]];
                this.expandedView.lineStyle(1, MagicCube.black, 1);
                this.expandedView.beginFill(color, 1);
                this.expandedView.drawRect(o[0] + (i + 0) * (gridSize + space), o[1] + (j + 1) * (gridSize + space), gridSize, gridSize);
                this.expandedView.endFill();
            }
        }
        for (let i = 0; i < 3; ++i) {
            for (let j = 6; j < 9; ++j) {
                let color = MagicCube.colors[data[5][j - 6][i]];
                this.expandedView.lineStyle(1, MagicCube.black, 1);
                this.expandedView.beginFill(color, 1);
                this.expandedView.drawRect(o[0] + (i + 3) * (gridSize + space), o[1] + (j + 1) * (gridSize + space), gridSize, gridSize);
                this.expandedView.endFill();
            }
        }
    }
}
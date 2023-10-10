import { Text } from '@pixi/text';
import { Button } from "@pixi/ui";
import { Graphics } from 'pixi.js';

export class TextButton extends Button
{
    private textView: Text;
    private buttonView: Graphics;
    private action: ((event: string) => void);

    constructor(props: {
        text: string,
        textColor: string,
        action: (event: string) => void})
    {
        super();
        this.buttonView =  new Graphics()
            .beginFill(0xFFFFFF)
            .drawRoundedRect(0, 0, 88, 42, 6);
        this.view = this.buttonView;
        this.textView = new Text(props.text, {
            fontSize: 22,
            fill: props.textColor });
        this.textView.anchor.set(0.5);
        this.textView.x = this.buttonView.width / 2;
        this.textView.y = this.buttonView.height / 2;
        this.buttonView.addChild(this.textView);
        const button = new Button(this.buttonView);
        this.action = props.action;
    }

    override down()
    {
        
    }

    override up()
    {
        
    }

    override press()
    {
        this.action('onPress');
    }
}
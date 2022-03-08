
import "./GameCanvas.html";
import "adaptive-scale/lib-esm/index";
import "squids/squids";

import { CreatePlayer } from "./player";
import { newInputType } from "./input";
import { getScaledRect, Size, POLICY} from "adaptive-scale/lib-esm/index";

Template.GameCanvas.onCreated(function()
{
    player = new ReactiveVar({});

    screen = vec(1600, 1200);
    canvas.width = screen.x;
    canvas.height = screen.y;

    assets = {};

    let images = [
        "data/squid.png"
    ];
    let sounds = [];

    let canvas_size = {
        x: 0, y: 0, width: screen.x, height: screen.y
    };

    let mouse = vec(0, 0);

    canvas.style.width = "unset";
    canvas.style.height = "unset";
    canvas.style.top = "unset";
    canvas.style.left = "unset";

    canvas.getContext("2d").imageSmoothingEnabled = true;

    let toggleDebug = newInputType("toggleDebug", ["`"]);

    let brain = new Thing();
        brain.listen("tick", function()
        {

            let originalWidth = canvas_size.width;
            let originalHeight = canvas_size.height;

            let options = {
                container: new Size(window.innerWidth, window.innerHeight),
                target: new Size(originalWidth, originalHeight),
                policy: POLICY.ShowAll
            };

            let rect = getScaledRect(options);

            canvas_size.x = rect.x;
            canvas_size.y = rect.y;
            canvas_size.width = rect.width;
            canvas_size.height = rect.height;

            canvas_size.scale = screen.x / rect.width;

            canvas.style.width = canvas_size.width + "px";
            canvas.style.height = canvas_size.height + "px";

            canvas.style.top = canvas_size.y + "px";
            canvas.style.left = canvas_size.x + "px";

            if(toggleDebug.pressed && input.debounce === 0)
            {
                debug = !debug;
                input.debounce = 20;
            }
    });

    brain.listen("mousemove", function(mx, my, event)
    {
        mouse = local_mouse(event.clientX, event.clientY);

    });

    function local_mouse(mx, my)
    {
        let px = ((mx) - canvas_size.x) * canvas_size.scale;
        let py = ((my) - canvas_size.y) * canvas_size.scale;

        return vec(px, py)
    }

    load_assets(images, sounds, function(progress, file, asset, type)
    {
        assets[file] = asset;
        console.log(type, file);
        if(progress >= 1.0)
        {
            player.set(CreatePlayer());
            tick(true);
        }
    });
});

Template.GameCanvas.onDestroyed(function()
{
    // I think this will work...
    this.player.get().destroy();
});

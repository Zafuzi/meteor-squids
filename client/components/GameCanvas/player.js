export function CreatePlayer()
{
    let squid_image = assets["data/squid.png"];

    let sq = new Squid(vec(screen.x * 0.5, screen.y * 0.5), squid_image);

    sq.listen("tick", function()
    {

    });

    return sq;
}
let {Product} = require("../product");
let mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/ShoppingCart")
let products = [new Product({
    imagePath:"http://res.cloudinary.com/yourmomgay/image/upload/v1523979685/fortnite.jpg",
    title:"Fortnite",
    description:"Fortnite is a co-op sandbox survival game developed by Epic Games and People Can Fly and published by Epic Games.",
    price:0

}),
new Product({
    imagePath:"http://res.cloudinary.com/yourmomgay/image/upload/v1523979686/pubg.jpg",
    title:"PUBG",
    description:"PlayerUnknown's Battlegrounds (PUBG) is a multiplayer online battle royale game developed and published by PUBG ",
    price:29.99

}),

new Product({
    imagePath:"http://res.cloudinary.com/yourmomgay/image/upload/v1523979686/farcry.jpg",
    title:"FarCry 3",
    description:"Far Cry 3 is an open world action-adventure first-person shooter video game developed by Ubisoft.",
    price:19.99

}),
new Product({
    imagePath:"http://res.cloudinary.com/yourmomgay/image/upload/v1523979685/gameofwar.jpg",
    title:"GameOfWars",
    description:"Gears of War is a video game franchise created by Epic Games, developed and managed by The Coalition, and own.",
    price:9.99

}),
new Product({
    imagePath:"http://res.cloudinary.com/yourmomgay/image/upload/v1523979686/gothic2.jpg",
    title:"Gothic 2",
    description:"Like Gothic, Gothic II is set on the medieval styled isle Khorinis. Places include the City of Khorinis, the. City of Khorinis, the.",
    price:9.99

}),
new Product({
    imagePath:"http://res.cloudinary.com/yourmomgay/image/upload/v1523981598/cod.jpg",
    title:"Call of Duty",
    description:"Call of Duty: Black Ops is a first-person shooter video game,developed by Treyarch and published by Activision",
    price:9.99

}),
new Product({
    imagePath:"http://res.cloudinary.com/yourmomgay/image/upload/v1523979685/crysis.jpg",
    title:"CRYSIS",
    description:"Crysis is a first-person shooter video game series developed by German developer Crytek and published by EA",
    price:40.99

}),
new Product({
    imagePath:"http://res.cloudinary.com/yourmomgay/image/upload/v1523980592/chair2.jpg",
    title:"Gaming Chair",
    description:"The Ultimate Gaming Chair for Hardcore Gamers with handler-bar support and can Do This? Clutch Chairz",
    price:399

}),
new Product({
    imagePath:"http://res.cloudinary.com/yourmomgay/image/upload/v1523979685/ascreed.jpg",
    title:"Assassin's Creed",
    description:"Assassin's Creed is a franchise centered on an action-adventure video game series developed by Ubisoft.",
    price:9.99

}),
new Product({
    imagePath:"http://res.cloudinary.com/yourmomgay/image/upload/v1523982232/gta.jpg",
    title:"GTA-5",
    description:"Grand Theft Auto V is an adventure video game developed by Rockstar North and published by Rockstar Games.",
    price:9.99

}),
new Product({
    imagePath:"http://res.cloudinary.com/yourmomgay/image/upload/v1523982493/overwatch.jpg",
    title:"OVERWATCH",
    description:"Overwatch is a team-based multiplayer first-person shooter video game developed and published by Blizzard",
    price:9.99

}),
new Product({
    imagePath:"http://res.cloudinary.com/yourmomgay/image/upload/v1523982748/minecraft.jpg",
    title:"MineCraft",
    description:"Minecraft is a sandbox video game created and designed by Swedish game designer Markus developed by Mojang.",
    price:9.99

}),

]
for(let i=0;i<products.length;i++){
    products[i].save()
    .then(product => mongoose.disconnect())
    .catch(e => console.log(e));
}


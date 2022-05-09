const rl=require('readline-sync');

const say=(prompt) => {
    console.log(prompt);
}

const die=(message) => {
    say(message);
    process.exit(1);
}

const ask=(mydude, prompt) => {
    console.log(`[[You have ${mydude.hp} hit points.]]`);
    if(mydude.hp<=0) {
        die("You died!");
    } else {
        return rl.question(prompt + ' ');
    }
}

const win=(mydude) => {
    if (mydude.hp=10 && mydude.lighter) {
        die("Perfect game, someone must have told you how this works, eh?")
    } else if (mydude.hp>4) {
        die("Not bad, you made it out alive, with plenty of gold to pay for your hospital bills.");
    } else
        die("Phew, you made it! At least you're alive, the gold may even prevent you from going bankrupt after you treat your injuries!  Probably...")
}
const door=(mydude) => {
    say("You are looking at a locked door.")
    if (mydude.key===true) {
        say("You use the key to open the door and discover a bag of gold!")
        win(mydude)
    } else if (mydude.key===false) {
        say("You can't seem to open the door, looks like you need a key.");
        rope(mydude);
    }
}

const tunnel=(mydude) => {
    say(`You crawl through the tunnel wiping ${cobwebs} out of your way.`);
    if (!spider && mydude.key===false) {
        say("You find a key!");
        mydude.key=true;
        say("You crawl back out to the rope");
        rope(mydude);
    }
    if (spider) {
        say("Ouch! Something bit your hand");
        mydude.hp=Math.floor(mydude.hp/2);
    }
    let next=ask(mydude, "What do you do?");
    if(next==="go back") {
        say("You crawl back out of the tunnel");
        rope(mydude)
    } else if(next==="kill spider") {
        say("You squash the spider and find a key");
        say("You crawl back out of the tunnel");
        mydude.key=true;
        rope(mydude);
    } else {
        say(`You can't ${next} here.`);
        say("You can 'go back' or 'kill spider'")
        tunnel(mydude);
    }

}

const rope=(mydude) => {
    say("You are now at the bottom of the well.");
    say(`There is a door to your left, and a tunnel covered in ${cobwebs} to your right.`)
    let next=ask(mydude, "What do you do?");
    if(next==="climb up") {
        say("You climb back up the rope");
        well(mydude);
    } else if(next==="goto door") {
        say("You approach the door.");
        door(mydude);
    } else if(next==="goto tunnel") {
        say("You approach the tunnel.");
        tunnel(mydude);
    } else if(next==="look around" && mydude.lighter===false) {
        say("You found a butane lighter.  <chk-chk> And it works!")
        mydude.lighter=true
        rope(mydude)
    } else if(next==="burn cobwebs" && mydude.lighter===false) {
        say("You need a butane lighter, silly.")
        rope(mydude)
    } else if(next==="burn cobwebs" && mydude.lighter===true) {
        say("You burn the cobwebs in the tunnel. A small spider crawls out.")
        say("You step on it and squash the spider")
        spider=false
        cobwebs="ashes"
        rope(mydude)
    } else {
        say(`You can't ${next} here.`);
        say("You can 'climb up' the rope, 'goto door' to try the door, or 'goto tunnel' to look in the spider webs.")
        if (mydude.lighter && !mydude.key) {
            say("You could also try to 'burn cobwebs' in the tunnel")
        }
        rope(mydude);
    }
}

const well=(mydude) => {
    say("You are walking through the woods and see a well with a rope hanging down.");
    say("Walking up to it and looking down you see a shiny thing at the bottom.");
    let next=ask(mydude, "What do you do?");

    if(next==="climb down") {
        say("You climb down the rope");
        rope(mydude);
    } else if(next==="jump") {
        say("Yikes! That hurt!");
        mydude.hp=Math.floor(mydude.hp/2);
        rope(mydude);
    } else {
        say(`You can't ${next} here.`);
        say("You can either 'jump' down or 'climb down' the rope.")
        well(mydude);
    }
}

const mydude = {
    hp: 10,
    key: false,
    lighter: false
}
let spider=true
let cobwebs="cobwebs"

well(mydude);
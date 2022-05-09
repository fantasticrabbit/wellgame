const rl=require('readline-sync');

const say=(prompt) => {
    console.log(prompt);
}

const die=(message) => {
    say(message);
    process.exit(1);
}

const ask=(hp, prompt) => {
    console.log(`[[You have ${hp} hit points.]]`);
    if(hp<=0) {
        die("You died!");
    } else {
        return rl.question(prompt + ' ');
    }
}

const door=(hp) => {
    say("You are looking at a locked door.")
    if (key===true) {
        say("You use the key to open the door and discover a bag of gold!")
        die("You invest the gold in a responsible mix of stocks and bonds and live happily ever after!")
    } else if (key===false) {
        say("You can't seem to open the door, looks like you need a key.");
        rope(hp);
    }
}

const spider=(hp) => {
    say("You crawl through the tunnel wiping cobwebs out of your way");
    say("Ouch! Something bit your hand");
    hp=Math.floor(hp/2);
    let next=ask(hp, "What do you do?");
    if(next==="go back") {
        say("You crawl back out of the tunnel");
        rope(hp)
    } else if(next==="kill spider") {
        say("You squash the spider and find a key");
        say("You crawl back out of the tunnel");
        key=true;
        rope(hp);
    } else {
        say(`You can't ${next} here.`);
        say("You can 'go back' or 'kill spider'")
        spider(hp);
    }

}

const rope=(hp) => {
    say("You are now at the bottom of the well.");
    say("There is a door to your left, and a tunnel covered in cobwebs to your right.")
    let next=ask(hp, "What do you do?");
    if(next==="climb") {
        say("You climb back up the rope");
        well(hp);
    } else if(next==="door") {
        say("You approach the door.");
        door(hp);
    } else if(next==="tunnel") {
        say("You approach the tunnel.");
        spider(hp); 
    } else {
        say(`You can't ${next} here.`);
        say("You can 'climb' up the rope, 'door' to try the door, or 'tunnel' to look in the spider webs.")
        rope(hp);
    }
}

const well=(hp) => {
    say("You are walking through the woods and see a well.");
    say("Walking up to it and looking down you see a shiny thing at the bottom.");
    let next=ask(hp, "What do you do?");

    if(next==="climb") {
        say("You climb down the rope");
        rope(hp);
    } else if(next==="jump") {
        say("Yikes! That hurt!");
        hp=Math.floor(hp/2);
        rope(hp);
    } else {
        say(`You can't ${next} here.`);
        say("You can either 'jump' or 'climb' down the rope.")
        well(hp);
    }
}

let hp=Math.floor(Math.random()*10) + 10;
let key=false;

well(hp);
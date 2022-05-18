const rl = require('readline-sync');

say = (prompt) => {
    console.log(prompt);
}

die = (message) => {
    say(message);
    process.exit(1);
}

class Game {
  constructor (rooms) {
    this.hp = 10;
    this.lighter=false;
    this.spider=true;
    this.key=false;
    this.cobwebs="cobwebs";
    this.addRooms(rooms);
  }

  ask(prompt) {
      say(`[[You have ${this.hp} hit points.]]`);
      if(this.hp <= 0) {
          die("You died!");
      } else {
          return rl.question(prompt + ' ');
      }
  }

  addRoom(room) {
    this[room.name] = room;
    room.game = this;
  }

  addRooms(rooms) {
    for(let room of rooms) {
        this.addRoom(room);
    }
}
  play(name) {
    this[name].enter();
  }

  hit(amount) {
    this.hp -= amount;
  }
}

class Room {
  constructor (name) {
    this.name = name;
  }

  enter() {
    console.log("Implement me!");
  }
}

class Gold extends Room {

    enter() {
        if (this.game.hp===10 && this.game.lighter) {
            die("Perfect game, someone must have told you how this works, eh?")
        } else if (this.game.hp>4) {
            die("Not bad, you made it out alive, with plenty of gold to pay for your hospital bills.");
        } else
            die("Phew, you made it! At least you're alive, the gold may even prevent you from going bankrupt after you treat your injuries!  Probably...")    }
  }

class Door extends Room {
    enter() {
        say("You are looking at a locked door.")
        if (this.game.key===true) {
            say("You use the key to open the door and discover a bag of gold!")
            this.game.gold.enter()
        } else if (this.game.key===false) {
            say("You can't seem to open the door, looks like you need a key.");
            this.game.rope.enter();
        }
    }
}

class Tunnel extends Room {
  enter() {
    say(`You crawl through the tunnel wiping ${this.game.cobwebs} out of your way.`);
    if (!this.game.spider && this.game.key===false) {
        say("You find a key!");
        this.game.key=true;
        say("You crawl back out to the rope");
        this.game.rope.enter();
    }
    if (this.game.spider) {
        say("Ouch! Something bit your hand");
        this.game.hit(2);
    }
    let next=this.game.ask("What do you do?");
    if(next==="go back") {
        say("You crawl back out of the tunnel");
        this.game.rope.enter();
    } else if(next==="kill spider") {
        say("You squash the spider and find a key");
        say("You crawl back out of the tunnel");
        this.game.key=true;
        this.game.spider=false;
        this.game.rope.enter();
    } else {
        say(`You can't ${next} here.`);
        say("You can 'go back' or 'kill spider'")
        this.game.tunnel.enter();
    }
  }
}

class Rope extends Room {
  enter() {
    say("You are now at the bottom of the well.");
    say(`There is a door to your left, and a tunnel covered in ${this.game.cobwebs} to your right.\n`)
    let next=this.game.ask("What do you do?");
    if(next==="climb up") {
        say("*****\n\nYou climb back up the rope");
        this.game.well.enter();
    } else if(next==="goto door") {
        say("*****\n\nYou approach the door.");
        this.game.door.enter();
    } else if(next==="goto tunnel") {
        say("*****\n\nYou approach the tunnel.");
        this.game.tunnel.enter();
    } else if(next==="look around" && this.game.lighter===false) {
        say("*****\n\nYou found a butane lighter.  <chk-chk> And it works!")
        this.game.lighter=true
        this.game.rope.enter();
    } else if(next==="burn cobwebs" && this.game.lighter===false) {
        say("*****\n\nYou need a butane lighter, silly.")
        this.game.rope.enter();
    } else if(next==="burn cobwebs" && this.game.lighter===true) {
        say("*****\n\nYou burn the cobwebs in the tunnel. A small spider crawls out.")
        say("You squash the spider with your foot.")
        this.game.spider=false
        this.game.cobwebs="ashes"
        this.game.rope.enter();
    } else {
        say(`*****\n\nYou can't ${next} here.`);
        say("You can 'climb up' the rope, 'goto door' to try the door, or 'goto tunnel' to look in the spider webs.")
        if (this.game.lighter && !this.game.key) {
            say("\nYou could also try to 'burn cobwebs' in the tunnel\n")
        } else if (!this.game.lighter && !this.game.key) {
            say("\nOr you could 'look around'...\n");
        }
        this.game.rope.enter();
    }
  }
}

class Well extends Room {

  enter() {
    say("You are walking through the woods and see a well.");
    say("Walking up to it and looking down you see a shiny thing at the bottom.\n");
    let next = this.game.ask("What do you do?");

    if(next === "climb down") {
        say("*****\n\nYou climb down the rope.\n");
        this.game.rope.enter();
    } else if(next === "jump in") {
        say("*****\n\nYikes! That's going to leave a mark!\n");
        this.game.hit(5);
        this.game.rope.enter();
    } else {
        say(`*****\n\nYou can't ${next} here.`);
        say("You can 'climb down' or 'jump in'")
        this.game.well.enter();
    }
  }
}

let game = new Game(
    [new Well('well'),
    new Rope('rope'),
    new Gold('gold'),
    new Tunnel('tunnel'),
    new Door('door')]);

say('*****\n\n');
game.play("well");
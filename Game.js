
const STARTHEALTH = 50;
const STARTSTANIMA = 30;
const STARTMANA = 30;
const DECKSIZE = 5;
const PUCNHDAMAGE = 5;
const PUNCHDRAIN = 2;
const KICKDAMAGE = 7;
const KICKDRAIN = 4;
const FIREBALLDAMAGE = 10;
const FIREBALLDRAIN = 15;
const HEALTHBOOST = -20;
const HEALDRAIN = 10;
const SPACINNN = "                                           ";

var winner = "NONE";
var currentFighter = null;
var moves = 0;
var turns = 0;

function Fighter(name){
    this.name = name
    this.health = STARTHEALTH,
    this.stanima = STARTSTANIMA,
    this.mana = STARTMANA,
    this.enemey = function(opp){
        this.enemey = opp;
    },
    this.deck = [],
    this.cards = [],
    this.lastCard = null,
    this.scalar = 1;
    this.endOfTurn = 0;
    this.extraMoves = 0;
};

function generateCards(Fighter, num){
    var thisDeck = [];
    var maxNum = cardTypes.length - 1;
    for(i = 0; i < num; i++){
        thisDeck[i] = randomNum(0, maxNum);
        Fighter.cards[i] = cardTypes[thisDeck[i]];
    }
    Fighter.deck = thisDeck;
}

function damage(Fighter, dam){
    Fighter.health = Math.round(Fighter.health - dam);
}

function manaUse(Fighter, drain){
    Fighter.mana = Math.round(Fighter.mana - drain);
}

function stanimaUse(Fighter, drain){
    Fighter.stanima = Math.round(Fighter.stanima - drain);
}

var cardTypes = [
    "Punch", "Kick", "Fireball", "Heal", "Rest", "Multiplier", "Combo"
]

function useCard(Fighter, placeInDeck){//USE THE CARD, GENERATE ANOTHER ONE, SET THE CARD TO THE NEW ONE
    var using = Fighter.deck[placeInDeck];
    var opp = Fighter.enemey;
    var caster = Fighter;
    var stam = Fighter.stanima;
    var mana = Fighter.mana;
    var mult = false;
    var scal = Fighter.scalar;
    var combo = false;
    function enough(energy, demand){
        if(energy >= demand){
            return true;
        }else{
            return false;
        }
    }
    function partial(current, demand){
        return current / demand;
    }
    switch(using){
        case 0: //Punch
        if(enough(stam, PUNCHDRAIN)){
            damage(opp, PUCNHDAMAGE * scal);
            stanimaUse(caster, PUNCHDRAIN);
        }else{
            damage(opp, PUCNHDAMAGE * scal * partial(stam, PUNCHDRAIN));
            stanimaUse(caster, PUNCHDRAIN * partial(stam, PUNCHDRAIN));
        } break;
        case 1: //Kick
        if(enough(stam, KICKDRAIN)){
            damage(opp, KICKDAMAGE * scal); 
            stanimaUse(caster, KICKDRAIN);
        }else{
            damage(opp, KICKDAMAGE * scal * partial(stam, KICKDRAIN)); 
            stanimaUse(caster, KICKDRAIN  * partial(stam, KICKDRAIN));
        }
  
        break;  
        case 2: //Fireball
        if(enough(mana, FIREBALLDRAIN)){
            damage(opp, FIREBALLDAMAGE * scal);
            manaUse(caster, FIREBALLDRAIN);
        }else{
            damage(opp, FIREBALLDAMAGE * scal * partial(mana, FIREBALLDRAIN));
            manaUse(caster, FIREBALLDRAIN * partial(mana, FIREBALLDRAIN));
        } break;
        case 3: //Heal
        if(enough(mana, HEALDRAIN)){
            damage(caster, HEALTHBOOST * scal);
            manaUse(caster, HEALDRAIN);
        }else{
            damage(caster, HEALTHBOOST * scal * partial(mana, HEALDRAIN));
            manaUse(caster, HEALDRAIN * partial(mana, HEALDRAIN));
        } break;
        case 4: //Rest
        if(stam < STARTSTANIMA){
            stanimaUse(caster, -HEALDRAIN * scal);
        }
        if(mana < STARTMANA){
            manaUse(caster, -HEALDRAIN * scal);
        }
        damage(caster, -2 * scal);
        break; 
        case 5: //Mult
        caster.scalar = 2 * scal;
        mult = true;
        break;
        case 6: //Combo
        Fighter.extraMoves = (2 * scal) + Fighter.extraMoves;
        Fighter.endOfTurn = moves + 1 + (2 * scal) + Fighter.extraMoves;
        break;
    }
    Fighter.lastCard = Fighter.cards[placeInDeck];
    var numMax = cardTypes.length - 1;
    var newCard = randomNum(0, numMax)
    Fighter.deck[placeInDeck] = newCard;
    Fighter.cards[placeInDeck] = cardTypes[newCard];
    console.log(Fighter.name + " used " + Fighter.lastCard);
    if(!mult){
        caster.scalar = 1;
    }
    if(Fighter.extraMoves > 0){
        Fighter.extraMoves -= 1;
    }else{
        Fighter.endOfTurn = moves + 1;
    }
   

}

function randomNum(min, max) {//MAX INCLUDED
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function gameOver(f1, f2){
    if (f1.health <= 0){
        winner = f2.name;
    }else if(f2.health <= 0){
        winner = f1.name;
    }
    if(winner == f1.name || winner == f2.name){
        return true;
    }else{
        return false;
    }

}
function display(){
    console.log(Fighter1.name + SPACINNN + Fighter2.name + "\n" +
    "Health: " + Fighter1.health + SPACINNN + Fighter2.health + "\n" +
    "Stanima: " + Fighter1.stanima + SPACINNN + Fighter2.stanima + "\n" +
    "Mana: " + Fighter1.mana + SPACINNN + Fighter2.mana + "\n" +
    Fighter1.cards + "                    " + Fighter2.cards);
}
function getNextFighter(){
    if(currentFighter === null){
        coinFlip = randomNum(0, 1);
        if(coinFlip == 1){
            currentFighter = Fighter1;
            return Fighter1;
        }else if(coinFlip == 0){
            currentFighter = Fighter2;
        }
    }else{
        if(currentFighter.endOfTurn == moves){
            turns++;
            if(currentFighter == Fighter1){
                currentFighter = Fighter2;
                return Fighter2; 
            }else if(currentFighter == Fighter2){
                currentFighter = Fighter1;
                return Fighter1;
            }else{
                currentFighter = null;
                getNextFighter();
            }
        }else{
            return currentFighter;
        }
    
    }
}

var Fighter1 = new Fighter("Fighter1");
var Fighter2 = new Fighter("Fighter2");
Fighter1.enemey(Fighter2);
Fighter2.enemey(Fighter1);
generateCards(Fighter1, 5);
generateCards(Fighter2, 5);
while(!gameOver(Fighter1, Fighter2)){
    display();
    getNextFighter();
    useCard(currentFighter, randomNum(0, DECKSIZE - 1));
    moves++;
}
console.log(winner + " has won the match after " + moves + " moves" + " and " + turns + " turns");



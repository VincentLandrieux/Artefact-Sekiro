//---IMPORT---//
import Character from "./character";

//---VARIABLE---//
const player = new Character();
const enemy = new Character();
player.characterElem = document.querySelector(".character_player");
player.staminaSld = document.querySelector(".slide_stamina.slide_player");
player.staminaLvlSld = player.staminaSld.querySelector(".slide_lvl");
player.healthSld = document.querySelector(".slide_health.slide_player");
player.healthLvlSld = player.healthSld.querySelector(".slide_lvl");

enemy.characterElem = document.querySelector(".character_enemy");
enemy.staminaSld = document.querySelector(".slide_stamina.slide_enemy");
enemy.staminaLvlSld = enemy.staminaSld.querySelector(".slide_lvl");
enemy.healthSld = document.querySelector(".slide_health.slide_enemy");
enemy.healthLvlSld = enemy.healthSld.querySelector(".slide_lvl");

const attackBtn = document.querySelector(".action_attack_btn");
const dodgeBtn = document.querySelector(".action_dodge_btn");
const parryBtn = document.querySelector(".action_parry_btn");

let spaceKeyPress = false;
let upKeyPress = false;
let downKeyPress = false;

let zKeyPress = false;
let aKeyPress = false;
let eKeyPress = false;

//---FUNCTION---//


//---EVENT---//
window.onresize = () => {
    player.renderStamina();
    player.renderHealth();
    enemy.renderStamina();
    enemy.renderHealth();
};


//UI Interaction
attackBtn.onmousedown = () => {
    player.charge();
}
attackBtn.onmouseup = () => {
    const attackResult = player.attack();
    if(attackResult.done){
        const touchResult = enemy.touch(attackResult.damage, attackResult.special);
        if(!touchResult.done){
            //Si l'attaque ne touche pas
            if(attackResult.special){
                if(touchResult.dodge){
                    //Si l'attaque est spéciale et l'ennemi esquive
                    player.exhausted();
                }
            }else{
                if(touchResult.parry){
                    //Si l'attaque est simple et l'ennemi bloque
                    player.parried(attackResult.damage);
                }
            }
        }
    }
}
dodgeBtn.onclick = () => {
    player.dodge();
}
parryBtn.onmousedown = () => {
    player.parry();
}
parryBtn.onmouseup = () => {
    player.unparry();
}
document.onkeydown = (e) => {
    if(e.keyCode === 38 && !upKeyPress){
        //Attack
        upKeyPress = true;

        player.charge();
    }
    if(e.keyCode === 40 && !downKeyPress){
        //Dodge
        downKeyPress = true;
        player.dodge();
    }
    if(e.keyCode === 32 && !spaceKeyPress){
        //Parry
        spaceKeyPress = true;
        player.parry();
    }


    if(e.keyCode === 65 && !aKeyPress){
        //Attack
        aKeyPress = true;

        enemy.charge();
    }
    if(e.keyCode === 69 && !eKeyPress){
        //Dodge
        eKeyPress = true;
        enemy.dodge();
    }
    if(e.keyCode === 90 && !zKeyPress){
        //Parry
        zKeyPress = true;
        enemy.parry();
    }
}
document.onkeyup = (e) => {
    if(e.keyCode === 38){
        //Attack
        upKeyPress = false;
        const attackResult = player.attack();
        if(attackResult.done){
            const touchResult = enemy.touch(attackResult.damage, attackResult.special);
            if(!touchResult.done){
                //Si l'attaque ne touche pas
                if(attackResult.special){
                    if(touchResult.dodge){
                        //Si l'attaque est spéciale et l'ennemi esquive
                        player.exhausted();
                    }
                }else{
                    if(touchResult.parry){
                        //Si l'attaque est simple et l'ennemi bloque
                        player.parried(attackResult.damage);
                    }
                }
            }
        }
    }
    if(e.keyCode === 40){
        //Dodge
        downKeyPress = false;
    }
    if(e.keyCode === 32){
        //Parry
        spaceKeyPress = false;
        player.unparry();
    }


    if(e.keyCode === 65){
        //Attack
        aKeyPress = false;
        const attackResult = enemy.attack();
        if(attackResult.done){
            const touchResult = player.touch(attackResult.damage, attackResult.special);
            if(!touchResult.done){
                //Si l'attaque ne touche pas
                if(attackResult.special){
                    if(touchResult.dodge){
                        //Si l'attaque est spéciale et l'ennemi esquive
                        enemy.exhausted();
                    }
                }else{
                    if(touchResult.parry){
                        //Si l'attaque est simple et l'ennemi bloque
                        enemy.parried(attackResult.damage);
                    }
                }
            }
        }
    }
    if(e.keyCode === 69){
        //Dodge
        eKeyPress = false;
    }
    if(e.keyCode === 90){
        //Parry
        zKeyPress = false;
        enemy.unparry();
    }
}

//---MAIN---//

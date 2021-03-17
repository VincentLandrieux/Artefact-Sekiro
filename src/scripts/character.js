export default class Character{
    constructor(){
        //HTML Element
        this.staminaSld = null;
        this.staminaLvlSld = null;
        this.healthSld = null;
        this.healthLvlSld = null;
        this.characterElem = null;

        //Attribute
        this.staminaMax = 100;
        this.healthMax = 100;
        this.stamina = 0;
        this.health = 100;
        this.damage = 10;
        this.chargeDamage = 20;
        this.parriedResist = 0.8;

        //State
        this.actionState = false;
        // this.inChargeState = false;
        this.chargeState = false;
        this.attackState = false;
        this.dodgeState = false;
        this.parryState = false;
        this.exhaustedState = false;

        //Cooldown
        this.cooldown = {
            exhausted: {
                value: 2000,
                timeout: null
            },
            stamina: {
                value: 2000,
                timeout: null
            },
            charge: {
                value: 2000,
                timeout: null
            },
            attack: {
                value: 1000,
                timeout: null
            },
            dodge: {
                value: 500,
                timeout: null
            }
        }
    }

    reduceStamina(n){
        this.stamina -= n;
        if(this.stamina < 0){
            this.stamina = 0;
        }
        this.renderStamina();
    }
    increaseStamina(n){
        this.stamina += n;
        if(this.stamina >= this.staminaMax){
            this.stamina = this.staminaMax;

            this.exhausted();
            window.setTimeout(() => {
                this.reduceStamina(this.staminaMax);
            }, 500);
        }
        this.renderStamina();
    }
    reduceHealth(n){
        this.health -= n;
        if(this.health <= 0){
            // this.health = 0;
            this.health = this.healthMax;
        }
        this.renderHealth();
    }
    increaseHealth(n){
        this.health += n;
        if(this.health > this.healthMax){
            this.health = this.healthMax;
        }
        this.renderHealth();
    }

    setCooldown(cooldown, funct){
        if(cooldown.timeout){
            window.clearTimeout(cooldown.timeout);
        }

        cooldown.timeout = window.setTimeout(() => {
            funct();
            cooldown.timeout = null;
        }, cooldown.value);
    }

    renderStamina(){
        if(this.staminaSld && this.staminaLvlSld){
            const staminaWidth = this.staminaSld.clientWidth;
            this.staminaLvlSld.style.right = staminaWidth - ((staminaWidth * this.stamina) / 100) +'px';
        }
    }
    renderHealth(){
        if(this.healthSld && this.healthLvlSld){
            const healthWidth = this.healthSld.clientWidth;
            this.healthLvlSld.style.right = healthWidth - ((healthWidth * this.health) / 100) +'px';
        }
    }

    touch(damage, special = false){
        let result = {
            done: false,
            parry: false,
            dodge: false
        };

        if(special){
            if(this.dodgeState){
                //Dodge
                result.dodge = true;
            }else{
                this.reduceHealth(damage);
                result.done = true;
            }
        }else{
            if(this.parryState){
                this.setCooldown(this.cooldown.stamina, () => {
                    if(!this.parryState){
                        this.reduceStamina(this.staminaMax);
                    }
                });

                this.increaseStamina(damage);
                result.parry = true;
            }else{
                this.reduceHealth(damage);

                result.done = true;
            }
        }

        return result;
    }
    exhausted(){
        this.unparry();
        this.actionState = true;
        this.exhaustedState = true;

        this.setCooldown(this.cooldown.exhausted, () => {
            this.actionState = false;
            this.exhaustedState = false;

            this.characterElem.classList.remove("character_exhausted");
        });

        this.characterElem.classList.add("character_exhausted");
    }

    charge(){
        if(!this.actionState){
            // this.inChargeState = true;

            this.setCooldown(this.cooldown.charge, () => {
                // this.inChargeState = false;
                this.chargeState = true;

                this.characterElem.classList.remove("character_charge-attack");
                this.characterElem.classList.add("character_charge-attack");
            });

            this.characterElem.classList.add("character_incharge-attack");
        }
    }
    unCharge(){
        this.chargeState = false;

        if(this.cooldown.charge.timeout){
            window.clearTimeout(this.cooldown.charge.timeout);
        }

        this.characterElem.classList.remove("character_incharge-attack");
        this.characterElem.classList.remove("character_charge-attack");

    }

    attack(){
        let result = {
            done: false,
            special: false,
            damage: 0
        };

        if(!this.actionState){
            this.actionState = true;
            this.attackState = true;

            result.done = true;
            if(this.chargeState){
                result.special = true;
                result.damage = this.chargeDamage;
            }else{
                result.damage = this.damage;
            }

            this.unCharge();

            this.setCooldown(this.cooldown.attack, () => {
                this.actionState = false;
                this.attackState = false;

                this.characterElem.classList.remove("character_attack");
            });

            this.characterElem.classList.add("character_attack");
        }else{
            this.unCharge();
        }

        return result;
    }

    dodge(){
        if(!this.actionState){
            this.actionState = true;
            this.dodgeState = true;

            this.unCharge();

            this.setCooldown(this.cooldown.dodge, () => {
                this.actionState = false;
                this.dodgeState = false;

                this.characterElem.classList.remove("character_dodge");
            });

            this.characterElem.classList.add("character_dodge");
        }
    }

    parry(){
        if(!this.actionState){
            this.actionState = true;
            this.parryState = true;

            this.unCharge();

            this.characterElem.classList.add("character_parry");
        }
    }
    unparry(){
        if(this.parryState){
            this.actionState = false;
            this.parryState = false;

            this.characterElem.classList.remove("character_parry");
        }

        if(!this.cooldown.stamina.timeout){
            this.reduceStamina(this.staminaMax);
        }
    }
    parried(n){
        this.increaseStamina(n * this.parriedResist);
        this.setCooldown(this.cooldown.stamina, () => {
            if(!this.parryState){
                this.reduceStamina(this.staminaMax);
            }
        });
    }
}

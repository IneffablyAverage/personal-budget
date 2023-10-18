//account.js contains the account class for envelope budgetting


//Oct. 12, 2023 to be added: logging functionality that records: initialization parameters, all expenses including overbudget

class Account{
    constructor(balance, name){
        //query database to assign id
        this._balance = balance;
        this._name = name;
        this._credit = 0;
    }
    get name(){
        return this._name;
    }
    get budget(){
        return this._budget;
    }
    get credit(){
        return this._credit;
    }
    get balance(){
        return this._balance;
    }

    set credit(creditAmount){
        if (typeof creditAmount === 'number'){
            this._credit = creditAmount;
        }
    }

    set balance(newBalance){
        //if value is less than zero you've gone over budget 
        if (newBalance + this.credit < 0){
            console.log(`this transaction could not be completed due to insufficient funds`);

        } else{
            console.log(`successful transaction. Remaining balance is ${newBalance}`);
            this._balance = newBalance;
        }
    }
    //account purchase. subtract money from account remaining balance
    purchase(amount){
        //check to see if envelope is over budget
        if ((this.balance + this.credit) < 0){
            console.log(`you have previously exceeded your ${this._name} available funds`);
        } else{
            //check the setter function for budget exceeding scenario
            this.balance -= amount;
        }
    }
    //account payment
    payment(amount){

    }

}

//envelope is a special type of account where credit is always = 0, balance can sink lower than available balance
class Envelope extends Account{
    constructor(balance, name){
        super(balance, name);
    }

    get credit(){
        return this._credit;
    }
    set credit(placeHolder){
        console.log(`cannot add credit to budgetting envelope`);
        this._credit = 0;
    }
}


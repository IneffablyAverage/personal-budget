//envelopes.js contains the Envelope class for envelope budgettings


//Oct. 12, 2023 to be added: logging functionality that records: initialization parameters, all expenses including overbudget

class Envelope{
    constructor(budget, name){
        this._name = name;
        this._budget = budget;
        this._remaining = budget;
        this._overBudget = false;
    }

    get name(){
        return this._name;
    }
    get budget(){
        return this._budget;
    }
    get remaining(){
        return this._remaining;
    }


    set remaining(newRemaining){
        //if value is less than zero you've gone over budget 
        if (newRemaining < 0){
        this._remaining = 0;
        this._overBudget = true;
        }
        
        this._remaining = newRemaining;

    }

    spend(ammount){
        //check to see if envelope is over budget
        if (this._overBudget){
            return `you have already exceeded your ${this._name} budget`;
        }
        //check the setter function for budget exceeding scenario
        this.remaining -= ammount;
    }
}
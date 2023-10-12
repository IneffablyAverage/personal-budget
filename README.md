
# Personal Budget

a budgeting app that uses envelope budgeting principles to track spending compared to income.

create, read, update, and delete budgeting envelopes using the api to help stay on top of your budget.

### Envelopes

within the program there are many refferences to envelopes.
envolopes are discrete portions of your budget and are made up of the following:

    - Name (category of spending) for example: transportation, food/groceries, rent...etc
    - Budget (max available per (month or biwk.))
    - Remaining (remaining balance in the envelope)

    - getters for retrieving each variable
    - setters for editing the remaining balance of an envelope (log spending)

Envelopes are represented in this program as instances of a class, "Envelope"
as such, when one is made, the constructor is called.
#### Envelope Constructor

The Envelope constructor takes in two variable, a string "name" and an number "budget"

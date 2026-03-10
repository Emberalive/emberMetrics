export default function RuleSelection({chosenRule, setChosenRule}) {

    const rules = [
        {name: "allow"},
        {name: "deny"},
        {name: "allow incoming"}, //default allow incoming
        {name: "deny incoming"},
        {name: "allow outgoing"}, //default allow outgoing
        {name: "deny outgoing"},
    ];

    const rulesList = rules.map(rule => {
        return (
            <div  key={rule.id} className={chosenRule.name === rule.name? "admin-selection__item disabled-selection" : 'admin-selection__item'}
                  onClick={() => setChosenRule(rule)}>
                <p>{rule.name}</p>
            </div>
        )
    })

    return (
        <div className={"admin-selection__container"}>
            <header>
                <p>Please select a rule</p>
            </header>
            <div  className={"admin-selection__items"}>
                {rulesList}
            </div>
        </div>
    )
}
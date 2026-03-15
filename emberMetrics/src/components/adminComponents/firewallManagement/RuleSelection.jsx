export default function RuleSelection({chosenRule, setChosenRule}) {

    const rules = [
        'allow',
        'deny',
        'default allow incoming',
        'default deny incoming',
        'default allow outgoing',
        'default deny outgoing',
    ];

    const rulesList = rules.map(rule => {
        return (
            <div  key={rule} className={chosenRule === rule? "admin-selection__item disabled-selection" : 'admin-selection__item'}
                  onClick={() => setChosenRule(rule.toString())}>
                <p>{rule}</p>
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
// SECTION DATA
const upgrades = [
    {
        id: 'c101',
        name: 'corn',
        type: 'click',
        initPrice: 10,
        price: 10,
        priceIncRate: 2,
        power: 1,
        quantity: 0,
    },
    {
        id: 'c102',
        name: 'sonar',
        type: 'click',
        initPrice: 50,
        price: 50,
        priceIncRate: 3,
        power: 5,
        quantity: 0
    },
    {
        id: 'a101',
        name: 'cat',
        type: 'auto',
        initPrice: 1000,
        price: 1000,
        priceIncRate: 2,
        power: 10,
        quantity: 0
    },
    {
        id: 'a102',
        name: 'dolphin',
        type: 'auto',
        initPrice: 5000,
        price: 5000,
        priceIncRate: 3,
        power: 50,
        quantity: 0
    }
];

const user = { bank: 0, clickPower: 0, autoPower: 0 }

// SECTION TOOLS
const compact = Intl.NumberFormat('en', { notation: 'compact' });


// SECTION DOM Updates
function draw(upgrade) {
    document.getElementById(`${upgrade.name}Price`).innerText = compact.format(upgrade.price)
    document.getElementById(`${upgrade.name}Quantity`).innerText = upgrade.quantity
    document.getElementById(`${upgrade.name}Power`).innerText = upgrade.quantity * upgrade.power
}

function drawScoreboard(key) {
    document.getElementById(key).innerText = user[key].toLocaleString('en-US')
}

function drawAll() {
    Object.keys(user).forEach(x => drawScoreboard(x))
    upgrades.forEach(x => draw(x))
}


// SECTION Transactions
function applyUpgrade(upgrade) {
    upgrade.quantity++
    user[`${upgrade.type}Power`] += upgrade.power
}

function increasePrice(upgrade) {
    upgrade.price *= upgrade.priceIncRate
}

function collectPayment(upgrade) {
    user.bank -= upgrade.price
}

function purchase(upgrade) {
    collectPayment(upgrade)
    increasePrice(upgrade)
    applyUpgrade(upgrade)
    draw(upgrade)
    drawScoreboard('bank')
    drawScoreboard(`${upgrade.type}Power`)
}

function collectClick() {
    user.bank += user.clickPower
    drawScoreboard('bank')
}

function collectAuto() {
    user.bank += user.autoPower
    drawScoreboard('bank')
}


// SECTION Handle User Actions
function buy(uid) {
    let upgrade = upgrades.find(x => x.id == uid)
    if (insufficientFunds(upgrade)) {
        window.alert(`Insufficient Funds: ${upgrade.name} costs ${upgrade.price} fish, but you only have ${user.bank}.`)
    }
    else {
        purchase(upgrade)
    }
}

function goFish() {
    collectClick()
}


// SECTION UTILITIES
function insufficientFunds(upgrade) {
    return user.bank < upgrade.price
}

// Source: https://reacthustle.com/blog/how-to-convert-number-to-kmb-format-in-javascript
function kmbFormat2(num, precision = 0) {
    const map = [
        { suffix: 'E', threshold: 1e18 },
        { suffix: 'P', threshold: 1e15 },
        { suffix: 'T', threshold: 1e12 },
        { suffix: 'B', threshold: 1e9 },
        { suffix: 'M', threshold: 1e6 },
        { suffix: 'K', threshold: 1e3 },
        { suffix: '', threshold: 1 },
    ];

    const found = map.find((x) => Math.abs(num) >= x.threshold);
    if (found) {
        const formatted = (num / found.threshold).toFixed(precision) + found.suffix;
        return formatted;
    }

    return num;
}



// SECTION Initialization
function reset() {
    [user.bank, user.clickPower, user.autoPower] = [0, 1, 0]
    upgrades.forEach(x => [x.quantity, x.price] = [0, x.initPrice])
    drawAll()
    setInterval(collectAuto, 3000)
}

reset()




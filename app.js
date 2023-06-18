// SECTION DATA
let initID;
let upgrades = [
    {
        id: 'c101',
        name: 'corn',
        icon: 'mdi mdi-corn',
        type: 'click',
        initPrice: 10,
        price: 10,
        priceIncRate: 2,
        power: 1,
        quantity: 0,
        locked: true
    },
    {
        id: 'c102',
        name: 'sonar',
        icon: 'mdi mdi-radar',
        type: 'click',
        initPrice: 50,
        price: 50,
        priceIncRate: 3,
        power: 5,
        quantity: 0,
        locked: true
    },
    {
        id: 'a101',
        name: 'cat',
        icon: 'mdi mdi-cat',
        type: 'auto',
        initPrice: 1000,
        price: 1000,
        priceIncRate: 2,
        power: 10,
        quantity: 0,
        locked: true
    },
    {
        id: 'a102',
        name: 'dolphin',
        icon: 'mdi mdi-dolphin',
        type: 'auto',
        initPrice: 5000,
        price: 5000,
        priceIncRate: 3,
        power: 50,
        quantity: 0,
        locked: true
    }
];
let user = { bankTotal: 0, bank: 0, clickPower: 0, autoPower: 0 }


// SECTION RESOURCES
function lsWrite() {
    window.localStorage.setItem('gameData', JSON.stringify({ user: user, upgrades: upgrades }))
}

function lsRead() {
    return JSON.parse(window.localStorage.getItem('gameData'))
}

function lsClear() {
    window.localStorage.clear()
}


// SECTION TOOLS
const compact = Intl.NumberFormat('en', { notation: 'compact' });


// SECTION DOM Updates
function setUpgradesAvailability() {
    upgrades.forEach(x => {
        if (x.price > user.bank) {
            document.getElementById(x.id).disabled = true
        }
        else {
            document.getElementById(x.id).disabled = false
        }
    })
}

function popClickTokens() {
    document.getElementById('clickTokens').classList.add('click-fish');
    setTimeout(function () {
        document.getElementById('clickTokens').classList.remove('click-fish');
    }, 500);
}

function drawTokens(type) {
    let items = upgrades.filter(x => x.type == type && x.quantity > 0)
    let template = ''
    items.forEach(x => {
        template += /*html*/`<i class="${x.icon}"></i>`.repeat(x.quantity)
    })
    document.getElementById(`${type}Tokens`).innerHTML = template
}

function draw(upgrade) {
    document.getElementById(`${upgrade.name}Price`).innerText = compact.format(upgrade.price)
    document.getElementById(`${upgrade.name}Quantity`).innerText = upgrade.quantity
    document.getElementById(`${upgrade.name}Power`).innerText = compact.format(upgrade.quantity * upgrade.power)
}

function drawScoreboard(key) {
    if (key == 'bankTotal') {
        document.getElementById(key).innerText = compact.format(user[key])
    }
    else {
        document.getElementById(key).innerText = user[key].toLocaleString('en-US')
    }
}

function drawAll() {
    Object.keys(user).forEach(x => drawScoreboard(x))
    upgrades.forEach(x => draw(x))
    drawTokens('click')
    drawTokens('auto')
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
    drawTokens(upgrade.type)
    setUpgradesAvailability()
    lsWrite()
}

function collectClick() {
    user.bank += user.clickPower
    drawScoreboard('bank')
    user.bankTotal += user.clickPower
    drawScoreboard('bankTotal')
    setUpgradesAvailability()
    lsWrite()
}

function collectAuto() {
    user.bank += user.autoPower
    drawScoreboard('bank')
    user.bankTotal += user.autoPower
    drawScoreboard('bankTotal')
    setUpgradesAvailability()
    lsWrite()
}

function bonus(type, amount) {
    user[`${type}Power`] += amount
    drawScoreboard(`${type}Power`)
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
    popClickTokens()
}

function freebie(type, amount) {
    bonus(type, amount)
}

function quit() {
    if (confirm('Are you sure you want to Quit?')) {
        clearInterval(initID)
        lsClear()
        initID = init()
    }
}


// SECTION UTILITIES
function insufficientFunds(upgrade) {
    return user.bank < upgrade.price
}


// SECTION Initialization
function resetUpgradesData() {
    upgrades.forEach(x => [x.quantity, x.price] = [0, x.initPrice])
}

function resetUserData() {
    [user.bankTotal, user.bank, user.clickPower, user.autoPower] = [0, 0, 1, 0]
}

function resetGameData() {
    resetUserData()
    resetUpgradesData()
}

function loadGameData(gameData) {
    Object.assign(user, gameData.user)
    upgrades = gameData.upgrades
}

function init() {
    let gameData = lsRead()
    if (gameData) {
        loadGameData(gameData)
    }
    else {
        resetGameData()
    }
    drawAll()
    setUpgradesAvailability()
    return setInterval(collectAuto, 3000)
}

initID = init()
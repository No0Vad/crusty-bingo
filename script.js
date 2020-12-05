const xMatrix = 5;
const yMatrix = 5;
const middleIndex = ((xMatrix * yMatrix) - 1) / 2;

const matrix = [];
const selectClass = 'active';
const storageNameIsFullHouse = 'CrustBingoRandomIsFullHouse';
const storageNameRandom = 'CrustBingoRandomIndexes';
const storageNameSelected = 'CrustBingoRandomSelected';

const freeSpaceImage = "free-space.png";
const images = [
    "andy.png",
    "crusty-con-when.png",
    "crustyyoggo-confirmed.png",
    "da-tells-kirsty-to-put-her-glasses-on.png",
    "eff-weirdchamp-someone.png",
    "fishmonger-reads-from-his-guide.png",
    "kirsty-orders-food.png",
    "moistcatto-returns.png",
    "new-copypasta-spawns.png",
    "raid-from-a-yog.png",
    "random-weirdo-in-chat.png",
    "ravs-is-lurking-and-is-summoned-by-roast.png",
    "ravs-makes-a-troll-dono.png",
    "ravs-roast.png",
    "scare-dono.png",
    "someone-gifts-a-sub-to-a-troll-username.png",
    "someone-orders-pizza.png",
    "someones-poopy.png",
    "tabs-does-a-poo.png",
    "tabs-gets-a-dreamie.png",
    "tabs-plays-with-the-curtains.png",
    "tabs-tos.png",
    "troll-donos-start-a-hype-train.png",
    "when.png"
];

let randomIndexs = [];
let finalImages = [];
let done = false;
let isFullHouseMode = localStorage.getItem(storageNameIsFullHouse) === '1';

let savedRandomIndex = localStorage.getItem(storageNameRandom);
if (savedRandomIndex != null)
{
    randomIndexs = JSON.parse(savedRandomIndex);
}

if (randomIndexs.length == 0)
{
    for (let i = 0; i < images.length; i++)
    {
        let randomIndex;
        while (true)
        {
            randomIndex = Math.floor(Math.random() * images.length);

            if (randomIndexs.indexOf(randomIndex) === -1)
            {
                break;
            }
        }

        randomIndexs.push(randomIndex);
        finalImages.push(images[randomIndex]);
    }

    localStorage.setItem(storageNameRandom, JSON.stringify(randomIndexs));
}
else
{
    for (let i = 0; i < randomIndexs.length; i++)
    {
        finalImages.push(images[randomIndexs[i]]);
    }
}

// Add the free space in center
finalImages.splice(middleIndex, 0, freeSpaceImage);


const toggleImage = function ()
{
    if (done)
    {
        return;
    }

    /** @type {HTMLSpanElement} */
    var item = this;

    if (item.dataset.id - 0 === middleIndex)
    {
        return;
    }

    item.classList.toggle(selectClass);

    saveSelection();

    var wasWinnerFound = checkForWinner();
    if (wasWinnerFound)
    {
        winnerFound();
    }
};


const saveSelection = function ()
{
    var selectedIds = [];

    for (let x = 0; x < xMatrix; x++)
    {
        for (let y = 0; y < yMatrix; y++)
        {
            /** @type {HTMLSpanElement} */
            var element = matrix[x][y];

            if (element.classList.contains(selectClass))
            {
                selectedIds.push(element.dataset.id - 0);
            }
        }
    }

    localStorage.setItem(storageNameSelected, JSON.stringify(selectedIds));
};


const checkForWinner = function ()
{
    if (isFullHouseMode)
    {
        for (let x = 0; x < xMatrix; x++)
        {
            for (let y = 0; y < yMatrix; y++)
            {
                /** @type {HTMLSpanElement} */
                var element = matrix[x][y];

                if (!element.classList.contains(selectClass) && element.dataset.id - 0 !== middleIndex)
                {
                    return false;
                }
            }
        }

        return true;
    }


    // Check horizontal and vertical
    for (let x = 0; x < xMatrix; x++)
    {
        let foundX = 0;
        let foundY = 0;
        for (let y = 0; y < yMatrix; y++)
        {
            /** @type {HTMLSpanElement} */
            var elementX = matrix[x][y];
            if (elementX.classList.contains(selectClass) || elementX.dataset.id - 0 === middleIndex)
            {
                foundX++;
            }

            /** @type {HTMLSpanElement} */
            var elementY = matrix[y][x];
            if (elementY.classList.contains(selectClass) || elementY.dataset.id - 0 === middleIndex)
            {
                foundY++;
            }
        }

        if (foundX == xMatrix || foundY == yMatrix)
        {
            return true;
        }
    }

    // Check for diagonals
    let foundDiag1 = 0;
    let foundDiag2 = 0;

    for (let x = 0; x < xMatrix; x++)
    {
        /** @type {HTMLSpanElement} */
        var element = matrix[x][x];
        if (element.classList.contains(selectClass) || element.dataset.id - 0 === middleIndex)
        {
            foundDiag1++;
        }
    }

    for (let x = xMatrix - 1; x >= 0; x--)
    {
        /** @type {HTMLSpanElement} */
        var element = matrix[x][yMatrix - 1 - x];
        if (element.classList.contains(selectClass) || element.dataset.id - 0 === middleIndex)
        {
            foundDiag2++;
        }
    }

    if (foundDiag1 == xMatrix || foundDiag2 === yMatrix)
    {
        return true;
    }

    return false;
};


const winnerFound = function ()
{
    done = true;
    var audio = new Audio('./blelele.mp3');
    audio.volume = 0.75;
    audio.play();

    resetBingo(false);


    document.body.classList.add('winner');
};


const setModeFullhouse = function (state)
{
    localStorage.setItem(storageNameIsFullHouse, state ? '1' : '');

    resetBingo(true);
};


const resetBingo = function (reload)
{
    localStorage.removeItem(storageNameRandom);
    localStorage.removeItem(storageNameSelected);

    if (reload)
    {
        window.location = window.location;
    }
};


document.addEventListener("DOMContentLoaded", function ()
{
    document.querySelector(`#setFullHouse_${(isFullHouseMode ? 'Yes' : 'No')}`).classList.add(selectClass);

    const itemsElement = document.querySelector('#items');
    let savedSelectionIds = [];

    var savedSelections = localStorage.getItem(storageNameSelected);
    if (savedSelections != null)
    {
        savedSelectionIds = JSON.parse(savedSelections);
    }

    let i = 0;
    for (let x = 0; x < xMatrix; x++)
    {
        var row = [];

        for (let y = 0; y < yMatrix; y++)
        {
            const finalImage = finalImages[i];

            var spanElement = document.createElement('span');
            spanElement.dataset.id = i;
            spanElement.addEventListener('click', toggleImage);

            var imgElement = document.createElement('img');
            imgElement.src = `./Images/${finalImage}`;
            imgElement.draggable = false;

            spanElement.appendChild(imgElement);

            if (savedSelectionIds.indexOf(i) !== -1)
            {
                spanElement.classList.add(selectClass);
            }

            itemsElement.appendChild(spanElement);

            row.push(spanElement);
            i++;
        }

        matrix.push(row);
    }
});
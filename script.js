const texts = {
    birthday: "Birthday",
    party: "PARTY",
    toast: "LET'S TOAST TO FABULOUS",
    name: "Ana's",
    age: "50th",
    date: "SATURDAY",
    time: "MARCH 21    AT 6 PM",
    year: "2026",
    address: "ADDRESS TBA"
};

const elements = {
    birthday: document.getElementById("birthday-text"),
    party: document.getElementById("party-text"),
    toast: document.getElementById("toast-text"),
    name: document.getElementById("name-text"),
    age: document.getElementById("age-text"),
    date: document.getElementById("date-text"),
    time: document.getElementById("time-text"),
    year: document.getElementById("year-text"),
    address: document.getElementById("address-text")
};

let currentIndex = 0;
let currentElement = null;
let currentText = "";

function typeWriter(elementKey, text, callback) {
    currentElement = elements[elementKey];
    currentText = text;
    currentIndex = 0;
    
    function type() {
        if (currentIndex < currentText.length) {
            currentElement.textContent += currentText.charAt(currentIndex);
            currentIndex++;
            setTimeout(type, 60);
        } else if (callback) {
            setTimeout(callback, 200);
        }
    }
    
    type();
}

window.addEventListener('load', () => {
    setTimeout(() => {
        typeWriter('birthday', texts.birthday, () => {
            typeWriter('party', texts.party, () => {
                typeWriter('toast', texts.toast, () => {
                    typeWriter('name', texts.name, () => {
                        typeWriter('age', texts.age, () => {
                            typeWriter('date', texts.date, () => {
                                typeWriter('time', texts.time, () => {
                                    typeWriter('year', texts.year, () => {
                                        typeWriter('address', texts.address);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }, 800);
});

document.querySelector('.scroll-arrow').addEventListener('click', () => {
    document.querySelector('.gallery-section').scrollIntoView({ 
        behavior: 'smooth' 
    });
});

document.querySelector('.scroll-up').addEventListener('click', () => {
    document.querySelector('.hero-section').scrollIntoView({ 
        behavior: 'smooth' 
    });
});
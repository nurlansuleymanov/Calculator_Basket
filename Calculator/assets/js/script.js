const display = document.getElementById("display");


// Düymədən gələn rəqəmi və operatoru ekrana yazır
function appendToDisplay(value) {
    display.value += value;
}


// C düyməsi - ekranı təmizləyir
function clearDisplay() {
    display.value = "";
}


// = düyməsi - hesablayır
function calculate() {
    try {
        display.value = eval(display.value);
    }
    catch {
        display.value = "Error";
    }
}

// X düyməsi - son rəqəmi silir
function deleteLast() {
    display.value = display.value.slice(0, -1);
}
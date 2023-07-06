function SortPrompt() {
    var text = document.getElementById("text-prompt").value;
    var maxWordLength = document.getElementById("max-word-length").value;
    var list = text.split(/[,\n]+/);
    list = list.map((item) => item.trim());
    // list.sort(); 
    list = list.filter((item) => item.length <= maxWordLength);
    list = list.filter((item, index) => list.indexOf(item) === index);
    document.getElementById("text-prompt").value = list.join(", ").trim();
}

/*
From the html extract data to generate string
        <label for="min-length">Min prompt length:</label>
        <input type="number" id="min-length" name="min-length" min="1" max="10000" value="100">
        <label for="max-length">Max prompt length:</label>
        <input type="number" id="max-length" name="max-length" min="1" max="10000" value="256">
Get random prompt length
Get random word from the word list and add it to prompt until prompt length is reached
    var text = document.getElementById("text-prompt").value;
    var list = text.split(/[,\n]+/);
*/
function Generate1Prompt() {
    var min = document.getElementById("min-length").value;
    var max = document.getElementById("max-length").value;
    var length = Math.floor(Math.random() * (max - min + 1)) + parseInt(min);
    var text = document.getElementById("text-prompt").value;
    var list = text.split(/[,\n]+/);
    list = list.map((item) => item.trim());
    var prompt = "";
    while (prompt.length < length) {
        var word = list[Math.floor(Math.random() * list.length)];
        prompt += word + ", ";
    }
    prompt = prompt.trim();
    var words = prompt.split(/[,\n]+/);
    words = words.map((item) => item.trim());
    words = words.filter((item, index) => words.indexOf(item) === index);
    prompt = words.join(", ").trim();
    // prompt = prompt.slice(0, -1);
    return prompt;
}

/*
Take the number of prompts and generate them using Generate1Prompt
        <label for="num-prompts">Number of Prompts:</label>
        <input type="number" id="num-prompts" name="num-prompts" min="1" max="10000" value="30">
write the output to document.getElementById("output") text area
*/
function GeneratePrompts() {
    var num = document.getElementById("num-prompts").value;
    var output = "";
    for (var i = 0; i < num; i++) {
        output += Generate1Prompt() + "\n";
    }
    document.getElementById("output").value = output;
    AddRandomInfixesToEachPrompt();
    AddOneWordFromEachLineToEachPrompt();
    AddPrefixToEachPrompt();
}

/*
Take the prefix and add it to each prompt
*/
function AddPrefixToEachPrompt() {
    var prefix = document.getElementById("prefix").value;
    var suffix = document.getElementById("suffix").value;
    var text = document.getElementById("output").value;
    var list = text.split(/[\n]+/);
    list = list.map((item) => item.trim());
    var prompt = "";
    for (var i = 0; i < list.length - 1; i++) {
        if (prefix.length > 0) prompt += prefix.trim() + ", ";
        prompt += list[i];
        if (suffix.length > 0) prompt += ", " + suffix.trim();
        prompt += "\n";

    }
    document.getElementById("output").value = prompt;
}

function AddRandomInfixesToEachPrompt() {
    var infix = document.getElementById("infix").value;
    var infixTokens = infix.split(",");
    infixTokens = infixTokens.map((item) => item.trim());
    var text = document.getElementById("output").value;
    var list = text.split(/[\n]+/);
    list = list.map((item) => item.trim());
    var prompt = "";
    for (var i = 0; i < list.length - 1; i++) {
        var listTokens = list[i].split(",");
        var mixed = listTokens.concat(infixTokens);
        var mixed = shuffle(mixed);
        mixed = mixed.map(item => item.trim()).filter(item => item.length > 0).join(", ");
        prompt += mixed + "\n";
    }
    document.getElementById("output").value = prompt;
}

function AddOneWordFromEachLineToEachPrompt() {
    var oneWord = document.getElementById("oneWord").value;
    var oneWord = oneWord.split(/[\n]+/);
    oneWord = oneWord.map((item) => item.trim());

    var text = document.getElementById("output").value;
    var list = text.split(/[\n]+/);
    list = list.map((item) => item.trim());

    var prompt = "";

    for (var i = 0; i < list.length - 1; i++) {

        var listTokens = list[i].split(",");
        for (var j = 0; j < oneWord.length; j++) {
            var words = oneWord[j].split(",").map(w=>w.trim()).filter(w=>w.length>0);
            const random = Math.floor(Math.random() * words.length);
            listTokens.push(words[random]);
        }
        var listTokens = shuffle(listTokens);
        listTokens = listTokens.map(item => item.trim()).filter(item => item.length > 0).join(", ");
        prompt += listTokens + "\n";

    }
    document.getElementById("output").value = prompt;
}

function copyOutput() {
    const outputTextarea = document.getElementById("output");
    outputTextarea.select();
    navigator.clipboard.writeText(outputTextarea.value);
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}
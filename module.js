// import flatten from './data.json' assert {type: "json"}

// for (let [elem, index] of flatten) {
//     console.log(elem);
// }

// var txt = "#div-name-1234-characteristic:561613213/213";
// var numb = txt.match(/[a-zA-Z0-9&/]/g).join("");

// console.log(str.match(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/).join(''))

const difference = (obj1, obj2) => {
    let arr = [];
    let keyFound = "";
    let fullKey_details = {};
    Object.keys(obj1).forEach(key => {
        if (obj1[key] !== obj2[key]) {
            let diff_val = Object.values(obj2[key]).join("");
            arr.push(diff_val);
            keyFound += obj2[key] + " ";
            fullKey_details[key] = obj2[key];
        };
    });
    return { keyFound, fullKey_details, arr };
};

export { difference };

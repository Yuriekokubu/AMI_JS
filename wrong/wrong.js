const url = new URL(document.URL);

const customerParams = url.searchParams.get('ca');
const peaNumberParams = url.searchParams.get('pea');

const CA = document.getElementById('ca');
const CA_Text = document.createTextNode(customerParams);

const PEA = document.getElementById('pea');
const PEA_Text = document.createTextNode(peaNumberParams);

CA.appendChild(CA_Text);
PEA.appendChild(PEA_Text);

const result = JSON.parse(localStorage.getItem('register'));

const ca_filter = result.filter((o) => o.PEA_No === peaNumberParams || o.Contract_Account === customerParams);

let n = ca_filter.length;

console.log(ca_filter)

for (var [key, val] of Object.entries(n == 1 ? ca_filter[0] : ca_filter[1])) {
    let formatedKey = key.slice(0, 3);
    let formatNum = parseInt(val, 10);
    var numb = formatedKey.trim();
    let isNumeric = /^\d+$/.test(parseInt(key));


    function date_090(value) {
        let val = value.slice(6, 12);
        let valSplit = val.split("");
        valSplit.splice(2, 0, "/");
        valSplit.splice(5, 0, "/");
        let join = valSplit.join("");
        return join;
    }

    function time_091(time) {
        let val = time.slice(9, 13);
        const numb_split = val.split("");
        numb_split.splice(2, 0, ":");
        let join = numb_split.join("");
        return join;
    }

    if (isNumeric) {
        const node = document.getElementById(numb);
        let numberWithDecimal = (formatNum / 100).toFixed(3);
        if (numb === "090") {
            numberWithDecimal = date_090(val);
        }
        if (numb === "091") {
            numberWithDecimal = time_091(val);
        }
        const node_val = document.createTextNode(numberWithDecimal);
        node.appendChild(node_val);
    }

}



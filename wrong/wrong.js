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
const result_mistake = JSON.parse(localStorage.getItem('customer_mistake'));



const ca_filter = result.filter((o) => o.PEA_No === peaNumberParams || o.Contract_Account === customerParams);
const cus_filter = result_mistake.filter((o) => o.PEA_No === peaNumberParams || o.Contract_Account === customerParams);

console.log(cus_filter);
const filters = {
    "015": "000000000000000"
};

const filterdData = ca_filter.filter(i => Object.entries(filters).every(([k, v]) => i[k] !== v));

console.log(filterdData);


for (var [key, val] of Object.entries(filterdData[1])) {
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
        switch (numb) {
            case "090":
                numberWithDecimal = date_090(val);
                break;
            case "091":
                numberWithDecimal = time_091(val);
            default:
                break;
        }
        const node_val = document.createTextNode(numberWithDecimal);
        node.appendChild(node_val);
    }
}

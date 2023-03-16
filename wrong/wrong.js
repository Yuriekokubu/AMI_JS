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

let filterdData = ca_filter.map(({ ["Contract_Account"]: CA, ["PEA_No"]: PEA, ...i }) => i);

let [obj] = cus_filter;

let { warning_mistake, warning_details } = obj;

let wrong_node = document.getElementById('wrong');
wrong_node.innerText = warning_mistake + " : " + warning_details;
wrong_node.style.color = "red";

const isAllZeroThreshold = (currentValue) => currentValue === '000000000000000';

let not_zero = filterdData.filter((v, i) => !Object.values(v).every(isAllZeroThreshold));


function check_undefined(value) {
    if (value === undefined) {
        console.log(filterdData[1]);
        return filterdData[1];
    }
    return value;
}


for (var [key, val] of Object.entries(check_undefined(not_zero[0]))) {
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

const url = new URL(document.URL);

const customerParams = url.searchParams.get('ca');
const peaNumberParams = url.searchParams.get('pea');

const CA = document.getElementById('ca');
const CA_Text = document.createTextNode(customerParams);

const PEA = document.getElementById('pea');
const PEA_Text = document.createTextNode(peaNumberParams);

CA.appendChild(CA_Text);
PEA.appendChild(PEA_Text);

const result = JSON.parse(sessionStorage.getItem('register'));

console.log(result);

// const ca_filter = result.filter((o) => o.Contract_Account == customerParams);

const ca_filter = result.filter(function (item) {
    if (item.Contract_Account == customerParams) {
        return true;
    }

});


for (var [key, val] of Object.entries(ca_filter[1])) {
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

    if (isNumeric) {
        const node = document.getElementById(numb);
        let numberwithComma = numb !== "090" ? (formatNum / 100).toFixed(3) : date_090(val);
        const node_val = document.createTextNode(numberwithComma);
        node.appendChild(node_val);
    }

}



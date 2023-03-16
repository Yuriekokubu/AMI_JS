import _ from 'https://unpkg.com/lodash-es@4.17.21/lodash.js';
const url = new URL(document.URL);

let params = url.searchParams;
let header_params = params.get("head");

let header_Value = localStorage.getItem('header');
let header = JSON.parse(header_Value);

let header_fliterd = header.filter(({ header: { ["Meter Reading Unit"]: v } }) => v === header_params);

let h = _.first(header_fliterd);

let content_fails = h.header["warning_details"];

let str_arr = content_fails.split(",");
let regex_str = str_arr.join("|");

delete h.header["warning_details"];
delete h.header["warning_mistake"];

let pre_node = document.getElementById('json');
pre_node.style.fontSize = '1.5em';
let text_to_fill = JSON.stringify(h.header, undefined, 2);

let newText;
const regex = new RegExp(regex_str, 'g');
let text = pre_node.innerHTML;
text = text.replace(/(<mark class="highlight">|<\/mark>)(^[\s]+|[\s]+$)/gim, '');
newText = text_to_fill.replace(regex, (matched) => `<mark class="highlight">${matched}</mark > `);
console.log(newText);
pre_node.innerHTML = newText;

import {
    Grid,
    html
} from "https://unpkg.com/gridjs?module";
import { difference } from './module.js';

const textDrop = document.getElementById('text-drop');
let filename = [];
let count = 0;
let headerFailedPosition = [];
let CustomerFailedPosition = [];
let RegisterFailedPosition = [];
let isAmi;
let checkSameFileType = [];


const upload = async (event, cb) => {
    let fileLen = event.length;

    if (localStorage.getItem('register')) {
        localStorage.clear();
    }
    // Convert the FileList into an array and iterate
    if (fileLen > 2) {
        alert('Maximum files input by 2');
        return;
    }

    let arrFile = [].slice.call(event);

    // let fileSorted = arrFile.sort((a, b) => a.name.localeCompare(b.name));

    let fileSorted = _.sortBy(arrFile, 'name');


    let files = fileSorted.map((file, i) => {
        filename.push(file.name);

        let cutFileExtension = file.name.replace(/\.[^/.]+$/, "");
        checkSameFileType.push(cutFileExtension.slice(0, -1));

        if (filename.length === 2) {
            let isSame = new Set(checkSameFileType).size == 1;
            if (!isSame) {
                alert('ไฟล์ไม่ตรงกัน');
                return;
            }
        }

        if (cutFileExtension.charAt(cutFileExtension.length - 1) == "2") {
            isAmi = true;
        }

        textDrop.innerHTML = filename;
        // Define a new file reader
        let reader = new FileReader();

        // Create a new promise
        return new Promise((resolve, reject) => {
            // Resolve the promise after reading file
            reader.onload = () => {
                let data = reader.result;
                let newArray = data.split(/\r?\n/);
                // resolve(newArray);

                //H=72 //C=163 //R=144
                let ArrayIndex = [];

                //Find Head Index
                for (let [index, elem] of newArray.entries()) {
                    //splice blank line (last page)
                    elem === '' && newArray.splice(index, 1);
                    let firstChar = elem.charAt(0);
                    if (elem.length === 72 || 84 && firstChar === "H") {
                        ArrayIndex.push(index);
                    }
                    firstChar === "H" && ArrayIndex.push(index);
                }

                // elem.length == 72 || 84 
                let sliced;
                let MergeArray = [];

                //Group Head
                for (let [index, elem] of ArrayIndex.entries()) {
                    if (ArrayIndex.length === 1) {
                        sliced = newArray.slice();
                        MergeArray.push(sliced);
                    } else {
                        sliced = newArray.slice(index === 0 ? index : elem, ArrayIndex[index + 1]);
                        MergeArray.push(sliced);
                    }
                }

                //Seperate Values
                const Seperate = MergeArray.map((val, index) => {
                    const Arr_sorted = [];

                    for (let [index, elem] of val.entries()) {
                        let firstCharH = elem.charAt(0);
                        let firstCharC = elem.charAt(0);
                        let firstCharR = elem.charAt(0);
                        //72,162,144
                        firstCharH === "H" && Arr_sorted.push(HeaderFn(elem));
                        firstCharC === "C" && Arr_sorted.push(CustomerFn(elem));
                        firstCharR === "R" && Arr_sorted.push(RegisterFn(elem));
                    }
                    return Arr_sorted;
                });

                let ArrObj = [];
                let customerArray = [];
                let customer;

                Seperate.map((arr, index) => {
                    /// [ [[H],[C],[R],[R],[C],[R],[R]] , [[H],[C],[R],[R],[C],[R],[R]] ]

                    let registerToFill = [];
                    let RegisterGroup = [];
                    let ObjArr = {};
                    let ObjHead = {};
                    let headerID;

                    arr.map((item, position) => {
                        /// [ [H,,,],[C,,,],[R,,,],[R,,,],[C,,,],[R,,,],[R,,,] ]

                        let customerID;

                        if (item[0][0] === "H") {
                            headerID = item[position + 1];
                            ObjHead = {
                                "Meter Reading Unit": item[position + 1],
                                "Number of Read": item[position + 2],
                                "Number of Actual Read": item[position + 3],
                                "Total consumption-kWh": item[position + 4],
                                "Total Demand-kW": item[position + 5],
                                "Scheduled meter reading date": item[position + 6],
                                "PTC No.": item[position + 7],
                                "MR reason": item[position + 8],
                                "Portion": item[position + 9],
                            };
                            ObjArr['header'] = ObjHead;
                            ArrObj.push(ObjArr);
                        }

                        if (item[0][0] === "C") {
                            customerID = item[2];
                            customer = {
                                "Meter Reading Unit": item[1],
                                "PEA_No": item[2],
                                "Contract_Account": item[3],
                                "Meter Type": item[4],
                                "Manufacturer + Model": item[5],
                                "Multiply Factor": item[6],
                                "Customer address": item[7],
                                "Actual meter reading date": item[8],
                                "Actual meter reading time": item[9],
                                "Actual upload date": item[10],
                                "Reading Code": item[11],
                                "Sealed at meter box": item[12],
                                "Sealed at meter": item[13],
                                "Sealed at cover": item[14],
                                "Sealed at Reset Demand": item[15],
                                "Error Code": item[16],
                                "Warning Code": item[17],
                                "Current active rate": item[18],
                                "Incorrect time (min)": item[19],
                                "Seal no. at reset": item[20],
                                "Seal no. at meter box": item[21],
                                "Device Plate": item[22],
                                "Old key": item[23],
                                "Reserved": item[24],
                                "Register": []
                            };
                            if (headerID === item[1]) {
                                customerArray.push(customer);
                                let cusFilter = customerArray.filter(v => v["Meter Reading Unit"] === headerID);
                                ObjArr['customer'] = cusFilter;
                            }
                        }

                        //Find Register
                        if (customerID === item[0][2]) {
                            RegisterGroup.push(item);
                            RegisterGroup.sort((a, b) => a[2] - b[2] || a[5] - b[5] || a[6] - b[6]);
                            registerToFill = RegisterGroup.filter((e, i) => e[2] === item[2]);
                            // isAmi ? registerToFill.length >= 31 : 
                            if (isAmi ? registerToFill.length >= 31 : registerToFill.length >= 18) {
                                customer.Register = registerToFill; //flat()
                                RegisterGroup = [];
                            }
                        }
                    });
                });
                // return ArrObj
                cb(ArrObj);
            };

            // Read the file as a text
            reader.readAsText(file, "TIS-620");
        });
    });
    // At this point you'll have an array of results

    let res = await Promise.all(files);
    // console.log(_.differenceWith(res[0], res[1], _.isEqual));
    return res;
};

//SubString
function HeaderFn(str) {
    let expect_len = 72;
    let getHead = str.slice(1, 9);
    str.length !== expect_len && headerFailedPosition.push([getHead, str, str.length + '/' + expect_len]);


    let combineArr = [];
    let arr = [[0, 1], [2, 9], [10, 13], [14, 17], [18, 34], [35, 51], [52, 59], [60, 62], [63, 64], [65, 72]];

    for (let [index, elem] of arr.entries()) {
        let sub = str.substring(elem[0] - 1, elem[1]);
        combineArr.push(sub);
    }
    return combineArr;
}

function CustomerFn(str) {
    let expect_len = 163;
    let getCus = str.slice(19, 31);
    str.length !== expect_len && CustomerFailedPosition.push([getCus, str, str.length + '/' + expect_len]);
    let combineArr = [];
    let arr = [[0, 1], [2, 9], [10, 19], [20, 31], [32, 39], [40, 59], [60, 69], [70, 77], [78, 85], [86, 89], [90, 97], [98, 98], [99, 99], [100, 100], [101, 101], [102, 102], [103, 112], [113, 122], [123, 123], [124, 127], [128, 132], [133, 137], [138, 143], [144, 160], [161, 164]];

    for (let [index, elem] of arr.entries()) {
        let sub = str.substring(elem[0] - 1, elem[1]);
        combineArr.push(sub);
    }
    return combineArr;
}

function RegisterFn(str) {
    let expect_len = 144;
    let getCus = str.slice(9, 17);
    str.length !== expect_len && RegisterFailedPosition.push([getCus, str, str.length + '/' + expect_len]);
    let combineArr = [];
    let arr = [[0, 1], [2, 9], [10, 19], [20, 22], [23, 42], [43, 44], [45, 52], [53, 67], [68, 82], [83, 83], [84, 84], [85, 87], [88, 88], [89, 98], [99, 108], [109, 123], [124, 138], [139, 142], [143, 144]];

    for (let [index, elem] of arr.entries()) {
        let sub = str.substring(elem[0] - 1, elem[1]);
        combineArr.push(sub);
    }
    return combineArr;
}
//020000530392 ///6500652119

let obj_To_XLS;
let data_to_export;
let arr = [];
let objH = [];
let objC = [];
let arrMisMatch = [];
let objRegister = [];

const callback = (e) => {
    count++;
    obj_To_XLS = e;

    /////////// REGISTER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    let register_map = obj_To_XLS;

    register_map.map(({ customer }) => customer.map(({ PEA_No, Register }) => objRegister.push({ [PEA_No.trim()]: Register })));

    if (count === 2) {
        let new_sorted_1 = objRegister.sort((a, b) => Object.keys(a) - Object.keys(b));

        const result = new_sorted_1.map((obj, index, arr) => {
            Object.values(obj).map((v, i) => {
                v.map((o) => {
                    const removeValFromIndex = [8, 15, 16];
                    for (const a of removeValFromIndex) {
                        o.splice(a, 1);
                    }
                });
            });
            if (index % 2 === 0 && index + 1 < arr.length) {
                const obj2 = arr[index + 1];
                return { obj, obj2 };
            }
            return { obj };
        }).filter((obj) => obj.obj2 !== undefined);

        console.log(result);

        const data = result;
        let differences = [];

        for (let item of data) {
            let obj = Object.values(item.obj);
            let objNext = Object.values(item.obj2);

            if (obj.length !== objNext.length) {
                console.log("obj and obj_next are different lengths");
            } else {
                for (let i = 0; i < obj.length; i++) {
                    for (let j = 0; j < obj[i].length; j++) {
                        if (JSON.stringify(obj[i][j]) !== JSON.stringify(objNext[i][j])) {
                            differences.push([obj[i][j], objNext[i][j]]);
                        }
                        // if (obj[i][j] !== objNext[i][j]) {
                        //     differences.push([obj[i][j], objNext[i][j]]);
                        // }
                    }
                }
            }
        }

        console.log(differences);

        // for (let item of result) {
        //     const obj_val = Object.values(item.obj);
        //     const objNext_val = Object.values(item.nextObj);
        //     const differences = [];

        //     for (let i = 0; i < obj_val.length; i++) {
        //         for (let j = 0; j < obj_val[i].length; j++) {
        //             const obj_ = JSON.stringify(obj_val[i][j]);
        //             const objNext_ = JSON.stringify(objNext_val[i][j]);
        //             if (obj_ !== objNext_) {
        //                 differences.push([obj_val[i][j], objNext_val[i][j]]);
        //             }
        //         }
        //     }
        //     if (differences.length > 0) {
        //         console.log(`obj and obj_next have ${differences.length} difference(s):`);
        //         for (let d of differences) {
        //             console.log(`- ${JSON.stringify(d[0])} (obj) vs ${JSON.stringify(d[1])} (obj_next)`);
        //         }
        //     } else {
        //         console.log("obj and obj_next are identical");
        //     }
        // }
    }

    // HEADER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    let obHead = obj_To_XLS.map((o) => o.header);

    objH.push({ ...obHead });
    const arrObjH = Object.values(objH);

    if (count == 2) {
        const o1_mapH = arrObjH[0];
        const o2_mapH = arrObjH[1];

        let map1H = Object.values(o1_mapH).map((o) => o);
        let map2H = Object.values(o2_mapH).map((o) => o);

        if (map1H.length === map2H.length) {
            // let o1H = map1H.map(({ ["Number of Actual Read"]: numAcRead, ...o }) => o);
            // let o2H = map2H.map(({ ["Number of Actual Read"]: numAcRead, ...o }) => o);
            let o1H = map1H;
            let o2H = map2H;

            Object.keys(o1H).map((o, i) => {
                let numeric = new RegExp(/^\d+$/).test(map2H[o]["Number of Actual Read"]);
                let isMatch = _.isEqual(o1H[o], o2H[i]);
                if (!numeric) {
                    if (!isMatch) {
                        const diff_ = difference(o1H[o], o2H[i]);
                        let keyDiff = Object.keys(diff_.fullKey_details);
                        let concatKeyFailed = keyDiff.join(",");
                        let arr_concat = diff_.arr.join(",");
                        let warn_obj = { ["warning_mistake"]: concatKeyFailed, ["warning_details"]: arr_concat };
                        Object.assign(map2H[o], warn_obj);
                        arrMisMatch.push({ "header": map2H[i] });
                    }
                }
            });
        }
        let headMisMatchFiltered = arrMisMatch.filter((v) => v.header);
        localStorage.setItem('header', JSON.stringify(headMisMatchFiltered));
        arrMisMatch.length > 0 && grid_HEAD_report3(headMisMatchFiltered);
    }

    // CUSTOMER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    let objcus = obj_To_XLS.map((o) => o.customer);

    data_to_export = objcus.flat();
    const newArray = data_to_export.map(({ Register, ...keepAttrs }) => keepAttrs);
    objC.push({ ...newArray });

    const arrObjC = Object.values(objC);
    if (count == 2) {
        const o1_map = arrObjC[0];
        const o2_map = arrObjC[1];

        let map1 = Object.values(o1_map).map((o) => o);
        let map2 = Object.values(o2_map).map((o) => o);

        if (o1_map.length === o2_map.length) {
            // const o1 = map1.map(({ ["Reading Code"]: rc, ["Actual meter reading date"]: ard, ["Actual upload date"]: aud, ["Incorrect time (min)"]: ict, ...o }) => o);
            // const o2 = map2.map(({ ["Reading Code"]: rc, ["Actual meter reading date"]: ard, ["Actual upload date"]: aud, ["Incorrect time (min)"]: ict, ...o }) => o);

            const o1 = Object.values(map1).map((o, i) => _.omit((o), ["Reading Code", "Actual meter reading date", "Actual upload date", "Incorrect time (min)", "Actual meter reading time"]));
            const o2 = Object.values(map2).map((o, i) => _.omit((o), ["Reading Code", "Actual meter reading date", "Actual upload date", "Incorrect time (min)", "Actual meter reading time"]));

            Object.keys(o1).map((o, i) => {
                let isMatch = _.isEqual(o1[o], o2[i]);
                if (!isMatch) {
                    /////// D I FF
                    const diff_ = difference(o1[o], o2[i]);
                    let concatKeyFailed = Object.keys(diff_.fullKey_details).join(",");
                    let warn_obj = { ["warning_mistake"]: concatKeyFailed, ["warning_details"]: diff_.keyFound };
                    Object.assign(map2[o], warn_obj);
                    arrMisMatch.push({ "customer": map2[o] });
                }
            });
        }
    };

    let arr_obj = {};
    Array.from(data_to_export).map(({ Contract_Account, Register }) => {
        //Register L:18
        Register.forEach((element, index) => {
            //['R', 'GRST9800', '27710591  ', '013', '00000000002322946276', '01', '015     ', '000000000012384'] L:19
            if (element[2]) arr_obj["PEA_No"] = element[2].trim();
            if (element[7]) arr_obj[element[6]] = element[7].trim();
            if (element[8]) arr_obj[element[6]] = element[8].trim();
            index === 17 && arr.push({ Contract_Account, ...arr_obj });
        });
    });

    if (arr && count == 2) {
        arr.sort((a, b) => a["PEA_No"] - b["PEA_No"]);
    }

    localStorage.setItem('register', JSON.stringify(arr));

    const app = document.getElementById('app');
    const gridElement = document.createElement('div');
    const grid = canvasDatagrid({
        parentNode: gridElement
    });

    count === 2 && app.append(gridElement);

    grid.addEventListener('rendercell', (e) => {
        if (/000000000000000/.test(e.cell.value)) {
            e.ctx.fillStyle = '#AEEDCF';
        }
        if (e.cell.value.length === 15 && !/^0/.test(e.cell.value)) {
            e.ctx.fillStyle = '#ed6a6a';
        }
    });

    grid.style.width = '100%';
    grid.style.height = '100vh';
    grid.data = arr;

    let miss_CA_sorted = arrMisMatch.filter(({ customer }) => customer).map(({ customer }) => customer);

    localStorage.setItem('customer_mistake', JSON.stringify(miss_CA_sorted));

    function no_match_wrong() {
        if (count == 2) {
            const para = document.getElementById('no_match_wrong');
            para.innerText = "ไม่พบข้อมูลผิดพลาด";
        }
    }
    count === 2 && headerFailedPosition.length > 1 && grid_POS_report2();
    count === 2 && arrMisMatch.length > 0 ? grid_CA_report(miss_CA_sorted) : no_match_wrong();
};


const exportEXCEL = () => {
    if (filename.length === 0) return;
    const worksheet = XLSX.utils.json_to_sheet(arr);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'a');
    XLSX.writeFile(workbook, "test.xlsx", { compression: true });
};

function createNewNode(item) {
    const type_name = Object.keys(item)[0];
    const value = Object.values(item)[0];

    let string_html = [];

    for (const [key, val] of Object.entries(value)) {
        string_html.push(`<p> <b>${key}</b> : ${val}</p>`);
    }

    let html = `
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${type_name}</title>
        </head>
        <body>
        ${string_html.map((v) => v).join(" ")}
        <hr />
        </body >
      </html>
        `;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);


    if (type_name === "header") {
        const node = document.createElement('a');
        node.href = url;
        node.setAttribute('target', '_blank');
        const textNode = document.createTextNode(`<<<สายจดผิดพลาด ${value["Meter Reading Unit"]}>>>`);
        node.appendChild(textNode);
        document.getElementById('missMatch').appendChild(node);
    }
}

function grid_CA_report(data_report) {
    return new Grid({
        columns: [
            { id: "Contract_Account", name: "ข้อมูลผู้ใช้ผิดพลาด", width: '25%', formatter: (_, row) => html(`<a href="${window.location.origin}/wrong/report${isAmi ? 2 : "s"}.html?ca=${row.cells[0].data}&pea=${row.cells[1].data}" target='_blank'>${row.cells[0].data}</a>`) },
            { id: "PEA_No", name: "รหัสผู้ใช้ไฟ", width: '25%' },
            { id: "warning_mistake", name: "สาเหตุผิดพลาด", width: '25%', formatter: (_, row) => html((row.cells[2].data).split(",").map((v) => `<p style="color:#ff7575">${v}</p>`)) }
        ],
        pagination: { limit: 10 },
        data: data_report,
        sort: true,
        style: {
            th: {
                'background-color': "#ecd3ff",
                "color": "black",
            }
        }
    }).render(document.getElementById("wrapper"));
}

function grid_POS_report2() {
    let mergeArr = _.union(headerFailedPosition, CustomerFailedPosition, RegisterFailedPosition);
    return new Grid({
        columns: [{ name: 'ตำแหน่งผิดพลาด' }, { name: 'รายละเอียด', width: '60%' }, { name: 'จำนวนตำแหน่ง' }],
        pagination: { limit: 10 },
        data: mergeArr,
        sort: true,
        search: true,
        style: {
            th: {
                'background-color': "#bcffda",
                "color": "black",
            }
        }
    }).render(document.getElementById("wrapper2"));
}

function grid_HEAD_report3(value) {
    let header_filtered = value.map(({ header }) => header);
    return new Grid({
        columns: [
            { id: "Meter Reading Unit", name: "สายจดหน่วยผิดพลาด", width: '25%', formatter: (_, row) => html(`<a href="${window.location.origin}/wrong/header.html?head=${row.cells[0].data}" target='_blank'>${row.cells[0].data}</a>`) },
            { id: "warning_details", name: "รายละเอียดผิดพลาด", width: '25%', formatter: (_, row) => html((row.cells[1].data).split(" ").map((v) => `<p style="color:#ff7575">${v}</p>`)) },
            { id: "warning_mistake", name: "หัวข้อผิดพลาด", width: '25%', formatter: (_, row) => html((row.cells[2].data).split(",").map((v) => `<p style="color:#ff7575">${v}</p>`)) }
        ],
        pagination: { limit: 10 },
        data: header_filtered,
        sort: true,
        style: {
            th: {
                'background-color': "#d9d8ff",
                "color": "black",
            }
        }
    }).render(document.getElementById("wrapper3"));
}


function findDiff(str1, str2) {
    let diff = "";
    str2.split('').forEach(function (val, i) {
        if (val != str1.charAt(i)) diff += val;
    });
    return diff;
}


document.getElementById("export_to_xls").addEventListener('click', exportEXCEL);

var dropzone = document.getElementById('dropzone');
var dropzone_input = dropzone.querySelector('.dropzone-input');

['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function (event) {
    dropzone.addEventListener(event, function (e) {
        e.preventDefault();
        e.stopPropagation();
    });
});

dropzone.addEventListener('dragover', function (e) {
    this.classList.add('dropzone-dragging');
}, false);

dropzone.addEventListener('dragleave', function (e) {
    this.classList.remove('dropzone-dragging');
}, false);

dropzone.addEventListener('click', function (e) {
    dropzone_input.click();
});

dropzone.addEventListener('change', (e) => upload(e.target.files, callback));


dropzone.addEventListener('drop', function (e) {
    this.classList.remove('dropzone-dragging');
    var file = e.dataTransfer.files;
    textDrop.innerHTML = file[0].name;
    upload(file, callback);
});

const clearButton = document.getElementById('clear');

clearButton.addEventListener('click', () => {
    window.location.reload();
    localStorage.clear();
});
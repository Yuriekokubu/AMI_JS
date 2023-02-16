// import { hello } from './module.js';
const textDrop = document.getElementById('text-drop');
let filename = [];


const upload = async (event, cb) => {
    // Convert the FileList into an array and iterate
    if (event.length > 2) {
        alert('Maximum files input by 2');
        return;
    }
    let files = Array.from(event).map((file, i) => {

        filename.push(file.name);
        filename > 1 ? filename.join('') : filename[0];

        textDrop.innerHTML = filename;
        // Define a new file reader
        let reader = new FileReader();

        // Create a new promise
        return new Promise((resolve, reject) => {

            // Resolve the promise after reading file
            reader.onload = () => {
                let data = reader.result;
                let newArray = data.split(/\r?\n/);
                resolve(newArray);

                // document.getElementById('output')
                //     .textContent = fr.result;

                //H=72 //C=163 //R=144
                let ArrayIndex = [];

                //Find Head Index
                for (let [index, elem] of newArray.entries()) {
                    let firstChar = elem.charAt(0);
                    if (elem.length == 72 || 84 && firstChar === "H") ArrayIndex.push(index);
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
                        elem.length >= 72 && firstCharH === "H" && Arr_sorted.push(HeaderFn(elem));
                        elem.length >= 160 && firstCharC === "C" && Arr_sorted.push(CustomerFn(elem));
                        elem.length >= 144 && firstCharR === "R" && Arr_sorted.push(RegisterFn(elem));
                    }
                    return Arr_sorted;
                });

                let ObjHeader = {};
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
                                "PEA No.": item[2],
                                "Contract Account": item[3],
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
                        if (item.length === 19 && customerID === item[0][2]) {
                            RegisterGroup.push(item);
                            RegisterGroup.sort((a, b) => a[2] - b[2] || a[5] - b[5] || a[6] - b[6]);
                            registerToFill = RegisterGroup.filter((e, i) => e[2] === item[2]);
                            if (registerToFill.length >= 18) {
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
            reader.readAsText(file, "UTF-8");
        });

    });

    // At this point you'll have an array of results

    let res = await Promise.all(files);
    // console.log(_.differenceWith(res[0], res[1], _.isEqual));
    return res;
};

//SubString
function HeaderFn(str) {
    let combineArr = [];
    let arr = [[0, 1], [2, 9], [10, 13], [14, 17], [18, 34], [35, 51], [52, 59], [60, 62], [63, 64], [65, 72]];

    for (let [index, elem] of arr.entries()) {
        let sub = str.substring(elem[0] - 1, elem[1]);
        combineArr.push(sub);
    }
    return combineArr;
}

function CustomerFn(str) {
    let combineArr = [];
    let arr = [[0, 1], [2, 9], [10, 19], [20, 31], [32, 39], [40, 59], [60, 69], [70, 77], [78, 85], [86, 89], [90, 97], [98, 98], [99, 99], [100, 100], [101, 101], [102, 102], [103, 112], [113, 122], [123, 123], [124, 127], [128, 132], [133, 137], [138, 143], [144, 160], [161, 164]];

    for (let [index, elem] of arr.entries()) {
        // if (elem[0] == 70) {
        //     let sub = str.substring(elem[0] - 1, elem[1]);
        //     let matchAddress = sub.charCodeAt() !== 32 ? sub.match(/[0-9&/]/g)?.join("") : sub;
        //     combineArr.push(matchAddress);
        // } else {
        let sub = str.substring(elem[0] - 1, elem[1]);
        combineArr.push(sub);
        // }
    }
    return combineArr;
}

function RegisterFn(str) {
    let combineArr = [];
    let arr = [[0, 1], [2, 9], [10, 19], [20, 22], [23, 42], [43, 44], [45, 52], [53, 67], [68, 82], [83, 83], [84, 84], [85, 87], [88, 88], [89, 98], [99, 108], [109, 123], [124, 138], [139, 142], [143, 144]];

    for (let [index, elem] of arr.entries()) {
        let sub = str.substring(elem[0] - 1, elem[1]);
        combineArr.push(sub);
    }
    return combineArr;
}

let obj_To_XLS;
let data_to_export;
let result;
let arr = [];
let count = 0;

const callback = (e) => {
    count++;
    obj_To_XLS = e;

    const app = document.getElementById('app');
    const gridElement = document.createElement('div');
    const grid = canvasDatagrid({
        parentNode: gridElement
    });
    let objcus = obj_To_XLS.map((o) => o.customer);

    data_to_export = objcus.flat();

    let arr_obj = {};

    Array.from(data_to_export).map(({ Register }) => {
        //Register L:18
        Register.forEach((element, index) => {
            //['R', 'GRST9800', '27710591  ', '013', '00000000002322946276', '01', '015     ', '000000000012384'] L:19
            if (element[2]) arr_obj["PEA No."] = element[2];
            if (element[7]) arr_obj[`${element[6]}Previous meter reading`] = element[7];
            if (element[8]) arr_obj[`${element[6]}Current meter reading`] = element[8];
            index === 17 && arr.push({ ...arr_obj });

            for (const elem of element) {
                if (elem.length === 15 && !/^0/.test(elem)) {
                    alert('ไฟล์ไม่ตรง');
                }
            }
        });
    });

    if (arr) {
        arr.sort((a, b) => a["PEA No."] - b["PEA No."]);
    }

    count === 2 && Array.from(arr, (e, i) => {
        let result = i === 0 ? _.isEqual(arr[i], arr[i + 1]) : _.isEqual(arr[i * 2], arr[(i * 2) + 1]);
        console.log(result);
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

};

const exportEXCEL = () => {
    if (filename.length === 0) return;
    const worksheet = XLSX.utils.json_to_sheet(arr);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'a');
    XLSX.writeFile(workbook, "test.xlsx", { compression: true });
};

document.getElementById("export_to_xls").addEventListener('click', exportEXCEL);

var dropzone = document.getElementById('dropzone');
var dropzone_input = dropzone.querySelector('.dropzone-input');
var multiple = dropzone_input.getAttribute('multiple') ? true : false;

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

clearButton.addEventListener('click', () => window.location.reload());
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
const data = {
    values: [],
    pages: 0,
    totalValues: 0,
    currentPage: 1,
    perPage: 0,
    twoDimArray: [],
    filtered: []
};
let filterMode = false;
const table = (_a = document.querySelector('table')) === null || _a === void 0 ? void 0 : _a.lastElementChild;
const totalPrice = document.getElementById('totalPrice');
const pageContainer = document.getElementById('page-container');
const perPage = document.getElementById('per-page');
const searchInput = document.getElementById('search-input');
perPage.addEventListener('change', () => {
    onPageSelectChange();
});
// call this everu time per page selection change
const onPageSelectChange = () => {
    data.perPage = Number(perPage.options[perPage.selectedIndex].value);
    makePaginate(filterMode ? data.filtered : data.values);
};
// get data from server and fire onPageSelectChange function for first time
const getData = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield fetch("https://jsonplaceholder.typicode.com/posts");
    yield result.json().then((response) => {
        // add price and fligh number to each item
        data.values = response.map((item) => {
            return Object.assign(Object.assign({}, item), { id: randomDidit(), userId: randomDidit() });
        });
        data.totalValues = response.length;
    });
    onPageSelectChange();
});
const changePage = (e) => {
    data.currentPage = Number(e.target.textContent);
    renderTableRows(data.twoDimArray[data.currentPage - 1]);
    makePaginate(filterMode ? data.filtered : data.values);
};
// create pages row below data list on condition of perPage selection
const makePaginate = (dataToPage) => {
    data.pages = dataToPage.length / data.perPage;
    if (data.pages > 1) {
        pageContainer.innerHTML = Array(Math.ceil(data.pages)).fill("").map((page, index) => {
            return `
                <span onclick="changePage(event)" class="cursor-pointer bg-indigo-500 hover:bg-indigo-800 w-[30px] h-[30px] p-1 rounded-full flex items-center justify-center ${data.currentPage === index + 1 ? 'active-page' : null}">${index + 1}</span>
            `;
        }).join('');
    }
    else {
        pageContainer.innerHTML = "";
    }
    createTwoDimArray(filterMode ? data.filtered : data.values);
};
//paginate creation core & logic is here
//create two dimensional array and calculate totalPrice
const createTwoDimArray = (dataToConvert) => {
    // calc total price
    let total = 0;
    let currentArray = [];
    let result = [];
    dataToConvert.forEach((item, index) => {
        currentArray.push(item);
        total += item.userId;
        // check if index is dividable to perPage number, so it break the array
        if ((index + 1) % (data.perPage) === 0) {
            result.push(currentArray);
            currentArray = [];
        }
    });
    result.push(currentArray);
    data.twoDimArray = result;
    renderTableRows(result[data.currentPage - 1]);
    totalPrice.textContent = `فروش کل : ${total.toLocaleString()} تومان`;
};
//creat random fake number for price and flight Number
const randomDidit = () => {
    return Math.floor(Math.random() * 999999);
};
// render each page data into table body as a row
function renderTableRows(data) {
    table.innerHTML = "... Loading";
    table.innerHTML = data.map((item, index) => {
        const price = item.id;
        return ` <tr class="hover:bg-amber-100 cursor-pointer">
                            <td class="border border-gray-400 px-3 py-2">${index + 1}</td>
                            <td class="border border-gray-400 px-3 py-2">${item.title.substring(0, 30)}</td>
                            <td class="border border-gray-400 px-3 py-2">${item.userId}</td>
                            <td class="border border-gray-400 px-3 py-2">${item.id.toLocaleString()} تومان</td>
                            <td class="border border-gray-400 px-3 py-2">${item.body.substring(0, 70)}</td>
                            
                </tr>`;
    }).join("");
}
//live search
searchInput === null || searchInput === void 0 ? void 0 : searchInput.addEventListener('keyup', () => {
    if (searchInput.value.trim().length > 0) {
        const result = data.values.filter((item) => {
            return item.title.includes(searchInput.value)
                || item.body.includes(searchInput.value)
                || String(item.id).includes(searchInput.value)
                || String(item.userId).includes(searchInput.value);
        });
        filterMode = true;
        data.filtered = result;
    }
    else {
        filterMode = false;
    }
    data.currentPage = 1;
    renderTableRows(filterMode ? data.filtered : data.values);
    makePaginate(filterMode ? data.filtered : data.values);
});
getData();

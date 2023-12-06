type ObjData = {
    values: Item[],
    pages: number,
    totalValues: number,
    currentPage: number,
    perPage: number,
    twoDimArray: Item[],
    dataClone: Item[]
}
const data = {
    values: [],
    pages: 0,
    totalValues: 0,
    currentPage: 1,
    perPage: 0,
    twoDimArray: [],
    filtered: []
}
let filterMode: boolean = false

const table = document.querySelector('table')?.lastElementChild! as HTMLTableElement;
const totalPrice = document.getElementById('totalPrice') as HTMLElement
const pageContainer = document.getElementById('page-container') as HTMLElement
const perPage = document.getElementById('per-page') as HTMLSelectElement
const searchInput = document.getElementById('search-input') as HTMLInputElement

perPage.addEventListener('change', () => {
    onPageSelectChange()
})

// call this every time perpage selection change
const onPageSelectChange = () => {
    data.perPage = Number(perPage.options[perPage.selectedIndex].value)
    makePaginate(filterMode ? data.filtered : data.values)
}

// get data from server and fire onPageSelectChange function for first time
const getData = async () => {
    const result = await fetch("https://jsonplaceholder.typicode.com/posts")
    await result.json().then((response) => {

        // add price and fligh number to each item
        data.values = response.map((item: Item) => {
            return {...item, id: randomDidit(), userId: randomDidit()}
        });        

        data.totalValues = response.length;        
    })

    onPageSelectChange()
}

const changePage = (e: any) => {
    data.currentPage = Number(e.target.textContent)
    renderTableRows(data.twoDimArray[data.currentPage - 1])
    makePaginate(filterMode ? data.filtered : data.values)
}

// create pages row below data list on condition of perPage selection
const makePaginate = (dataToPage: Item[]) => {
    data.pages = dataToPage.length / data.perPage

    if(data.pages > 1) {
        pageContainer.innerHTML = Array(Math.ceil(data.pages)).fill("").map((page, index) => {
            return `
                <span onclick="changePage(event)" class="cursor-pointer bg-indigo-500 hover:bg-indigo-800 w-[30px] h-[30px] p-1 rounded-full flex items-center justify-center ${data.currentPage === index + 1 ? 'active-page' : null}">${index + 1}</span>
            `
        }).join('')
    } else {
        pageContainer.innerHTML = ""
    }

    createTwoDimArray(filterMode ? data.filtered : data.values)

}

//paginate creation core & logic is here
//create two dimensional array and calculate totalPrice
const createTwoDimArray = (dataToConvert: Item[]) => {

    // calc total price
    let total: number = 0;

    let currentArray: Item[] = []
    let result: any = []
    dataToConvert.forEach((item: Item, index) => {        
    
        currentArray.push(item)
        total += item.id

        // check if index is dividable to perPage number, so it break the array
        if((index + 1) % (data.perPage) === 0) {
            result.push(currentArray);
            currentArray = []
        }
    })   
    result.push(currentArray);

    data.twoDimArray = result

    renderTableRows(result[data.currentPage - 1])
    totalPrice.textContent = `فروش کل : ${total.toLocaleString()} تومان`;
}

//creat random fake number for price and flight Number
const randomDidit = () :number => {
    return Math.floor(Math.random() * 999999)
}

type Item = {
    body: string, 
    id: number,
    title: string,
    userId: number,
}

// render each page data into table body as a row
function renderTableRows (data: Item[]) {
    table.innerHTML = "... Loading"

    table.innerHTML = data.map((item: Item, index: number): string => {
        
        const price = item.id;

        return ` <tr class="hover:bg-amber-100 cursor-pointer">
                            <td class="border border-gray-400 px-3 py-2">${index + 1}</td>
                            <td class="border border-gray-400 px-3 py-2">${item.title.substring(0, 30)}</td>
                            <td class="border border-gray-400 px-3 py-2">${item.userId}</td>
                            <td class="border border-gray-400 px-3 py-2">${item.id.toLocaleString()} تومان</td>
                            <td class="border border-gray-400 px-3 py-2">${item.body.substring(0, 70)}</td>
                            
                </tr>`
    }).join("")

}

//live search
searchInput?.addEventListener('keyup', () => {  

    if(searchInput.value.trim().length > 0) {
        const result = data.values.filter((item: Item) :boolean => {
            return item.title.includes(searchInput.value) 
            || item.body.includes(searchInput.value) 
            || String(item.id).includes(searchInput.value) 
            || String(item.userId).includes(searchInput.value);
        })
        filterMode = true
        data.filtered = result
      
    } else {
         filterMode = false
    }

    data.currentPage = 1
    renderTableRows(filterMode ? data.filtered : data.values)
    makePaginate(filterMode ? data.filtered : data.values)
})

getData()
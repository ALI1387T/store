let addCategoryBtn = document.querySelector("#add-category-btn")
let hiddenCategoryBtn = document.querySelector("#hidden-category-btn")
let categoryParent = document.querySelector(".categoris")
let addCategoryName = document.querySelector("#category-name")
let addProductName = document.querySelector("#add-product-name")
let addProductPrice = document.querySelector("#add-product-price")
let addProductQuantity = document.querySelector("#add-product-quantity")
let addProductCategory = document.querySelector("#add-product-category")
let addProductBtn = document.querySelector("#add-product-btn")
let searchBox = document.querySelector("#search")
let filterCategorySelect = document.querySelector("#filter-category")
let products = document.querySelector("#products")
let exportFileBtn = document.querySelector("#export")
let importFileBtn = document.querySelector("#import")

function hiddenCategory() {
    if (hiddenCategoryBtn.innerHTML == "hidden") {
        categoryParent.style.display = "none"
        Array.from(categoryParent.children).forEach(elememt => (elememt.style.borderBottom = "none"))
        hiddenCategoryBtn.innerHTML = "show"
    } else {
        categoryParent.style.display = "flex"
        Array.from(categoryParent.children).forEach(elememt => (elememt.style.borderBottom = "0.01rem solid gray"))
        hiddenCategoryBtn.innerHTML = "hidden"
    }
}

function addCategoryHTMLFormat(name) {
    return `<div class="category">
    <p class="category-name">${name}</p>
    <div>
        <button class="delete-category-with-items"><i class="fa-solid fa-trash-can"></i> Delete with items</button>
        <button class="delete-category"><i class="fa-regular fa-trash-can"></i> Delete</button>
    </div>
    </div> `
}

function addProductHTMLFormat(name, date, price, quantity, categoryName) {
    return `<div class="product">
    <h3 class="product-name">${name}</h3>
    <span>
        <p class="date">${date}</p>
        <p class="product-price"><i class="fa-solid fa-dollar-sign"></i> ${price}</p>
        <p class="product-quantity">${quantity}</p>
        <p class="product-category"><i class="fa-solid fa-list"></i> ${categoryName}</p>
        <button class="edit-product"><i class="fa-solid fa-pen"></i> Edit</button>
        <button class="delete-product"><i class="fa-solid fa-trash-can"></i> Delete</button>
    </span>
</div>`
}

function addCategory() {
    if (!addCategoryName.value) {
        addCategoryName.classList.add("empty-value")
        return
    }
    const categoryItem = []
    Array.from(categoryParent.children).forEach(i => categoryItem.push(i.children[0].innerHTML))

    hiddenCategory()
    categoryItem.indexOf(addCategoryName.value) == -1 && (categoryParent.innerHTML += addCategoryHTMLFormat(addCategoryName.value))
    CategoryToLocalStorage()
    category()
    addCategoryName.value = ""
    hiddenCategory()
}

function deleteCategory(e) {
    if (e.target.className == "delete-category") {
        Array.from(products.children).forEach(elememt => {
            if (elememt.children[1].children[3].innerText.trim() == e.target.parentElement.parentElement.children[0].innerHTML) {
                elememt.children[1].children[3].innerHTML = `<i class="fa-solid fa-list"></i> global`
            }
        })
        e.target.parentElement.parentElement.remove()
        productToLocalStorage()
        CategoryToLocalStorage()
        category()
    }
}

function deleteCategoryWithItem(e) {
    if (e.target.innerText.trim() == "Delete with items") {
        Array.from(products.children).forEach(elememt => {
            if (elememt.children[1].children[3].innerText.trim() == e.target.parentElement.parentElement.children[0].innerText) {
                elememt.remove()
            }
        })
        e.target.parentElement.parentElement.remove()
        productToLocalStorage()
        CategoryToLocalStorage()
        category()
    }
}

function CategoryToLocalStorage() {
    const categoryArray = []
    Array.from(categoryParent.children).forEach(e => categoryArray.push(e.children[0].innerHTML))
    localStorage.setItem("category", JSON.stringify(categoryArray))
}

function localStorageToCategory() {
    let items = JSON.parse(localStorage.getItem("category"))
    items && items.forEach(item => (categoryParent.innerHTML += addCategoryHTMLFormat(item)))
}

function productToLocalStorage() {
    const productArray = []
    Array.from(products.children).forEach(e =>
        productArray.push({
            name: e.children[0].innerText,
            date: e.children[1].children[0].innerText,
            price: e.children[1].children[1].innerText.trim(),
            quantity: e.children[1].children[2].innerText,
            category: e.children[1].children[3].innerText.trim(),
        })
    )
    localStorage.setItem("products", JSON.stringify(productArray))
}

function addProduct() {
    if (!addProductName.value || !addProductPrice.value || !addProductQuantity.value) {
        Array.from(addProductBtn.parentElement.parentNode.children).forEach(e => (!e.value ? e.classList.add("empty-value") : false))
        return
    }
    const productItem = []
    Array.from(products.children).forEach(i => productItem.push(i.children[0].innerHTML))

    const date = new Intl.DateTimeFormat("fa").format(new Date())
    productItem.indexOf(addProductName.value) == -1 &&
        (products.innerHTML += addProductHTMLFormat(
            addProductName.value,
            date,
            new Intl.NumberFormat("en").format(addProductPrice.value.replace(/,/g, "")),
            addProductQuantity.value,
            addProductCategory.value == "category" ? "global" : addProductCategory.value
        ))
    addProductBtn.parentElement.parentElement.childNodes.forEach(e => (e.type == "text" || e.type == "number" ? (e.value = "") : false))
    productToLocalStorage()
}

function deleteProduct(e) {
    if (e.target.innerText.trim() == "Delete") e.target.parentElement.parentElement.remove()
    productToLocalStorage()
}

function localStorageToProduct() {
    const items = JSON.parse(localStorage.getItem("products"))
    items && items.forEach(e => (products.innerHTML += addProductHTMLFormat(e.name, e.date, e.price, e.quantity, e.category)))
}

function category() {
    let items = JSON.parse(localStorage.getItem("category"))
    addProductCategory.innerHTML = "<option selected hidden>category</option> <option>global</option>"
    filterCategorySelect.innerHTML = "<option selected>all category</option> <option>global</option>"
    items &&
        items.forEach(item => {
            addProductCategory.innerHTML += `<option>${item}</option>`
            filterCategorySelect.innerHTML += `<option>${item}</option>`
        })
}

function filterCategory() {
    Array.from(products.children).forEach(element => {
        if (filterCategorySelect.value == "all category") {
            element.style.display = "flex"
        } else {
            if (element.children[1].children[3].innerText.trim() == filterCategorySelect.value) {
                element.style.display = "flex"
            } else {
                element.style.display = "none"
            }
        }
    })
}

function search() {
    const searchedItem = searchBox.value
    Array.from(products.children).forEach(element => {
        if (element.children[0].innerText.trim().toLowerCase().includes(searchedItem.toLowerCase())) {
            element.style.display = "flex"
        } else {
            element.style.display = "none"
        }
    })
}

function importFile(e) {
    e.preventDefault()
    let input = document.querySelector("#import-input")
    input.click()

    input.addEventListener(
        "change",
        () => {
            const categoryItem = []
            Array.from(categoryParent.children).forEach(i => categoryItem.push(i.children[0].innerHTML))

            const productItem = []
            Array.from(products.children).forEach(i => productItem.push(i.children[0].innerHTML))

            const file = input.files[0].text()
            const fileText = file.then(rawData => JSON.parse(rawData))

            fileText.then(data => {
                data[0].forEach(categories => {
                    Array.from(categoryParent.children).forEach(i => categoryItem.push(i.children[0].innerHTML))
                    hiddenCategory()
                    categoryItem.indexOf(categories) == -1 && (categoryParent.innerHTML += addCategoryHTMLFormat(categories))
                    CategoryToLocalStorage()
                    hiddenCategory()
                    category()
                })
                data[1].forEach(product => {
                    Array.from(products.children).forEach(i => productItem.push(i.children[0].innerHTML))
                    productItem.indexOf(product.name) == -1 &&
                        (products.innerHTML += addProductHTMLFormat(
                            product.name,
                            product.date,
                            new Intl.NumberFormat("en").format(product.price.replace(/,/g, "")),
                            product.quantity,
                            data[0].indexOf(product.category) == -1 ? "global" : product.category
                        ))
                    productToLocalStorage()
                })
            })
            input.value = ""
        },
        { once: true }
    )
}

function exportFile() {
    let aTag = document.createElement("a")
    let file = new Blob(
        [
            `[\n\t${localStorage.category},\n\t${localStorage.products
                .replace(/\},\{/g, "},\n{")
                .replace(/\{/g, "\t\t{")
                .replace("[", "[\n")
                .replace("]", "\n\t]")}\t\n]`,
        ],
        { type: "application/json" }
    )
    aTag.href = URL.createObjectURL(file)
    aTag.download = "products"
    aTag.click()
}

hiddenCategoryBtn.addEventListener("click", hiddenCategory)
addCategoryBtn.addEventListener("click", addCategory)
addProductBtn.addEventListener("click", addProduct)
exportFileBtn.addEventListener("click", exportFile)
importFileBtn.addEventListener("click", e => importFile(e))
categoryParent.addEventListener("click", e => deleteCategory(e))
categoryParent.addEventListener("click", e => deleteCategoryWithItem(e))
products.addEventListener("click", e => deleteProduct(e))
addCategoryBtn.addEventListener("keydown", e => (e.key == "Enter" ? addCategory() : false))
addProductBtn.addEventListener("keydown", e => (e.key == "Enter" ? addProduct() : false))
filterCategorySelect.addEventListener("change", filterCategory)
searchBox.addEventListener("input", search)
addEventListener("input", e => e.target.classList.remove("empty-value"))

addProductPrice.addEventListener("input", e => {
    if (Number(e.data) || e.data == "0") {
        addProductPrice.value = new Intl.NumberFormat("en").format(addProductPrice.value.replace(/,/g, ""))
    } else if (e.data == null && e.target.value.length > 0) {
        addProductPrice.value = new Intl.NumberFormat("en").format(addProductPrice.value.replace(/,/g, ""))
    } else {
        addProductPrice.value = addProductPrice.value.slice(0, -1)
    }
})

window.addEventListener("load", () => {
    localStorageToCategory()
    localStorageToProduct()
    category()
    hiddenCategory()
    hiddenCategory()
})

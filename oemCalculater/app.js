
//Stroge Controller
const strogeController = (function () {


    return {
        storeProduct:(product)=>{
            let products;
            if(localStorage.getItem('products')===null){
                products=[];
                products.push(product);
          
            }else{
                    products=JSON.parse(localStorage.getItem('products'));
                    products.push(product);
            }
            localStorage.setItem('products',JSON.stringify(products));
        },getProduct:()=>{
            let products;
            if(localStorage.getItem('products')==null){
                products=[];
            }
            else{
                products=JSON.parse(localStorage.getItem('products'));
            }
            return products; 
        },updateProduct:(product)=>{
            let products=JSON.parse(localStorage.getItem('products'));
            products.forEach((prd,index)=>{
                if(product.id==prd.id){
                    products.splice(index,1,product);
                }
            })
            localStorage.setItem('products',JSON.stringify(products))
        },deleteProduct:(id)=>{
            let products=JSON.parse(localStorage.getItem('products'));
            products.forEach((prd,index)=>{
                if(id==prd.id){
                    products.splice(index,1);
                }
            })
            localStorage.setItem('products',JSON.stringify(products))
        }
    }
})();


//Product Contoller

const productController = (function () {

    //private
    const ProductController = function (id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    const data =
    {
        product: strogeController.getProduct(),
        selectedProduct: null,
        totalPrice: 0
    }



    //public
    return {
        getProduct: () => {
            return data.product;
        },
        getData: () => {
            return data
        }, addProduct: (name, price) => {

            let id;
            if (data.product.length > 0) {
                id = data.product[data.product.length - 1].id + 1
            } else {
                id = 0;
            }
            const newProduct = new ProductController(id, name, parseFloat(price));
            data.product.push(newProduct);
            return newProduct;

        }, getTotal: () => {
            var total = 0;
            data.product.forEach(item => {
                total += item.price;
            })
            data.totalPrice = total;
            return data.totalPrice;
        }, getProductById: (id) => {
            let product = null;
            data.product.forEach(function (prd) {
                if (prd.id == id) {
                    product = prd
                }
            })
            return product;
        }, setCurrentProduct: (product) => {
            data.selectedProduct = product;
        }, getCurrentSelectedProduct: () => {
            return data.selectedProduct;
        }, updateProduct: (name, price) => {
            let product = null
            data.product.forEach(item => {
                if (item.id == data.selectedProduct.id) {
                    item.name = name;
                    item.price = parseFloat(price);
                    product = item;
                }
            })
            return product;
        }, deleteProduct: (product) => {
            data.product.forEach((item, index) => {
                if (item.id == product.id) {
                    data.product.splice(index, 1)
                }
            })
        }

    }



})();


//UI controller

const uiController = (function () {

    const selectors = {
        productsList: 'item-list',
        productListItems: '#item-list tr',
        addBtn: 'add',
        update: 'update',
        delete: 'delete',
        cancel: 'cancel',
        productName: 'productName',
        productPrice: 'productPrice',
        hiddenCard: 'hiddenCard',
        tl: 'total-tl',
        dl: 'total-dolar'

    }

    return {
        createProductList: (products) => {
            let html = "";
            products.forEach(element => {
                html +=
                    `
                <tr>
                        <td>${element.id}</td>
                        <td>${element.name}</td>
                        <td>${element.price}</td>
                        <td class="text-end">
                          <i class="fas fa-edit edit-product" > </i>
                        </td>
                </tr>        
            `
            });
            document.getElementById(selectors.productsList).innerHTML = html;
        },
        getSelectors: () => {
            return selectors;
        }, addProduct: (element) => {
            document.getElementById(selectors.hiddenCard).style.display = "block"
            let html = 
                `
                <tr>
                        <td>${element.id}</td>
                        <td>${element.name}</td>
                        <td>${element.price}</td>
                        <td class="text-end">
                             <i class="fas fa-edit edit-product" > </i>
                        </td>
                </tr>        
            `
            document.getElementById(selectors.productsList).innerHTML += html;
        }, clearInputs: () => {
            document.getElementById(selectors.productName).value = "";
            document.getElementById(selectors.productPrice).value = "";
        }, hideCard: () => {
            document.getElementById(selectors.hiddenCard).style.display = "none"
        }, showGetTotal: (total) => {
            document.getElementById(selectors.tl).textContent = total; //duzenin degişecegi gun bugun olsun...
            document.getElementById(selectors.dl).textContent = total * 10;
        }, productTurnToInputs: () => {
            const selectedProduct = productController.getCurrentSelectedProduct()
            document.getElementById(selectors.productName).value = selectedProduct.name;
            document.getElementById(selectors.productPrice).value = selectedProduct.price;
        }, addingState: () => {
            uiController.clearWarnings();
            uiController.clearInputs();
            document.getElementById(selectors.addBtn).style.display = 'inline';
            document.getElementById(selectors.update).style.display = 'none';
            document.getElementById(selectors.delete).style.display = 'none';
            document.getElementById(selectors.cancel).style.display = 'none';
        }, editState: (tr) => {
            tr.classList.add('bg-warning')
            document.getElementById(selectors.addBtn).style.display = 'none';
            document.getElementById(selectors.update).style.display = 'inline';
            document.getElementById(selectors.delete).style.display = 'inline';
            document.getElementById(selectors.cancel).style.display = 'inline';
        }, updateProduct: (product) => {
            let updateItem = null;
            let items = document.querySelectorAll(selectors.productListItems);
            items.forEach(item => {
                if (item.classList.contains('bg-warning')) {
                    item.children[1].textContent = product.name;
                    item.children[2].textContent = product.price + ' $';
                    updateItem = item;
                }
            })


            return updateItem;
        }, clearWarnings: () => {
            const items = document.querySelectorAll(selectors.productListItems)
            items.forEach(item => {
                if (item.classList.contains('bg-warning')) {
                    item.classList.remove('bg-warning')
                }
            })
        }, deleteProduct: () => {
            const items = document.querySelectorAll(selectors.productListItems);
            items.forEach(item => {
                if (item.classList.contains('bg-warning')) {
                    item.remove();
                }
            })
        }
    }
})();


//App Controller

const appController = (function (ProductCtrl, UIctrl,StorageCtrl) {
    const uiSelectors = UIctrl.getSelectors();

    //load Event Listener
    const loadEventListener = () => {
        //add product event
        document.getElementById(uiSelectors.addBtn).addEventListener('click', productAddSubmit);
        document.getElementById(uiSelectors.productsList).addEventListener('click', productEditClick);
        document.getElementById(uiSelectors.update).addEventListener('click', editProductSubmit);
        document.getElementById(uiSelectors.cancel).addEventListener('click', updateCancel);
        document.getElementById(uiSelectors.delete).addEventListener('click', deleteProductSubmit);
    }
    const productAddSubmit = (e) => {

        const productName = document.getElementById(uiSelectors.productName).value;
        const productPrice = document.getElementById(uiSelectors.productPrice).value;
        if (productName !== 0 && productPrice !== 0) {
            const newProduct = ProductCtrl.addProduct(productName, productPrice);
            //add ProductList
            UIctrl.addProduct(newProduct);
            
            //add product to LocalStroge
            StorageCtrl.storeProduct(newProduct)

            //get Total
            const total = ProductCtrl.getTotal()

            UIctrl.showGetTotal(total);

            //clear Inputs
            UIctrl.clearInputs();

        }


        e.preventDefault();
    }
    const productEditClick = (e) => {
        if (e.target.classList.contains('edit-product')) {
            const id =
                e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
            const product = ProductCtrl.getProductById(id);
            ProductCtrl.setCurrentProduct(product);

           

            UIctrl.clearWarnings();

            UIctrl.productTurnToInputs();

            // Add button hidden
            UIctrl.editState(e.target.parentNode.parentNode);


        }

        e.preventDefault();
    }
    const editProductSubmit = (e) => {
        const productName = document.getElementById(uiSelectors.productName).value;
        const productPrice = document.getElementById(uiSelectors.productPrice).value;
        if (productName.length !== '' && productPrice.length !== '') {
            //update product
            const updatedProduct = ProductCtrl.updateProduct(productName, productPrice)

            //update UI
            let item = UIctrl.updateProduct(updatedProduct);

            //get Total
            const total = ProductCtrl.getTotal()

            UIctrl.showGetTotal(total);

            //update Storage

                StorageCtrl.updateProduct(updatedProduct);
            UIctrl.addingState();
        }




        e.preventDefault();
    }
    const updateCancel = (e) => {
        UIctrl.addingState();
        UIctrl.clearWarnings();
        e.preventDefault();
    }
    const deleteProductSubmit = (e) => {
        //get selected Product
        const selectedProduct = ProductCtrl.getCurrentSelectedProduct();

        //delete product 
        ProductCtrl.deleteProduct(selectedProduct);

        //delete UI
        UIctrl.deleteProduct();
        //get Total
        const total = ProductCtrl.getTotal()
        UIctrl.showGetTotal(total);

        //delete from Storage
        StorageCtrl.deleteProduct(selectedProduct.id)

        UIctrl.addingState();


        if (total == 0) {
            UIctrl.hideCard();
        }


        e.preventDefault()
    }
    return {
        init: () => {

            //hide others except addBtn
            UIctrl.addingState()


            const products = ProductCtrl.getProduct();
            if (products.length == 0) {
                UIctrl.hideCard();
            }
            else {
                UIctrl.createProductList(products);
            }
            // get total
            const total = ProductCtrl.getTotal();

            // show total
            UIctrl.showGetTotal(total);

            loadEventListener();
        }
    }

})(productController, uiController,strogeController);

appController.init();
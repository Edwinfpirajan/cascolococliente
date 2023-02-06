import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import ProductService from '../../service/ProductsService'
import axios from 'axios';
import Sidebar from '../../components/sidebar/Sidebar';   
import './products.scss'
import Navbar from '../../components/navbar/Navbar';



const Products = () => {

  let emptyProduct = {
    id: null,
    name: '',
    reference: 0,
    quantity: 0,
    price: 0,
    image: null,
    // inventoryStatus: 'INSTOCK'
  };

  const [products, setProducts] = useState([]);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);
  const productService = new ProductService();

  // useEffect(() => {
  //   productService.getProducts().then(data => setProducts(data));
  // }, []); 

  const baseURL = "http://localhost:3001/api/products/"

  useEffect(() => {
    productService.getProducts()
    .then(res => setProducts(res));

  }, []);


  const updateProduct = (product) => {
    productService.updateProduct()
    .then(res => setProducts(res));

    axios.put(product.id, product)
    .then(res => {
      let _products = [...products];
      let index = findIndexById(product.id);
      _products[index] = product;
      setProducts(_products);
    }
    )

  }

  console.log(products)

  const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'COP' });
  }

  const openNew = () => {
    setProduct(emptyProduct);
    setSubmitted(false);
    setProductDialog(true);
  }

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
}

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  }

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  }

  const saveProduct = () => {
    productService.updateProduct()
    .then(res => {
      setProduct({})
      setShowModal(false);
      setSaveSucces(!saveSucces);
    });

    setSubmitted(true);

    if (product.name.trim()) {
      let _products = [...products];
      let _product = { ...product };
      if (product.id) {
        const index = findIndexById(product.id);

        _products[index] = _product;
        toast.current.show({ severity: 'success', summary: 'Successfulsss', detail: 'Product Updated', life: 3000 });
      }
      else {
        _product.id = createId();
        // _product.image = 'product-placeholder.svg';
        _products.push(_product);
        toast.current.show({ severity: 'successsssssss', summary: 'Succeful', detail: 'Product Created', life: 3000 });
      }

      updateProduct(_product)
      setProducts(_products);
      setProductDialog(false);
      setProduct(emptyProduct);
    }
  }

  const editProduct = (product) => {
    setProduct({...product});
    setProductDialog(true);
}

  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  }

  const deleteProduct = () => {
    let _products = products.filter(val => val.id !== product.id);
    setProducts(_products);
    setDeleteProductDialog(false);
    setProduct(emptyProduct);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
  }

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < products.length; i++) {
      if (products[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  const createId = () => {
    let id = '';
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  const importCSV = (e) => {
    const file = e.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target.result;
      const data = csv.split('\n');

      // Prepare DataTable
      const cols = data[0].replace(/['"]+/g, '').split(',');
      data.shift();

      const importedData = data.map(d => {
        d = d.split(',');
        const processedData = cols.reduce((obj, c, i) => {
          c = c === 'Status' ? 'inventoryStatus' : (c === 'Reviews' ? 'rating' : c.toLowerCase());
          obj[c] = d[i].replace(/['"]+/g, '');
          (c === 'price' || c === 'rating') && (obj[c] = parseFloat(obj[c]));
          return obj;
        }, {});

        processedData['id'] = createId();
        return processedData;
      });

      const _products = [...products, ...importedData];

      setProducts(_products);
    };

    reader.readAsText(file, 'UTF-8');
  }

  const exportCSV = () => {
    dt.current.exportCSV();
  }

  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
  }

  const deleteSelectedProducts = () => {
    let _products = products.filter(val => !selectedProducts.includes(val));
    setProducts(_products);
    setDeleteProductsDialog(false);
    setSelectedProducts(null);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
  }

  const onCategoryChange = (e) => {
    let _product = { ...product };
    _product['category'] = e.value;
    setProduct(_product);
  }

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _product = { ...product };
    _product[`${name}`] = val;

    setProduct(_product);
  }

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _product = { ...product };
    _product[`${name}`] = val;

    setProduct(_product);
  }

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
        <Button label="Borrar" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
      </React.Fragment>
    )
  }

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <FileUpload mode="basic" name="demo[]" auto url="https://primefaces.org/primereact/showcase/upload.php" accept=".csv" chooseLabel="Importar" className="mr-2 inline-block" onUpload={importCSV} />
        <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
      </React.Fragment>
    )
  }

  const imageBodyTemplate = (rowData) => {
    return <img src={`images/product/${rowData.image}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={rowData.image} className="product-image" />
  }

  const priceBodyTemplate = (rowData) => {
    return formatCurrency(rowData.price);
  }

  const ratingBodyTemplate = (rowData) => {
    return <Rating value={rowData.rating} readOnly cancel={false} />;
  }

  // const statusBodyTemplate = (rowData) => {
  //   return <span className={`product-badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>;
  // }

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProduct(rowData)} />
      </React.Fragment>
    );
  }

  const header = (
    <div className="table-header">
      <h5 className="mx-0 my-1">Administración de productos</h5>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
      </span>
    </div>
  );
  const productDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
    </React.Fragment>
  );
  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
      <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
    </React.Fragment>
  );
  const deleteProductsDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
      <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
    </React.Fragment>
  );

  return (
    <div className="products">
      <Sidebar />
      <div className="datatable-crud-demo">
      <Navbar />
        <Toast ref={toast} />

        <div className="card">
          <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

          <DataTable value={products} ref={dt} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
            dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} de {last} de un total {totalRecords} productos"
            globalFilter={globalFilter} header={header} responsiveLayout="scroll" >
            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
            <Column field="id" header="ID"></Column>
            <Column field="name" header="Nombre" sortable style={{ minWidth: '25rem' }}></Column>
            <Column field="quantity" header="Cantidad" sortable style={{ minWidth: '18rem' }}></Column>
            <Column field="reference" header="Referencia" sortable style={{ minWidth: '16rem' }}></Column>
            <Column field="associations" header="id-reference" sortable style={{ minWidth: '16rem' }}></Column>
            {/* <Column field="image" header="Image" body={imageBodyTemplate}></Column> */}
            {/* <Column field="category" header="Category" sortable style={{ minWidth: '20rem' }}></Column> */}
            {/* <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable style={{ minWidth: '20rem' }}></Column> */}
            {/* <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column> */}
            <Column field="price" header="Price" body={priceBodyTemplate} sortable style={{ minWidth: '16rem' }}></Column>
            <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
          </DataTable>
        </div>

        {/* EDITAR  */}

        <Dialog visible={productDialog} style={{ width: '450px' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
          <div className="field">
            <label htmlFor="name">Nombre</label>
            <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
            {submitted && !product.name && <small className="p-error">El nombre es requerido</small>}
          </div>
          <div className="field">
            <label htmlFor="description">Descripción</label>
            <InputTextarea id="description" value={product.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
          </div>
          <div className="formgrid grid">
            <div className="field col">
              <label htmlFor="price">Precio</label>
              <InputNumber id="price" value={product.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" />
            </div>
            <div className="field col">
              <label htmlFor="quantity">Cantidad</label>
              <InputNumber id="quantity" value={product.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')}  />
            </div>
          </div>
        </Dialog>

        <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
          <div className="confirmation-content">
            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
            {product && <span>Are you sure you want to delete <b>{product.name}</b>?</span>}
          </div>
        </Dialog>

        <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
          <div className="confirmation-content">
            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
            {product && <span>Are you sure you want to delete the selected products?</span>}
          </div>
        </Dialog>
      </div>
    </div>
  );
}

export default Products
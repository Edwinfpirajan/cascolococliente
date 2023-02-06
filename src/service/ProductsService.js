import axios from "axios";

export class ProductsService {

    baseURL = "http://localhost:3001/products/";



    async getProducts() {
        const res = await axios.get(this.baseURL);
        return res.data;
    }

    async updateProduct(product) {
        const {
            id,
            name,
            price,
            quantity
        } = product
        const xmlString = `
  <prestashop>
    <product>
      <id>${id}</id>
      <name>
         <language id="1">${name}</language>
      </name>
      <price>${price}</price>
      <stock_availables nodeType="stock_available" api="stock_availables">
         <stock_available >
             <id>
              ${quantity}
             </id>
      <id_product_attribute>
      <![CDATA[ 0 ]]>
      </id_product_attribute>
  </stock_available>
  </stock_availables>
  </product>
  </prestashop>
  `
        try {
            const res = await axios.put(
                `https://serverpruebas.tk/api/products?output_format=JSON&ws_key=GJM2TB1KNADU6GT7LVFWV1MFH3Y6XTRH`, xmlString,
                {
                    headers: {
                        'Content-Type': 'text/xml',
                    }
                }
            );
            return res.data;
        } catch (error) {
            console.error(error);
        }
    };
}


export default ProductsService
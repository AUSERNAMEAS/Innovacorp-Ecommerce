const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

let currentProduct;

async function loadProduct(){
    // we fetch the product with id and set the data in the html
    try
    {
        const response = await fetch(`http://localhost:3000/api/products/${productId}`);

        const product = await response.json();
        currentProduct = product;
        allProducts = [currentProduct];

    }
    catch (error){
        console.error('Error fetching product data:', error);
    }

    let detailsTypeProduct = "";
    if(currentProduct.categoria === "camisa" || currentProduct.categoria === "sueter")
    {

        document.getElementById("size-container").innerHTML = `
        <label>Talla</label>
        <select id="talla-${currentProduct.id_producto}">
            <option>S</option>
            <option>M</option>
            <option>L</option>
            <option>XL</option>
        </select>`;
        
        detailsTypeProduct = `
         <h3>Tabla de Medidas</h3>

        <table class="size-table">
            <thead>
                <tr>
                    <th>Talla</th>
                    <th>Pecho (cm)</th>
                    <th>Largo (cm)</th>
                    <th>Hombros (cm)</th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <td>XS</td>
                    <td>86-91</td>
                    <td>64</td>
                    <td>40</td>
                </tr>

                <tr>
                    <td>S</td>
                    <td>92-97</td>
                    <td>67</td>
                    <td>42</td>
                </tr>

                <tr>
                    <td>M</td>
                    <td>98-103</td>
                    <td>70</td>
                    <td>44</td>
                </tr>

                <tr>
                    <td>L</td>
                    <td>104-109</td>
                    <td>73</td>
                    <td>46</td>
                </tr>

                <tr>
                    <td>XL</td>
                    <td>110-115</td>
                    <td>76</td>
                    <td>48</td>
                </tr>

                <tr>
                    <td>2XL</td>
                    <td>116-121</td>
                    <td>79</td>
                    <td>50</td>
                </tr>
            </tbody>
        </table>

        <p>Nota: Las medidas son aproximadas y pueden variar ligeramente según el estilo de la prenda.</p>`;
        if(currentProduct.categoria === "camisa"){
            detailsTypeProduct += `
            Camisa confeccionada con 100% algodón, suave, ligera y cómoda para uso diario. Su tela transpirable permite mantener frescura durante todo el día, ideal para un estilo casual o semi formal.
            `
        }
        else if(currentProduct.categoria === "sueter"){
            detailsTypeProduct += `
            Suéter fabricado con una mezcla 50% algodón y 50% poliéster, que combina suavidad y durabilidad. Proporciona abrigo ligero y buena resistencia al uso diario, perfecto para climas frescos y outfits casuales.
            `
        }
    }

    

    else if(currentProduct.categoria === "taza"){
        detailsTypeProduct = `
        Taza clásica de 11 oz (aprox. 325 ml) perfecta para café, té o chocolate caliente. Fabricada con material resistente y cómoda de sostener, es ideal para uso diario en casa, oficina o como producto personalizable para regalos.
        `
    }

    else if(currentProduct.categoria === "termo"){
        detailsTypeProduct = `
        Termo térmico de 20 oz (aprox. 590 ml) fabricado en acero inoxidable de doble pared, diseñado para mantener tus bebidas calientes o frías por varias horas. Su construcción resistente ayuda a conservar la temperatura y evita condensación exterior. Ideal para café, té, agua o bebidas frías durante el día.
        `
    }
    else if(currentProduct.categoria === "freebe"){
        detailsTypeProduct = `Pequeño accesorio  Ideal para complementar tu pedido o añadir un toque especial. Ligero, práctico y perfecto como regalo o recuerdo. Disponible en diferentes estilos según el producto seleccionado.`
    }

    else if(currentProduct.categoria === "frazada"){
        detailsTypeProduct = `
        Frazada suave elaborada con algodón de alta calidad, ideal para brindar comodidad y abrigo ligero. Con medidas de 1.10 m de ancho por 1.60 m de largo, es perfecta para usar en casa, viajes o como manta personal para descansar con mayor confort.        `
    }
    
    document.getElementById("product-name").textContent = currentProduct.nombre;

    document.getElementById("product-price").textContent =
        `$${currentProduct.precio_unitario} MXN`;

    document.getElementById("product-image").src = "/" + currentProduct.imagen;

    document.getElementById("product-category").textContent =
    "Categoría: " + currentProduct.categoria;

   document.getElementById("size-container").innerHTML += detailsTypeProduct;

}

document.addEventListener('DOMContentLoaded',() => {
document.getElementById("home-btn").addEventListener("click", ()=>{
    //js redirect to home page
    window.location.href = "../html/FakeShop.html";


});
  loadProduct();
});


